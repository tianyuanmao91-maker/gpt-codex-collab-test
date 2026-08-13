const {execFileSync}=require('child_process');
function git(cwd,args){return execFileSync('git',args,{cwd,encoding:'utf8'}).trim();}
function snapshot(cwd){return {status:git(cwd,['status','--porcelain']),branch:git(cwd,['branch','--show-current']),files:git(cwd,['diff','--name-only'])};}
module.exports={git,snapshot};
