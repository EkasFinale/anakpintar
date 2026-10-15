(function(B){
  let ctx=null,master=null,musicBus=null,timer=null,step=0,bar=0,active='home';
  let enabled=true,unlocked=false,ducked=false,volume=.55;

  // Original procedural background songs: fully offline, no external audio/CDN.
  // 16-step melodies + bass/chord/percussion layers keep each world distinct.
  const THEMES={
    home:{bpm:96,wave:'triangle',gain:.72,mel:[60,64,67,72,67,64,62,67,60,64,69,72,69,67,64,62],bass:[48,48,53,55],chord:[[60,64,67],[60,65,69],[62,67,71],[59,62,67]],bell:true,beat:'soft'},
    map:{bpm:104,wave:'triangle',gain:.68,mel:[60,62,64,67,69,67,64,62,64,67,71,74,71,69,67,64],bass:[48,50,52,55],chord:[[60,64,67],[62,65,69],[64,67,71],[55,59,62]],beat:'soft'},
    numbers:{bpm:118,wave:'triangle',gain:.74,mel:[67,72,76,72,69,74,77,74,72,76,79,76,74,77,81,77],bass:[48,53,50,55],chord:[[60,64,67],[65,69,72],[62,65,69],[67,71,74]],beat:'bounce'},
    fingers:{bpm:110,wave:'sine',gain:.72,mel:[72,76,79,76,74,77,81,77,76,79,83,79,77,81,84,81],bass:[48,55,50,53],chord:[[60,64,67],[67,71,74],[62,65,69],[65,69,72]],bell:true,beat:'clap'},
    words:{bpm:90,wave:'sine',gain:.64,mel:[64,67,71,76,71,67,62,67,64,69,72,76,72,69,67,64],bass:[48,52,55,52],chord:[[60,64,67],[64,67,71],[55,59,62],[57,60,64]],bell:true,beat:'soft'},
    colors:{bpm:122,wave:'triangle',gain:.74,mel:[72,76,79,84,81,77,74,79,76,79,83,86,83,81,79,76],bass:[48,53,55,52],chord:[[60,64,67],[65,69,72],[67,71,74],[64,67,71]],bell:true,beat:'bounce'},
    wardrobe:{bpm:98,wave:'sine',gain:.61,mel:[67,71,74,79,74,71,69,74,67,72,76,79,76,74,71,69],bass:[48,55,52,53],chord:[[60,64,67],[67,71,74],[64,67,71],[65,69,72]],bell:true,beat:'soft'},
    collection:{bpm:88,wave:'sine',gain:.63,mel:[72,76,79,83,79,76,74,79,72,77,81,84,81,79,76,74],bass:[48,53,55,52],chord:[[60,64,67],[65,69,72],[67,71,74],[64,67,71]],bell:true,beat:'soft'},
    'journey-map':{bpm:96,wave:'triangle',gain:.67,mel:[60,64,67,71,69,67,64,62,60,64,69,72,71,69,67,64],bass:[48,48,53,50],chord:[[60,64,67],[60,64,69],[65,69,72],[62,67,71]],beat:'march'},
    'journey-garden':{bpm:108,wave:'triangle',gain:.70,mel:[67,71,74,79,76,72,74,71,69,72,76,81,79,76,74,72],bass:[48,55,53,50],chord:[[60,64,67],[67,71,74],[65,69,72],[62,65,69]],bell:true,beat:'soft'},
    'journey-sea':{bpm:82,wave:'sine',gain:.61,mel:[72,76,79,83,79,76,71,74,72,74,79,81,79,76,74,71],bass:[45,48,43,47],chord:[[57,60,64],[60,64,67],[55,59,62],[59,62,66]],bell:true,beat:'wave'},
    'journey-forest':{bpm:92,wave:'triangle',gain:.60,mel:[62,65,69,72,69,65,64,67,62,67,70,74,70,69,67,64],bass:[43,46,48,45],chord:[[55,58,62],[58,62,65],[60,64,67],[57,60,64]],beat:'soft'},
    'journey-sky':{bpm:106,wave:'sine',gain:.63,mel:[72,76,79,83,86,83,79,76,74,79,83,88,86,83,81,79],bass:[48,52,55,52],chord:[[60,64,67],[64,67,71],[67,71,74],[64,69,72]],bell:true,beat:'air'},
    'journey-castle':{bpm:120,wave:'triangle',gain:.70,mel:[67,71,74,79,83,79,76,74,72,76,79,84,83,81,79,76],bass:[43,50,48,55],chord:[[55,59,62],[62,67,71],[60,64,67],[67,71,74]],bell:true,beat:'march'},
    reward:{bpm:132,wave:'triangle',gain:.78,mel:[72,76,79,84,79,84,88,91,84,88,91,96,91,88,84,79],bass:[48,53,55,60],chord:[[60,64,67],[65,69,72],[67,71,74],[72,76,79]],bell:true,beat:'party'},
    parent:{bpm:76,wave:'sine',gain:.34,mel:[60,64,67,64,62,65,69,65,60,64,67,71,67,64,62,60],bass:[48,48,50,50],chord:[[60,64,67],[60,64,67],[62,65,69],[62,65,69]],beat:'none'}
  };
  const ALIAS={count:'numbers',add:'numbers',subtract:'numbers',fingers:'fingers',twohands:'fingers',letter:'words',syllable:'words',read:'words',color:'colors'};
  const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
  const midi=n=>440*Math.pow(2,(n-69)/12);

  function ensure(){
    if(ctx)return true;
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;
    ctx=new C();master=ctx.createGain();musicBus=ctx.createGain();
    master.gain.value=0;musicBus.gain.value=1;musicBus.connect(master);master.connect(ctx.destination);
    return true
  }
  function targetGain(){const t=THEMES[active]||THEMES.home;return enabled?.038*t.gain*volume*(ducked?.12:1):0}
  function updateGain(){if(!master||!ctx)return;master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(targetGain(),ctx.currentTime,.09)}
  function voice(note,duration,wave='triangle',v=1,delay=0,detune=0){
    if(!ctx||!musicBus||!enabled||volume<=0)return;
    const start=ctx.currentTime+delay,osc=ctx.createOscillator(),g=ctx.createGain();osc.type=wave;osc.frequency.value=midi(note);osc.detune.value=detune;
    g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(Math.max(.0002,.085*v),start+.018);g.gain.exponentialRampToValueAtTime(.0001,start+duration);
    osc.connect(g);g.connect(musicBus);osc.start(start);osc.stop(start+duration+.04)
  }
  function bell(note,duration,v=.22,delay=0){voice(note+12,duration,'sine',v,delay);voice(note+24,duration*.55,'sine',v*.35,delay+.01)}
  function thump(v=.16,delay=0){if(!ctx||!musicBus||!enabled||volume<=0)return;const s=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(95,s);o.frequency.exponentialRampToValueAtTime(52,s+.08);g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(.06*v,s+.008);g.gain.exponentialRampToValueAtTime(.0001,s+.12);o.connect(g);g.connect(musicBus);o.start(s);o.stop(s+.13)}
  function click(v=.10,delay=0){if(!ctx||!musicBus||!enabled||volume<=0)return;const s=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type='square';o.frequency.value=1500;g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(.025*v,s+.002);g.gain.exponentialRampToValueAtTime(.0001,s+.035);o.connect(g);g.connect(musicBus);o.start(s);o.stop(s+.04)}
  function percussion(kind,beat,i){
    if(kind==='none')return;
    if(kind==='soft'){if(i%4===0)thump(.55);if(i%4===2)click(.35)}
    else if(kind==='bounce'){if(i%2===0)thump(.62);if(i%4===2)click(.45)}
    else if(kind==='clap'){if(i%4===0)thump(.50);if(i%4===2)click(.60)}
    else if(kind==='march'){if(i%2===0)thump(.65);if(i%4===1||i%4===3)click(.28)}
    else if(kind==='wave'){if(i%4===0)thump(.38);if(i%4===3)click(.20,beat*.25)}
    else if(kind==='air'){if(i%4===0)thump(.32);if(i%4===2)click(.20)}
    else if(kind==='party'){if(i%2===0)thump(.68);click(i%4===2?.62:.24,beat*.44)}
  }
  function tick(){
    clearTimeout(timer);timer=null;
    if(!unlocked||!enabled||volume<=0||document.hidden)return;
    const t=THEMES[active]||THEMES.home,beat=60/t.bpm,i=step%16,n=t.mel[i];
    // Melody has a small second-pass variation every other bar so loops feel less repetitive.
    const variation=(bar%4===2&&i%4===3)?12:0;
    voice(n+variation,beat*.68,t.wave,.54);
    if(t.bell&&i%4===3)bell(n,beat*.62,.22,beat*.12);
    if(i%4===0){
      const bi=(Math.floor(i/4)+bar)%t.bass.length;voice(t.bass[bi],beat*1.45,'sine',.25,.008);
      const chord=t.chord[(Math.floor(i/4)+bar)%t.chord.length];chord.forEach((cn,k)=>voice(cn,beat*1.35,'sine',.105,beat*.05+k*.012,k===1?3:-3));
    }
    percussion(t.beat,beat,i);
    step++;if(step%16===0)bar=(bar+1)%8;
    timer=setTimeout(tick,beat*1000)
  }
  async function unlock(){
    if(!ensure())return;
    try{await ctx.resume()}catch{}
    if(!unlocked){unlocked=true;updateGain();tick()}
  }
  function stinger(kind='tap'){
    if(!unlocked||!enabled||volume<=0||!ctx)return;
    const map={tap:[84],correct:[79,84,88],wrong:[60,57],reward:[72,79,84,91],next:[76,79]};
    const notes=map[kind]||map.tap;notes.forEach((n,i)=>{voice(n,.14,'sine',kind==='wrong'?.16:.28,i*.07);if(kind==='reward')bell(n,.23,.30,i*.07)})
  }
  function theme(name){const next=ALIAS[name]||name,changed=active!==next;active=THEMES[next]?next:'home';step=0;bar=0;if(unlocked){updateGain();if(changed)stinger('next');tick()}}
  function setEnabled(v){enabled=!!v;if(!enabled){clearTimeout(timer);timer=null}updateGain();if(enabled&&unlocked)tick()}
  function setVolume(v){volume=clamp(v);updateGain();if(volume>0&&enabled&&unlocked)tick()}
  function duck(v){ducked=!!v;updateGain()}
  function pause(){clearTimeout(timer);timer=null;if(master&&ctx)master.gain.setTargetAtTime(0,ctx.currentTime,.08)}
  function resume(){if(unlocked&&enabled){updateGain();tick()}}
  function isUnlocked(){return unlocked}
  document.addEventListener('pointerdown',unlock,{once:true,passive:true});
  document.addEventListener('keydown',unlock,{once:true});
  document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
  B.Music={theme,stinger,setEnabled,setVolume,volume:()=>volume,duck,pause,resume,isEnabled:()=>enabled,isUnlocked,unlock};
})(BD);
