const D=window.LEAGUE_DATA, by=Object.fromEntries(D.teams.map(t=>[t.team,t]));
const fmt=x=>Number(x).toFixed(Number(x)%1?1:0);
const table=(heads,rows)=>`<div class="tablewrap"><table><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr class="${r._cls||''}">${r.map? r.map(x=>`<td>${x}</td>`).join(''):''}</tr>`).join('')}</tbody></table></div>`;
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));document.getElementById(b.dataset.tab).classList.add('active')});
const t11=by[11];
document.getElementById('homeCards').innerHTML=[
 ['Final Seed','#11','Up from 12th entering finale'],['Final Points','80.5','6.5 points in final match'],['R16 Gross',fmt(t11.r16Gross),'Final regular-season round'],['R16 Net',fmt(t11.r16Net),'Handicap-adjusted'],['Round 1','#6 vs #11','Team 2 vs Team 11']
].map(x=>`<div class="mini"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('');
document.getElementById('field').innerHTML=table(['Seed','Team','Points','Final Week','Status'],D.playoffs.map((id,i)=>{let t=by[id],r=[`<span class="seed">${i+1}</span>`,`#${id} ${t.name}`,fmt(t.points),fmt(t.finalPts),i<4?'<span class="bye">FIRST-ROUND BYE</span>':'Round 1'];r._cls=id===11?'team11':'';return r}));
document.getElementById('bracketGrid').innerHTML=`
<div class="match"><div class="eyebrow">FIRST-ROUND BYES</div>${D.playoffs.slice(0,4).map((id,i)=>`<p><span class="seed">${i+1}</span> #${id} <strong>${by[id].name}</strong></p>`).join('')}</div>
<div>${D.round1.map(m=>`<div class="match"><div class="eyebrow">ROUND 1</div><div><span class="seed">${m.s1}</span> #${m.a} <strong>${by[m.a].name}</strong></div><div class="vs">vs</div><div><span class="seed">${m.s2}</span> #${m.b} <strong>${by[m.b].name}</strong></div></div>`).join('')}</div>`;
document.getElementById('matchupCards').innerHTML=D.round1.map(m=>{let a=by[m.a],b=by[m.b],edge=m.edge?by[m.edge]:null;return `<div class="match ${m.a===11||m.b===11?'team11':''}"><div class="eyebrow">#${m.s1} VS #${m.s2}</div><h2>Team ${m.a} vs Team ${m.b}</h2><p>${a.name}<br><span class="muted">vs</span><br>${b.name}</p><p>Net avg: <strong>${a.netAvg}</strong> vs <strong>${b.netAvg}</strong><br>Gross avg: ${a.grossAvg} vs ${b.grossAvg}</p><p class="edge">${edge?`Season net-average edge: Team ${edge.team} by ${m.netDiff}`:'Even on season net average'}</p></div>`}).join('');
let gross=[...D.teams].sort((a,b)=>a.grossAvg-b.grossAvg), net=[...D.teams].sort((a,b)=>a.netAvg-b.netAvg);
document.getElementById('gross').innerHTML=table(['Rank','Team','Avg','R16'],gross.map((t,i)=>{let r=[i+1,`#${t.team} ${t.name}`,t.grossAvg,fmt(t.r16Gross)];r._cls=t.team===11?'team11':'';return r}));
document.getElementById('net').innerHTML=table(['Rank','Team','Avg','R16'],net.map((t,i)=>{let r=[i+1,`#${t.team} ${t.name}`,t.netAvg,fmt(t.r16Net)];r._cls=t.team===11?'team11':'';return r}));
const sel=document.getElementById('teamSelect');sel.innerHTML=D.teams.map(t=>`<option value="${t.team}" ${t.team===11?'selected':''}>#${t.team} ${t.name}</option>`).join('');
function teamView(){
 let t=by[+sel.value],p=t.playoffProfile,seed=p.seed;
 let opponent=p.opponent?by[p.opponent]:null;
 let playoffBlock=p.qualified
   ? `<div class="hero small ${t.team===11?'team11':''}">
        <div class="eyebrow">${p.bye?'FIRST-ROUND BYE':`PLAYOFF SEED #${seed}`}</div>
        <h2>${p.bye?'Waiting for Round 1':`#${seed} Team ${t.team} vs #${D.seeds[p.opponent]} Team ${p.opponent}`}</h2>
        <p>${p.outlook}</p>
        ${opponent?`<div class="profilecompare">
          <div><span>Net Avg</span><strong>${t.netAvg}</strong><small>Team ${t.team}</small></div>
          <div><span>Opponent Net</span><strong>${opponent.netAvg}</strong><small>Team ${opponent.team}</small></div>
          <div><span>Gross Avg</span><strong>${t.grossAvg}</strong><small>#${p.grossRank} league rank</small></div>
          <div><span>Opponent Gross</span><strong>${opponent.grossAvg}</strong><small>#${opponent.playoffProfile.grossRank} league rank</small></div>
        </div>`:''}
      </div>`
   : `<div class="hero small"><div class="eyebrow">REGULAR SEASON COMPLETE</div><h2>Outside playoff field</h2><p>${p.status}</p></div>`;
 document.getElementById('teamView').innerHTML=`
   <div class="hero small"><div class="eyebrow">TEAM ${t.team} PLAYOFF PROFILE</div><h2>${t.name}</h2>
   <p>Final position: <strong>#${t.pos}</strong> • ${fmt(t.points)} points • Final week: ${fmt(t.finalPts)} points</p></div>
   <div class="cards">
    <div class="mini"><span>Playoff Status</span><strong>${p.qualified?(p.bye?'BYE':`#${seed}`):'OUT'}</strong><small>${p.status}</small></div>
    <div class="mini"><span>Gross Stroke Rank</span><strong>#${p.grossRank}</strong><small>${t.grossAvg} average</small></div>
    <div class="mini"><span>Net Stroke Rank</span><strong>#${p.netRank}</strong><small>${t.netAvg} average</small></div>
    <div class="mini"><span>Round 16</span><strong>${fmt(t.r16Gross)} / ${fmt(t.r16Net)}</strong><small>Gross / Net</small></div>
    <div class="mini"><span>Course Handicap</span><strong>${fmt(t.hdcp)}</strong><small>Final export</small></div>
   </div>${playoffBlock}`;
}sel.onchange=teamView;teamView();
document.getElementById('standings').innerHTML=table(['Pos','Team','Points','Final Week','Gross Avg','Net Avg','Result'],D.teams.map((t,i)=>{let r=[t.pos,`#${t.team} ${t.name}`,fmt(t.points),fmt(t.finalPts),t.grossAvg,t.netAvg,i<12?(i<4?'BYE':'PLAYOFFS'):'Eliminated'];r._cls=(i<12?'qual ':'')+(t.team===11?'team11 ':'')+(i===11?'cut':'');return r}));
