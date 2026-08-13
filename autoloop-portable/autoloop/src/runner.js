const fs = require('fs');
const path = require('path');
const { listReadyIssues } = require('./github');
const { runCodex } = require('./executor');
const { createLogger } = require('./logger');
const { STATES } = require('./state');

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')); }
  catch { return fallback; }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function metadata(body) {
  const block = (body || '').match(/<!--\s*AUTOLOOP([\s\S]*?)-->/i);
  if (!block) return null;
  const get = key => ((block[1].match(new RegExp(`^\\s*${key}\\s*:\\s*(.+)$`, 'im')) || [])[1] || '').trim();
  return { project: get('project'), state: get('state') };
}

function promptFor(issue, repository) {
  return [
    'You are Codex, awakened by a local AutoLoop doorbell.',
    `repository: ${repository}`,
    `issue number: ${issue.number}`,
    `issue title: ${issue.title || ''}`,
    '',
    'The following immutable snapshot was read by the watcher from GitHub. It is the complete task payload and the only source of truth for this run.',
    'Do not call `gh issue view`, GitHub Issue APIs, or any other command to reread the task. Use this snapshot exactly as provided.',
    '--- BEGIN ISSUE BODY ---',
    issue.body || '',
    '--- END ISSUE BODY ---',
    'Follow its acceptance criteria and prohibited actions exactly.',
    'Actually perform the task now using terminal tools. Do not merely describe a plan, proposal, summary, or recommendation.',
    'Create an independent task branch from the latest main, modify only task-related files, run relevant validation, commit and push, and create a Draft PR to main linked to the Issue.',
    'Do not directly modify or merge main. Do not invent requirements. If the Issue is incomplete or blocked, stop and report that state.',
  ].join('\n');
}

function createDoorbell(config) {
  const stateFile = path.join(config.stateDir || path.join(__dirname, '..', 'state'), 'triggers.json');
  const log = createLogger(config.logDir || path.join(__dirname, '..', 'logs'));
  const state = readJson(stateFile, { issues: {} });
  const allowed = Array.isArray(config.triggerIssueNumbers) ? new Set(config.triggerIssueNumbers) : null;
  return async function doorbell() {
    const issues = await listReadyIssues(config.repository);
    for (const issue of issues) {
      if (allowed && !allowed.has(issue.number)) continue;
      const meta = metadata(issue.body);
      if (!meta || meta.state !== STATES.READY || !meta.project || !config.projects?.[meta.project]?.localPath) {
        log({ issue: issue.number, state: STATES.BLOCKED, action: 'blocked', errorCode: 'INVALID_AUTOLOOP_ROUTE' });
        continue;
      }
      if (state.issues[issue.number]?.status === 'triggered') {
        log({ issue: issue.number, state: STATES.READY, action: 'skipped_duplicate', errorCode: null });
        continue;
      }
      log({ issue: issue.number, state: STATES.READY, action: 'discovered', errorCode: null });
      state.issues[issue.number] = { status: 'triggered', triggerTimestamp: new Date().toISOString() };
      writeJson(stateFile, state);
      try {
        const result = await runCodex({ cwd: config.projects[meta.project].localPath, prompt: promptFor(issue, config.repository), logDir: config.logDir, issueNumber: issue.number });
        log({ issue: issue.number, state: STATES.RUNNING, action: 'triggered', codexExitCode: result.code, errorCode: null });
        log({ issue: issue.number, state: STATES.RUNNING, action: 'codex_exit', codexExitCode: result.code, errorCode: null });
      } catch (error) {
        log({ issue: issue.number, state: STATES.BLOCKED, action: 'codex_exit', codexExitCode: error.code ?? null, errorCode: error.message });
      }
    }
  };
}

async function main(config) {
  const doorbell = createDoorbell(config);
  await doorbell();
}

async function watch(config) {
  const interval = config.pollIntervalMs || 30000;
  while (true) {
    try { await main(config); }
    catch (error) { createLogger(config.logDir || path.join(__dirname, '..', 'logs'))({ state: STATES.BLOCKED, action: 'blocked', errorCode: error.message }); }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

if (require.main === module) {
  const config = readJson(process.argv[2] || path.join(__dirname, '..', 'config.json'), null);
  if (!config) { console.error('CONFIG_READ_FAILED'); process.exitCode = 1; }
  else (process.argv.includes('--watch') ? watch(config) : main(config)).catch(error => { console.error(error.message); process.exitCode = 1; });
}

module.exports = { metadata, promptFor, createDoorbell, main, watch };
