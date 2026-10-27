'use strict';
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const port=3337;const base=`http://127.0.0.1:${port}`;
const child=spawn(process.execPath,['server.js'],{cwd:__dirname,env:{...process.env,PORT:String(port)},stdio:'ignore'});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function main(){try{
  let ready=false;for(let i=0;i<40;i++){try{let r=await fetch(base+'/api/health');if(r.ok){ready=true;break}}catch{}await wait(125)}assert.ok(ready,'API started');
  let all=await (await fetch(base+'/api/properties')).json();assert.equal(all.length,8);
  const payload={deposit:1800,moveInDeposit:600,n:3,scheme:'custom',customAmounts:[600,400,200],enabled:true,concessionEnabled:true,concessionAmount:250,concessionTitle:'Demo concession'};
  let r=await fetch(base+'/api/properties/lake/policy',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});assert.equal(r.status,200);let result=await r.json();assert.deepEqual(result.policy.payments.map(p=>p.amount),[600,600,400,200]);assert.equal(result.policy.move_in_cash_with_offers,2750);assert.equal(result.policy.payments.at(-1).remaining_deposit,0);
  r=await fetch(base+'/api/properties/lake/policy',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,customAmounts:[600,400,100]})});assert.equal(r.status,400);
  const persisted=await (await fetch(base+'/api/properties/lake/policy')).json();assert.equal(persisted.deposit_at_move_in,600);
  r=await fetch(base+'/api/reset',{method:'POST'});assert.equal(r.status,200);
  console.log('PASS: 8 properties, GET/PUT, accurate schedule, concession math, invalid payment rejected, persisted GET, reset');
}finally{child.kill('SIGTERM')}}main().catch(e=>{console.error(e);process.exitCode=1});
