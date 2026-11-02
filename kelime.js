// KELİME OYUNU (TV'deki Kelime Oyunu tarzı: ipucuna bak, altıgenlerdeki kelimeyi bul)
// Kullanım: index.html'de passaparola.js satırından SONRA ekle: <script src="kelime.js"></script>
(function () {
  const TUR = 10;   // bir oyundaki kelime sayısı
  const SURE = 60;  // her kelime için saniye
  const HAK = 3;    // her kelime için tahmin hakkı
  const PUAN = 100; // kapalı her harf için puan

  // [ "Kelime", "İpucu" ] — yeni kelime eklemek için listeye bir satır ekle
  const KELIMELER = [
    ["Kütüphane", "Çok sayıda kitabın bulunduğu, ödünç kitap alınabilen yer"],
    ["Bilgisayar", "Verileri işleyen, ekranı ve klavyesi olan elektronik cihaz"],
    ["Pencere", "Odaya ışık ve hava girmesini sağlayan, camlı açıklık"],
    ["Merdiven", "Bir kattan diğerine çıkmaya yarayan basamaklı yapı"],
    ["Kelebek", "Renkli kanatlı, tırtıldan dönüşen böcek"],
    ["Çiçek", "Bahçede açan, güzel kokulu bitki parçası"],
    ["Terazi", "Nesnelerin ağırlığını ölçmeye yarayan alet"],
    ["Mutfak", "Evde yemeklerin pişirildiği oda"],
    ["Ayakkabı", "Ayağa giyilen, yürümeyi kolaylaştıran eşya"],
    ["Sinema", "Filmlerin büyük perdede gösterildiği yer"],
    ["Havuç", "Turuncu renkli, tavşanların sevdiği kök sebze"],
    ["Okyanus", "Denizden de büyük, kıtaları ayıran geniş su kütlesi"],
    ["Kaplumbağa", "Sırtında kabuk taşıyan, çok yavaş yürüyen hayvan"],
    ["Telefon", "Uzaktaki kişilerle konuşmaya yarayan cihaz"],
    ["Gözlük", "Görmeyi kolaylaştıran, burna takılan cam eşya"],
    ["Fotoğraf", "Kamerayla çekilen sabit görüntü"],
    ["Kamyon", "Yük taşımak için kullanılan büyük taşıt"],
    ["Çorba", "Kaşıkla içilen, sıcak ve sulu yemek"],
    ["Baklava", "Fıstıklı, şerbetli, ince yufkalı Türk tatlısı"],
    ["Simit", "Üzeri susamlı, halka biçimli hamur işi"],
    ["Hastane", "Hastaların tedavi edildiği sağlık kurumu"],
    ["Eczane", "İlaçların satıldığı yer"],
    ["Sandalye", "Oturmaya yarayan, arkalıklı eşya"],
    ["Yıldırım", "Gök gürültüsüyle birlikte çakan elektrik boşalması"],
    ["Deprem", "Yer kabuğundaki hareketlerle oluşan sarsıntı"],
    ["Volkan", "Lav püskürten dağ"],
    ["Şelale", "Yüksekten dökülen akarsu"],
    ["Yarımada", "Üç yanı sularla çevrili kara parçası"],
    ["Harita", "Yeryüzünün küçültülerek çizilmiş hâli"],
    ["Pusula", "Yön bulmaya yarayan, ibresi kuzeyi gösteren alet"],
    ["Mikroskop", "Gözle görülemeyen küçük şeyleri büyüterek gösteren alet"],
    ["Teleskop", "Uzaktaki gök cisimlerini yakından göstermeye yarayan alet"],
    ["Termometre", "Sıcaklığı ölçen alet"],
    ["Roket", "Uzaya fırlatılan, yakıtla yükselen araç"],
    ["Astronot", "Uzaya giden kişi"],
    ["Orkestra", "Birçok çalgıcının birlikte müzik yaptığı topluluk"],
    ["Tiyatro", "Oyuncuların sahnede canlı oynadığı gösteri"],
    ["Gazete", "Her gün yayımlanan haber basılısı"],
    ["Karınca", "Koloniler hâlinde yaşayan, çok çalışkan küçük böcek"],
    ["Kanguru", "Yavrusunu karnındaki keseyle taşıyan Avustralya hayvanı"],
    ["Mercimek", "Çorbası yapılan, küçük taneli kırmızı veya yeşil bakliyat"],
    ["Salatalık", "Yeşil renkli, turşusu yapılan sulu sebze"],
    ["Patlıcan", "Mor renkli, musakkası yapılan sebze"],
    ["Karpuz", "Yazın yenen, içi kırmızı, kabuğu yeşil iri meyve"],
    ["Çilek", "Kırmızı, küçük, yaz mevsiminde yenen meyve"],
    ["Kitaplık", "Kitapların dizildiği raflı mobilya"],
    ["Takvim", "Günleri ve ayları gösteren çizelge"],
    ["Bulmaca", "Kareler ve ipuçlarıyla çözülen oyun"],
    ["Termos", "Sıcak içeceği uzun süre sıcak tutan şişe"],
    ["Madalya", "Yarışmada kazananlara verilen metal ödül"],
    ["Basketbol", "Potaya top atılarak oynanan takım sporu"],
    ["Papağan", "Konuşmayı taklit eden renkli kuş"],
    ["Timsah", "Nil'de yaşayan, geniş çeneli sürüngen"],
    ["Gergedan", "Burnunun üstünde boynuz taşıyan iri hayvan"],
    ["Flamingo", "Pembe renkli, uzun bacaklı su kuşu"],
    ["Kunduz", "Baraj yapan, geniş kuyruklu kemirgen"],
    ["Salyangoz", "Sırtında kabuk taşıyan, yavaş giden yumuşakça"],
    ["Ahtapot", "Sekiz kollu deniz canlısı"],
    ["Kumpir", "Fırında pişen, içi doldurulmuş büyük patates yemeği"],
    ["Gözleme", "Elde açılan ince hamurdan sacda pişen yiyecek"],
    ["Kavun", "Yazın yenen, kokulu, sarı ve sulu meyve"],
    ["Mandalina", "Kışın yenen, kolay soyulan küçük turunçgil"],
    ["Ananas", "Tepesinde yapraklı taç olan tropikal meyve"],
    ["Berber", "Saç ve sakal kesen usta"],
    ["Avukat", "Mahkemede müvekkilini savunan hukukçu"],
    ["Gazeteci", "Haber toplayan ve yazan kişi"],
    ["Kaptan", "Gemiyi veya uçağı yöneten kişi"],
    ["Dolunay", "Ayın tamamen göründüğü gece"],
    ["Tornavida", "Vidaları sıkmaya yarayan alet"],
    ["Matkap", "Duvara delik açan elektrikli alet"],
    ["Testere", "Odun kesmeye yarayan dişli alet"],
    ["Kilit", "Anahtarla açılan güvenlik düzeneği"],
    ["Mıknatıs", "Demiri kendine çeken cisim"],
    ["Atkı", "Boyna sarılan yünlü kışlık eşya"],
    ["Kemer", "Pantolonu belde tutan kayış"],
    ["Bavul", "Seyahatte eşyaların konduğu büyük çanta"],
    ["Lavanta", "Mor renkli, güzel kokulu bitki"],
    ["Kumbara", "Para biriktirilen küçük kap"],
    ["Şemsiye", "Yağmurdan korunmak için açılan kumaş kubbe"],
    ["Asansör", "Katlar arasında insan taşıyan kabin"],
    ["Balkon", "Evin dışa doğru çıkıntılı, korkuluklu bölümü"],
    ["Semaver", "Çay kaynatılan metal kap"],
    ["Sürahi", "Su veya meyve suyu konulan, saplı cam kap"],
    ["Piknik", "Doğada yemek yeme etkinliği"],
    ["Kaktüs", "Çölde yetişen dikenli bitki"],
    ["Sincap", "Fındık toplayan, kabarık kuyruklu küçük hayvan"],
    ["Kirpi", "Sırtı dikenlerle kaplı küçük hayvan"],
    ["Leylek", "Çatılara yuva yapan, uzun bacaklı göçmen kuş"],
    ["Baykuş", "Geceleri avlanan, büyük gözlü kuş"],
    ["Zürafa", "Boynu çok uzun, benekli hayvan"],
    ["Penguen", "Kutuplarda yaşayan, uçamayan siyah beyaz kuş"],
    ["Sandalet", "Yazın giyilen, açık ve hafif ayakkabı"],
    ["Kazak", "Kışın giyilen kalın örgü üst giysi"],
    ["Mayo", "Denizde yüzerken giyilen giysi"],
    ["Pijama", "Gece yatarken giyilen rahat giysi"],
    ["Bornoz", "Banyodan sonra giyilen havlu kumaşlı giysi"],
    ["Terlik", "Evde ayağa giyilen hafif ayakkabı"],
    ["Cetvel", "Çizgi çizmeye ve ölçmeye yarayan düz alet"],
    ["Silgi", "Kurşun kalem izlerini yok eden küçük nesne"],
    ["Kalemtraş", "Kalemin ucunu açan küçük alet"],
    ["Defter", "Üzerine yazı yazılan çizgili sayfalar bütünü"],
    ["Sınıf", "Öğrencilerin ders gördüğü oda"],
    ["Karne", "Öğrencinin notlarının yazılı olduğu belge"],
    ["Tatil", "Çalışmaya veya okula ara verilen dinlenme günleri"],
    ["Bahçıvan", "Bitkilere bakan kişi"],
    ["Orman", "Çok sayıda ağacın bulunduğu geniş alan"],
    ["Mağara", "Kayalarda doğal oluşmuş boşluk"],
    ["Vadi", "İki dağ arasındaki alçak yer"],
    ["Nehir", "Denize veya göle dökülen büyük akarsu"],
    ["Şimşek", "Yağmurlu havada gökte çakan ışık"],
    ["Kasırga", "Çok şiddetli, dönerek ilerleyen fırtına"],
    ["Gökkuşağı", "Yağmurdan sonra göğü süsleyen yedi renk"],
    ["Meteor", "Atmosfere girip yanan uzay taşı"],
    ["Pervane", "Uçak ve gemilerde dönen kanatlı parça"],
    ["Helikopter", "Tepesindeki kanatlarla havalanan taşıt"],
    ["Denizaltı", "Su altında seyreden gemi"],
    ["Ambulans", "Hastaları hastaneye taşıyan sirenli araç"],
    ["İtfaiye", "Yangınları söndüren ekip"],
    ["Otopark", "Arabaların bırakıldığı yer"],
    ["Kavşak", "Yolların birleştiği veya kesiştiği yer"],
    ["Tünel", "Dağın veya yerin altından açılan yol"],
    ["Köprü", "İki yakayı birbirine bağlayan yapı"],
    ["Liman", "Gemilerin yanaştığı güvenli kıyı"],
    ["Fener", "Geceleri yolu aydınlatan taşınabilir ışık"],
    ["Müzisyen", "Müzik yapan kişi"],
    ["Gitarist", "Gitar çalan sanatçı"],
    ["Piyanist", "Piyano çalan sanatçı"],
    ["Ressam", "Tablo yapan sanatçı"],
    ["Heykel", "Taş veya tunçtan yapılan üç boyutlu sanat eseri"]
  ];

  // ---------- Stil ----------
  const css = document.createElement("style");
  css.textContent = `
  .btn.oval{border-radius:999px}
  #kk.kkK{padding:10px 12px;border-radius:28px;min-height:0;height:auto}
  #kkBilgi{display:flex;justify-content:space-between;color:#8e9bc4;font-size:14px;margin-bottom:0}
  #kkHeks{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin:6px 0}
  .kkH{display:flex;align-items:center;justify-content:center;background:#5b21b6;color:#fff;font-weight:700;clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)}
  .kkH.a{background:#fff;color:#1d1040}
  .kkH.d{background:#22c55e;color:#fff}
  .kkH.y{background:#ef4444;color:#fff}
  #kkPot{color:#ffe9c7;font-weight:700;font-size:15px}
  #kkIpucu{font-size:16px;line-height:1.3;margin:6px 0 8px;text-align:center;white-space:pre-line}
  #kkCevap{box-sizing:border-box;width:100%;min-height:42px;padding:8px 12px;border-radius:16px;border:1px solid #1d2540;background:#0d1426;color:#fff;font:inherit;font-size:18px;line-height:24px;text-align:center;outline:none;caret-color:#fff;white-space:nowrap;overflow:hidden;-webkit-user-select:text;user-select:text}
  #kkCevap:focus{border-color:#8e9bc4}
  #kkGeriBildirim{min-height:18px;margin-top:4px;font-size:15px;font-weight:700;text-align:center}
  .kkSatir{display:flex;gap:8px}
  .kkSatir .btn{margin-top:4px;padding:10px 6px;font-size:15px}
  #kk.kkK{min-height:0!important;height:auto!important;padding:16px 14px!important}
  body.kkOyunda #kkBilgi{margin-bottom:10px!important}
  body.kkOyunda #kkHeks{margin-top:10px!important;margin-bottom:10px!important}
  body.kkOyunda #kkIpucu{margin-top:12px!important;margin-bottom:14px!important}
  #kkGeriBildirim{min-height:22px!important;margin-top:6px!important}
  .kkTitre{animation:kkt .3s}
  @keyframes kkt{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
  `;
  document.head.append(css);

  // ---------- Ana menü butonu ----------
  const ana = document.getElementById("ana");
  const menuBtn = document.createElement("button");
  menuBtn.className = "btn ikinci oval";
  menuBtn.textContent = "Kelime Oyunu";
  ana.append(menuBtn);

  // ---------- Ekran ----------
  // Cevap kutusu bilerek <input> değil, düzenlenebilir bir <div>:
  // Chrome bunu şifre/kart/adres alanı sanıp otomatik doldurma çubuğu göstermesin diye.
  const sec = document.createElement("section");
  sec.className = "kart hidden";
  sec.id = "kk";
  sec.innerHTML = `
    <div id="kkGiris">
      <h2><svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" style="vertical-align:middle;margin-right:8px"><use href="#i-k"/></svg>Kelime Oyunu</h2>
      <p class="alt">İpucunu oku, kelimeyi bul.<br>Ne kadar az harf açarsan o kadar çok<br>puan kazanırsın. ${TUR} kelime, her kelime<br>için ${SURE} saniye ve ${HAK} tahmin hakkı var.</p>
      <button class="btn" id="kkBasla">▶️ Başla</button>
      <button class="btn ikinci" id="kkGeri">Ana menü</button>
    </div>
    <div id="kkOyun" class="hidden">
      <div id="kkBilgi"><b id="kkSayi"></b><span id="kkPuan"></span></div>
      <div id="kkHeks"></div>
      <div id="kkBilgi2" style="display:flex;justify-content:space-between"><span id="kkPot"></span><span id="kkSure" style="font-weight:700"></span></div>
      <p id="kkIpucu"></p>
      <div id="kkCevap" contenteditable="true" role="textbox" aria-label="Cevap" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="done"></div>
      <p id="kkGeriBildirim"></p>
      <div class="kkSatir">
        <button class="btn ikinci" id="kkHarfAl">💡 Harf Al</button>
        <button class="btn ikinci" id="kkPas">Pas</button>
        <button class="btn" id="kkTahmin">Tahmin</button>
      </div>
    </div>
    <div id="kkSon" class="hidden">
      <h2 id="kkSBaslik"></h2>
      <p class="alt" id="kkSMetin"></p>
      <button class="btn" id="kkTekrar">Tekrar oyna</button>
      <button class="btn ikinci" id="kkMenu">Ana menü</button>
    </div>`;
  ana.insertAdjacentElement("afterend", sec);

  const $ = id => document.getElementById(id);
  const giris = $("kkGiris"), oyun = $("kkOyun"), son = $("kkSon");
  const inp = $("kkCevap"), fb = $("kkGeriBildirim"), heks = $("kkHeks");

  // ---------- Başlığı ana ekranla aynı boyut ve konumda tut ----------
  // Klavye açılınca vh/svh/lvh birimleri değişebiliyor; başlık küçülüp yukarı kayıyor.
  // Bu yüzden ana ekrandayken (klavye kapalıyken) piksel değerlerini ölçüp sabitliyoruz.
  const BASLIK_OZELLIK = ["margin-top", "margin-bottom", "font-size", "line-height", "letter-spacing"];

  let baslikUst = null; // başlığın ana ekrandaki üst konumu
  const BASLIK_INDIR = 13; // piksel: başlığı oyun ekranında bu kadar aşağı al (artır = daha aşağı)
  // Başlık artık style.css'teki sabit çubuk; bu fonksiyonlar eski çağrılar bozulmasın diye boş bırakıldı.
  function baslikHizala() {}
  function baslikKilitle() {}
  function baslikSerbest() {}

  // Cevap kutusunu oku / yaz / odaklan (div olduğu için .value yok)
  const oku = () => inp.textContent;
  const yaz = v => { inp.textContent = v; };
  const odak = () => {
    inp.focus();
    const r = document.createRange();
    r.selectNodeContents(inp);
    r.collapse(false);
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(r);
  };

  // ---------- Durum ----------
  let liste, k, harfler, acik, hak, sure, toplam, dogruSayi, zaman, kilit;
  let duel = null; // düello: { api, elendi }
  const DUELLO_HEDEF = 5; // düelloda hedef: bu kadar kelimeyi ilk bilen kazanır
  const tohumlu = (a, seed) => { let s = (Math.abs(Math.floor(seed)) % 233280) || 1; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  const norm = s => s.toLocaleLowerCase("tr").replace(/[^a-zçğıöşü0-9]/g, "");
  const karistir = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const kapali = () => acik.filter(x => !x).length;

  // İpucunu iki satıra böl: üst satır alt satırdan uzun olmasın
  function ipucuBol(metin) {
    if (metin.length <= 32) return metin;
    const kel = metin.split(" ");
    let en = -1, enFark = Infinity;
    for (let i = 1; i < kel.length; i++) {
      const ust = kel.slice(0, i).join(" ").length;
      const alt = kel.slice(i).join(" ").length;
      if (ust <= alt && alt - ust < enFark) { enFark = alt - ust; en = i; }
    }
    if (en < 0) return metin;
    return kel.slice(0, en).join(" ") + "\n" + kel.slice(en).join(" ");
  }

  const bolum = b => {
    giris.classList.toggle("hidden", b !== "giris");
    oyun.classList.toggle("hidden", b !== "oyun");
    son.classList.toggle("hidden", b !== "son");
    sec.classList.toggle("kkK", b === "oyun");
    alta();
  };

  // Kartı klavyenin hemen üstüne indir
  // Kart ekrana sabitlenir (position:fixed) ve klavyenin yüksekliğine göre alttan hizalanır.
  function altaSifirla() {
    ["position", "left", "width", "bottom", "top", "marginTop", "zIndex"].forEach(p => { sec.style[p] = ""; });
  }
  function alta() {
    // Kelime Oyunu ekranı açık değilken hiçbir şeye dokunma (başlığı Passaparola/ana sayfa yönetiyor;
    // klavye açılırken resize olayları başlığın hizasını sıfırlayıp sıçratıyordu)
    if (sec.classList.contains("hidden")) return;
    if (!sec.classList.contains("kkK")) { altaSifirla(); baslikHizala(); return; }
    // Önce normal akışta genişlik ve soldan konumu ölç
    altaSifirla();
    const r = sec.getBoundingClientRect();
    const sol = r.left, gen = r.width;
    // Klavyenin kapladığı yükseklik (hem resizes-content hem resizes-visual için çalışır)
    const vv = window.visualViewport;
    const gorunenAlt = vv ? vv.offsetTop + vv.height : window.innerHeight;
    const klavye = Math.max(0, window.innerHeight - gorunenAlt);
    sec.style.position = "fixed";
    sec.style.left = Math.round(sol) + "px";
    sec.style.width = Math.round(gen) + "px";
    sec.style.top = "auto";
    sec.style.marginTop = "0px";
    sec.style.bottom = Math.round(klavye + 10) + "px";
    sec.style.zIndex = "5";
    window.scrollTo(0, 0); // başlık yerinden oynamasın
    baslikHizala();
  }

  function menuyeDon() {
    clearInterval(zaman);
    sec.classList.add("hidden");
    sec.classList.remove("kkK");
    altaSifirla();
    baslikSerbest();
    document.querySelector("h1").style.display = "";
    ana.classList.remove("hidden");
  }

  function sureYaz() { $("kkSure").textContent = "⏱️ " + sure; }

  function ciz(durum) {
    const n = harfler.length;
    const s = Math.max(24, Math.min(36, Math.floor(300 / n) - 4));
    heks.innerHTML = harfler.map((h, i) => {
      const c = durum || (acik[i] ? "a" : "");
      const goster = durum || acik[i];
      return `<div class="kkH ${c}" style="width:${s}px;height:${Math.round(s * 0.92)}px;font-size:${Math.round(s * 0.5)}px">${goster ? h : ""}</div>`;
    }).join("");
    $("kkSayi").textContent = "Kelime " + (k + 1) + "/" + liste.length;
    $("kkPuan").textContent = "⭐ " + toplam;
    $("kkPot").textContent = "💰 " + kapali() * PUAN + " " + "❤️".repeat(hak);
    $("kkIpucu").textContent = ipucuBol(liste[k][1]);
    $("kkHarfAl").disabled = kilit || kapali() <= 1;
    sureYaz();
  }

  function yeniKelime() {
    harfler = Array.from(liste[k][0].toLocaleUpperCase("tr"));
    acik = harfler.map(() => false);
    hak = HAK;
    sure = SURE;
    kilit = false;
    fb.textContent = "";
    yaz("");
    ciz();
    odak();
    clearInterval(zaman);
    zaman = setInterval(() => {
      sure--;
      sureYaz();
      if (sure <= 0) kelimeBitir("⏰ Süre doldu! Cevap: " + harfler.join(""));
    }, 1000);
  }

  // Kelimeler destesi: bütün kelimeler bitmeden hiçbiri tekrar etmez; deste bitince yeniden karılır.
  function kelimeDesteCek() {
    let d = [];
    try { d = JSON.parse(localStorage.getItem("kkDeste")) || []; } catch (e) {}
    d = d.filter(i => i >= 0 && i < KELIMELER.length);
    const al = [];
    while (al.length < TUR) {
      if (!d.length) {
        d = karistir(KELIMELER.map((_, i) => i)).filter(i => al.indexOf(i) < 0);
      }
      al.push(d.shift());
    }
    try { localStorage.setItem("kkDeste", JSON.stringify(d)); } catch (e) {}
    return al.map(i => KELIMELER[i]);
  }
  function baslat() { duel = null; baslatCek(null); }
  function baslatCek(seed) {
    $("kkTekrar").style.display = "";
    liste = (seed == null ? kelimeDesteCek() : tohumlu(KELIMELER, seed).slice(0, TUR));
    k = 0; toplam = 0; dogruSayi = 0;
    bolum("oyun");
    yeniKelime();
    alta();
    setTimeout(alta, 300);
    setTimeout(alta, 700);
  }

  function sonraki() {
    k++;
    if (k >= liste.length || (duel && dogruSayi + (liste.length - k) < DUELLO_HEDEF)) return bitir();
    yeniKelime();
  }

  function kelimeBitir(mesaj) {
    if (kilit) return;
    kilit = true;
    clearInterval(zaman);
    ciz("y");
    fb.textContent = mesaj;
    fb.style.color = "#ef4444";
    setTimeout(sonraki, 1900);
  }

  function tahmin() {
    if (kilit) return;
    const v = norm(oku());
    if (!v) return;
    if (v === norm(liste[k][0])) {
      const p = kapali() * PUAN;
      toplam += p;
      dogruSayi++;
      if (window.Puan) Puan.ekle("kelime"); // bulunan kelime puanı hemen genel puana ve sıralamaya yansır
      if (duel) {
        duel.api.ilerle(dogruSayi, DUELLO_HEDEF);
        if (dogruSayi >= DUELLO_HEDEF) { kilit = true; clearInterval(zaman); ciz("d"); fb.textContent = "✅ Hedefe ulaştın!"; fb.style.color = "#22c55e"; duel.api.bitti(); return; }
      }
      kilit = true;
      clearInterval(zaman);
      ciz("d");
      fb.textContent = "✅ Doğru! +" + p + " puan";
      fb.style.color = "#22c55e";
      setTimeout(sonraki, 1300);
    } else {
      hak--;
      yaz("");
      inp.classList.remove("kkTitre");
      void inp.offsetWidth;
      inp.classList.add("kkTitre");
      if (hak <= 0) return kelimeBitir("❌ Hakkın bitti! Cevap: " + harfler.join(""));
      fb.textContent = "❌ Yanlış, kalan hak: " + hak;
      fb.style.color = "#ef4444";
      ciz();
    }
  }

  function harfAl() {
    if (kilit || kapali() <= 1) return;
    const kapaliIdx = acik.map((x, i) => x ? -1 : i).filter(i => i >= 0);
    acik[kapaliIdx[Math.floor(Math.random() * kapaliIdx.length)]] = true;
    ciz();
    odak();
  }

  function bitir() {
    clearInterval(zaman);
    kilit = true;
    if (duel) {
      if (!duel.elendi) { duel.elendi = true; duel.api.elendi(); }
      $("kkSBaslik").textContent = "Hedefe ulaşamadın";
      $("kkSMetin").textContent = "Bildiğin kelime: " + dogruSayi + " / " + DUELLO_HEDEF + " • Rakibin bitirmesini bekle.";
      $("kkTekrar").style.display = "none";
      bolum("son");
      return;
    }
    let en = 0;
    try {
      en = Number(localStorage.getItem("kelimeEn")) || 0;
      if (toplam > en) { en = toplam; localStorage.setItem("kelimeEn", String(en)); }
    } catch (e) { if (toplam > en) en = toplam; }
    $("kkSBaslik").textContent = dogruSayi === liste.length ? "🏆 Hepsini bildin!" : "Oyun bitti!";
    $("kkSMetin").textContent = "Puanın: " + toplam + " • Bildiğin kelime: " + dogruSayi + "/" + liste.length + " • En yüksek puan: " + en;
    bolum("son");
  }

  // ---------- Olaylar ----------
  menuBtn.onclick = () => {
    baslikKilitle(); // ana ekrandayken (klavye kapalı) ölç ve sabitle
    ana.classList.add("hidden");
    sec.classList.remove("hidden");
    bolum("giris");
  };
  $("kkBasla").onclick = baslat;
  $("kkTekrar").onclick = baslat;
  const cikis = () => { if (duel) document.querySelector("h1").click(); else menuyeDon(); };
  $("kkGeri").onclick = cikis;
  $("kkMenu").onclick = cikis;
  // KLAVYE AÇIK KALSIN: Tahmin / Harf Al / Pas düğmesine basınca odak düğmeye geçip klavye kapanıyordu
  // (sonraki kelimede tekrar açılıyor, kart aşağı yukarı sıçrıyordu). Düğmeler odağı çalamaz, tıklama sonrası odak kutuya geri verilir.
  const odakKoru = () => { if (!sec.classList.contains("hidden") && !oyun.classList.contains("hidden")) odak(); };
  ["kkTahmin", "kkHarfAl", "kkPas"].forEach(id => $(id).addEventListener("mousedown", e => e.preventDefault()));
  $("kkTahmin").onclick = () => { tahmin(); odakKoru(); };
  $("kkHarfAl").onclick = harfAl;
  $("kkPas").onclick = () => { kelimeBitir("⏭️ Pas geçildi. Cevap: " + harfler.join("")); odakKoru(); };

  // Enter: yeni satır açma, tahmin et
  inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); tahmin(); } });
  // Yapıştırılan metni düz metin yap
  inp.addEventListener("paste", e => {
    e.preventDefault();
    const t = (e.clipboardData || window.clipboardData).getData("text").replace(/\s+/g, " ");
    document.execCommand("insertText", false, t);
  });

  // Kartı klavyenin hemen üstünde tut
  window.addEventListener("resize", alta);
  if (window.visualViewport) {
    visualViewport.addEventListener("resize", alta);
    visualViewport.addEventListener("scroll", alta);
  }
  inp.addEventListener("focus", () => { setTimeout(alta, 150); setTimeout(alta, 450); setTimeout(alta, 900); });
  inp.addEventListener("blur", () => setTimeout(alta, 200));

  // Başlığa tıklanınca (ortak.js) süreyi durdur ve ana sayfaya dön
  // DÜELLO (arena.js): iki oyuncu aynı kelimelerle oynar, ilk DUELLO_HEDEF kelimeyi bilen kazanır
  (window.ArenaOyunlari = window.ArenaOyunlari || {}).kelime = {
    ad: "Kelime Oyunu",
    baslat: function (d, api) {
      duel = { api: api, elendi: false };
      ana.classList.add("hidden"); sec.classList.remove("hidden");
      bolum("giris");
      baslatCek(d.seed);
      api.ilerle(0, DUELLO_HEDEF);
    },
    dur: function () { duel = null; clearInterval(zaman); kilit = true; }
  };
  document.addEventListener("anasayfa", menuyeDon);
})();
