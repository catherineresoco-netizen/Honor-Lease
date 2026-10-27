'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {DatabaseSync}=require('node:sqlite');
const PORT=Number(process.env.PORT||3000);
// Intentionally local-only: this student demo has no production identity service.
const HOST='127.0.0.1';
const db=new DatabaseSync(path.join(__dirname,'honor-flex-demo.sqlite'));
db.exec('CREATE TABLE IF NOT EXISTS properties (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at TEXT NOT NULL)');
const seed=JSON.parse(fs.readFileSync(path.join(__dirname,'seed-properties.json'),'utf8'));
const getOne=db.prepare('SELECT payload FROM properties WHERE id = ?');
const getAll=db.prepare('SELECT payload FROM properties ORDER BY rowid');
const insert=db.prepare('INSERT INTO properties (id, payload, updated_at) VALUES (?,?,?)');
const update=db.prepare('UPDATE properties SET payload=?, updated_at=? WHERE id=?');
for(const p of seed){if(!getOne.get(p.id))insert.run(p.id,JSON.stringify(p),new Date().toISOString());}
const json=(res,status,obj)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'http://127.0.0.1:'+PORT});res.end(JSON.stringify(obj));};
const cents=x=>Math.round(Number(x)*100);
function policy(p){
  const d=cents(p.deposit),m=p.enabled?cents(p.moveInDeposit??Math.round(p.deposit*(p.initialPercent??40))/100):d;
  const n=p.enabled?p.n:0;let later=[];
  if(p.enabled){if(p.scheme==='custom')later=p.customAmounts.map(cents);else {const each=Math.floor((d-m)/n),rem=d-m-each*n;later=Array.from({length:n},(_,i)=>each+(i<rem?1:0));}}
  let owed=d;const payments=[{timing:'at_move_in',amount_cents:m},...later.map((x,i)=>({timing:'month_'+(i+2),amount_cents:x}))].map((entry,i)=>{owed-=entry.amount_cents;return {payment_number:i+1,timing:entry.timing,amount:entry.amount_cents/100,remaining_deposit:owed/100};});
  const credit=p.concessionEnabled?p.concessionAmount:0;
  return {property_id:p.id,enabled:p.enabled,payment_scheme:p.scheme,full_deposit:p.deposit,deposit_at_move_in:m/100,remaining_deposit_after_move_in:(d-m)/100,payments,monthly_rent:p.rent,rent_concession:{enabled:p.concessionEnabled,title:p.concessionTitle,first_month_credit:credit},standard_move_in_cash:p.rent+p.deposit,move_in_cash_with_offers:p.rent-credit+m/100,deposit_cash_deferred:(d-m)/100,actual_rent_discount:credit,total_initial_cash_difference:(d-m)/100+credit,updated_at:p.updated_at||null,disclosure:'Deposit installments defer, not forgive, payment. Rent credits reduce rent due. Does not include fees, prorations or utilities.'};
}
function validate(body,old){
  if(!body||typeof body!=='object'||Array.isArray(body))throw Error('Policy must be an object');
  const keys=['deposit','moveInDeposit','n','scheme','customAmounts','enabled','concessionEnabled','concessionAmount','concessionTitle'];
  for(const k of keys)if(!Object.hasOwn(body,k))throw Error('Missing field: '+k);
  for(const k of ['deposit','moveInDeposit','concessionAmount'])if(!Number.isFinite(body[k])||body[k]<0||!Number.isInteger(body[k]*100))throw Error(k+' must be a nonnegative dollar amount with up to two decimals');
  if(body.deposit>100000||body.moveInDeposit>body.deposit)throw Error('Invalid deposit or move-in amount');
  if(!Number.isInteger(body.n)||body.n<1||body.n>6)throw Error('Later payment count must be 1 to 6');
  if(!['custom','equal'].includes(body.scheme))throw Error('Unknown payment scheme');
  if(typeof body.enabled!=='boolean'||typeof body.concessionEnabled!=='boolean')throw Error('Invalid toggles');
  if(body.concessionAmount>old.rent)throw Error('First-month rent credit cannot exceed first-month rent');
  if(typeof body.concessionTitle!=='string'||body.concessionTitle.length>90)throw Error('Concession title too long');
  if(body.scheme==='custom'&&body.enabled){if(!Array.isArray(body.customAmounts)||body.customAmounts.length!==body.n)throw Error('Custom schedule must have one value per later month');if(body.customAmounts.some(x=>!Number.isFinite(x)||x<0||!Number.isInteger(x*100)))throw Error('Invalid custom installment');if(body.customAmounts.reduce((sum,x)=>sum+cents(x),0)!==cents(body.deposit)-cents(body.moveInDeposit))throw Error('Custom payments must equal unpaid deposit exactly');}
  return {...old,...Object.fromEntries(keys.map(k=>[k,body[k]]))};
}
const frontend=path.join(__dirname,'index.html');
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');const route=url.pathname;
  if(route==='/api/health'&&req.method==='GET')return json(res,200,{status:'ok',storage:'sqlite',mode:'local-demo',properties:getAll.all().length});
  if(route==='/api/properties'&&req.method==='GET')return json(res,200,getAll.all().map(x=>JSON.parse(x.payload)));
  const match=route.match(/^\/api\/properties\/([a-z0-9-]+)(?:\/(policy|schedule))?$/);
  if(match){const id=match[1],part=match[2];const row=getOne.get(id);if(!row)return json(res,404,{error:'Property not found'});const old=JSON.parse(row.payload);
    if(req.method==='GET')return json(res,200,part==='policy'||part==='schedule'?policy(old):old);
    if(req.method==='PUT'&&part==='policy'){
      let chunks=[],size=0;req.on('data',buf=>{size+=buf.length;if(size>25000){req.destroy();return;}chunks.push(buf)});req.on('end',()=>{try{const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));const merged=validate(body,old);merged.updated_at=new Date().toISOString();update.run(JSON.stringify(merged),merged.updated_at,id);json(res,200,{ok:true,property:merged,policy:policy(merged)});}catch(e){json(res,400,{error:e.message})}});return;
    }
  }
  if(route==='/api/reset'&&req.method==='POST'){
    db.exec('BEGIN');try{db.exec('DELETE FROM properties');for(const p of seed)insert.run(p.id,JSON.stringify(p),new Date().toISOString());db.exec('COMMIT');return json(res,200,{ok:true,properties:seed.length});}catch(e){db.exec('ROLLBACK');return json(res,500,{error:'Reset failed'});}
  }
  if(route.startsWith('/api/'))return json(res,404,{error:'Endpoint not found'});
  if(req.method!=='GET'||!(route==='/'||route==='/index.html'))return json(res,404,{error:'Not found'});
  fs.readFile(frontend,(err,data)=>{if(err)return json(res,500,{error:'Frontend not found'});res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(data)});
});
server.listen(PORT,HOST,()=>console.log(`Honor Flex REAL API demo at http://${HOST}:${PORT} (local-only; SQLite storage)`));
