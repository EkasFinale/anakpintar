import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {getFirestore,collection,doc,getDocs,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import {firebaseConfig} from './config.js';
const P=window.BD?.Profiles;
const configured=!!(firebaseConfig.apiKey&&firebaseConfig.projectId&&firebaseConfig.appId);
const box=document.createElement('aside');
box.style.cssText='max-width:1080px;margin:10px auto;padding:14px;background:#e8f1e5;border-radius:14px;font:14px system-ui';
document.querySelector('header')?.after(box);
let auth,db,user=null,working=false,dirty=false;
function status(message){
 box.replaceChildren();
 const label=document.createElement('strong');label.textContent='☁ Cloud Save · '+message;box.append(label);
 if(!configured)return;
 const btn=document.createElement('button');btn.style.marginLeft='12px';btn.textContent=user?'Sinkronkan':'Login orang tua';btn.onclick=user?sync:login;box.append(btn);
 if(user){const logout=document.createElement('button');logout.textContent='Keluar';logout.onclick=()=>signOut(auth);box.append(logout)}
}
async function login(){
 const email=window.prompt('Email orang tua');if(!email)return;
 const password=window.prompt('Password orang tua');if(!password)return;
 try{await signInWithEmailAndPassword(auth,email,password)}
 catch(e){if(e.code==='auth/user-not-found'){status('Akun belum ada. Buat akun melalui Firebase Console.')}else status('Login gagal: '+e.code)}
}
function merge(a,b){
 const x=structuredClone(a);
 const events=new Map();
 for(const e of [...(b.events||[]),...(a.events||[])])if(e.id)events.set(e.id,e);
 x.events=[...events.values()].slice(-5000);
 for(const [k,v] of Object.entries(b.completions||{})){
  const old=x.completions[k];
  x.completions[k]=old?{times:Math.max(old.times||0,v.times||0),last:[old.last||'',v.last||''].sort().at(-1)}:v;
 }
 x.journey=x.journey||{};const remote=b.journey||{};
 x.journey.stars={...remote.stars,...x.journey.stars};
 for(const [k,v] of Object.entries(remote.stars||{}))x.journey.stars[k]=Math.max(Number(v)||0,Number(x.journey.stars[k])||0);
 x.journey.badges=[...new Set([...(remote.badges||[]),...(x.journey.badges||[])])];
 x.journey.treasure=!!(remote.treasure||x.journey.treasure);
 x.maxMission=Math.max(a.maxMission||1,b.maxMission||1);
 return x;
}
async function sync(){
 if(!user||working){dirty=true;return}
 working=true;status('Menyinkronkan…');
 try{
  const base=collection(db,'families',user.uid,'children');
  const remote=await getDocs(base);
  const local=P.all();
  // Cloud import must never overwrite an active in-progress run.
  const map=new Map(local.map(p=>[p.id,p]));
  for(const d of remote.docs){
   const incoming=d.data().profile;
   if(!incoming||incoming.id!==d.id)continue;
   const existing=map.get(d.id);
   map.set(d.id,existing?merge(existing,incoming):incoming);
  }
  const list=[...map.values()];
  window.__bdCloudImport=true;
  try{P.mergeCloud(list)}finally{window.__bdCloudImport=false}
  // Transaction retries when another device changes the same child.
  // The merged server snapshot is also imported back locally after commit.
  for(const p of P.all()){
   const ref=doc(base,p.id);
   const committed=await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);
    const existing=snap.exists()?snap.data().profile:null;
    const final=existing&&existing.id===p.id?merge(p,existing):p;
    tx.set(ref,{schemaVersion:1,name:final.name,buddy:final.buddy,profile:final,updatedAt:serverTimestamp()});
    return final;
   });
   window.__bdCloudImport=true;
   try{P.mergeCloud([committed])}finally{window.__bdCloudImport=false}
  }
  status('Tersimpan di cloud ✓');
 }catch(e){status('Belum tersinkron · data lokal tetap aman');console.error(e)}
 finally{working=false;if(dirty){dirty=false;setTimeout(sync,1200)}}
}
if(!P)status('Modul profil tidak tersedia');
else if(!configured)status('Isi konfigurasi Firebase untuk mengaktifkan');
else {
 try{
  const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);
  onAuthStateChanged(auth,u=>{user=u;status(u?'Akun terhubung':'Login diperlukan');if(u)sync()});
  window.addEventListener('belvadeva:save',()=>{if(!user||window.__bdCloudImport)return;clearTimeout(window.__bdSyncTimer);window.__bdSyncTimer=setTimeout(sync,2500)});
 }catch(e){status('Konfigurasi Firebase tidak valid')}
}
