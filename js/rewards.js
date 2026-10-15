(function(B){
function completed(p){return Object.keys(p.completions).length}
function totalPlays(p){return Object.values(p.completions||{}).reduce((n,c)=>n+(Number(c?.times)||0),0)}
function unlocked(p){return [true,true,true]}
function rewardStats(p){
  const distinct=completed(p),plays=totalPlays(p),days=new Set((p.events||[]).map(e=>e.day)).size;
  const numberIds=B.Data.worlds.find(w=>w.id==='numbers')?.missions||[],wordIds=B.Data.worlds.find(w=>w.id==='words')?.missions||[];
  const numberDone=numberIds.filter(id=>p.completions[id]).length,wordDone=wordIds.filter(id=>p.completions[id]).length;
  return {distinct,plays,days,numberIds,wordIds,numberDone,wordDone}
}
function stickers(p){
  const s=rewardStats(p);
  return [
    {emoji:'🌱',name:'Langkah pertama',hint:'Selesaikan 1 permainan',open:s.plays>=1,current:Math.min(s.plays,1),target:1},
    {emoji:'🐣',name:'Teman bermain',hint:'Selesaikan 2 permainan',open:s.plays>=2,current:Math.min(s.plays,2),target:2},
    {emoji:'🎀',name:'Penjelajah ceria',hint:'Coba 3 permainan berbeda',open:s.distinct>=3,current:Math.min(s.distinct,3),target:3},
    {emoji:'🎈',name:'Pengumpul bintang',hint:'Selesaikan 5 permainan',open:s.plays>=5,current:Math.min(s.plays,5),target:5},
    {emoji:'👑',name:'Sahabat angka',hint:'Coba semua permainan Angka',open:s.numberDone>=s.numberIds.length,current:s.numberDone,target:s.numberIds.length},
    {emoji:'🚀',name:'Penjelajah bintang',hint:'Coba 6 permainan berbeda',open:s.distinct>=6,current:Math.min(s.distinct,6),target:6},
    {emoji:'📚',name:'Sahabat kata',hint:'Coba semua permainan Kata',open:s.wordDone>=s.wordIds.length,current:s.wordDone,target:s.wordIds.length},
    {emoji:'🧩',name:'Tidak mudah menyerah',hint:'Selesaikan 10 permainan',open:s.plays>=10,current:Math.min(s.plays,10),target:10},
    {emoji:'🦄',name:'Kembali menemukan',hint:'Bermain pada 3 hari berbeda',open:s.days>=3,current:Math.min(s.days,3),target:3},
    {emoji:'🏅',name:'Pahlawan mini',hint:'Selesaikan 15 permainan',open:s.plays>=15,current:Math.min(s.plays,15),target:15},
    {emoji:'🌈',name:'Kolektor hebat',hint:'Selesaikan 20 permainan',open:s.plays>=20,current:Math.min(s.plays,20),target:20}
  ]
}
function nextProgress(p){const reward=stickers(p).find(s=>!s.open)||null;if(!reward)return {reward:null,current:1,target:1,ratio:1};const current=Math.max(0,Number(reward.current)||0),target=Math.max(1,Number(reward.target)||1);return {reward,current,target,ratio:Math.max(0,Math.min(1,current/target))}}
function finish(p,id){const before=stickers(p).filter(s=>s.open).map(s=>s.name);const c=p.completions[id];p.completions[id]={times:(c?.times||0)+1,last:B.Profiles.today()};p.resume=null;B.Profiles.save();return stickers(p).filter(s=>s.open&&!before.includes(s.name))}
function dailySeed(text){let h=2166136261;for(const ch of text){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function today(p){const d=B.Profiles.today(),all=B.Data.worlds.flatMap(w=>w.missions),pool=[...new Set(all)],seed=dailySeed(d+'|'+(p?.id||'player'));for(let i=pool.length-1;i>0;i--){const j=(seed+Math.imul(i+11,2654435761))%(i+1);[pool[i],pool[j]]=[pool[j],pool[i]]}const ids=pool.slice(0,Math.min(5,pool.length));return {ids,done:ids.filter(id=>p.completions[id]?.last===d).length,date:d}}
B.Rewards={completed,totalPlays,rewardStats,nextProgress,unlocked,stickers,finish,today};})(BD);
