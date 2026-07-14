const D=window.LEAGUE_DATA;
const byId=Object.fromEntries(D.teams.map(t=>[t.team,t]));
const fmt=n=>Number(n).toFixed(1);
const status=t=>t.position<=12?'IN':t.position<=16?'BUBBLE':'OUT';
const cls=s=>s==='IN'?'in':s==='BUBBLE'?'bubble':'out';
function table(headers,rows){return `<table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`}
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));btn.classList.add('active');document.getElementById(btn.dataset.tab).classList.add('active')}));

const hot=byId[D.storylines.hottest.team], cold=byId[D.storylines.coldest.team], climb=byId[D.storylines.biggestClimber.team], fall=byId[D.storylines.biggestFall.team];
document.getElementById('headlineHero').innerHTML=`<div class="eyebrow">WEEK 10 PREVIEW</div><h2>The playoff bubble has officially arrived</h2><p>Eight teams are separated by only two points from 9th through 16th. Every half-point in Round 10 can change multiple positions.</p>`;
document.getElementById('storyCards').innerHTML=[
['Hottest team',hot.name,`${fmt(hot.last3)} pts/round over last 3`],
['Biggest climber',climb.name,`${climb.positionChange>=0?'+':''}${climb.positionChange} places since Week 1`],
['Hardest road',byId[D.storylines.hardestSOS].name,`SOS rank #1`],
['Easiest road',byId[D.storylines.easiestSOS].name,`Best remaining path`]
].map(x=>`<div class="story-card"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('');

const sorted=[...D.teams].sort((a,b)=>b.points-a.points);
document.getElementById('standingsTable').innerHTML=table(['Pos','Team','Pts','Odds','Status'],sorted.map(t=>[t.position,`#${t.team} ${t.name}`,fmt(t.points),`${t.playoffOdds}%`,`<span class="pill ${cls(status(t))}">${status(t)}</span>`]));
document.getElementById('bubbleTable').innerHTML=table(['Pos','Team','Pts','Gap','Need Avg'],sorted.filter(t=>t.position>=9&&t.position<=16).map(t=>[t.position,`#${t.team} ${t.name}`,fmt(t.points),fmt(Math.max(0,44-t.points)),fmt(t.neededAvg)]));
document.getElementById('playoffTable').innerHTML=table(['Pos','Team','Pts','Playoff Odds','Projected','Need Avg','Best','Worst','Destiny'],sorted.map(t=>[t.position,`#${t.team} ${t.name}`,fmt(t.points),`${t.playoffOdds}%`,fmt(t.projected),fmt(t.neededAvg),t.bestCase,t.worstCase,t.controlsDestiny?'Yes':'Needs help']));

const motw=D.round10[0],ma=byId[motw.a],mb=byId[motw.b];
document.getElementById('weekHeadline').innerHTML=`<div class="eyebrow">MATCH OF THE WEEK</div><h2>#${ma.team} ${ma.name} vs #${mb.team} ${mb.name}</h2><p>Impact score <strong>${motw.impact}/100</strong>. This matchup carries the largest combined effect on playoff positioning and bubble pressure.</p>`;
document.getElementById('matchupTable').innerHTML=table(['Rank','Matchup','Impact','Implication'],D.round10.map((m,i)=>{const a=byId[m.a],b=byId[m.b],ic=m.impact>=80?'high':m.impact>=55?'med':'low';const imp=(a.position<=12&&b.position<=12)?'Seeding and cushion':((a.position<=16||b.position<=16)?'Direct bubble pressure':'Spoiler opportunity');return[i+1,`#${a.team} ${a.name}<br><small>vs</small><br>#${b.team} ${b.name}`,`<span class="impact ${ic}">${m.impact}</span>`,imp]}));
document.getElementById('sosTable').innerHTML=table(['Rank','Team','SOS','Avg Opp Pts','Top 8','Bubble','Difficulty'],D.sos.map(x=>{const t=byId[x.team],d=x.score>=80?'Brutal':x.score>=65?'Very hard':x.score>=50?'Difficult':x.score>=35?'Average':x.score>=20?'Favorable':'Easiest';return[x.rank,`#${t.team} ${t.name}`,fmt(x.score),fmt(x.avgOppPts),x.top8,x.bubble,d]}));

const power=[...D.teams].sort((a,b)=>(b.points*.45+b.last3*5*.30+(100-b.sosScore)*.15)-(a.points*.45+a.last3*5*.30+(100-a.sosScore)*.15));
document.getElementById('powerTable').innerHTML=table(['Rank','Team','Pts','3-Wk Avg','SOS'],power.map((t,i)=>[i+1,`#${t.team} ${t.name}`,fmt(t.points),fmt(t.last3),t.sosRank]));
document.getElementById('trendTable').innerHTML=table(['Team','Trend','3-Wk','Season','Move'],[...D.teams].sort((a,b)=>b.last3-a.last3).map(t=>[`#${t.team} ${t.name}`,t.trend,fmt(t.last3),fmt(t.seasonAvg),t.positionChange]));

const simWrap=document.getElementById('simControls');
simWrap.className='sim-grid';
D.round10.forEach((m,i)=>{const a=byId[m.a],b=byId[m.b];simWrap.innerHTML+=`<div class="sim-row"><label>#${a.team} ${a.name}<br>vs<br>#${b.team} ${b.name}</label><input id="sim${i}" type="number" min="0" max="10" step="0.5" value="5"><small>Points for Team ${a.team}; opponent receives remainder</small></div>`});
function runSim(){const pts=Object.fromEntries(D.teams.map(t=>[t.team,t.points]));D.round10.forEach((m,i)=>{const aPts=Number(document.getElementById('sim'+i).value);pts[m.a]+=aPts;pts[m.b]+=10-aPts});const rows=[...D.teams].sort((a,b)=>pts[b.team]-pts[a.team]).map((t,i)=>[i+1,`#${t.team} ${t.name}`,fmt(pts[t.team]),i<12?'IN':'OUT']);document.getElementById('simTable').innerHTML=table(['Pos','Team','Projected Pts','Status'],rows)}
document.getElementById('runSim').addEventListener('click',runSim);runSim();

const select=document.getElementById('teamSelect');[...D.teams].sort((a,b)=>a.team-b.team).forEach(t=>{const o=document.createElement('option');o.value=t.team;o.textContent=`Team ${t.team} — ${t.name}`;select.appendChild(o)});select.value=11;
function renderTeam(){const t=byId[Number(select.value)],s=D.sos.find(x=>x.team===t.team),rows=s.opps.map((o,i)=>[10+i,D.dates[String(10+i)],`#${o} ${byId[o].name}`,byId[o].position,fmt(byId[o].points)]);document.getElementById('teamView').innerHTML=`<div class="team-grid"><div class="metric"><span>Current position</span><strong>${t.position}</strong></div><div class="metric"><span>Playoff odds</span><strong>${t.playoffOdds}%</strong></div><div class="metric"><span>3-week average</span><strong>${fmt(t.last3)}</strong></div><div class="metric"><span>SOS rank</span><strong>${t.sosRank}</strong></div></div><div class="grid two"><div class="card"><div class="card-head"><h2>${t.name}</h2><span>${status(t)}</span></div><p>Projected finish: <strong>${fmt(t.projected)} points</strong></p><p>Needed average to reach 79.5: <strong>${fmt(t.neededAvg)}</strong></p><p>Best-case seed: <strong>${t.bestCase}</strong> · Worst-case seed: <strong>${t.worstCase}</strong></p><p>Trend: <strong>${t.trend}</strong> · Net scoring average: <strong>${fmt(t.netAvg)}</strong></p><div class="bar"><span style="width:${t.playoffOdds}%"></span></div></div><div class="card"><div class="card-head"><h2>Remaining opponents</h2><span>Rounds 10–16</span></div>${table(['Round','Date','Opponent','Pos','Pts'],rows)}</div></div>`}
select.addEventListener('change',renderTeam);renderTeam();

document.getElementById('strokeTable').innerHTML=table(['Rank','Team','Gross Avg','Net Avg','Current Pos'],[...D.teams].sort((a,b)=>a.netAvg-b.netAvg).map((t,i)=>[i+1,`#${t.team} ${t.name}`,fmt(t.grossAvg),fmt(t.netAvg),t.position]));
