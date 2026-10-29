(()=>{
  const stage=document.getElementById('pitchStage');
  if(!stage)return;
  const shell=document.querySelector('.pitch-shell');
  const scenes=[...document.querySelectorAll('[data-pitch-scene]')];
  const labels=['THE OPENING','THE BARRIER','THE CASH DIFFERENCE','THE RENTER EXPERIENCE','THE LANDLORD EXPERIENCE','THE API','THE BUSINESS MODEL','THE CLOSE'];
  const pages=document.getElementById('pitchPages');
  const prev=document.getElementById('pitchPrev'),next=document.getElementById('pitchNext'),play=document.getElementById('pitchPlay');
  let current=0, playing=false, timer;
  scenes.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.className='pitch-page';b.title=`Scene ${i+1}: ${labels[i]}`;b.setAttribute('aria-label',b.title);b.onclick=()=>go(i);pages.append(b)});
  function go(n){current=(n+scenes.length)%scenes.length;scenes.forEach((e,i)=>{e.classList.toggle('active',i===current);e.setAttribute('aria-hidden',String(i!==current))});[...pages.children].forEach((e,i)=>{e.classList.toggle('selected',i===current);e.classList.toggle('past',i<current)});document.getElementById('pitchSceneLabel').textContent=String(current+1).padStart(2,'0')+' / '+labels[current];if(playing)restartTimer();}
  function restartTimer(){clearTimeout(timer);if(playing){timer=setTimeout(()=>{if(current===scenes.length-1){pause();return}go(current+1)},current===4?18000:15000)}}
  function pause(){playing=false;clearTimeout(timer);play.textContent='▶ Auto';play.setAttribute('aria-label','Start automatic presentation')}
  prev.onclick=()=>go(Math.max(0,current-1));next.onclick=()=>go(Math.min(scenes.length-1,current+1));play.onclick=()=>{playing=!playing;play.textContent=playing?'❚❚ Pause':'▶ Auto';restartTimer()};
  document.addEventListener('keydown',e=>{if(!document.getElementById('pitch').classList.contains('active'))return;if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(Math.min(scenes.length-1,current+1))}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(Math.max(0,current-1))}if(e.key==='Escape'&&document.fullscreenElement)document.exitFullscreen()});
  document.getElementById('pitchFullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else shell.requestFullscreen?.().catch(()=>{})};
  document.getElementById('pitchRestart').onclick=()=>go(0);document.getElementById('pitchToMarketplace').onclick=()=>{pause();document.querySelector('[data-screen="rent"]').click()};
  const slider=document.getElementById('pitchMove'),read=document.getElementById('pitchMoveRead'),balance=document.getElementById('pitchBalance'),schedule=document.getElementById('pitchSchedule');let scheme='equal';const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
  function updateSchedule(){const initial=Number(slider.value),rest=1800-initial;read.textContent=money(initial);balance.textContent=money(rest);let arr=[];if(scheme==='equal'){const base=Math.floor(rest/3);arr=[base,base,rest-base*2]}else{const first=Math.round(rest*.5/100)*100,second=Math.round(rest*.3/100)*100;arr=[first,second,rest-first-second]}
    let left=1800;schedule.innerHTML='';[initial,...arr].forEach((amount,i)=>{left-=amount;const row=document.createElement('div');row.className='pitch-payment-row';const a=document.createElement('span');a.textContent=i===0?'At move-in':`Month ${i+1} · ${money(left)} outstanding`;const b=document.createElement('b');b.textContent=money(amount);row.append(a,b);schedule.append(row)})}
  slider.oninput=updateSchedule;document.querySelectorAll('[data-pitch-scheme]').forEach(b=>b.onclick=()=>{scheme=b.dataset.pitchScheme;document.querySelectorAll('[data-pitch-scheme]').forEach(x=>x.classList.toggle('chosen',x===b));updateSchedule()});
  document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.screen!=='pitch')pause();else{go(0);setTimeout(()=>stage.focus({preventScroll:true}),50)}}));
  updateSchedule();go(0);
})();
