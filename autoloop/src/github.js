const {execFile}=require('child_process');
const gh=process.env.GH_CLI||'gh';
function run(args){return new Promise((resolve,reject)=>execFile(gh,['api',...args],{encoding:'utf8'},(e,stdout,stderr)=>{if(e) reject(new Error(stderr||e.message)); else resolve(stdout);}));}
async function listReadyIssues(repo){const raw=await run([`repos/${repo}/issues?state=open&per_page=100`]); return JSON.parse(raw).filter(i=>!i.pull_request&&/<!-- AUTOLOOP[\s\S]*?state:\s*READY[\s\S]*?-->/.test(i.body||''));}
async function issue(repo,n){return JSON.parse(await run([`repos/${repo}/issues/${n}`]));}
async function comments(repo,n){return JSON.parse(await run([`repos/${repo}/issues/${n}/comments?per_page=100`]));}
async function createDraftPr(repo,head,base,title,body){return JSON.parse(await run([`repos/${repo}/pulls`,'-f',`head=${head}`,'-f',`base=${base}`,'-f',`title=${title}`,'-f',`body=${body}`,'-F','draft=true']));}
async function prComments(repo,n){return JSON.parse(await run([`repos/${repo}/issues/${n}/comments?per_page=100`]));}
module.exports={run,listReadyIssues,issue,comments,createDraftPr,prComments};
