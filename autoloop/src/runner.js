const fs=require('fs'); const path=require('path'); const os=require('os');
const {listReadyIssues,issue,comments,createDraftPr,prComments}=require('./github');
const {runCodex}=require('./executor'); const {git,snapshot,addFiles,commit,push,worktree}=require('./git');
const {createLogger}=require('./logger'); const {STATES}=require('./state');
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);
function promptFor(i,review){return ['You are the Codex executor for AutoLoop.','Issue #'+i.number+': '+i.title,'Issue body:\n'+i.body,(review?'Review feedback:\n'+review:'First pass.'),'Current cwd and branch are provided by the runner.','Implement only the requested acceptance criteria. Do not modify main, do not merge, do not create branches or PRs.','For this fixture, add exactly `AutoLoop fixture verification.` to README.md and nothing else. Run relevant checks and return concise JSONL-safe results.'].join('\n\n');}
async function runTask(config,i){const log=createLogger(path.join(config.logDir||path.join(__dirname,'..','logs'))); const taskId=`issue-${i.number}`; const branch=`autoloop/issue-${i.number}-${slug(i.title)}`; const base=config.projects[(i.body.match(/project:\s*([^\s]+)/)||[])[1]].localPath; const root=path.dirname(base); const wt=path.join(root,`${path.basename(base)}-${taskId}`); const repo=base; let pr=null; let retryCount=0;
  const record=(state,action,extra={})=>log({taskId,issue:i.number,pr:pr&&pr.number||null,repository:config.repository,branch,commit:extra.commit||null,state,action,codexExitCode:extra.codexExitCode??null,testSummary:extra.testSummary||'',reviewSummary:extra.reviewSummary||'',retryCount,errorCode:extra.errorCode||null});
  if(fs.existsSync(path.join(repo,'.git'))===false) throw new Error('PROJECT_NOT_GIT_REPO');
  git(repo,['fetch','origin']); record(STATES.RUNNING,'fetch');
  if (!fs.existsSync(path.join(wt,'.git'))) worktree(repo,['add','-b',branch,wt,'origin/main']);
  try {
    record(STATES.RUNNING,'codex'); const first=await runCodex({cwd:wt,prompt:promptFor(i)}); const s=snapshot(wt); if(s.branch!==branch||!s.status||s.files!=='README.md') throw new Error('WORKTREE_GUARD_FAILED');
    addFiles(wt,['README.md']); commit(wt,`task(issue-${i.number}): ${i.title.replace(/\[AUTOLOOP TEST\]\s*/,'').slice(0,60)}`); const c1=git(wt,['rev-parse','HEAD']); push(wt,branch); record(STATES.WAITING_REVIEW,'push',{commit:c1,codexExitCode:0});
    pr=await createDraftPr(config.repository,branch,'main',`[AUTOLOOP] ${i.title}`,`Closes #${i.number}\n\n<!-- AUTOLOOP_PR\nissue: ${i.number}\nstate: WAITING_REVIEW\n-->`); record(STATES.WAITING_REVIEW,'draft_pr',{commit:c1});
    const reviewItems=await prComments(config.repository,pr.number); const review=reviewItems.map(x=>x.body||'').find(x=>/AUTOLOOP_REVIEW:\s*CHANGES_REQUESTED/.test(x));
    if(review){retryCount=1; record(STATES.CHANGES_REQUESTED,'review',{reviewSummary:review}); const second=await runCodex({cwd:wt,prompt:promptFor(i,review)}); const s2=snapshot(wt); if(s2.branch!==branch||!s2.status||s2.files!=='README.md') throw new Error('WORKTREE_GUARD_FAILED_RETRY'); addFiles(wt,['README.md']); commit(wt,`fix(issue-${i.number}): address review`); const c2=git(wt,['rev-parse','HEAD']); push(wt,branch); record(STATES.WAITING_REVIEW,'retry_push',{commit:c2,codexExitCode:0}); return {issue:i.number,branch,pr:pr.number,commits:[c1,c2],state:STATES.WAITING_REVIEW}; }
    return {issue:i.number,branch,pr:pr.number,commits:[c1],state:STATES.WAITING_REVIEW};
  } catch(e){record(STATES.BLOCKED,'error',{errorCode:e.message}); throw e;}
}
async function main(config){const lock=path.join(config.stateDir||path.join(__dirname,'..','state'),'runner.lock'); fs.mkdirSync(path.dirname(lock),{recursive:true}); if(fs.existsSync(lock)) throw new Error('RUN_LOCK_EXISTS'); fs.writeFileSync(lock,String(process.pid)); try{const issues=await listReadyIssues(config.repository); const results=[]; for(const i of issues){const project=(i.body.match(/project:\s*([^\s]+)/)||[])[1]; if(config.projects[project]) results.push(await runTask(config,i));} return results;} finally{fs.rmSync(lock,{force:true});}}
if(require.main===module){const raw=fs.readFileSync(process.argv[2]||path.join(__dirname,'..','config.json'),'utf8').replace(/^\uFEFF/,''); const config=JSON.parse(raw); main(config).then(x=>console.log(JSON.stringify(x))).catch(e=>{console.error(e.message);process.exitCode=1;});}
module.exports={main,runTask};
