(function(B){
  let enabled=true,request=0,utterance=null,clip=null,timer=null,catalog={},voices=[];
  let narrationVolume=1,effectsVolume=.8,notify=()=>{};
  const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
  function status(s){notify(s)}
  function refresh(){if('speechSynthesis'in window)voices=window.speechSynthesis.getVoices()}
  function stop(){request++;clearTimeout(timer);B.Music?.duck(false);if(clip){clip.pause();clip=null}if('speechSynthesis'in window)window.speechSynthesis.cancel();utterance=null;document.querySelectorAll('.speaking').forEach(x=>x.classList.remove('speaking'))}
  function tts(text,token){
    if(token!==request)return;if(!('speechSynthesis'in window)||!window.SpeechSynthesisUtterance){status('Suara tidak didukung browser ini. Instruksi tetap ada di layar.');B.Music?.duck(false);return}
    refresh();const voice=voices.find(v=>/^id(?:[-_]|$)/i.test(v.lang))||voices.find(v=>/indonesia|gadis|ardi/i.test(v.name));
    const u=new window.SpeechSynthesisUtterance(text);utterance=u;u.lang='id-ID';u.rate=.9;u.volume=narrationVolume;if(voice)u.voice=voice;let began=false;
    u.onstart=()=>{began=true;status(voice?'':'Memakai suara perangkat; pelafalan mungkin berbeda.');document.querySelector('.guide .avatar')?.classList.add('speaking')};
    u.onend=()=>{B.Music?.duck(false);if(token===request)utterance=null;document.querySelectorAll('.speaking').forEach(x=>x.classList.remove('speaking'))};
    u.onerror=e=>{B.Music?.duck(false);if(token===request&&!['canceled','interrupted'].includes(e.error))status('Ucapan gagal diputar. Cek volume media atau coba browser utama.')};
    try{window.speechSynthesis.resume();window.speechSynthesis.speak(u);timer=setTimeout(()=>{if(token===request&&!began)status('Ucapan belum mulai. Tekan tombol suara sekali lagi.')},3500)}catch{B.Music?.duck(false);status('Suara gagal diputar. Tekan speaker sekali lagi.')}
  }
  function say(text,key){if(!enabled||narrationVolume<=0)return;stop();B.Music?.duck(true);const token=request,path=catalog[key];if(path){clip=new Audio(path);clip.volume=narrationVolume;clip.onended=()=>B.Music?.duck(false);clip.onerror=()=>B.Music?.duck(false);clip.play().then(()=>status('')).catch(()=>{if(token===request)tts(text,token)});return}tts(text,token)}
  async function init(callback){notify=callback;refresh();if('speechSynthesis'in window)window.speechSynthesis.addEventListener('voiceschanged',refresh);try{const r=await fetch('audio/catalog.json',{cache:'no-store'});catalog=r.ok?await r.json():{}}catch{catalog={}}}
  function effect(kind='tap'){
    if(!enabled||effectsVolume<=0)return;
    try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C();c.resume().then(()=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type='sine';o.frequency.value=kind==='success'?880:kind==='error'?330:620;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(Math.max(.002,.08*effectsVolume),c.currentTime+.015);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.18);o.start();o.stop(c.currentTime+.2);o.onended=()=>c.close()})}catch{}
  }
  function tone(){effect('success');status('Tes efek suara diputar. Jika senyap, cek volume media dan Bluetooth.')}
  function setNarrationVolume(v){narrationVolume=clamp(v);if(clip)clip.volume=narrationVolume;if(utterance)utterance.volume=narrationVolume}
  function setEffectsVolume(v){effectsVolume=clamp(v)}
  B.Audio={init,say,stop,tone,effect,setNarrationVolume,setEffectsVolume,volumes:()=>({narrationVolume,effectsVolume}),toggle(){enabled=!enabled;if(!enabled)stop();return enabled},isEnabled:()=>enabled};
})(BD);
