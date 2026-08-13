const fs=require('fs'); const path=require('path');
function createLogger(dir){fs.mkdirSync(dir,{recursive:true}); const file=path.join(dir,'autoloop.jsonl'); return entry=>{const safe={...entry,timestamp:new Date().toISOString()}; fs.appendFileSync(file,JSON.stringify(safe)+'\n');};}
module.exports={createLogger};
