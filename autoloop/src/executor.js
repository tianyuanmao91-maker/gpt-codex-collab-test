const {spawn}=require('child_process');
function runCodex({cwd,prompt}){return new Promise((resolve,reject)=>{const p=spawn(process.env.CODEX_CLI||'codex',['exec','--json',prompt],{cwd,stdio:['ignore','pipe','pipe']});let out='',err='';p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);p.on('close',code=>code?reject(Object.assign(new Error(err||'codex failed'),{code,out})):resolve({code,out}));});}
module.exports={runCodex};
