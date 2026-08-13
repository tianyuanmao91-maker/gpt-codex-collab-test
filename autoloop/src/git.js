const {execFileSync}=require('child_process');
function git(cwd,args){return execFileSync('git',args,{cwd,encoding:'utf8'}).trim();}
function snapshot(cwd){return {status:git(cwd,['status','--porcelain']),branch:git(cwd,['branch','--show-current']),files:git(cwd,['diff','--name-only'])};}
function addFiles(cwd,files){for(const file of files) git(cwd,['add','--',file]);}
function commit(cwd,message){return git(cwd,['commit','-m',message]);}
function push(cwd,branch){return git(cwd,['push','-u','origin',branch]);}
function worktree(cwd,args){return git(cwd,['worktree',...args]);}
module.exports={git,snapshot,addFiles,commit,push,worktree};
