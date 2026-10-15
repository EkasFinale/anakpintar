window.BD={};
(function(B){
const WORDS=[
  {word:'APEL',emoji:'🍎',syllable:'A',end:'PEL'},
  {word:'API',emoji:'🔥',syllable:'A',end:'PI'},
  {word:'AYAM',emoji:'🐔',syllable:'A',end:'YAM'},
  {word:'AWAN',emoji:'☁️',syllable:'A',end:'WAN'},
  {word:'BAJU',emoji:'👕',syllable:'BA',end:'JU'},
  {word:'BATIK',emoji:'🧵',syllable:'BA',end:'TIK'},
  {word:'BEBEK',emoji:'🦆',syllable:'BE',end:'BEK'},
  {word:'BOLA',emoji:'⚽',syllable:'BO',end:'LA'},
  {word:'BUKU',emoji:'📚',syllable:'BU',end:'KU'},
  {word:'BULAN',emoji:'🌙',syllable:'BU',end:'LAN'},
  {word:'BUNGA',emoji:'🌸',syllable:'BU',end:'NGA'},
  {word:'CABAI',emoji:'🌶️',syllable:'CA',end:'BAI'},
  {word:'CACING',emoji:'🪱',syllable:'CA',end:'CING'},
  {word:'CERI',emoji:'🍒',syllable:'CE',end:'RI'},
  {word:'COKELAT',emoji:'🍫',syllable:'CO',end:'KELAT'},
  {word:'DADU',emoji:'🎲',syllable:'DA',end:'DU'},
  {word:'DAUN',emoji:'🍃',syllable:'DA',end:'UN'},
  {word:'DOMBA',emoji:'🐑',syllable:'DOM',end:'BA'},
  {word:'DONAT',emoji:'🍩',syllable:'DO',end:'NAT'},
  {word:'EMBER',emoji:'🪣',syllable:'EM',end:'BER'},
  {word:'ESKRIM',emoji:'🍦',syllable:'ES',end:'KRIM'},
  {word:'FOTO',emoji:'📷',syllable:'FO',end:'TO'},
  {word:'GAJAH',emoji:'🐘',syllable:'GA',end:'JAH'},
  {word:'GELAS',emoji:'🥛',syllable:'GE',end:'LAS'},
  {word:'GIGI',emoji:'🦷',syllable:'GI',end:'GI'},
  {word:'GITAR',emoji:'🎸',syllable:'GI',end:'TAR'},
  {word:'HUJAN',emoji:'🌧️',syllable:'HU',end:'JAN'},
  {word:'IKAN',emoji:'🐟',syllable:'I',end:'KAN'},
  {word:'JAMUR',emoji:'🍄',syllable:'JA',end:'MUR'},
  {word:'JERUK',emoji:'🍊',syllable:'JE',end:'RUK'},
  {word:'KADO',emoji:'🎁',syllable:'KA',end:'DO'},
  {word:'KAMBING',emoji:'🐐',syllable:'KAM',end:'BING'},
  {word:'KAPAL',emoji:'🚢',syllable:'KA',end:'PAL'},
  {word:'KATAK',emoji:'🐸',syllable:'KA',end:'TAK'},
  {word:'KELAPA',emoji:'🥥',syllable:'KELA',end:'PA'},
  {word:'KELINCI',emoji:'🐰',syllable:'KELIN',end:'CI'},
  {word:'KERA',emoji:'🐒',syllable:'KE',end:'RA'},
  {word:'KERETA',emoji:'🚂',syllable:'KERE',end:'TA'},
  {word:'KIPAS',emoji:'🪭',syllable:'KI',end:'PAS'},
  {word:'KOIN',emoji:'🪙',syllable:'KO',end:'IN'},
  {word:'KUDA',emoji:'🐴',syllable:'KU',end:'DA'},
  {word:'KUE',emoji:'🧁',syllable:'KU',end:'E'},
  {word:'KUNCI',emoji:'🔑',syllable:'KUN',end:'CI'},
  {word:'KURSI',emoji:'🪑',syllable:'KUR',end:'SI'},
  {word:'LAMPU',emoji:'💡',syllable:'LAM',end:'PU'},
  {word:'LEBAH',emoji:'🐝',syllable:'LE',end:'BAH'},
  {word:'LEMON',emoji:'🍋',syllable:'LE',end:'MON'},
  {word:'LILIN',emoji:'🕯️',syllable:'LI',end:'LIN'},
  {word:'MANGGA',emoji:'🥭',syllable:'MANG',end:'GA'},
  {word:'MATA',emoji:'👁️',syllable:'MA',end:'TA'},
  {word:'MELON',emoji:'🍈',syllable:'ME',end:'LON'},
  {word:'MIE',emoji:'🍜',syllable:'MI',end:'E'},
  {word:'MOBIL',emoji:'🚗',syllable:'MO',end:'BIL'},
  {word:'MONYET',emoji:'🐒',syllable:'MON',end:'YET'},
  {word:'NAGA',emoji:'🐉',syllable:'NA',end:'GA'},
  {word:'NASI',emoji:'🍚',syllable:'NA',end:'SI'},
  {word:'NENAS',emoji:'🍍',syllable:'NE',end:'NAS'},
  {word:'OBAT',emoji:'💊',syllable:'O',end:'BAT'},
  {word:'OMBAK',emoji:'🌊',syllable:'OM',end:'BAK'},
  {word:'PADI',emoji:'🌾',syllable:'PA',end:'DI'},
  {word:'PANDA',emoji:'🐼',syllable:'PAN',end:'DA'},
  {word:'PAYUNG',emoji:'☂️',syllable:'PA',end:'YUNG'},
  {word:'PENSIL',emoji:'✏️',syllable:'PEN',end:'SIL'},
  {word:'PESAWAT',emoji:'✈️',syllable:'PESA',end:'WAT'},
  {word:'PISANG',emoji:'🍌',syllable:'PI',end:'SANG'},
  {word:'PIZZA',emoji:'🍕',syllable:'PIZ',end:'ZA'},
  {word:'ROBOT',emoji:'🤖',syllable:'RO',end:'BOT'},
  {word:'ROTI',emoji:'🍞',syllable:'RO',end:'TI'},
  {word:'RUMAH',emoji:'🏠',syllable:'RU',end:'MAH'},
  {word:'RUSA',emoji:'🦌',syllable:'RU',end:'SA'},
  {word:'SAPI',emoji:'🐮',syllable:'SA',end:'PI'},
  {word:'SATE',emoji:'🍢',syllable:'SA',end:'TE'},
  {word:'SEMUT',emoji:'🐜',syllable:'SE',end:'MUT'},
  {word:'SEPATU',emoji:'👟',syllable:'SEPA',end:'TU'},
  {word:'SINGA',emoji:'🦁',syllable:'SI',end:'NGA'},
  {word:'SUSU',emoji:'🥛',syllable:'SU',end:'SU'},
  {word:'TELUR',emoji:'🥚',syllable:'TE',end:'LUR'},
  {word:'TOMAT',emoji:'🍅',syllable:'TO',end:'MAT'},
  {word:'TOPI',emoji:'👒',syllable:'TO',end:'PI'},
  {word:'ULAR',emoji:'🐍',syllable:'U',end:'LAR'},
  {word:'WAYANG',emoji:'🎭',syllable:'WA',end:'YANG'},
  {word:'WORTEL',emoji:'🥕',syllable:'WOR',end:'TEL'},
  {word:'YOYO',emoji:'🪀',syllable:'YO',end:'YO'},
  {word:'ZEBRA',emoji:'🦓',syllable:'ZE',end:'BRA'}
];
const FINGER_REF={0:'assets/images/img-68062c70af36.png',1:'assets/images/img-1e4c317a4fa1.png',2:'assets/images/img-3abd30a432f9.png',3:'assets/images/img-3f673666da8b.png',4:'assets/images/img-ae471eefe87d.png',5:'assets/images/img-88f4f1faf8d2.png'};
const colors=[
  ['MERAH','#e44848'],
  ['BIRU','#3879da'],
  ['KUNING','#f5ce38'],
  ['HIJAU','#36a268'],
  ['UNGU','#9c62cd'],
  ['ORANYE','#f28c28'],
  ['MERAH MUDA','#f58db2']
];
const COLOR_MARKS={MERAH:'●',BIRU:'◆',KUNING:'▲',HIJAU:'✦',UNGU:'▦',ORANYE:'✚','MERAH MUDA':'♥'};
const COLOR_LOOKUP=Object.fromEntries(colors.map(([name,hex])=>[name,{name,hex,mark:COLOR_MARKS[name]||'●'}]));

const COLOR_OUTFIT_REF={
  'MERAH':'assets/color/belva-merah.webp',
  'BIRU':'assets/color/belva-biru.webp',
  'KUNING':'assets/color/belva-kuning.webp',
  'HIJAU':'assets/color/belva-hijau.webp',
  'UNGU':'assets/color/belva-ungu.webp',
  'ORANYE':'assets/color/belva-oranye.webp',
  'MERAH MUDA':'assets/color/belva-merah-muda.webp'
};
const COLOR_OBJECTS=[
  {key:'balloon',emoji:'🎈',name:'balon',scene:'balloon'},
  {key:'car',emoji:'🚗',name:'mobil',scene:'car'},
  {key:'fish',emoji:'🐟',name:'ikan',scene:'fish'},
  {key:'kite',emoji:'🪁',name:'layang-layang',scene:'kite'},
  {key:'ice',emoji:'🍦',name:'es krim',scene:'ice'}
];
let svgUid=0;
function uid(prefix){svgUid+=1;return prefix+svgUid}
function escapeAttr(text){return String(text).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function colorByName(name){return COLOR_LOOKUP[name]||{name,hex:'#cccccc',mark:'●'}}
function hand(n){
  const key=Math.max(0,Math.min(10,Number(n)||0));
  if(key<=5){
    return `<div class="hand-card hand-ref"><div class="finger-single"><div class="finger-slot"><img class="finger-ref" src="${FINGER_REF[key]}" alt="Ilustrasi tangan menunjukkan ${key} jari terbuka"></div></div><span class="hand-shadow" aria-hidden="true"></span></div>`
  }
  const remainder=Math.max(1,Math.min(5,key-5));
  return `<div class="hand-card hand-ref multi"><div class="finger-pair"><div class="finger-slot"><img class="finger-ref" src="${FINGER_REF[5]}" alt="Tangan kiri menunjukkan 5 jari terbuka"></div><div class="finger-slot"><img class="finger-ref" src="${FINGER_REF[remainder]}" alt="Tangan kanan menunjukkan ${remainder} jari terbuka"></div></div><span class="hand-shadow" aria-hidden="true"></span></div>`
}
function outfit(color,girl){
  const c=typeof color==='string'?{hex:color,name:'BIRU'}:color;
  const src=COLOR_OUTFIT_REF[c.name]||COLOR_OUTFIT_REF.BIRU;
  return `<div class="color-scene outfit-scene belva toy3d-photo-scene">
    <div class="toy3d-photo-card">
      <img class="toy3d-belva" src="${src}" alt="Belva memakai baju ${escapeAttr(c.name)}" loading="eager" decoding="async">
      <div class="toy3d-scene-shine" aria-hidden="true"></div>
      <div class="toy3d-scene-stars" aria-hidden="true"><span>★</span><span>✦</span><span>★</span></div>
    </div>
  </div>`
}

function toyScene(color,item){
  const c=typeof color==='string'?{hex:color,name:'warna'}:color;
  return `<div class="color-scene toy-scene scene-${item.scene}" role="img" aria-label="${escapeAttr(item.name)} berwarna ${escapeAttr(c.name)}">
    <div class="scene-card scene-toy-card">
      <div class="toy-badge">${item.emoji}</div>
      <div class="toy-stage"><div class="toy-shape" style="--toy:${c.hex}">${objectShape(item.scene)}</div></div>
      <div class="scene-caption"><strong>${capitalize(item.name)}</strong><small>Perhatikan warnanya</small></div>
    </div>
  </div>`
}
function objectShape(scene){
  if(scene==='balloon')return `<span class="shape-balloon"><i></i></span>`;
  if(scene==='car')return `<span class="shape-car"><i></i><b></b><u></u></span>`;
  if(scene==='fish')return `<span class="shape-fish"><i></i><b></b><u></u></span>`;
  if(scene==='kite')return `<span class="shape-kite"><i></i><b></b><u></u></span>`;
  return `<span class="shape-ice"><i></i><b></b><u></u></span>`;
}
function paintScene(color){
  const c=typeof color==='string'?{hex:color,name:'warna'}:color;
  return `<div class="color-scene splash-scene" role="img" aria-label="Percikan cat berwarna ${escapeAttr(c.name)}">
    <div class="scene-card scene-splash-card">
      <div class="splash-area" style="--paint:${c.hex}">
        <span class="splash-drop a"></span><span class="splash-drop b"></span><span class="splash-drop c"></span>
        <div class="paint-blob"><em>${c.mark}</em></div>
        <div class="paint-brush">🖌️</div>
      </div>
      <div class="scene-caption"><strong>Cat ajaib</strong><small>Pilih warna yang sama</small></div>
    </div>
  </div>`
}
function capitalize(text){return text.charAt(0).toUpperCase()+text.slice(1)}

const missions=[
{id:0,world:'numbers',name:'Kebun angka',range:'Hitung 1–5',type:'count',icon:'🍎'},
{id:1,world:'words',name:'Teman huruf',range:'Huruf awal',type:'letter',icon:'🔤'},
{id:2,world:'numbers',name:'Piknik tambah',range:'Penjumlahan sampai 8',type:'add',icon:'🧺'},
{id:3,world:'words',name:'Kereta suku kata',range:'Lengkapi suku kata',type:'syllable',icon:'🚂'},
{id:4,world:'numbers',name:'Kupu-kupu pergi',range:'Pengurangan sampai 9',type:'subtract',icon:'🦋'},
{id:5,world:'words',name:'Aku bisa baca',range:'Cocokkan gambar dan kata',type:'read',icon:'📖'},
{id:6,world:'numbers',name:'Jari ajaib',range:'Jari 1–5',type:'fingers',icon:'✋'},
{id:7,world:'colors',name:'Lemari warna',range:'Warna baju Belva & Deva',type:'color',icon:'👕'},
{id:8,world:'numbers',name:'Dua tangan ceria',range:'Jari 6–10',type:'twohands',icon:'🙌'},
{id:9,world:'colors',name:'Mainan pelangi',range:'Warna benda sehari-hari',type:'color',icon:'🧸'},
{id:10,world:'colors',name:'Studio cat',range:'Pilih warna yang sama',type:'color',icon:'🎨'}
];
const worlds=[
  {id:'numbers',name:'Dunia Angka',icon:'🍎',missions:[0,6,8,2,4]},
  {id:'words',name:'Dunia Kata',icon:'🐣',missions:[1,3,5]},
  {id:'colors',name:'Dunia Warna',icon:'🌈',missions:[7,9,10]}
];
function shuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function options(answer,pool){return shuffle([answer,...shuffle([...new Set(pool)].filter(x=>x!==answer)).slice(0,3)])}
const bankCache={};
function addColorOutfit(list,add){
  for(const [name] of colors){
    const c=colorByName(name);
    add('outfit-belva-'+name,{
      title:'Apa warna baju Belva?',
      visual:outfit(c,true),
      answer:name,
      options:options(name,colors.map(x=>x[0])),
      say:'Lihat baju Belva. Warna bajunya apa?',
      variant:'outfit'
    });
  }
}
function addColorObjects(list,add){
  for(const item of COLOR_OBJECTS){
    for(const [name] of colors){
      const c=colorByName(name);
      add('toy-'+item.key+'-'+name,{
        title:'Apa warna '+item.name+' ini?',
        visual:toyScene(c,item),
        answer:name,
        options:options(name,colors.map(x=>x[0])),
        say:'Perhatikan '+item.name+' ini. Warnanya apa?',
        variant:'toy',
        objectName:item.name
      });
    }
  }
}
function addColorSplash(list,add){
  const prompts=['Sentuh warna yang sama','Warna cat ini apa?','Pilih warna yang cocok'];
  for(const [name] of colors){
    const c=colorByName(name);
    prompts.forEach((title,idx)=>add('paint-'+name+'-'+idx,{
      title,
      visual:paintScene(c),
      answer:name,
      options:options(name,colors.map(x=>x[0])),
      say:idx===0?'Pilih warna yang sama dengan cat di gambar.':'Warna cat di gambar apa?',
      variant:'splash'
    }));
  }
}
function bank(m){
  const cacheKey=String(m.id);
  if(bankCache[cacheKey])return bankCache[cacheKey];
  const list=[],type=m.type;
  function add(key,q){list.push({...q,id:type+':'+m.id+':'+key})}
  const nums=Array.from({length:11},(_,i)=>i);
  if(type==='count')for(const f of ['🍎','🍌','🍊'])for(let n=1;n<=5;n++)add(f+n,{title:f==='🍌'?'Masukkan '+n+' pisang ke keranjang':'Ada berapa buah?',collect:f==='🍌',items:Array(f==='🍌'?7:n).fill(f),answer:n,options:options(n,nums.slice(0,7)),say:f==='🍌'?'Sentuh '+n+' pisang untuk dimasukkan ke keranjang. Lalu tekan selesai.':'Hitung buahnya. Ada berapa semuanya?'});
  if(type==='fingers'||type==='twohands')for(let n=type==='fingers'?1:6;n<=(type==='fingers'?5:10);n++)add(n,{title:'Berapa jari yang terbuka?',visual:'<div class="hand-visual">'+hand(n)+'</div>',answer:n,options:options(n,nums),say:'Hitung hanya jari yang terbuka. Ada berapa semuanya?'});
  if(type==='add')for(let a=1;a<=5;a++)for(let b=1;b<=4;b++)if(a+b<=8)add(a+'+'+b,{title:a+' + '+b+' = …',items:[...Array(a).fill('🍎'),'+',...Array(b).fill('🍎')],answer:a+b,options:options(a+b,nums),say:a+' ditambah '+b+', berapa?',a,b});
  if(type==='subtract')for(let a=5;a<=9;a++)for(let b=1;b<=4;b++)add(a+'-'+b,{title:a+' − '+b+' = …',items:Array(a-b).fill('🦋'),gone:b,answer:a-b,options:options(a-b,nums),say:'Ada '+a+' kupu-kupu. '+b+' pergi. Berapa yang tersisa?',a,b});
  if(type==='color'){
    if(m.id===7)addColorOutfit(list,add);
    else if(m.id===9)addColorObjects(list,add);
    else if(m.id===10)addColorSplash(list,add);
    else addColorOutfit(list,add);
  }
  if(['letter','syllable','read'].includes(type))for(const w of WORDS){if(type==='letter')add(w.word,{title:'Apa huruf awalnya?',items:[w.emoji],word:w.word,answer:w.word[0],options:options(w.word[0],WORDS.map(x=>x.word[0])),say:w.word.toLowerCase()+'. Apa huruf awalnya?'});if(type==='syllable')add(w.word,{title:'Lengkapi suku katanya',items:[w.emoji],word:w.syllable+' — …',fullWord:w.word,answer:w.end,options:options(w.end,WORDS.map(x=>x.end)),say:'Lengkapi kata '+w.word.toLowerCase()+'. '+w.syllable.toLowerCase()+', apa lanjutannya?'});if(type==='read')add(w.word,{title:'Mana kata yang sesuai?',items:[w.emoji],answer:w.word,options:options(w.word,WORDS.map(x=>x.word)),say:'Lihat gambarnya. Pilih kata yang sesuai.'})}
  bankCache[cacheKey]=list;
  return list
}
B.Data={WORDS,missions,worlds,colors,bank,shuffle,byId:id=>missions.find(m=>m.id===+id),colorByName};
})(BD);
