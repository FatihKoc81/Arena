// ARENA ANA SAYFA: kategori merkezli menü.
// Mevcut oyun butonlarının click handler'ları korunur; butonlar kategori görünümüne taşınır.
(function () {
  const ana = document.getElementById('ana');
  if (!ana || ana.dataset.arenaHub === '1') return;
  ana.dataset.arenaHub = '1';

  const oyunTanimi = [
    { id: 'milyoner', re: /Milyoner/i, name: 'Milyoner', cat: 'bilgi', icon: '🏆', desc: 'Genel kültür ve bilgi yarışması' },
    { id: 'passaparola', re: /Passaparola/i, name: 'Passaparola', cat: 'bilgi', icon: '🔤', desc: 'Harf harf cevapla, süreye karşı yarış' },
    { id: 'kelime', re: /Kelime Oyunu/i, name: 'Kelime Oyunu', cat: 'kelime', icon: '🧩', desc: 'İpuçlarından kelimeleri bul' },
    { id: 'islem', re: /İşlem Oyunu/i, name: 'İşlem Oyunu', cat: 'zeka', icon: '➗', desc: 'Sayılarla hedefe ulaş' },
    { id: 'rotasyon', re: /Rotasyon/i, name: 'Rotasyon', cat: 'kelime', icon: '🔄', desc: 'Harfleri birleştir, kelimeleri keşfet' }
  ];
  const kategoriler = [
    { id:'bilgi', name:'Bilgi Oyunları', icon:'🏆', color:'violet', desc:'Bilgini sına ve zirveye çık', planned:['Hızlı Karar'] },
    { id:'kelime', name:'Kelime Oyunları', icon:'🔠', color:'blue', desc:'Harfler, kelimeler ve sözcükler', planned:['Kelime Lik','Adam Asmaca','Kelime Zinciri'] },
    { id:'masa', name:'Masa Oyunları', icon:'🎲', color:'green', desc:'Klasik oyunlarda rakiplerini yen', planned:['Tavla','Dama','Domino'] },
    { id:'mantik', name:'Mantık Oyunları', icon:'🧠', color:'orange', desc:'Planla, çöz ve doğru yolu bul', planned:['Okları Çöz','Blok Kaçış','Labirent','Trafik Ustası','Şifre Kırıcı'] },
    { id:'bulmaca', name:'Bulmaca Oyunları', icon:'🧩', color:'pink', desc:'Her bölümde yeni bir meydan okuma', planned:['Sudoku','Matematik Bulmacası','Görsel Avı','Sıradaki Ne?'] },
    { id:'renk', name:'Renk ve Sıralama', icon:'🧪', color:'cyan', desc:'Renkleri ayır, parçaları yerleştir', planned:['Top Sıralama','Su Sıralama','Renk Laboratuvarı','Renkli Bloklar','Blok Yerleştir'] }
  ];

  const style = document.createElement('style');
  style.id = 'arenaHubStyle';
  style.textContent = `
    #ana{display:block!important;width:100%;max-width:620px;min-height:0;height:auto;max-height:calc(100dvh - var(--bas-yuk,58px) - env(safe-area-inset-top) - 22px);overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;margin:0 auto 12px;padding:12px 14px 22px;border:1px solid #263d70;border-radius:26px;background:linear-gradient(160deg,#0b1734 0%,#070d20 60%,#080b19 100%);box-shadow:0 12px 34px #0008;text-align:left;}
    #ana.hidden{display:none!important} #ana #seviye{display:none!important}
    #arenaHubHome,#arenaHubCategory{width:100%} #arenaHubCategory{padding-bottom:18px}
    .ah-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:2px 0 14px}
    .ah-brand{font-size:26px;font-weight:950;letter-spacing:2px;text-align:center;flex:1;color:#fff;text-shadow:0 0 16px #258cff;cursor:pointer}
    .ah-brand small{display:block;font-size:9px;letter-spacing:3px;color:#8eb8ff;font-weight:700}
    .ah-round{width:40px;height:40px;border-radius:14px;background:#12264a;border:1px solid #42649e;color:#fff;font-size:19px;display:grid;place-items:center}
    .ah-profile{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:12px;border:1px solid #315b98;border-radius:19px;background:linear-gradient(110deg,#10264a,#111b3b 65%,#19264b);margin-bottom:13px}
    .ah-avatar{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;font-size:25px;background:linear-gradient(135deg,#f6d46a,#a96a12);border:2px solid #ffe6a0}
    .ah-name{font-weight:850;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .ah-sub{font-size:11px;color:#a9bbdf;margin-top:4px}
    .ah-level{height:6px;border-radius:8px;background:#263b65;margin-top:7px;overflow:hidden}.ah-level i{display:block;width:38%;height:100%;background:linear-gradient(90deg,#2db7ff,#b45cff);border-radius:8px}
    .ah-wallet{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:800;white-space:nowrap;text-align:right}.ah-wallet span{background:#0a142d;border:1px solid #314d7b;border-radius:12px;padding:6px 8px}
    .ah-shortcuts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:0 0 15px}
    .ah-short{min-height:66px;padding:8px 3px;border-radius:15px;background:linear-gradient(160deg,#172b51,#0d1730);border:1px solid #344e7c;color:#fff;text-align:center;font-size:10px;font-weight:750;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
    .ah-short b{font-size:22px;line-height:1}
    .ah-section-title{display:flex;align-items:center;justify-content:space-between;color:#f3f6ff;font-size:16px;font-weight:900;margin:15px 2px 9px}
    .ah-section-title small{font-size:10px;color:#8ea8d3;font-weight:600}
    .ah-categories{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
    .ah-cat{min-height:108px;border-radius:18px;padding:12px 10px;display:grid;grid-template-columns:48px 1fr;align-items:center;gap:8px;color:white;text-align:left;border:1px solid var(--edge);background:linear-gradient(135deg,var(--bg1),var(--bg2));box-shadow:inset 0 1px 0 #ffffff20;position:relative;overflow:hidden}
    .ah-cat:after{content:'';position:absolute;right:-22px;top:-30px;width:90px;height:90px;border-radius:50%;background:#ffffff0a}
    .ah-cat-icon{font-size:36px;filter:drop-shadow(0 4px 5px #0008);text-align:center}
    .ah-cat strong{display:block;font-size:13px;line-height:1.2;font-weight:900}.ah-cat small{display:block;font-size:10px;color:#d2def4;margin-top:5px;line-height:1.25}
    .ah-cat.violet{--bg1:#32115b;--bg2:#171d4a;--edge:#a75aff}.ah-cat.blue{--bg1:#0d3b75;--bg2:#101f4a;--edge:#399bff}.ah-cat.green{--bg1:#07543e;--bg2:#102d3d;--edge:#24d78c}.ah-cat.orange{--bg1:#79400b;--bg2:#342047;--edge:#ffb32f}.ah-cat.pink{--bg1:#6a174b;--bg2:#301747;--edge:#ff5d9e}.ah-cat.cyan{--bg1:#07545c;--bg2:#102b50;--edge:#30e1e7}
    .ah-daily{display:flex;align-items:center;gap:10px;padding:12px;margin-top:13px;border:1px solid #5262a5;border-radius:16px;background:linear-gradient(100deg,#172a58,#26164a)}
    .ah-daily .ah-target{font-size:28px}.ah-daily strong{font-size:13px;display:block}.ah-daily small{font-size:10px;color:#c2cde6}
    .ah-featured{display:flex;gap:9px;overflow-x:auto;padding:2px 1px 8px;scrollbar-width:none}.ah-feature{min-width:82px;max-width:90px;text-align:center;color:#fff;font-size:10px;font-weight:750}.ah-feature i{display:grid;place-items:center;height:70px;border-radius:16px;background:linear-gradient(145deg,#203d75,#171632);border:1px solid #536caa;font-size:30px;font-style:normal;margin-bottom:5px}
    .ah-back{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:56px;background:#14274a;border:1px solid #41649a;border-radius:13px;padding:12px 14px;color:#fff;font-weight:800;font-size:17px;margin:0 0 13px;position:relative;z-index:5;touch-action:manipulation}
    .ah-cat-head{display:flex;align-items:center;gap:10px;padding:12px;border-radius:16px;background:linear-gradient(110deg,#172c54,#151c3d);margin-bottom:12px}.ah-cat-head i{font-size:34px;font-style:normal}.ah-cat-head strong{font-size:17px}.ah-cat-head small{display:block;color:#aabddd;font-size:11px;margin-top:3px}
    .ah-game-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
    .ah-game-card{min-height:112px;border:1px solid #344f80;border-radius:16px;background:linear-gradient(145deg,#152b50,#0c1530);color:#fff;padding:12px 9px;text-align:left;display:flex;flex-direction:column;justify-content:space-between}
    .ah-game-card .ah-game-icon{font-size:27px}.ah-game-card strong{font-size:13px;line-height:1.2}.ah-game-card small{font-size:10px;color:#9fb4d8;margin-top:5px}.ah-game-card.soon{opacity:.62;border-style:dashed}.ah-game-card.soon small{color:#f4c66b}
    #ana>button:not(.ah-round):not(.ah-short):not(.ah-cat):not(.ah-back):not(.ah-game-card){display:none!important} #ana>.pill{display:none!important} #ana>.ek-bar{display:none!important}
    @media(max-width:360px){.ah-cat{grid-template-columns:38px 1fr;padding:10px 7px;min-height:100px}.ah-cat-icon{font-size:30px}.ah-cat strong{font-size:12px}.ah-wallet{font-size:10px}}
    body.arena-kategori-acik .ek-dock, body.arena-kategori-acik .apk-btn{display:none!important}
    #ana{scrollbar-width:none} #ana::-webkit-scrollbar{display:none}
    .ah-game-card,.ah-back,.ah-cat{touch-action:manipulation}
  `;
  document.head.appendChild(style);

  const home = document.createElement('div'); home.id = 'arenaHubHome';
  const catView = document.createElement('div'); catView.id = 'arenaHubCategory'; catView.hidden = true;
  const gameButtons = [];
  const originalButtons = Array.from(ana.querySelectorAll('button')).filter(b => b.id !== 'sifirla');

  // Ana ekran içerikleri
  home.innerHTML = `
    <div class="ah-top"><button class="ah-round" aria-label="Menü">☰</button><div class="ah-brand">ARENA<small>OYUN PLATFORMU</small></div><button class="ah-round" aria-label="Bildirimler">♧</button></div>
    <div class="ah-profile"><div class="ah-avatar">👑</div><div><div class="ah-name">ARENA Oyuncusu</div><div class="ah-sub">Profil bilgileri giriş yaptığında gösterilecek</div><div class="ah-level"><i></i></div></div><div class="ah-wallet"><span>🪙 Altın</span><span>❤️ Can</span></div></div>
    <div class="ah-shortcuts"><button class="ah-short" data-short="reward"><b>🎁</b>Günlük Ödül</button><button class="ah-short" data-short="tasks"><b>📋</b>Görevler</button><button class="ah-short" data-short="league"><b>🏆</b>Lig</button><button class="ah-short" data-short="friends"><b>👥</b>Arkadaşlar</button></div>
    <div class="ah-section-title">Oyun Kategorileri <small>6 KATEGORİ</small></div>
    <div class="ah-categories">${kategoriler.map(k=>`<button class="ah-cat ${k.color}" data-category="${k.id}"><span class="ah-cat-icon">${k.icon}</span><span><strong>${k.name}</strong><small>${k.desc}</small></span></button>`).join('')}</div>
    <div class="ah-daily"><span class="ah-target">🎯</span><span><strong>Günün Görevi</strong><small>3 farklı oyun oyna · Günlük ödüller seni bekliyor</small></span></div>
    <div class="ah-section-title">Öne Çıkan Oyunlar <small>KEŞFET</small></div>
    <div class="ah-featured"><div class="ah-feature"><i>🏆</i>Milyoner</div><div class="ah-feature"><i>🔤</i>Passaparola</div><div class="ah-feature"><i>🧩</i>Kelime Oyunu</div><div class="ah-feature"><i>➗</i>İşlem</div><div class="ah-feature"><i>🔄</i>Rotasyon</div></div>
  `;
  ana.insertBefore(home, ana.firstChild);
  ana.appendChild(catView);

  function findButtons() {
    const all = Array.from(ana.querySelectorAll('button'));
    for (const b of all) {
      if (b.classList.contains('ah-round') || b.classList.contains('ah-short') || b.classList.contains('ah-cat') || b.classList.contains('ah-back') || b.classList.contains('ah-game-card')) continue;
      const def = oyunTanimi.find(x => x.re.test((b.textContent || '').replace(/\s+/g,' ')));
      if (def && !gameButtons.some(x => x.button === b)) { b.classList.add('arena-source-game'); gameButtons.push({button:b, def}); }
    }
  }
  function showCategory(id) {
    const cat = kategoriler.find(x=>x.id===id); if (!cat) return;
    findButtons(); home.hidden = true; catView.hidden = false;
    const active = gameButtons.filter(x=>x.def.cat===id);
    const cards = active.map(x=>`<button class="ah-game-card" data-launch="${x.def.id}"><span class="ah-game-icon">${x.def.icon}</span><span><strong>${x.def.name}</strong><small>${x.def.desc}</small></span></button>`).join('');
    const planned = cat.planned.map((n,i)=>`<div class="ah-game-card soon"><span class="ah-game-icon">🔒</span><span><strong>${n}</strong><small>Yakında eklenecek</small></span></div>`).join('');
    catView.innerHTML = `<button class="ah-back" type="button">← Kategorilere Dön</button><div class="ah-cat-head"><i>${cat.icon}</i><span><strong>${cat.name}</strong><small>${cat.desc}</small></span></div><div class="ah-game-list">${cards}${planned}</div>`;
  }
  home.addEventListener('click', e=>{
    const c=e.target.closest('[data-category]'); if(c) showCategory(c.dataset.category);
    const s=e.target.closest('[data-short]'); if(s) { const labels={reward:'Günlük ödül sistemi sonraki geliştirme aşamasında açılacak.',tasks:'Günlük görevler sonraki geliştirme aşamasında açılacak.',league:'Lig sistemi sonraki geliştirme aşamasında açılacak.',friends:'Arkadaş sistemi sonraki geliştirme aşamasında açılacak.'}; alert(labels[s.dataset.short]); }
  });
  function anaSayfayaDon() {
    catView.hidden = true;
    home.hidden = false;
    document.body.classList.remove('arena-kategori-acik');
    const dock = document.querySelector('.ek-dock');
    if (dock) dock.style.display = '';
    const apk = document.querySelector('.apk-btn');
    if (apk) apk.style.display = '';
    try { history.replaceState({arenaHome:true}, '', location.href); } catch (_) {}
    ana.scrollTop = 0;
  }
  function kategoriGoster(id) {
    showCategory(id);
    document.body.classList.add('arena-kategori-acik');
    const dock = document.querySelector('.ek-dock');
    if (dock) dock.style.display = 'none';
    const apk = document.querySelector('.apk-btn');
    if (apk) apk.style.display = 'none';
    ana.scrollTop = 0;
    try { history.pushState({arenaCategory:id}, '', '#kategori-' + id); } catch (_) {}
  }
  // Replace category button click with robust navigation wrapper
  home.addEventListener('click', e=>{
    const c=e.target.closest('[data-category]');
    if(c) { kategoriGoster(c.dataset.category); return; }
  }, true);
  catView.addEventListener('click', e=>{
    const back = e.target.closest('.ah-back');
    if(back) { e.preventDefault(); e.stopPropagation(); anaSayfayaDon(); return; }
    const launch=e.target.closest('[data-launch]'); if(!launch) return;
    const item=gameButtons.find(x=>x.def.id===launch.dataset.launch); if(item) item.button.click();
  }, true);
  // Sabit üstteki ARENA başlığı her ekrandan ana sayfaya döndürür.
  const pageTitle = document.querySelector('body > h1');
  if (pageTitle) {
    pageTitle.setAttribute('role','button');
    pageTitle.setAttribute('aria-label','ARENA ana sayfaya dön');
    pageTitle.addEventListener('click', function(e){ e.preventDefault(); e.stopImmediatePropagation(); anaSayfayaDon(); }, true);
  }
  window.addEventListener('popstate', function(ev) {
    if (!catView.hidden) anaSayfayaDon();
  });
  window.addEventListener('arena:home', anaSayfayaDon);
  window.addEventListener('anasayfa', anaSayfayaDon);

  // Existing buttons keep their original listeners and are kept hidden, not deleted.
  findButtons();
  const observer = new MutationObserver(()=>findButtons());
  observer.observe(ana,{childList:true,subtree:true});
  window.addEventListener('load',findButtons);
  window.addEventListener('arena:home',()=>{catView.hidden=true;home.hidden=false;});
})();
