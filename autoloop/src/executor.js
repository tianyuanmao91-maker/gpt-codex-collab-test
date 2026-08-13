const {spawn}=require('child_process');
function runCodex({cwd,prompt}){return new Promise((resolve,reject)=>{const exe=process.env.CODEX_CLI||'codex'; const args=['exec','--json',prompt]; const p=spawn(exe,args,{cwd,stdio:['ignore','pipe','pipe'],shell:false});let out='',err='';p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);p.on('error',reject);p.on('close',code=>code?reject(Object.assign(new Error(err||'codex failed'),{code,out})):resolve({code,out}));});}
module.exports={runCodex};
