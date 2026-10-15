(function(B){
  const KEY='belvadeva-v9'; // dipertahankan agar data lama tetap ditemukan
  const SCHEMA_VERSION=10;
  const DEFAULT_SETTINGS={musicVolume:.65,effectsVolume:.8,narrationVolume:1};
  let store=freshStore(), warning='';

  function freshStore(){return {version:SCHEMA_VERSION,schemaVersion:SCHEMA_VERSION,current:null,players:{},meta:{lastExportAt:null,migratedFrom:null,migratedAt:null},settings:{...DEFAULT_SETTINGS}}}
  const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
  const volume=v=>Math.max(0,Math.min(1,Number.isFinite(Number(v))?Number(v):1));
  function nameOK(n){return typeof n==='string'&&n.trim().length>0&&n.trim().length<=24&&!['__proto__','constructor','prototype'].includes(n.trim().toLowerCase())}
  function id(){return 'p_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9)}
  function fresh(name,buddy){return {id:id(),name:name.trim(),buddy:buddy==='deva'?'deva':'belva',completions:{},events:[],sessions:[],review:{},costume:0,style:'3d',motion:!window.matchMedia('(prefers-reduced-motion: reduce)').matches,maxMission:11,breakMinutes:15,resume:null,journey:{stars:{},badges:[],treasure:false},questionBags:{}}}

  function valid(p){
    if(!p||!nameOK(p.name)||typeof p.id!=='string'||!/^p_[a-z0-9_]+$/.test(p.id))throw Error('Profil tidak valid');
    const out=fresh(p.name,p.buddy);out.id=p.id;
    for(const [key,value] of Object.entries(p.completions||{})){
      if(!B.Data.byId(key)||!value||typeof value!=='object')throw Error('Misi cadangan tidak valid');
      out.completions[key]={times:Math.max(1,Math.min(100000,Number(value.times)||1)),last:typeof value.last==='string'?value.last.slice(0,10):today()};
    }
    out.events=(Array.isArray(p.events)?p.events:[]).slice(-5000).map(e=>{
      if(!e||!B.Data.byId(e.mission)||typeof e.day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(e.day)||!Number.isInteger(e.attempts)||e.attempts<0||e.attempts>100||!Number.isInteger(e.hints)||e.hints<0||e.hints>100)throw Error('Riwayat tidak valid');
      return {day:e.day,mission:+e.mission,first:e.first===true,attempts:e.attempts,hints:e.hints};
    });
    out.sessions=(Array.isArray(p.sessions)?p.sessions:[]).slice(-2000).filter(e=>e&&/^\d{4}-\d{2}-\d{2}$/.test(e.day)&&Number.isFinite(e.seconds)&&e.seconds>=0&&e.seconds<86400).map(e=>({day:e.day,seconds:e.seconds}));
    out.review={};for(const [k,v] of Object.entries(p.review||{}).slice(0,1000))if(k.length<100&&Number.isInteger(v)&&v>=0&&v<10000&&!['__proto__','constructor','prototype'].includes(k))out.review[k]=v;
    out.costume=[0,1,2].includes(p.costume)?p.costume:0;out.style=p.style==='2d'?'2d':'3d';out.motion=p.motion!==false;
    out.maxMission=Number.isInteger(p.maxMission)&&p.maxMission>=1&&p.maxMission<=9?p.maxMission:11;out.breakMinutes=[0,10,15,20].includes(p.breakMinutes)?p.breakMinutes:15;
    out.journey={stars:{},badges:[],treasure:p.journey?.treasure===true};
    for(const jid of ['garden','sea','forest']){const n=Number(p.journey?.stars?.[jid]);out.journey.stars[jid]=Number.isInteger(n)?Math.max(0,Math.min(3,n)):0}
    out.journey.badges=[...new Set((Array.isArray(p.journey?.badges)?p.journey.badges:[]).filter(x=>['🐝','🐠','🦉','🌈'].includes(x)))];
    out.questionBags={};
    for(const [mid,ids] of Object.entries(p.questionBags||{})){
      const mission=B.Data.byId(mid);if(!mission||!Array.isArray(ids))continue;
      const validIds=new Set(B.Data.bank(mission).map(q=>q.id));
      out.questionBags[mid]=[...new Set(ids.filter(qid=>typeof qid==='string'&&validIds.has(qid)))].slice(0,500);
    }
    if(p.resume&&B.Data.byId(p.resume.mission)){
      const r=p.resume,bank=B.Data.bank(B.Data.byId(r.mission));
      if(Array.isArray(r.ids)&&r.ids.length===5&&r.ids.every(qid=>bank.some(q=>q.id===qid))&&Number.isInteger(r.index)&&r.index>=0&&r.index<5){
        const currentQ=bank.find(q=>q.id===r.ids[r.index]);
        out.resume={touched:Array.isArray(r.touched)?[...new Set(r.touched.filter(n=>Number.isInteger(n)&&n>=0&&n<(currentQ?.items?.length||0)))]:[],mission:+r.mission,ids:r.ids,index:r.index,attempts:Math.max(0,Math.min(4,Number(r.attempts)||0)),hints:Math.max(0,Math.min(3,Number(r.hints)||0)),done:r.done===true,wrongOptions:Array.isArray(r.wrongOptions)?r.wrongOptions.filter(x=>['number','string'].includes(typeof x)).slice(0,3):[]};
      }
    }
    return out;
  }

  function normalizeSettings(s){return {musicVolume:volume(s?.musicVolume??DEFAULT_SETTINGS.musicVolume),effectsVolume:volume(s?.effectsVolume??DEFAULT_SETTINGS.effectsVolume),narrationVolume:volume(s?.narrationVolume??DEFAULT_SETTINGS.narrationVolume)}}
  function migrate(raw){
    const next=freshStore();
    if(!raw||!raw.players||![9,10].includes(Number(raw.version)))return null;
    next.current=raw.current||null;next.players=raw.players;
    if(Number(raw.version)===9){next.meta.migratedFrom=9;next.meta.migratedAt=new Date().toISOString()}
    else next.meta={...next.meta,...(raw.meta||{})};
    next.settings=normalizeSettings(raw.settings);
    return next;
  }
  function save(){try{store.version=SCHEMA_VERSION;store.schemaVersion=SCHEMA_VERSION;localStorage.setItem(KEY,JSON.stringify(store));warning=''}catch{warning='Progres belum tersimpan. Ekspor cadangan sebelum menutup permainan.'}}
  function load(){
    try{
      const raw=JSON.parse(localStorage.getItem(KEY));const migrated=migrate(raw);
      if(migrated){store=freshStore();store.meta=migrated.meta;store.settings=migrated.settings;for(const p of Object.values(migrated.players)){const v=valid(p);store.players[v.id]=v}store.current=own(store.players,migrated.current)?migrated.current:null;save()}
    }catch{warning='Data BelvaDeva tidak dapat dibaca. Data lama tidak dihapus.'}
    if(!Object.keys(store.players).length){
      try{const old=JSON.parse(localStorage.getItem('belva-world-v2'));for(const p of Object.values(old?.players||{})){if(!nameOK(p.name))continue;const v=fresh(p.name,p.name.toLowerCase()==='deva'?'deva':'belva');for(const [m,stars] of Object.entries(p.scores||{}))if(B.Data.byId(m)&&stars>0)v.completions[m]={times:1,last:today()};store.players[v.id]=v}if(Object.keys(store.players).length){store.meta.migratedFrom='belva-world-v2';store.meta.migratedAt=new Date().toISOString()}}catch{}
      if(!Object.keys(store.players).length)for(const [n,b] of [['Belva','belva'],['Deva','deva']]){const p=fresh(n,b);store.players[p.id]=p}
      save();
    }
  }
  function current(){return store.players[store.current]||null}
  function add(name,buddy){if(!nameOK(name))throw Error('Isi nama 1–24 karakter.');if(Object.values(store.players).some(p=>p.name.toLowerCase()===name.trim().toLowerCase()))throw Error('Nama itu sudah dipakai.');const p=fresh(name,buddy);store.players[p.id]=p;save();return p}
  function rename(name){const p=current();if(!nameOK(name))throw Error('Isi nama 1–24 karakter.');if(Object.values(store.players).some(x=>x.id!==p.id&&x.name.toLowerCase()===name.trim().toLowerCase()))throw Error('Nama itu sudah dipakai.');p.name=name.trim();save()}
  function select(pid){if(!own(store.players,pid))throw Error('Profil tidak ditemukan');store.current=pid;save();return current()}
  function exportData(){save();return JSON.stringify({format:'belvadeva-progress',version:SCHEMA_VERSION,schemaVersion:SCHEMA_VERSION,exportedAt:new Date().toISOString(),settings:store.settings,players:Object.values(store.players)},null,2)}
  function parseImport(text){const data=JSON.parse(text);if(data?.format!=='belvadeva-progress'||![9,10].includes(Number(data.version))||!Array.isArray(data.players)||data.players.length<1||data.players.length>100)throw Error('Gunakan cadangan BelvaDeva V9 atau V10.');const ids=new Set();return data.players.map(p=>{const v=valid(p);if(ids.has(v.id))throw Error('ID profil ganda');ids.add(v.id);return v})}
  function merge(list){for(const p of list){const same=Object.values(store.players).find(x=>x.name.toLowerCase()===p.name.toLowerCase());if(same&&!own(store.players,p.id))p.id=same.id;store.players[p.id]=p}save()}
  function settings(){return {...store.settings}}
  function setSettings(patch){store.settings=normalizeSettings({...store.settings,...patch});save();return settings()}
  function markExported(){store.meta.lastExportAt=new Date().toISOString();save();return store.meta.lastExportAt}
  function lastExportAt(){return store.meta.lastExportAt||null}
  function backupDue(days=7){const last=lastExportAt();if(!last)return true;const age=Date.now()-new Date(last).getTime();return !Number.isFinite(age)||age>days*86400000}

  load();
  B.Profiles={save,current,all:()=>Object.values(store.players),select,add,rename,nameOK,today,exportData,parseImport,merge,warning:()=>warning,settings,setSettings,markExported,lastExportAt,backupDue,schemaVersion:()=>SCHEMA_VERSION};
})(BD);
