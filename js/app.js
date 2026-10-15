(function(B){const $=s=>document.querySelector(s),esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),P=B.Profiles,D=B.Data,R=B.Rewards,G=B.Game,A=B.Audio,M=B.Music,S=B.Storage;let screen='home',parentOpen=false,gateAnswer=0,gateCallback=null,gateHoldReady=false,gateHoldTimer=null,gateHoldTicker=null,gateHoldStarted=0,editMode='add';const order=D.worlds.flatMap(w=>w.missions);function profile(){return P.current()}const CHARACTER_LABELS=['dongeng','superhero','antariksa'];
function avatar(p,large=false){
  const n=[0,1,2].includes(p.costume)?p.costume:0,isDeva=p.buddy==='deva',buddy=isDeva?'deva':'belva',label=CHARACTER_LABELS[n],base=`assets/characters/${buddy}-${label}`;
  return `<div class="avatar ${large?'large':''}" role="img" aria-label="${isDeva?'Deva':'Belva'} berkostum ${['Dongeng','Superhero','Antariksa'][n]}"><picture><source srcset="${base}.webp" type="image/webp"><img src="${base}.jpg" alt="" aria-hidden="true" loading="eager" decoding="async"></picture></div>`
}
function buddyName(p=profile()){return p?.buddy==='deva'?'Deva':'Belva'}
function worldLabels(id){return id==='numbers'?'Hitung · Jari · Tambah · Kurang':id==='words'?'Huruf · Suku kata · Membaca':'Baju · Mainan · Cat'}
function worldSummary(id){return id==='numbers'?'Bermain angka dengan sentuhan, benda lucu, dan tantangan jari.':id==='words'?'Kenali huruf, suku kata, dan kata lewat permainan cepat.':'Eksplor warna lewat baju, mainan, dan studio cat yang seru.'}
function companionLine(kind,m,r){
  if(kind==='hub')return `Halo, aku ${buddyName()}! Aku ikut bermain, memberi semangat, dan merayakan tiap bintangmu.`;
  if(kind==='world')return `Aku akan menemani di dunia ${m?.name?.replace('Dunia ','')||''}. Pilih game yang paling kamu suka.`;
  if(kind==='success')return 'Yeay! Kita berhasil. Bintangnya bertambah!';
  if(kind==='retry')return 'Tidak apa-apa. Kita lihat pelan-pelan lalu coba lagi, ya.';
  if(kind==='result')return 'Hebat! Satu permainan selesai. Mau lanjut atau istirahat dulu?';
  return `Ayo main ${m?.name||'game ini'} bersama. Aku bantu kasih petunjuk kalau kamu butuh.`;
}
function companionCard({title='',text='',kicker='',actions='',compact=false,mood='sunny'}={}){const p=profile();return `<div class="companion-card ${compact?'compact':''} mood-${mood}">${avatar(p)}<div class="companion-copy">${kicker?`<small class="companion-kicker">${kicker}</small>`:''}<h3>${esc(title||buddyName(p))}</h3><p>${esc(text)}</p>${actions?`<div class="companion-actions">${actions}</div>`:''}</div></div>`}
function guide(text){return companionCard({title:`${buddyName()} menemani`,text,kicker:'TEMAN MAIN',compact:true,mood:'guide'})}
function playCompanion(m,r){
  const stateText=r.done?companionLine('success',m,r):r.attempts?companionLine('retry',m,r):companionLine('play',m,r);
  return `<div class="play-companion-wrap">${companionCard({title:`${buddyName()} siap bantu`,text:stateText,kicker:`${m.icon} ${m.name.toUpperCase()}`,mood:r.done?'win':'sunny'})}<div class="play-status-strip"><span>⭐ Bintang ${r.index+1} dari 5</span><span>${worldName(m)} · ${m.range}</span></div></div>`
}
function familyRewardMarkup({gallery=false}={}){
  if(gallery)return `<section class="family-memory-gallery"><div class="family-memory-head"><span class="section-kicker">💛 KENANGAN KELUARGA</span><h2>Bonus dari Petualangan Pelangi</h2><p>Hadiah ini terbuka setelah semua 25 Bintang Pelangi ditemukan.</p></div><div class="family-photo-grid"><figure class="family-photo-card main"><img src="assets/family/family-reward-main.webp" alt="Foto keluarga hadiah utama" loading="lazy" decoding="async"><figcaption><strong>🏆 Hadiah Utama</strong><span>Foto Keluarga Tersayang</span></figcaption></figure><figure class="family-photo-card bonus"><img src="assets/family/family-reward-bonus.webp" alt="Foto keluarga bonus" loading="lazy" decoding="async"><figcaption><strong>✨ Bonus Kenangan</strong><span>Satu foto lagi untuk album petualangan</span></figcaption></figure></div><blockquote>“Karena petualangan paling indah selalu pulang ke rumah.” 💛</blockquote></section>`;
  return `<section class="family-final-reward" aria-label="Hadiah spesial foto keluarga"><div class="family-gift-pop" aria-hidden="true"><span>🎁</span><i>✨</i><b>⭐</b></div><div class="family-reward-label">HADIAH SPESIAL TERBUKA</div><h2>Foto Keluarga Tersayang</h2><div class="family-frame"><span class="frame-star f1">⭐</span><span class="frame-star f2">✨</span><span class="frame-star f3">🌈</span><img src="assets/family/family-reward-main.webp" alt="Foto keluarga hadiah akhir Petualangan Pelangi" loading="eager" decoding="async"></div><p class="family-reward-quote">Karena petualangan paling indah selalu pulang ke rumah. 💛</p></section>`
}
function familyRewardCollection(){
  const root=$('#collection');if(!root||root.querySelector('.family-memory-gallery,.family-memory-locked'))return;const j=jState();
  if(j.treasure){root.insertAdjacentHTML('beforeend',familyRewardMarkup({gallery:true}));return}
  const total=jTotal(j);root.insertAdjacentHTML('beforeend',`<section class="family-memory-locked"><div class="family-lock-icon">🔒</div><div><span class="section-kicker">BONUS RAHASIA</span><h2>Kenangan Keluarga</h2><p>Kumpulkan semua ${J_TOTAL} Bintang Pelangi untuk membuka hadiah spesial.</p><div class="reward-meter"><span style="width:${Math.min(100,total/J_TOTAL*100)}%"></span></div><small>${total}/${J_TOTAL} ⭐ ditemukan</small></div></section>`)
}
function show(id){if(screen==='play'&&id!=='play')G.leave();parentOpen=id==='parent'&&parentOpen;for(const name of ['home','worlds','wardrobe','collection','play','parent'])$('#'+name).hidden=name!==id;screen=id;$('#nav').hidden=id==='play';document.body.classList.toggle('motion-off',profile()?.motion===false);document.querySelectorAll('[data-nav]').forEach(b=>b.setAttribute('aria-current',b.dataset.nav===id?'page':'false'));const warn=P.warning();if(warn)$('#audioStatus').textContent=warn;window.scrollTo?.({top:0,behavior:'instant'})}function available(id){return !!D.byId(id)}function nextMission(){const p=profile();return order.find(id=>available(id)&&!p.completions[id])??order.find(id=>available(id))}function startMission(id,resume=false){const mm=D.byId(id);B.Music?.theme(mm?.type||'numbers');show('play');G.start(id,resume)}
function worldName(m){return m.world==='numbers'?'Angka':m.world==='words'?'Kata':'Warna'}
function dailyInfo(p=profile()){const daily=R.today(p),ids=daily.ids.filter(available),doneIds=ids.filter(id=>p.completions[id]?.last===P.today());return {daily,ids,doneIds,done:doneIds.length,total:ids.length,next:ids.find(id=>!doneIds.includes(id))??ids[0]}}
function dailyStars(info){return Array.from({length:info.total||5},(_,i)=>`<span class="${i<info.done?'found':''}" aria-hidden="true">${i<info.done?'★':'☆'}</span>`).join('')}
function nextReward(p){return R.stickers(p).find(s=>!s.open)||null}function rewardProgress(p){return R.nextProgress?.(p)||{reward:nextReward(p),current:0,target:1,ratio:0}}
function home(){B.Music?.theme('home');const p=profile();if(!p)return profiles();const info=dailyInfo(p),validResume=p.resume&&available(p.resume.mission),id=validResume?p.resume.mission:info.next,m=D.byId(id),reward=nextReward(p),allDone=info.total>0&&info.done>=info.total;$('#home').innerHTML=`
<section class="adventure-home ${allDone?'day-complete':''}">
  <div class="adventure-copy">
    <div class="hello-badge">✨ Halo, ${esc(p.name)}!</div>
    <div class="adventure-kicker">PETUALANGAN HARI INI</div>
    <h1>${allDone?'Bintang hari ini lengkap!':'Ayo cari 5 bintang hari ini!'}</h1>
    <p class="hero-lead">${allDone?'Hebat! Kamu sudah menyelesaikan petualangan hari ini. Besok ada pilihan baru.':'Mainkan game mana saja. Setiap misi hari ini memberi satu bintang.'}</p>
    <div class="daily-star-path" aria-label="${info.done} dari ${info.total} bintang hari ini">${dailyStars(info)}</div>
    <div class="daily-count"><strong>${info.done}/${info.total}</strong><span>bintang ditemukan</span></div>
    ${allDone?`<div class="day-finish-note"><span>🌙</span><div><strong>Sampai besok!</strong><small>Kalau masih ingin bermain, semua game tetap boleh dimainkan.</small></div></div><button class="primary game-cta" id="chooseGame">🎮 Pilih permainan</button>`:`<button class="primary game-cta" id="mainContinue">▶ ${validResume?'Lanjutkan yang tadi':'Lanjutkan Petualangan'}</button><button class="soft-link" id="chooseGame">Atau pilih permainan sendiri →</button>`}
  </div>
  <div class="character-quest-stage">
    <div class="character-bubble">${allDone?'Yeay! Semua bintang ketemu! 🎉':p.buddy==='deva'?'Ayo pilih game yang kamu suka!':'Kita cari bintang berikutnya! ⭐'}</div>
    ${avatar(p,true)}
    <div class="character-actions"><button class="mini-action" id="changeCostume">👗 Ganti kostum</button><button class="mini-action" id="changePlayer">👧 Ganti pemain</button></div>
  </div>
</section>
<section class="today game-section free-choice">
  <div class="section-head"><div><span class="section-kicker">🎮 BEBAS PILIH</span><h2>Mau main apa?</h2></div><div class="daily-progress"><strong>${info.done}/${info.total}</strong><span>hari ini</span></div></div>
  <p class="section-copy">Tidak harus berurutan. Mulai dari game yang paling kamu suka.</p>
  <div class="quick-world-grid">
    <button class="quick-world numbers" data-go-world="numbers"><span>🍎</span><strong>Angka</strong><small>Hitung, tambah, kurang & jari</small></button>
    <button class="quick-world fingers" data-start="6"><span>✋</span><strong>Jari</strong><small>Mulai langsung dari game jari</small></button>
    <button class="quick-world words" data-go-world="words"><span>🔤</span><strong>Kata</strong><small>Huruf, suku kata & membaca</small></button>
    <button class="quick-world colors" data-go-world="colors"><span>🌈</span><strong>Warna</strong><small>Baju, mainan & studio cat</small></button>
  </div>
</section>
<section class="reward-thread">
  ${(()=>{const rp=rewardProgress(p),rr=rp.reward;return `<div class="reward-icon">${rr?'🎁':'🏆'}</div><div class="reward-thread-copy"><span class="section-kicker">HADIAH & KOLEKSI</span><h2>${rr?'Sedikit lagi: '+esc(rr.name):'Koleksimu makin lengkap!'}</h2><p>${rr?esc(rr.hint):'Lihat semua stiker dan oleh-oleh yang sudah ditemukan.'}</p>${rr?`<div class="reward-mini-progress"><span style="width:${Math.round(rp.ratio*100)}%"></span></div><small>${rp.current}/${rp.target} langkah</small>`:''}</div>`})()}<button class="pill" id="openCollection">Lihat koleksi →</button>
</section>`;
if($('#mainContinue'))$('#mainContinue').onclick=()=>startMission(id,!!validResume);$('#chooseGame').onclick=()=>worlds();$('#changeCostume').onclick=wardrobe;$('#changePlayer').onclick=profiles;$('#openCollection').onclick=collection;document.querySelectorAll('[data-go-world]').forEach(b=>b.onclick=()=>worlds(b.dataset.goWorld));bindStarts();show('home');journeyHomeCard()}function bindStarts(){document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startMission(+b.dataset.start))}function worlds(selected){B.Music?.theme('map');const p=profile(),info=dailyInfo(p);if(!selected){$('#worlds').innerHTML=`<section class="play-hub play-hub-rich"><div class="play-hub-copy"><span class="section-kicker">🎮 PILIH PERMAINAN</span><h1>Mau main yang mana?</h1><p>Semua game terbuka. Tidak perlu menyelesaikan game lain dulu. Pilih yang paling membuatmu semangat.</p><div class="hub-chips"><span>✨ bebas pilih</span><span>⭐ ${info.done}/${info.total} bintang hari ini</span><span>🎒 hadiah tetap terkumpul</span></div></div><div class="hub-side"><div class="hub-progress"><div class="daily-star-path small">${dailyStars(info)}</div><strong>${info.done}/${info.total} bintang hari ini</strong><small>Lanjut kapan saja. Tidak harus urut.</small></div>${companionCard({title:`${buddyName(p)} jadi teman main`,text:companionLine('hub'),kicker:'AVATAR AKTIF',actions:`<button class="mini-action" id="hubCostume">👗 Kostum</button><button class="mini-action" id="hubPlayer">👧 Pemain</button>`,mood:'sunny'})}</div></section><div class="world-grid game-world-grid enhanced">${D.worlds.map(w=>{const n=w.missions.filter(id=>p.completions[id]).length;return `<button class="world-card game-select-card world-${w.id}" data-world="${w.id}"><div class="card-top"><span class="icon">${w.icon}</span><span class="world-progress-pill">${n}/${w.missions.length}</span></div><div class="card-body"><small>${worldLabels(w.id)}</small><h2>${w.name.replace('Dunia ','')}</h2><p>${worldSummary(w.id)}</p></div><div class="card-foot"><span class="world-buddy-chip">${buddyName(p)} ikut bermain</span><span class="go-arrow">→</span></div></button>`}).join('')}</div>`;document.querySelectorAll('[data-world]').forEach(b=>b.onclick=()=>worlds(b.dataset.world));$('#hubCostume').onclick=wardrobe;$('#hubPlayer').onclick=profiles}else{const w=D.worlds.find(w=>w.id===selected);$('#worlds').innerHTML=`<div class="world-hero-shell"><button class="pill" id="allWorlds">← Pilih permainan</button><section class="world-detail-hero world-${w.id}"><div class="world-page-head"><span class="section-kicker">${w.icon} ${w.name.toUpperCase()}</span><h1>Pilih game yang kamu suka</h1><p>Tidak ada urutan wajib. ${buddyName(p)} akan menemani dan memberi semangat di setiap ronde.</p></div>${companionCard({title:`${buddyName(p)} siap di ${w.name.replace('Dunia ','')}`,text:companionLine('world',w),kicker:'TEMAN MAIN',actions:`<button class="mini-action" id="changeAvatarInline">🔁 Ganti avatar</button>`,mood:w.id})}</section></div><div class="mission-grid free-mission-grid">${w.missions.map(id=>{const m=D.byId(id),done=p.completions[id],today=info.ids.includes(id),doneToday=info.doneIds.includes(id);return `<button class="mission game-mission-card ${done?'done':''} ${today?'today-pick':''}" data-start="${id}"><span class="mission-icon">${m.icon}</span><div class="mission-copy"><small>${today?(doneToday?'⭐ BINTANG SUDAH DIDAPAT':'☀️ PILIHAN HARI INI'):worldName(m).toUpperCase()}</small><h2>${m.name}</h2><p>${m.range}</p></div><div class="mission-side"><span class="mini-avatar-badge">${buddyName(p)}</span><span class="go-arrow">→</span></div></button>`}).join('')}</div>`;$('#allWorlds').onclick=()=>worlds();$('#changeAvatarInline').onclick=wardrobe;bindStarts()}show('worlds');if(!selected)journeyWorldCard()}function wardrobe(){B.Music?.theme('wardrobe');const p=profile(),unlock=R.unlocked(p);$('#wardrobe').innerHTML=`<button class="pill" id="wardrobeBack">← Kembali</button><div class="world-page-head"><span class="section-kicker">👗 KARAKTER & KOSTUM</span><h1>Pilih gaya petualanganmu</h1><p>Kostum menemani ${esc(p.name)} saat bermain dan mengumpulkan hadiah.</p></div><div class="costumes">${['belva','deva'].map(w=>`<div class="costume-card">${avatar({...p,buddy:w},true)}<h2>${w==='belva'?'Belva':'Deva'}</h2><button class="pill" data-buddy="${w}" aria-pressed="${p.buddy===w}">Temani aku</button></div>`).join('')}</div><div class="row" style="margin-top:24px">${['Dongeng','Superhero','Antariksa'].map((n,i)=>`<button class="pill" data-costume="${i}" aria-pressed="${p.costume===i}" ${unlock[i]?'':'disabled'}>${unlock[i]?'':'🔒 '}${n}${unlock[i]?'':` · ${i===1?3:6} misi berbeda`}</button>`).join('')}</div><section class="illustration-style"><div><div class="eyebrow">Galeri tampilan</div><h2>🎨 Gaya ilustrasi</h2><p>Mode 2D tetap tersedia di sini sebagai galeri alternatif. Beranda akan selalu tampil 3D.</p><div class="row"><button class="pill" data-style="3d" aria-pressed="${p.style!=='2d'}">✨ 3D</button><button class="pill" data-style="2d" aria-pressed="${p.style==='2d'}">🎨 2D</button></div></div><div class="family wardrobe-family ${p.style==='2d'?'two':''}" role="img" aria-label="Pratinjau gaya ${p.style==='2d'?'2D':'3D'} Belva dan Deva"></div></section>`;document.querySelectorAll('[data-buddy]').forEach(b=>b.onclick=()=>{p.buddy=b.dataset.buddy;P.save();wardrobe()});document.querySelectorAll('[data-costume]').forEach(b=>b.onclick=()=>{const n=+b.dataset.costume;if(unlock[n]){p.costume=n;P.save();wardrobe()}});document.querySelectorAll('[data-style]').forEach(b=>b.onclick=()=>{p.style=b.dataset.style;P.save();wardrobe()});$('#wardrobeBack').onclick=home;show('wardrobe')}function collection(){B.Music?.theme('collection');const p=profile(),rp=rewardProgress(p),reward=rp.reward,plays=R.totalPlays?.(p)||0;$('#collection').innerHTML=`<section class="collection-hero"><div><span class="section-kicker">🎒 KOLEKSI ${esc(p.name).toUpperCase()}</span><h1>Hadiah dari petualanganmu</h1><p>Setiap permainan menambah perjalananmu. Hadiah terbuka lewat target yang jelas—tidak ada hadiah acak atau streak yang hilang.</p></div><div class="collection-actions"><button class="primary" id="collectionCostume">👗 Pilih kostum</button><button class="pill" id="collectionPlay">🎮 Main lagi</button></div></section><section class="star-vault"><div class="vault-orb">⭐</div><div><small>BINTANG PETUALANGAN</small><strong>${plays}</strong><p>Total permainan yang sudah selesai.</p></div>${reward?`<div class="vault-next"><small>MENUJU HADIAH</small><b>${reward.emoji} ${esc(reward.name)}</b><div class="reward-meter"><span style="width:${Math.round(rp.ratio*100)}%"></span></div><em>${rp.current}/${rp.target}</em></div>`:'<div class="vault-next complete"><b>🏆 Album utama lengkap!</b><p>Kamu tetap bisa bermain dan mengulang game favoritmu.</p></div>'}</section><div class="collection-grid reward-album">${R.stickers(p).map(s=>`<div class="sticker ${s.open?'':'locked'}"><div class="emoji">${s.open?s.emoji:'🔒'}</div><h3>${s.name}</h3><p class="subtle">${s.open?'Sudah ditemukan!':s.hint}</p>${!s.open&&s.target?`<div class="sticker-progress"><span style="width:${Math.round((s.current/s.target)*100)}%"></span></div><small>${s.current}/${s.target}</small>`:''}</div>`).join('')}</div>`;$('#collectionCostume').onclick=wardrobe;$('#collectionPlay').onclick=()=>worlds();show('collection');journeyCollection();familyRewardCollection()}
function visual(q){if(q.visual)return q.visual;const countable=['count','add','subtract'].includes(D.byId(G.state().mission).type);return (q.items||[]).map((x,i)=>x==='+'?'<span class="operator" aria-label="ditambah">+</span>':countable?`<button class="item count-object" data-object="${i}" aria-label="Hitung benda ini" aria-pressed="false"><span>${esc(x)}</span><small class="object-number" aria-hidden="true"></small></button>`:`<span class="item">${esc(x)}</span>`).join('')+(q.gone?`<span class="departed" aria-label="${q.gone} kupu-kupu pergi">${'🦋'.repeat(q.gone)}<small>Terbang pergi</small></span>`:'')}
function sparkles(){return '<div class="celebration" aria-hidden="true">'+Array.from({length:16},(_,i)=>`<span style="--i:${i};--x:${(i*37)%100}%">${i%3?'✦':'★'}</span>`).join('')+'</div>'}
function bindObjects(){const r=G.state(),q=G.question();r.touched=r.touched||[];function update(){const count=r.touched.length;document.querySelectorAll('[data-object]').forEach(b=>{const at=r.touched.indexOf(+b.dataset.object);b.setAttribute('aria-pressed',at>=0?'true':'false');b.classList.toggle('counted',at>=0);b.querySelector('.object-number').textContent=at>=0?at+1:'';if(q.collect)b.classList.toggle('picked',at>=0)});const readout=$('#countReadout');if(readout)readout.textContent=count?count+(q.collect?' buah di keranjang':' sudah dihitung'):q.collect?'Sentuh pisang untuk memetiknya':'Sentuh bendanya satu per satu 👆';const basket=$('#basketItems');if(basket)basket.textContent=count?'🍌'.repeat(count):'🧺';const check=$('#checkBasket');if(check)check.disabled=r.done||!count}document.querySelectorAll('[data-object]').forEach(b=>{b.onclick=()=>{if(r.done)return;const i=+b.dataset.object,at=r.touched.indexOf(i);if(at>=0){if(!q.collect)return;r.touched.splice(at,1)}else r.touched.push(i);update();G.save();A.say(String(r.touched.length))};if(r.done)b.disabled=true});update();if($('#checkBasket'))$('#checkBasket').onclick=()=>G.answer(r.touched.length)}
function interactionMeta(type,q){const map={count:['👆 Sentuh untuk menghitung','number-tiles'],add:['🍎 Kelompokkan lalu pilih','number-tiles'],subtract:['🦋 Lihat yang tersisa','number-tiles'],fingers:['✋ Cocokkan jumlah jari','finger-tiles'],twohands:['🙌 Hitung dua tangan','finger-tiles'],letter:['🫧 Pecahkan gelembung huruf','letter-bubbles'],syllable:['🚂 Pasang gerbong yang tepat','train-options'],read:['📖 Temukan kartu kata','word-options']};if(type==='color'){if(q?.variant==='outfit')return ['👕 Lihat bajunya, lalu pilih warna','paint-options'];if(q?.variant==='toy')return ['🧸 Lihat bendanya, lalu pilih warna','paint-options'];return ['🎨 Samakan warna catnya','paint-options']}return map[type]||['✨ Temukan jawaban','number-tiles']}
function colorPattern(name){const names=D.colors.map(c=>c[0]),marks=['●','◆','▲','✦','▦','✚','♥'],i=Math.max(0,names.indexOf(name));return marks[i%marks.length]}
function colorSoft(hex,a=.16){const h=String(hex||'#cccccc').replace('#','');if(h.length!==6)return 'rgba(204,204,204,'+a+')';const n=parseInt(h,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`}
function answerInner(m,q,v){if(m.type==='color'){const c=(D.colorByName?D.colorByName(v):null)||{hex:(D.colors.find(x=>x[0]===v)?.[1]||'#ccc')};const sub=q?.variant==='splash'?'Warna cat':q?.variant==='toy'?'Warna benda':'Warna baju';return `<span class="paint-pot variant-${q?.variant||'base'}"><span class="paint-swatch" style="--swatch:${c.hex||'#ccc'}"><i>${colorPattern(v)}</i></span><span class="paint-copy"><small>${sub}</small><strong>${esc(v)}</strong></span></span>`}if(m.type==='letter')return `<span class="letter-orb">${esc(v)}</span>`;if(m.type==='syllable')return `<span class="train-answer"><i>🚃</i><strong>${esc(v)}</strong></span>`;if(m.type==='read')return `<span class="read-answer"><i>📖</i><strong>${esc(v)}</strong></span>`;if(['fingers','twohands'].includes(m.type))return `<span class="finger-answer"><b>${esc(v)}</b><small>jari</small></span>`;return `<span class="number-answer">${esc(v)}</span>`}
function answerOptions(m,q,r){const [cue,klass]=interactionMeta(m.type,q);return {cue,html:`<div class="options playful-options ${klass} variant-${q.variant||'base'} layout-${r.index%3} ${q.collect?'hidden-options':''}">${q.options.map((v,i)=>{const c=m.type==='color'?(D.colorByName?.(v)||{hex:'#cccccc'}):null,style=c?` style="--choice:${c.hex};--choice-soft:${colorSoft(c.hex,.18)};--choice-mid:${colorSoft(c.hex,.30)}"`:'';return `<button class="option ${r.done&&v===q.answer?'correct':''} ${r.wrongOptions.includes(v)?'wrong':''} ${r.hints>=3&&v===q.answer?'highlight':''}" data-answer="${i}"${style} ${r.done||r.wrongOptions.includes(v)?'disabled':''}>${answerInner(m,q,v)}${r.done&&v===q.answer?'<span class="answer-check" aria-hidden="true">✓</span>':''}</button>`}).join('')}</div>`}}
function revealedWord(m,q,r){
  if(!q.word)return '';
  if(m.type==='letter'){
    if(!r.done)return '';
    const chars=[...String(q.word)];
    return `<div class="word word-reveal" aria-live="polite" aria-label="${esc(q.word)}"><span class="word-reveal-label">✨ Ketemu!</span><div class="word-reveal-letters">${chars.map((ch,i)=>`<span class="reveal-char ${i===0?'is-initial':''}" style="--i:${i}">${esc(ch)}</span>`).join('')}</div></div>`
  }
  if(m.type==='syllable')return `<div class="word">${esc(r.done?q.fullWord:q.word)}</div>`;
  return `<div class="word">${esc(q.word)}</div>`
}

function renderQuestion(state){const r=G.state(),q=G.question(),m=D.byId(r.mission),opts=answerOptions(m,q,r);$('#play').innerHTML=`<div class="game-shell"><div class="game-top game-top-rich"><div class="row spread game-top-row"><button class="pill" id="backMap">← Pilih game</button><span class="game-top-title">${m.name} · ${r.index+1} / 5</span><span class="stars game-stars" aria-label="${r.index+(r.done?1:0)} dari 5 bintang">${'★'.repeat(r.index+(r.done?1:0))}${'☆'.repeat(5-r.index-(r.done?1:0))}</span></div><div class="progress"><span style="width:${(r.index+(r.done?1:0))/5*100}%"></span></div></div>${playCompanion(m,r)}<div class="board game-board type-${m.type} ${r.done?'is-success':''}" data-round="${r.index}">${r.done?sparkles():''}${guide(r.done?'Nah, ketemu!':r.attempts?'Tidak apa-apa, kita coba lagi!':'Kita cari bersama!')}<div class="play-mode-badge">${opts.cue}</div><h2>${q.title}</h2><button class="speaker" id="speakQuestion" aria-label="Dengarkan pertanyaan">🔊 Dengarkan lagi</button><div class="visual scene-${m.type}">${visual(q)}</div>${['count','add','subtract'].includes(m.type)?'<p class="count-readout" id="countReadout" aria-live="polite">Sentuh bendanya satu per satu 👆</p>':''}${revealedWord(m,q,r)}${q.collect?`<div class="basket-zone"><div id="basketItems" class="basket-items" aria-hidden="true">🧺</div><button class="primary" id="checkBasket" ${r.done?'disabled':''}>✓ Selesai memetik</button></div>`:''}${opts.html}<div class="feedback" role="status">${r.done?'✨ Ketemu! Bintangmu bertambah.':r.attempts?'Hampir! Coba cara lain yuk.':'Pilih jawabanmu.'}</div>${r.hints&&!r.done?`<div class="hint" role="status">${esc(G.hint().text)}</div>`:''}<div class="row result-actions">${r.done?'<button class="primary" id="nextQuestion">Lanjut →</button>':'<button class="pill" id="help">💡 Kasih petunjuk</button>'}</div></div></div>`;bindObjects();$('#backMap').onclick=()=>worlds(m.world);$('#speakQuestion').onclick=()=>A.say(q.say,m.type);document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{B.Music?.stinger('tap');G.answer(q.options[+b.dataset.answer])});if(r.done){$('#nextQuestion').onclick=G.next;const a=$('.guide .avatar');if(a&&state==='correct')a.classList.add('correct');$('.play-companion-wrap .avatar')?.classList.add('correct');$('#nextQuestion').focus?.()}else{$('#help').onclick=G.help;if(state==='wrong'){$('.guide .avatar')?.classList.add('thinking');$('.play-companion-wrap .avatar')?.classList.add('thinking')}if(r.hints>=2&&!q.collect){G.countAnimation();if(r.hints>=3&&q.items){let count=0;document.querySelectorAll('.visual .item').forEach(el=>{if(el.dataset.count!=='false'){const n=document.createElement('span');n.className='count-label';n.textContent=++count;el.appendChild(n)}})}}}}
function result(data){B.Music?.theme('reward');B.Music?.stinger('reward');const m=D.byId(data.mission),p=profile(),info=dailyInfo(p),allDone=info.total>0&&info.done>=info.total,next=info.ids.find(id=>!info.doneIds.includes(id)),rp=rewardProgress(p),rr=rp.reward;$('#play').innerHTML=`<div class="board result-board reward-stage">${sparkles()}<div class="result-companion">${companionCard({title:`${buddyName(p)} bangga sekali!`,text:companionLine('result',m),kicker:'SELESAI MAIN',mood:'win'})}${jCelebrationBuddy(allDone?'Semua bintang hari ini lengkap':'Permainan selesai!')}<div class="reward-orbit"><span>${allDone?'🏆':'⭐'}</span></div></div><h1>${allDone?'Petualangan hari ini selesai!':'Hebat, '+esc(p.name)+'!'}</h1><p>${allDone?'Lima bintang lengkap. Ini titik berhenti yang bagus—boleh lanjut kalau masih ingin bermain.':'Kamu menuntaskan '+m.name+'.'}</p><div class="daily-star-path result-daily-stars" aria-label="${info.done} dari ${info.total} bintang hari ini">${dailyStars(info)}</div><div class="daily-count"><strong>${info.done}/${info.total}</strong><span>bintang hari ini</span></div>${data.earned.length?`<div class="reward-reveal"><div class="reward-box-lid">🎁</div><small>HADIAH BARU TERBUKA!</small><div class="reward-reveal-items">${data.earned.map(s=>`<span><b>${s.emoji}</b><strong>${esc(s.name)}</strong></span>`).join('')}</div></div>`:rr?`<div class="reward-chase"><span class="reward-chase-icon">${rr.emoji}</span><div><small>HADIAH BERIKUTNYA</small><strong>${esc(rr.name)}</strong><p>${esc(rr.hint)}</p><div class="reward-meter"><span style="width:${Math.round(rp.ratio*100)}%"></span></div><em>${rp.current}/${rp.target}</em></div></div>`:''}${allDone?`<div class="daily-treasure"><span>👑</span><div><strong>Peti 5 Bintang terbuka!</strong><small>Hadiah hari ini adalah perayaanmu. Besok ada 5 pilihan baru.</small></div></div>`:''}<div class="row result-actions">${allDone?'<button class="primary" id="resultCollection">🎒 Lihat koleksi</button><button class="pill" id="resultChoose">🎮 Main lagi</button>':`<button class="primary" id="resultNext">▶ Cari bintang berikutnya</button><button class="pill" id="resultCollection">🎁 Lihat hadiah</button><button class="pill" id="resultChoose">Pilih game sendiri</button>`}<button class="pill" id="resultHome">Beranda</button></div></div>`;triggerVictoryFX($('#play'),'game',m);if($('#resultNext'))$('#resultNext').onclick=()=>startMission(next??nextMission());if($('#resultCollection'))$('#resultCollection').onclick=collection;$('#resultChoose').onclick=()=>worlds();$('#resultHome').onclick=home;A.say(allDone?'Petualangan hari ini selesai. Hebat! Sampai besok.':'Hebat! Kamu menemukan satu bintang lagi.','complete');if(data.rest)$('#breakDialog').showModal()}
function gateProblem(){
  const kind=Math.floor(Math.random()*3);
  if(kind===0){const a=17+Math.floor(Math.random()*25),b=7+Math.floor(Math.random()*17);return {text:`Berapa ${a} + ${b}?`,answer:a+b}}
  if(kind===1){const b=7+Math.floor(Math.random()*14),answer=12+Math.floor(Math.random()*24),a=b+answer;return {text:`Berapa ${a} − ${b}?`,answer}}
  const a=3+Math.floor(Math.random()*6),b=3+Math.floor(Math.random()*6);return {text:`Berapa ${a} × ${b}?`,answer:a*b}
}
function resetGateHold(){clearTimeout(gateHoldTimer);clearInterval(gateHoldTicker);gateHoldTimer=gateHoldTicker=null;gateHoldReady=false;gateHoldStarted=0;const hold=$('#gateHold'),bar=$('#gateHoldProgress span'),input=$('#gateInput'),submit=$('#gateSubmit');if(hold){hold.textContent='🔒 Tahan 3 detik';hold.classList.remove('ready')}if(bar)bar.style.width='0%';if(input)input.disabled=true;if(submit)submit.disabled=true}
function finishGateHold(){clearTimeout(gateHoldTimer);clearInterval(gateHoldTicker);gateHoldTimer=gateHoldTicker=null;gateHoldReady=true;const hold=$('#gateHold'),bar=$('#gateHoldProgress span'),input=$('#gateInput'),submit=$('#gateSubmit');if(hold){hold.textContent='✓ Tahan selesai';hold.classList.add('ready')}if(bar)bar.style.width='100%';if(input){input.disabled=false;input.focus()}if(submit)submit.disabled=false}
function beginGateHold(){if(gateHoldReady)return;gateHoldStarted=performance.now();clearTimeout(gateHoldTimer);clearInterval(gateHoldTicker);gateHoldTicker=setInterval(()=>{const pct=Math.min(100,(performance.now()-gateHoldStarted)/30);const bar=$('#gateHoldProgress span');if(bar)bar.style.width=pct+'%'},50);gateHoldTimer=setTimeout(finishGateHold,3000)}
function cancelGateHold(){if(gateHoldReady)return;clearTimeout(gateHoldTimer);clearInterval(gateHoldTicker);gateHoldTimer=gateHoldTicker=null;gateHoldStarted=0;const bar=$('#gateHoldProgress span');if(bar)bar.style.width='0%'}
function gate(title,fn){gateCallback=fn;const q=gateProblem();gateAnswer=q.answer;$('#gateTitle').textContent=title;$('#gateQuestion').textContent=q.text;$('#gateInput').value='';$('#gateError').textContent='';resetGateHold();$('#gate').showModal()}
function profiles(){
G.leave();if($('#profileDialog').open)return;
const dlg=$('#profileDialog'),list=$('#profileList'),title=$('#profileTitle'),subtitle=document.querySelector('.opening-subtitle'),kicker=document.querySelector('.opening-kicker');
dlg.classList.remove('is-choosing','opening-exit','step-costume');
const all=P.all();
const findHero=(name,buddy)=>all.find(x=>x.name.toLowerCase()===name.toLowerCase())||all.find(x=>x.buddy===buddy);
const heroes=[findHero('Belva','belva'),findHero('Deva','deva')].filter((x,i,a)=>x&&a.findIndex(y=>y.id===x.id)===i);
const heroName=p=>p.buddy==='deva'?'Deva':'Belva';
let choosing=false;

function setupOpeningCarousel(root,cardSelector,onActiveChange){
  const track=root.querySelector('.carousel-track'),
        cards=[...root.querySelectorAll(cardSelector)],
        prev=root.querySelector('.carousel-arrow.prev'),
        next=root.querySelector('.carousel-arrow.next'),
        dots=[...root.querySelectorAll('.carousel-dot')];
  if(!track||!cards.length)return;
  let active=0,timer=0;

  function centerCard(i,smooth=true){
    i=Math.max(0,Math.min(cards.length-1,i));
    const card=cards[i];
    const left=card.offsetLeft-(track.clientWidth-card.offsetWidth)/2;
    track.scrollTo({left,behavior:smooth?'smooth':'auto'});
    setActive(i);
  }
  function setActive(i){
    active=i;
    cards.forEach((c,n)=>c.classList.toggle('is-active',n===i));
    dots.forEach((d,n)=>{d.classList.toggle('is-active',n===i);d.setAttribute('aria-current',n===i?'true':'false')});
    if(prev)prev.disabled=i===0;
    if(next)next.disabled=i===cards.length-1;
    onActiveChange?.(cards[i],i);
  }
  function nearest(){
    const center=track.scrollLeft+track.clientWidth/2;
    let idx=0,best=Infinity;
    cards.forEach((c,i)=>{
      const cc=c.offsetLeft+c.offsetWidth/2,d=Math.abs(cc-center);
      if(d<best){best=d;idx=i}
    });
    setActive(idx);
  }
  track.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(nearest,70)},{passive:true});
  prev?.addEventListener('click',()=>centerCard(active-1));
  next?.addEventListener('click',()=>centerCard(active+1));
  dots.forEach((d,i)=>d.addEventListener('click',()=>centerCard(i)));
  window.requestAnimationFrame(()=>centerCard(0,false));
}

function playerStep(){
  choosing=false;dlg.classList.remove('is-choosing','opening-exit','step-costume');
  kicker.textContent='✨ DUNIA BELVA & DEVA ✨';
  title.textContent='Siapa yang mau bermain?';
  subtitle.textContent='Geser untuk memilih Belva atau Deva 🌈';
  list.className='profile-list player-step';

  if(!heroes.length){
    list.innerHTML='<div class="parent-card"><h3>Belum ada profil Belva atau Deva</h3><p>Tambahkan profil melalui Mode Orang Tua.</p></div>';
    $('#addPlayer').hidden=true;$('#profileClose').hidden=true;return;
  }

  list.innerHTML=`<div class="character-carousel">
    <button class="carousel-arrow prev" type="button" aria-label="Karakter sebelumnya">‹</button>
    <div class="carousel-viewport">
      <div class="carousel-track" aria-label="Pilih karakter">
        ${heroes.map(p=>{const deva=p.buddy==='deva',name=heroName(p);return `
          <button class="hero-player-card carousel-card ${deva?'player-deva':'player-belva'}" data-pick-player="${p.id}" aria-label="Pilih ${name}">
            <span class="profile-mark" aria-hidden="true">${deva?'🚀':'🌸'}</span>
            ${avatar({...p,costume:p.costume||0},true)}
            <span class="hero-player-name">${deva?'🚀':'🌸'} ${name}</span>
            <span class="hero-player-tag">${deva?'Si penjelajah kecil':'Si penemu ceria'}</span>
            <span class="hero-player-cta">Pilih ${name}</span>
          </button>`}).join('')}
      </div>
    </div>
    <button class="carousel-arrow next" type="button" aria-label="Karakter berikutnya">›</button>
    <div class="carousel-dots" aria-label="Posisi karakter">
      ${heroes.map((_,i)=>`<button class="carousel-dot ${i===0?'is-active':''}" type="button" aria-label="Karakter ${i+1}"></button>`).join('')}
    </div>
    <div class="carousel-swipe-hint"><span class="hand">👆</span> Geser kiri atau kanan</div>
  </div>`;

  document.querySelectorAll('[data-pick-player]').forEach(b=>b.onclick=()=>{
    const p=all.find(x=>x.id===b.dataset.pickPlayer);
    if(p)costumeStep(p)
  });
  setupOpeningCarousel(list,'.hero-player-card');
  $('#addPlayer').hidden=true;$('#profileClose').hidden=true;
}

function costumeStep(p){
  choosing=false;dlg.classList.remove('is-choosing','opening-exit');dlg.classList.add('step-costume');
  const name=heroName(p),deva=p.buddy==='deva';
  kicker.textContent=(deva?'🚀 ':'🌸 ')+name.toUpperCase()+' TIME!';
  title.textContent=name+' mau jadi apa hari ini?';
  subtitle.textContent='Geser kostum, lalu sentuh gaya favoritmu ✨';
  list.className='profile-list costume-step';

  const looks=['Dongeng','Superhero','Antariksa'];
  list.innerHTML=`<div class="costume-carousel">
    <button class="carousel-arrow prev" type="button" aria-label="Kostum sebelumnya">‹</button>
    <div class="carousel-viewport">
      <div class="carousel-track" aria-label="Pilih kostum ${name}">
        ${looks.map((label,n)=>`
          <button class="costume-card carousel-card look-${n}" data-pick-costume="${n}" aria-label="${name} kostum ${label}">
            ${avatar({...p,costume:n},true)}
            <strong>${label}</strong>
            <small>✨ Pilih ${label}</small>
          </button>`).join('')}
      </div>
    </div>
    <button class="carousel-arrow next" type="button" aria-label="Kostum berikutnya">›</button>
    <div class="carousel-dots" aria-label="Posisi kostum">
      ${looks.map((_,i)=>`<button class="carousel-dot ${i===0?'is-active':''}" type="button" aria-label="Kostum ${i+1}"></button>`).join('')}
    </div>
    <div class="carousel-swipe-hint"><span class="hand">👆</span> Geser untuk lihat kostum lain</div>
    <div class="costume-toolbar">
      <button class="costume-back" id="backToHeroes" type="button">← Ganti karakter</button>
      <div class="costume-coming"><span class="soon-label">Segera hadir:</span><span>🧭 Penjelajah</span><span>🩺 Dokter</span><span>👩‍🍳 Chef</span><span>🦖 Dino</span></div>
    </div>
  </div>`;

  $('#backToHeroes').onclick=playerStep;
  setupOpeningCarousel(list,'.costume-card');

  document.querySelectorAll('[data-pick-costume]').forEach(b=>b.onclick=()=>{
    if(choosing)return;choosing=true;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    dlg.classList.add('is-choosing');b.classList.add('is-selected');b.setAttribute('aria-pressed','true');
    const small=b.querySelector('small');if(small)small.textContent='🌟 Ayo!';
    if(!reduced){
      const sparks=['✨','⭐','✦','💫','✨','✦'],vectors=[[-68,-70],[66,-66],[-82,5],[82,6],[-52,68],[54,66]];
      sparks.forEach((v,i)=>{
        const e=document.createElement('span'),xy=vectors[i];
        e.className='select-spark';e.textContent=v;
        e.style.setProperty('--dx',xy[0]+'px');e.style.setProperty('--dy',xy[1]+'px');
        e.style.setProperty('--rot',(i%2?35:-35)+'deg');e.style.setProperty('--delay',(i*24)+'ms');
        b.appendChild(e)
      })
    }
    const chosen=P.select(p.id);chosen.costume=+b.dataset.pickCostume;P.save();
    setTimeout(()=>{
      dlg.classList.add('opening-exit');
      setTimeout(()=>{
        dlg.close();dlg.classList.remove('is-choosing','opening-exit','step-costume');
        home();A.say('Halo '+profile().name+'. Ayo bermain bersama.','start')
      },reduced?0:210)
    },reduced?70:500)
  });

  $('#addPlayer').hidden=true;$('#profileClose').hidden=true;
}
playerStep();dlg.showModal()
}function editor(mode){editMode=mode;$('#editTitle').textContent=mode==='add'?'Tambah pemain':'Ubah nama profil';$('#nameInput').value=mode==='add'?'':profile().name;$('#buddyInput').value=profile()?.buddy||'belva';$('#profileError').textContent='';$('#editProfile').showModal()}
function summaryFor(id,events){const rows=events.filter(e=>e.mission===id);if(!rows.length)return {count:0,first:0,hints:0,percent:null,label:'Belum cukup data'};const first=rows.filter(e=>e.first).length,hints=rows.reduce((n,e)=>n+e.hints,0),percent=Math.round(first/rows.length*100);return {count:rows.length,first,hints,percent,label:rows.length<5?'Baru dicoba':percent>=80?'Sering mandiri':percent>=50?'Sedang berkembang':'Perlu pendampingan'}}
function parent(){
  parentOpen=true;M?.theme('parent');
  const p=profile(),cut=new Date();cut.setDate(cut.getDate()-6);const cutDay=cut.getFullYear()+'-'+String(cut.getMonth()+1).padStart(2,'0')+'-'+String(cut.getDate()).padStart(2,'0');
  const events=p.events.filter(e=>e.day>=cutDay),secs=p.sessions.filter(e=>e.day>=cutDay).reduce((n,e)=>n+e.seconds,0),ind=events.filter(e=>e.first).length,help=events.reduce((n,e)=>n+e.hints,0);
  const weak=D.missions.map(m=>({m,s:summaryFor(m.id,p.events)})).filter(x=>x.s.count>=5).sort((a,b)=>a.s.percent-b.s.percent)[0];
  const audio=P.settings(),lastExport=P.lastExportAt(),due=P.backupDue(7),lastLabel=lastExport?new Date(lastExport).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'}):'Belum pernah';
  const vol=n=>Math.round(n*100);
  $('#parent').innerHTML=`<div class="row spread"><h1>Perkembangan ${esc(p.name)}</h1><button class="pill" id="lockParent">🔒 Kunci</button></div><p>Target 4–6 tahun. Data hanya tersimpan di perangkat ini. Tidak ada analitik, font eksternal, atau server profil.</p>
  <div class="parent-card"><h2>7 hari terakhir</h2><div class="metrics"><div class="metric"><strong>${events.length?Math.round(ind/events.length*100)+'%':'—'}</strong>Jawaban mandiri pada percobaan pertama</div><div class="metric"><strong>${help}×</strong>Tahap bantuan digunakan</div><div class="metric"><strong>${Math.round(secs/60)} menit</strong>Waktu bermain tercatat</div></div><p class="subtle">Jawaban mandiri = benar pada percobaan pertama tanpa bantuan. Ini ringkasan aktivitas, bukan penilaian perkembangan klinis.</p><div class="tablewrap"><table><thead><tr><th>Topik</th><th>Percobaan pertama mandiri</th><th>Ringkasan</th></tr></thead><tbody>${D.missions.map(m=>{const v=summaryFor(m.id,p.events);return `<tr><td>${m.range}</td><td>${v.percent===null?'—':v.percent+'%'} (${v.count} soal)</td><td>${v.label}</td></tr>`}).join('')}</tbody></table></div><h3>🎯 Saran berikutnya</h3><p>${weak&&weak.s.percent<80?'Coba ulangi '+weak.m.name+' bersama pendamping.':'Lanjutkan misi yang belum selesai dan amati bagian yang masih memerlukan bantuan.'}</p></div>
  <div class="parent-card parent-form"><h2>Pengaturan profil</h2><button class="pill" id="rename">Ubah nama</button><button class="pill" id="addFromParent">Tambah pemain</button><label for="allowed">Jumlah misi di profil</label><select id="allowed">${order.map((id,i)=>`<option value="${i+1}" ${p.maxMission===i+1?'selected':''}>${i+1} · sampai ${D.byId(id).name}</option>`).join('')}</select><label for="breakMinutes">Pengingat istirahat</label><select id="breakMinutes">${[0,10,15,20].map(n=>`<option value="${n}" ${p.breakMinutes===n?'selected':''}>${n?n+' menit':'Mati'}</option>`).join('')}</select><label><input id="motion" type="checkbox" ${p.motion?'checked':''}> Gerakan karakter aktif</label></div>
  <div class="parent-card parent-form"><h2>🔊 Suara & musik</h2><p>Volume disimpan di perangkat. Narasi memakai rekaman lokal bila tersedia; TTS menjadi cadangan.</p><label for="musicVolume">Musik latar <output id="musicVolumeValue">${vol(audio.musicVolume)}%</output></label><input class="volume-range" id="musicVolume" type="range" min="0" max="100" value="${vol(audio.musicVolume)}"><label for="effectsVolume">Efek suara <output id="effectsVolumeValue">${vol(audio.effectsVolume)}%</output></label><input class="volume-range" id="effectsVolume" type="range" min="0" max="100" value="${vol(audio.effectsVolume)}"><label for="narrationVolume">Narasi <output id="narrationVolumeValue">${vol(audio.narrationVolume)}%</output></label><input class="volume-range" id="narrationVolume" type="range" min="0" max="100" value="${vol(audio.narrationVolume)}"><div class="row"><button class="pill" id="tone">♪ Tes efek</button><button class="pill" id="testSpeech">🔊 Tes narasi</button></div></div>
  <div class="parent-card parent-form ${due?'backup-due':''}"><h2>Cadangan data ${due?'⚠️':''}</h2><p><strong>Ekspor terakhir:</strong> ${esc(lastLabel)}</p>${due?'<p class="backup-reminder">Sudah lebih dari 7 hari atau belum pernah membuat cadangan. Sebaiknya ekspor sekarang.</p>':''}<p class="subtle" id="storageStatus">${esc(S?.summary?.()||'')}</p><button class="pill" id="storageRetry">💾 Minta penyimpanan permanen</button><button class="pill" id="export">⬇ Ekspor semua profil</button><label for="import">⬆ Impor JSON V9 / V10</label><input id="import" type="file" accept=".json,application/json"><p id="backupMessage" role="status"></p><p class="subtle">Impor menggabungkan profil. Profil dengan ID/nama sama diganti setelah konfirmasi. Data lama tidak dihapus otomatis.</p><button class="pill danger" id="erase">Hapus progres ${esc(p.name)}</button></div>`;
  $('#lockParent').onclick=()=>{parentOpen=false;home()};$('#rename').onclick=()=>editor('rename');$('#addFromParent').onclick=()=>editor('add');$('#allowed').onchange=e=>{p.maxMission=+e.target.value;P.save()};$('#breakMinutes').onchange=e=>{p.breakMinutes=+e.target.value;P.save()};$('#motion').onchange=e=>{p.motion=e.target.checked;P.save();document.body.classList.toggle('motion-off',!p.motion)};
  const bindVolume=(id,key,apply)=>{$('#'+id).oninput=e=>{const value=+e.target.value/100;P.setSettings({[key]:value});apply(value);$('#'+id+'Value').textContent=e.target.value+'%'}};bindVolume('musicVolume','musicVolume',v=>M?.setVolume(v));bindVolume('effectsVolume','effectsVolume',v=>A.setEffectsVolume(v));bindVolume('narrationVolume','narrationVolume',v=>A.setNarrationVolume(v));
  $('#tone').onclick=A.tone;$('#testSpeech').onclick=()=>A.say('Halo! Ayo berhitung. Satu, dua, tiga, empat, lima.');$('#storageRetry').onclick=async()=>{await S?.request?.();parent()};
  $('#export').onclick=()=>{G.pause();const payload=P.exportData(),url=URL.createObjectURL(new Blob([payload],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='belvadeva-v10-progres.json';a.click();P.markExported();setTimeout(()=>URL.revokeObjectURL(url),3000);$('#backupMessage').textContent='Cadangan diekspor. Tanggal cadangan sudah diperbarui.'};
  $('#import').onchange=async e=>{const f=e.target.files[0];if(!f||!parentOpen)return;try{if(f.size>3e6)throw Error('Maksimal 3 MB.');const list=P.parseImport(await f.text());gate('Gabungkan cadangan? Profil sama akan diganti.',()=>{P.merge(list);parent()})}catch(err){$('#backupMessage').textContent=err.message}finally{e.target.value=''}};
  $('#erase').onclick=()=>gate('Langkah 1/2: hapus progres '+p.name,()=>gate('Langkah 2/2: hapus hanya profil '+p.name,()=>{p.completions={};p.events=[];p.sessions=[];p.review={};p.resume=null;p.costume=0;P.save();parent()}));show('parent')
}
$('#gateForm').onsubmit=e=>{e.preventDefault();if(!gateHoldReady){$('#gateError').textContent='Tahan tombol 3 detik dulu, ya.';return}if(Number($('#gateInput').value)!==gateAnswer){$('#gateError').textContent='Belum tepat. Coba lagi.';return}$('#gate').close();resetGateHold();const fn=gateCallback;gateCallback=null;fn?.()};$('#gateCancel').onclick=()=>{$('#gate').close();resetGateHold();gateCallback=null};$('#gateHold').addEventListener('pointerdown',beginGateHold);['pointerup','pointercancel','pointerleave'].forEach(ev=>$('#gateHold').addEventListener(ev,cancelGateHold));$('#gateHold').addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();beginGateHold()}});$('#gateHold').addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();cancelGateHold()}});$('#profileForm').onsubmit=e=>{e.preventDefault();try{if(editMode==='add'){P.add($('#nameInput').value,$('#buddyInput').value)}else{P.rename($('#nameInput').value);profile().buddy=$('#buddyInput').value;P.save()}$('#editProfile').close();if(parentOpen)parent();if($('#profileDialog').open){$('#profileDialog').close();profiles()}}catch(err){$('#profileError').textContent=err.message}};$('#editCancel').onclick=()=>$('#editProfile').close();$('#addPlayer').onclick=()=>gate('Tambah pemain: khusus orang tua',()=>editor('add'));$('#profileClose').onclick=()=>{$('#profileDialog').close();if(profile())home()};$('#profileDialog').addEventListener('cancel',e=>{if(!profile())e.preventDefault()});$('#playerSwitch').onclick=profiles;$('#brand').onclick=e=>{e.preventDefault();if(profile())home();else profiles()};$('#parentOpen').onclick=()=>{if(profile()){G.pause();gate('Buka mode orang tua',parent)}};$('#sound').onclick=()=>{const enabled=A.toggle();B.Music?.setEnabled(enabled);if(enabled)B.Music?.unlock();$('#sound').innerHTML=enabled?'🔊 <span>Musik &amp; Suara</span>':'🔇 <span>Musik &amp; Suara</span>';$('#sound').setAttribute('aria-pressed',enabled);if(enabled)A.say('Musik dan suara aktif. Ayo bermain!')};document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{if(!profile())return profiles();const n=b.dataset.nav;if(n==='home')home();if(n==='worlds')worlds();if(n==='wardrobe')wardrobe();if(n==='collection')collection()});$('#breakDone').onclick=()=>$('#breakDialog').close();document.addEventListener('pointerup',e=>{const b=e.target.closest?.('button');if(b&&!b.disabled&&b.id!=='sound'&&!b.matches('[data-answer]'))A.effect('tap')},{passive:true});G.init((state,data)=>{if(state==='result')result(data);else renderQuestion(state)});const audioSettings=P.settings();A.setNarrationVolume(audioSettings.narrationVolume);A.setEffectsVolume(audioSettings.effectsVolume);M?.setVolume(audioSettings.musicVolume);S?.init?.();A.init(s=>$('#audioStatus').textContent=s);window.addEventListener('pagehide',()=>{G.pause();B.Music?.pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden)G.pause();else if(screen==='play'&&G.state())G.activate()});if(profile())home();profiles();
/* ===== PETUALANGAN BESAR — Journey engine V3: 5 lokasi × 5 checkpoint + challenge lives ===== */
const J_MAX_STARS=5;
const JOURNEY=[
 {id:'garden',icon:'🌻',name:'Kebun Kembar',tag:'Pasangkan teman kebun',reward:'🐝',type:'memory',seconds:60,story:'Bintang pertama tersembunyi di kebun. Temukan pasangan yang sama!'},
 {id:'sea',icon:'🌊',name:'Teluk Bintang',tag:'Hitung teman laut',reward:'🐠',type:'count',seconds:55,story:'Mercusuar redup. Hitung teman laut untuk menyalakan bintangnya!'},
 {id:'forest',icon:'🌳',name:'Hutan Rahasia',tag:'Cari yang berbeda',reward:'🦉',type:'odd',seconds:50,story:'Hutan menyimpan petunjuk. Temukan satu gambar yang berbeda!'},
 {id:'sky',icon:'☁️',name:'Pulau Awan',tag:'Lanjutkan pola ajaib',reward:'🐦',type:'pattern',seconds:45,story:'Jembatan awan muncul lewat pola. Temukan gambar berikutnya!'},
 {id:'castle',icon:'🏰',name:'Istana Pelangi',tag:'Tangkap simbol yang sama',reward:'🦄',type:'target',seconds:40,story:'Gerbang istana hampir terbuka. Tangkap semua simbol yang sama sebelum waktunya habis!'}
];
const J_TOTAL=JOURNEY.length*J_MAX_STARS;
const J_BADGES=['🐝','🐠','🦉','🐦','🦄','🌈'];
let jRun=null,jAC=null,jTimer=null,jTimeLeft=0;
function jState(p=profile()){
  if(!p.journey||typeof p.journey!=='object')p.journey={stars:{},badges:[],treasure:false,version:2};
  p.journey.stars=p.journey.stars||{};
  p.journey.badges=Array.isArray(p.journey.badges)?p.journey.badges:[];
  let migrated=false;
  const oldVersion=Number(p.journey.version)||1;
  if(oldVersion<2){
    // A completed V1 location had 3/3. Preserve that completion as 5/5 in V2.
    for(const id of ['garden','sea','forest'])if(Number(p.journey.stars[id])===3)p.journey.stars[id]=5;
    p.journey.version=2;migrated=true;
  }
  for(const x of JOURNEY)p.journey.stars[x.id]=Math.max(0,Math.min(J_MAX_STARS,Number(p.journey.stars[x.id])||0));
  p.journey.treasure=p.journey.treasure===true;
  if(migrated)P.save();
  return p.journey
}
function jTotal(j=jState()){return JOURNEY.reduce((n,x)=>n+(j.stars[x.id]||0),0)}
function jUnlocked(i,j=jState()){return i===0||(j.stars[JOURNEY[i-1].id]||0)>=J_MAX_STARS}
function jBadge(j,b){if(!j.badges.includes(b))j.badges.push(b)}
function jSave(){P.save()}
function jTone(kind='ok'){
  if(!A.isEnabled())return;
  try{
    jAC=jAC||new(window.AudioContext||window.webkitAudioContext)();if(jAC.state==='suspended')jAC.resume();
    const seq=kind==='win'?[523,659,784,1047]:kind==='bad'?[220]:kind==='tick'?[880]:[660,880],gain=kind==='tick'?.035:.09,dur=kind==='tick'?.075:.13;
    seq.forEach((f,i)=>{const o=jAC.createOscillator(),g=jAC.createGain(),t=jAC.currentTime+i*.09;o.frequency.value=f;o.type=kind==='bad'?'triangle':'sine';g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(jAC.destination);o.start(t);o.stop(t+dur+.01)})
  }catch{}
}
function jStars(n){return '★'.repeat(Math.min(J_MAX_STARS,n))+'☆'.repeat(Math.max(0,J_MAX_STARS-n))}
function jCharacter(){const p=profile();return avatar(p,true)}
function jCelebrationMeta(p=profile()){
  const costume=[0,1,2].includes(p?.costume)?p.costume:0,isDeva=p?.buddy==='deva';
  if(costume===1)return {motion:'fly',emoji:'🚀',verb:isDeva?'terbang kencang':'terbang gagah',line:isDeva?'Deva terbang sambil tepuk tangan!':'Belva terbang sambil bersinar!'};
  if(costume===2)return {motion:'float',emoji:'✨',verb:isDeva?'melayang seru':'melayang ceria',line:isDeva?'Deva melayang riang di angkasa!':'Belva melayang ceria di angkasa!'};
  return {motion:isDeva?'bounce':'dance',emoji:isDeva?'🎉':'💃',verb:isDeva?'melonjak gembira':'menari gembira',line:isDeva?'Deva lompat-lompat senang!':'Belva menari senang!'};
}
function jCelebrationBuddy(note='Hebat!'){const p=profile(),meta=jCelebrationMeta(p);return `<div class="victory-buddy ${meta.motion} buddy-${p?.buddy==='deva'?'deva':'belva'}"><div class="victory-buddy-stage">${avatar(p,true)}<span class="victory-spark s1">⭐</span><span class="victory-spark s2">✨</span><span class="victory-spark s3">🌈</span><span class="victory-emote">${meta.emoji}</span></div><div class="victory-copy"><small>${esc(note)}</small><strong>${buddyName(p)} ${meta.verb}</strong><span>${meta.line}</span></div></div>`}
function victoryTheme(kind='generic',m=null){
  const type=m?.type||kind;
  if(['count','add','subtract'].includes(type))return {cls:'numbers',icons:['1','2','3','⭐','✨'],label:'Bintang angka!'};
  if(['fingers','twohands'].includes(type))return {cls:'fingers',icons:['✋','🙌','⭐','✨','👏'],label:'High five!'};
  if(['letter','syllable','read'].includes(type))return {cls:'words',icons:['A','B','C','📚','✨'],label:'Huruf beterbangan!'};
  if(type==='color')return {cls:'colors',icons:['🎨','🟣','🟡','🔵','✨'],label:'Warna meledak!'};
  if(kind==='journey')return {cls:'journey',icons:['⭐','🌈','🗺️','✨','💫'],label:'Bintang Journey!'};
  return {cls:'generic',icons:['⭐','✨','🎉','🌈','💫'],label:'Yeay!'};
}
function victoryOverlay(kind='generic',m=null){
  const p=profile(),meta=jCelebrationMeta(p),theme=victoryTheme(kind,m);
  const parts=Array.from({length:18},(_,i)=>{const icon=theme.icons[i%theme.icons.length],x=(i*37)%96,delay=(i%7)*.08,dur=1.15+(i%5)*.14,rot=(i*53)%360;return `<span class="victory-particle" style="--x:${x}%;--d:${delay}s;--dur:${dur}s;--r:${rot}deg">${icon}</span>`}).join('');
  return `<div class="victory-overlay theme-${theme.cls}" aria-hidden="true"><div class="victory-overlay-glow"></div>${parts}<div class="victory-flyer ${meta.motion}">${avatar(p,true)}<span>${meta.emoji}</span></div><div class="victory-banner"><strong>${buddyName(p)} berhasil!</strong><small>${theme.label}</small></div></div>`
}
function triggerVictoryFX(host,kind='generic',m=null){
  if(!host||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
  host.insertAdjacentHTML('afterbegin',victoryOverlay(kind,m));
  const fx=host.querySelector('.victory-overlay');
  if(fx)setTimeout(()=>fx.remove(),2400)
}
function jStopTimer(){clearInterval(jTimer);jTimer=null}
function jTimeFor(r=jRun){return Math.max(24,(r?.loc?.seconds||50)-(r?.cp||0)*3)}
function jMistakeLimit(cp=jRun?.cp||0){const levels=[3,4,6,10,12];return levels[Math.max(0,Math.min(4,cp||0))]}
function jRoundsRequired(cp=jRun?.cp||0){return [1,2,2,3,3][Math.max(0,Math.min(4,cp||0))]}
function jLivesMarkup(){
  const limit=jRun?.mistakeLimit||jMistakeLimit(),used=jRun?.mistakes||0,left=Math.max(0,limit-used);
  if(limit>6)return `<span class="j-life-count"><b>💛</b><strong>× ${left}</strong><small>dari ${limit}</small></span>`;
  return `<span class="j-life-live">${'💛'.repeat(left)}</span><span class="j-life-used">${'♡'.repeat(Math.max(0,limit-left))}</span>`
}
function jUpdateLives(){const el=$('#jLives');if(el)el.innerHTML=jLivesMarkup()}
function jRegisterMistake(){
  if(!jRun||jRun.timedOut||jRun.failed)return false;
  jRun.mistakes=(jRun.mistakes||0)+1;jUpdateLives();jTone('bad');
  if(jRun.mistakes>=jRun.mistakeLimit){jRun.answerLock=true;setTimeout(jMistakesUp,460);return false}
  return true
}
function jMistakesUp(){
  if(!jRun||jRun.timedOut||jRun.failed)return;jRun.failed=true;jRun.answerLock=true;jStopTimer();
  $('#jBoard').innerHTML=`<div class="j-timeup j-challenge-fail"><span class="j-timeup-icon">💛</span><h1>Kesempatannya habis</h1><p>Checkpoint ini belum berhasil, tapi semua bintang sebelumnya tetap aman. Yuk coba sekali lagi!</p><button class="j-next" id="jRetryMistake">↻ Coba checkpoint lagi</button><button class="journey-back" id="jMistakeMap">Kembali ke peta</button></div>`;
  A.say('Kesempatannya habis. Tidak apa-apa, ayo coba checkpoint ini lagi.','retry');
  $('#jRetryMistake').onclick=()=>{jRun.round=0;jRun.failed=false;jRun.mistakes=0;renderJourneyGame()};$('#jMistakeMap').onclick=journeyMap
}
function jUpdateTimer(){
  const el=$('#jTimer'),txt=$('#jTimerText'),bar=$('#jTimerBar');if(!el||!txt||!bar)return;
  const max=Math.max(1,jRun?.timeMax||jTimeLeft||1),ratio=Math.max(0,Math.min(1,jTimeLeft/max));
  txt.textContent=jTimeLeft+' dtk';bar.style.width=(ratio*100)+'%';el.classList.toggle('warning',jTimeLeft<=10);el.classList.toggle('danger',jTimeLeft<=5)
}
function jStartTimer(seconds){
  jStopTimer();jTimeLeft=seconds;jRun.timeMax=seconds;jUpdateTimer();
  jTimer=setInterval(()=>{if(document.hidden||!jRun||jRun.timedOut)return;jTimeLeft=Math.max(0,jTimeLeft-1);jUpdateTimer();if(jTimeLeft===10||jTimeLeft<=5&&jTimeLeft>0)jTone('tick');if(jTimeLeft<=0)jTimeUp()},1000)
}
function jTimeUp(){
  if(!jRun||jRun.timedOut)return;jRun.timedOut=true;jRun.answerLock=true;jStopTimer();jTone('bad');
  $('#jBoard').innerHTML=`<div class="j-timeup"><span class="j-timeup-icon">⏰</span><h1>Waktunya habis!</h1><p>Tidak apa-apa. Bintang yang sudah didapat tetap aman. Yuk coba checkpoint ini lagi.</p><button class="j-next" id="jRetryTime">↻ Coba lagi</button><button class="journey-back" id="jTimeMap">Kembali ke peta</button></div>`;
  A.say('Waktunya habis. Tidak apa-apa, ayo coba lagi.','retry');
  $('#jRetryTime').onclick=()=>{jRun.round=0;jRun.timedOut=false;renderJourneyGame()};$('#jTimeMap').onclick=journeyMap
}
function journeyHomeCard(){
  const host=$('#home');if(!host||host.querySelector('.journey-teaser'))return;const j=jState(),total=jTotal(j),today=host.querySelector('.today');
  const html=`<button class="journey-teaser" id="journeyHome" type="button"><div class="jt-top"><span class="jt-kicker">🗺️ PETUALANGAN BESAR</span><span>${total}/${J_TOTAL} ⭐</span></div><h2>${total>=J_TOTAL?'Peti Pelangi menunggumu!':'Cari '+J_TOTAL+' Bintang Pelangi'}</h2><p>${total>=J_TOTAL?'Semua jalan sudah terbuka. Saatnya melihat harta karun!':'5 lokasi · 5 bintang per lokasi · ada countdown di setiap checkpoint.'}</p><div class="jt-progress journey-mini-progress" aria-label="${total} dari ${J_TOTAL} bintang"><span style="width:${total/J_TOTAL*100}%"></span></div><span class="jt-cta">▶ Buka Peta Journey</span></button>`;
  (today||host.lastElementChild).insertAdjacentHTML('afterend',html);$('#journeyHome').onclick=journeyMap
}
function journeyWorldCard(){
  const root=$('#worlds'),grid=root?.querySelector('.world-grid');if(!grid||root.querySelector('.journey-feature'))return;const j=jState(),total=jTotal(j);
  grid.insertAdjacentHTML('beforebegin',`<button class="journey-feature" id="journeyWorld" type="button"><span class="icon">🗺️</span><div class="eyebrow">STORY JOURNEY</div><h2>Petualangan Besar BelvaDeva</h2><p>Kumpulkan ${J_TOTAL} Bintang Pelangi lewat 5 lokasi mini-game dengan countdown.</p><div class="progress"><span style="width:${total/J_TOTAL*100}%"></span></div><strong>${total}/${J_TOTAL} ⭐ ditemukan →</strong></button>`);$('#journeyWorld').onclick=journeyMap
}
function journeyCollection(){
  const root=$('#collection');if(!root||root.querySelector('.j-collection-extra'))return;const j=jState();root.insertAdjacentHTML('beforeend',`<section class="j-collection-extra"><h2>🗺️ Oleh-oleh Journey</h2><p class="subtle">Didapat dari Petualangan Besar.</p><div class="journey-badge-row">${J_BADGES.map(b=>`<div class="journey-badge ${j.badges.includes(b)?'':'locked'}">${j.badges.includes(b)?b:'🔒'}</div>`).join('')}</div></section>`)
}
function journeyMap(){
  jStopTimer();B.Music?.theme('journey-map');G.leave();const p=profile(),j=jState(p),total=jTotal(j);show('play');
  $('#play').innerHTML=`<div class="journey-shell"><div class="journey-topbar"><button class="journey-back" id="jBackWorlds">← Pilih game</button><span class="journey-stars-total">⭐ ${total}/${J_TOTAL}</span></div><section class="journey-hero">${jCharacter()}<div class="journey-copy"><div class="eyebrow">STORY JOURNEY</div><h1>Cari Bintang Pelangi!</h1><p>${p.name}, ${J_TOTAL} serpihan bintang tersebar di lima tempat. Setiap lokasi punya 5 checkpoint dan waktu yang makin menantang.</p></div></section><div class="journey-route">${JOURNEY.map((x,i)=>{const n=j.stars[x.id]||0,open=jUnlocked(i,j);return `<button class="journey-stop ${x.id} ${open?'':'locked'}" data-jloc="${x.id}" ${open?'':'disabled'}><span class="journey-node">${open?x.icon:'🔒'}</span><span><small>LOKASI ${i+1}</small><h2>${x.name}</h2><p>${open?x.tag:'Selesaikan lokasi sebelumnya dulu'}</p><span class="journey-stop-stars" aria-label="${n} dari ${J_MAX_STARS} checkpoint">${jStars(n)}</span></span><span class="go">${n===J_MAX_STARS?'↻':'→'}</span></button>`}).join('')}<button class="journey-treasure" id="jTreasure" ${total>=J_TOTAL?'':'disabled'}><span class="chest">${j.treasure?'🌈':'🎁'}</span><strong>${j.treasure?'Harta Pelangi ditemukan!':total>=J_TOTAL?'Buka Peti Pelangi!':'Peti Pelangi terkunci'}</strong><small>${total>=J_TOTAL?'Semua bintang sudah terkumpul':'Butuh '+J_TOTAL+' ⭐'}</small></button></div><section class="journey-souvenirs"><h3>🎒 Oleh-oleh perjalanan</h3><div class="journey-badge-row">${J_BADGES.map(b=>`<div class="journey-badge ${j.badges.includes(b)?'':'locked'}">${j.badges.includes(b)?b:'🔒'}</div>`).join('')}</div></section></div>`;
  $('#jBackWorlds').onclick=()=>worlds();document.querySelectorAll('[data-jloc]').forEach(b=>b.onclick=()=>startJourney(b.dataset.jloc));$('#jTreasure').onclick=()=>{if(jTotal(j)>=J_TOTAL)openJourneyTreasure()};A.say(total>=J_TOTAL?'Semua bintang sudah terkumpul. Peti Pelangi siap dibuka.':'Ayo kumpulkan dua puluh lima Bintang Pelangi.','start')
}
function startJourney(id){
  jStopTimer();B.Music?.theme('journey-'+id);const idx=JOURNEY.findIndex(x=>x.id===id),j=jState();if(idx<0||!jUnlocked(idx,j))return;const loc=JOURNEY[idx],done=j.stars[id]||0;
  jRun={id,cp:done>0&&done<J_MAX_STARS?done:0,round:0,loc,answerLock:false,timedOut:false,failed:false,mistakes:0,mistakeLimit:2};show('play');renderJourneyGame();A.say(loc.story,'start')
}
function journeyGameHeader(){
  const r=jRun,n=(jState().stars[r.id]||0),secs=jTimeFor(r);return `<div class="jgame-top"><button class="journey-back" id="jMapBack">← Peta</button><div class="jgame-head"><small>${r.loc.icon} ${r.loc.name}</small><h2>Checkpoint ${r.cp+1} / ${J_MAX_STARS}</h2></div><div class="j-chances" aria-label="Kesempatan salah"><small>Kesempatan</small><strong id="jLives">${jLivesMarkup()}</strong></div><div class="j-timer" id="jTimer" role="timer" aria-label="Waktu tersisa"><span>⏱️</span><strong id="jTimerText">${secs} dtk</strong><i><b id="jTimerBar" style="width:100%"></b></i></div><div class="j-check-stars">${jStars(n)}</div></div>`
}
function renderJourneyGame(){
  if(!jRun)return journeyMap();jStopTimer();jRun.timedOut=false;jRun.failed=false;jRun.answerLock=false;jRun.mistakes=0;jRun.mistakeLimit=jMistakeLimit(jRun.cp);const p=profile();
  $('#play').innerHTML=`<div class="jgame">${journeyGameHeader()}<div class="j-board" id="jBoard"><div class="j-story">${avatar(p,true)}<div><strong>${jRun.loc.name}</strong><p>${jRun.loc.story}</p></div></div><div id="jStage"></div></div></div>`;
  $('#jMapBack').onclick=journeyMap;
  if(jRun.loc.type==='memory')jMemory();
  if(jRun.loc.type==='count')jCountStart();
  if(jRun.loc.type==='odd')jOddStart();
  if(jRun.loc.type==='pattern')jPatternStart();
  if(jRun.loc.type==='target')jTargetStart();
  jStartTimer(jTimeFor())
}
function jShuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const k=Math.floor(Math.random()*(i+1));[b[i],b[k]]=[b[k],b[i]]}return b}
function jMemoryPairs(cp){return [2,3,4,5,6][Math.max(0,Math.min(4,cp||0))]}
function jMemory(){
  const pairs=jMemoryPairs(jRun.cp),cols=pairs<=3?pairs:4,pool=jShuffle(['🍎','🍌','🍇','🍓','🌼','🐝','🦋','🐞','🌻','🍐','🐌','🌷']).slice(0,pairs),deck=jShuffle([...pool,...pool]);jRun.mem={open:[],matched:0,lock:false};
  $('#jStage').innerHTML=`<h1>Temukan pasangan kembar!</h1><p class="j-help">Sentuh dua kartu yang gambarnya sama.</p><div class="j-level-hint"><strong>${pairs} pasangan</strong><span>•</span><span>${pairs*2} kartu</span></div><div class="j-memory ${pairs>=4?'many':''}" data-pairs="${pairs}" style="--jcols:${cols}">${deck.map((e,i)=>`<button class="j-memory-card" data-mi="${i}" data-e="${e}" aria-label="Kartu tertutup">?</button>`).join('')}</div>`;
  document.querySelectorAll('[data-mi]').forEach(b=>b.onclick=()=>{const m=jRun.mem;if(jRun.timedOut||m.lock||b.dataset.done==='1'||b.classList.contains('open'))return;b.classList.add('open');b.textContent=b.dataset.e;b.setAttribute('aria-label',b.dataset.e);jTone('ok');m.open.push(b);if(m.open.length<2)return;m.lock=true;const[a,c]=m.open;m.open=[];if(a.dataset.e===c.dataset.e){[a,c].forEach(x=>{x.dataset.done='1';x.classList.remove('open');x.classList.add('matched')});m.matched++;jTone('win');setTimeout(()=>{if(jRun?.timedOut)return;m.lock=false;if(m.matched===pairs)journeyCheckpointDone()},350)}else{const keepGoing=jRegisterMistake();A.say(keepGoing?'Belum sama. Coba lagi ya.':'Kesempatannya habis.','retry');setTimeout(()=>{if(!jRun||jRun.timedOut||jRun.failed)return;[a,c].forEach(x=>{x.classList.remove('open');x.textContent='?';x.setAttribute('aria-label','Kartu tertutup')});m.lock=false},650)}})
}
function jCountStart(){jRun.round=0;jCountQuestion()}
function jCountQuestion(){
  const icons=['🐠','🐙','🐳','🦀','🐚','⭐'],maxByCp=[4,5,6,8,10],max=maxByCp[Math.max(0,Math.min(4,jRun.cp))],rounds=jRoundsRequired(),optionCount=jRun.cp>=3?4:3,n=1+Math.floor(Math.random()*max),e=icons[Math.floor(Math.random()*icons.length)],gridSize=max>=10?15:12,cells=jShuffle(Array.from({length:gridSize},(_,i)=>i)).slice(0,n),opts=new Set([n]);while(opts.size<optionCount)opts.add(1+Math.floor(Math.random()*max));jRun.count={n,touched:[]};jRun.answerLock=false;
  $('#jStage').innerHTML=`<h1>Ada berapa ${e}?</h1><p class="j-help">Sentuh satu per satu kalau mau menghitung 👆</p><div class="j-level-hint"><strong>hingga ${max} benda</strong><span>•</span><span>${rounds} ronde</span></div><div class="j-sea-scene"><div class="j-sea-grid ${gridSize===15?'wide':''}">${Array.from({length:gridSize},(_,i)=>cells.includes(i)?`<button class="j-creature" data-ci="${i}"><span>${e}</span><small class="num"></small></button>`:'<span></span>').join('')}</div></div><div class="j-answer-row">${jShuffle([...opts]).map(v=>`<button class="j-answer" data-ca="${v}">${v}</button>`).join('')}</div>`;
  document.querySelectorAll('[data-ci]').forEach(b=>b.onclick=()=>{if(jRun.timedOut||jRun.failed)return;const arr=jRun.count.touched,i=+b.dataset.ci,at=arr.indexOf(i);if(at>=0)arr.splice(at,1);else arr.push(i);document.querySelectorAll('[data-ci]').forEach(x=>{const pos=arr.indexOf(+x.dataset.ci);x.classList.toggle('counted',pos>=0);x.querySelector('.num').textContent=pos>=0?pos+1:''})});
  document.querySelectorAll('[data-ca]').forEach(b=>b.onclick=()=>{if(jRun.answerLock||jRun.timedOut||jRun.failed)return;if(+b.dataset.ca===n){jRun.answerLock=true;b.classList.add('good');jTone('win');A.say('Nah, ketemu!','correct');setTimeout(()=>{if(!jRun||jRun.timedOut||jRun.failed)return;jRun.round++;if(jRun.round>=rounds)journeyCheckpointDone();else jCountQuestion()},480)}else{b.classList.add('wrong');const keepGoing=jRegisterMistake();A.say(keepGoing?'Hmm, coba hitung lagi yuk.':'Kesempatannya habis.','retry');if(keepGoing)setTimeout(()=>b.classList.remove('wrong'),420)}})
}
function jOddStart(){jRun.round=0;jOddQuestion()}
function jOddQuestion(){
  const easy=[['🐶','🐱'],['🐸','🐢'],['🌳','🌵'],['🐝','🦋']],hard=[['🍎','🍅'],['🌞','🌕'],['🚗','🚕'],['🍓','🍒'],['🐟','🐠'],['🍋','🍊']],set=jRun.cp>=2?hard:[...easy,...hard],pair=jShuffle(set[Math.floor(Math.random()*set.length)]),a=pair[0],b=pair[1],cells=[6,9,12,15,16][Math.max(0,Math.min(4,jRun.cp))],cols=cells<=9?3:4,rounds=jRoundsRequired(),k=Math.floor(Math.random()*cells);jRun.odd=k;jRun.answerLock=false;
  $('#jStage').innerHTML=`<h1>Mana yang berbeda?</h1><p class="j-help">Cari satu gambar yang tidak sama dengan teman-temannya.</p><div class="j-level-hint"><strong>${cells} gambar</strong><span>•</span><span>${rounds} ronde</span></div><div class="j-forest"><div class="j-odd-grid" style="grid-template-columns:repeat(${cols},1fr)">${Array.from({length:cells},(_,i)=>`<button class="j-odd" data-oi="${i}" aria-label="Gambar ${i+1}">${i===k?b:a}</button>`).join('')}</div></div>`;
  document.querySelectorAll('[data-oi]').forEach(c=>c.onclick=()=>{if(jRun.answerLock||jRun.timedOut||jRun.failed)return;if(+c.dataset.oi===k){jRun.answerLock=true;c.classList.add('good');jTone('win');A.say('Ketemu! Hebat!','correct');setTimeout(()=>{if(!jRun||jRun.timedOut||jRun.failed)return;jRun.round++;if(jRun.round>=rounds)journeyCheckpointDone();else jOddQuestion()},500)}else{c.classList.add('wrong');const keepGoing=jRegisterMistake();A.say(keepGoing?'Hampir. Cari yang beda ya.':'Kesempatannya habis.','retry');if(keepGoing)setTimeout(()=>c.classList.remove('wrong'),420)}})
}
function jPatternStart(){jRun.round=0;jPatternQuestion()}
function jPatternQuestion(){
  const pool=jShuffle(['⭐','🌈','☁️','🪁','🌙','☀️','🎈','🦋']),a=pool[0],b=pool[1],c=pool[2],d=pool[3];
  const patterns=[
    {seq:[a,b,a,b],answer:a},
    {seq:[a,a,b,a,a],answer:b},
    {seq:[a,b,c,a,b,c],answer:a},
    {seq:[a,b,b,a,b,b,a],answer:b},
    {seq:[a,b,c,d,a,b,c,d],answer:a}
  ],pat=patterns[Math.min(4,jRun.cp)],choiceCount=[2,3,3,4,4][Math.min(4,jRun.cp)],rounds=jRoundsRequired(),opts=jShuffle([pat.answer,...pool.filter(x=>x!==pat.answer).slice(0,choiceCount-1)]);jRun.answerLock=false;
  $('#jStage').innerHTML=`<h1>Gambar apa berikutnya?</h1><p class="j-help">Lihat polanya, lalu pilih gambar selanjutnya.</p><div class="j-level-hint"><strong>${pat.seq.length} gambar pola</strong><span>•</span><span>${choiceCount} pilihan</span></div><div class="j-sky"><div class="j-pattern-strip">${pat.seq.map(x=>`<span>${x}</span>`).join('')}<span class="missing">?</span></div></div><div class="j-answer-row j-pattern-options">${opts.map(v=>`<button class="j-answer j-pattern-answer" data-pa="${v}">${v}</button>`).join('')}</div>`;
  document.querySelectorAll('[data-pa]').forEach(bu=>bu.onclick=()=>{if(jRun.answerLock||jRun.timedOut||jRun.failed)return;if(bu.dataset.pa===pat.answer){jRun.answerLock=true;bu.classList.add('good');jTone('win');A.say('Polanya ketemu!','correct');setTimeout(()=>{if(!jRun||jRun.timedOut||jRun.failed)return;jRun.round++;if(jRun.round>=rounds)journeyCheckpointDone();else jPatternQuestion()},480)}else{bu.classList.add('wrong');const keepGoing=jRegisterMistake();A.say(keepGoing?'Coba lihat polanya lagi.':'Kesempatannya habis.','retry');if(keepGoing)setTimeout(()=>bu.classList.remove('wrong'),420)}})
}
function jTargetStart(){jRun.round=0;jTargetQuestion()}
function jTargetQuestion(){
  const icons=jShuffle(['⭐','💎','🌈','👑','🔑','🪄','🔔','❤️','☀️','🌙']),target=icons[0],need=[1,2,3,4,5][Math.max(0,Math.min(4,jRun.cp))],cells=[6,8,10,12,15][Math.max(0,Math.min(4,jRun.cp))],rounds=jRoundsRequired(),fillers=[];while(fillers.length<cells-need)fillers.push(icons[1+(fillers.length%(icons.length-1))]);const deck=jShuffle([...Array(need).fill(target),...fillers]);jRun.target={target,need,found:0};jRun.answerLock=false;
  $('#jStage').innerHTML=`<h1>Tangkap semua ${target}</h1><p class="j-help">Sentuh semua simbol yang sama dengan target.</p><div class="j-level-hint"><strong>${need} target</strong><span>•</span><span>${cells} simbol</span><span>•</span><span>${rounds} ronde</span></div><div class="j-castle"><div class="j-target-callout"><span>${target}</span><strong id="jTargetCount">0 / ${need}</strong></div><div class="j-target-grid ${cells>=15?'many':''}">${deck.map((v,i)=>`<button class="j-target" data-ti="${i}" data-tv="${v}" aria-label="Simbol ${v}">${v}</button>`).join('')}</div></div>`;
  document.querySelectorAll('[data-ti]').forEach(bu=>bu.onclick=()=>{if(jRun.answerLock||jRun.timedOut||jRun.failed||bu.disabled)return;if(bu.dataset.tv===target){bu.disabled=true;bu.classList.add('good');jRun.target.found++;$('#jTargetCount').textContent=jRun.target.found+' / '+need;jTone('ok');if(jRun.target.found>=need){jRun.answerLock=true;jTone('win');A.say('Semua ketemu!','correct');setTimeout(()=>{if(!jRun||jRun.timedOut||jRun.failed)return;jRun.round++;if(jRun.round>=rounds)journeyCheckpointDone();else jTargetQuestion()},520)}}else{bu.classList.add('wrong');const keepGoing=jRegisterMistake();A.say(keepGoing?'Bukan yang itu. Cari simbol targetnya.':'Kesempatannya habis.','retry');if(keepGoing)setTimeout(()=>bu.classList.remove('wrong'),380)}})
}
function journeyCheckpointDone(){
  if(!jRun||jRun.timedOut)return;jStopTimer();const p=profile(),j=jState(p),r=jRun,newStars=Math.max(j.stars[r.id]||0,r.cp+1);j.stars[r.id]=newStars;if(newStars>=J_MAX_STARS)jBadge(j,r.loc.reward);jSave();jTone('win');
  $('#jBoard').innerHTML=`<div class="j-checkpoint-result"><span class="j-found-star">⭐</span>${jCelebrationBuddy(r.cp<J_MAX_STARS-1?'Checkpoint selesai':'Lokasi selesai')}<h1>Bintang ditemukan!</h1><p>${r.cp<J_MAX_STARS-1?'Checkpoint berikutnya terbuka. Countdown akan sedikit lebih cepat!':'Lokasi '+r.loc.name+' selesai! Kamu mendapat '+r.loc.reward}</p><div class="j-check-stars">${jStars(newStars)}</div><button class="j-next" id="jNextCheck">${r.cp<J_MAX_STARS-1?'Lanjut checkpoint '+(r.cp+2)+' →':'Kembali ke peta 🗺️'}</button></div>`;
  triggerVictoryFX($('#jBoard'),'journey');
  A.say(r.cp<J_MAX_STARS-1?'Bintang ditemukan. Ayo lanjut.':'Lokasi selesai. Hebat!','complete');
  $('#jNextCheck').onclick=()=>{if(r.cp<J_MAX_STARS-1){r.cp++;r.round=0;renderJourneyGame()}else journeyMap()}
}
function openJourneyTreasure(){
  jStopTimer();const p=profile(),j=jState(p);j.treasure=true;jBadge(j,'🌈');jSave();jTone('win');show('play');
  $('#play').innerHTML=`<div class="journey-shell"><div class="j-final family-ending">${jCelebrationBuddy('Harta Pelangi ditemukan!')}<div class="j-confetti" aria-hidden="true">${Array.from({length:30},(_,i)=>`<span style="--x:${(i*37)%100}%;--d:${(i%8)*.07}s">${i%4===0?'⭐':i%4===1?'🌈':i%4===2?'✨':'💛'}</span>`).join('')}</div><span class="big">🌈</span><h1>Harta Pelangi!</h1><p>${esc(p.name)} sudah menyelesaikan 5 lokasi dan menemukan semua ${J_TOTAL} Bintang Pelangi.</p><div class="journey-badge-row" style="justify-content:center;margin:20px 0">${J_BADGES.map(b=>`<div class="journey-badge">${b}</div>`).join('')}</div>${familyRewardMarkup()}<div class="family-ending-actions"><button class="j-next" id="jFamilyCollection">🎒 Lihat Album Keluarga</button><button class="journey-back" id="jFinalMap">🗺️ Kembali ke peta</button></div></div></div>`;
  triggerVictoryFX($('#play'),'journey');
  A.say('Hore! Semua Bintang Pelangi sudah ditemukan. Hadiah spesial keluarga terbuka!','complete');$('#jFinalMap').onclick=journeyMap;$('#jFamilyCollection').onclick=collection
}

B.App={home,worlds,parent,profiles,startMission,summaryFor,renderQuestion,journeyMap};})(BD);
