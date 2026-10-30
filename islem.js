// TRT 1 Bir Kelime Bir İşlem - İşlem Oyunu (islem.js)
// Seviyeli sürüm: kolaydan zora. Her seviyenin hedefi, verilen sayılarla GERÇEKTEN ulaşılabilir (çözümü olan) üretilir.
let verilenSayilar = [];
let hedefSayi = 0;
let islemCozumu = "";      // üretilen örnek çözüm (ileride "ipucu / çözümü göster" için kullanılabilir)
let islemSeviyeNo = 1;     // oyuncunun şu anki seviyesi (kayıtlı)

const ISLEM_ENCOK_SEVIYE = 30; // zorluk bu seviyede tavan yapar, sayaç yine de artar
try { islemSeviyeNo = Math.max(1, parseInt(localStorage.getItem("islemSeviye") || "1", 10) || 1); } catch (e) {}

// Seviye numarasına göre zorluk ayarı
function islemSeviyeAyari(n) {
    const k = Math.min(n, ISLEM_ENCOK_SEVIYE);
    let a;
    if (k <= 3)       a = { adim: 2, ops: ["+", "-"],           buyuk: [],                 min: 10,  max: 30 };
    else if (k <= 6)  a = { adim: 2, ops: ["+", "-", "*"],      buyuk: [],                 min: 20,  max: 80 };
    else if (k <= 10) a = { adim: 3, ops: ["+", "-", "*"],      buyuk: [10],               min: 40,  max: 150 };
    else if (k <= 15) a = { adim: 3, ops: ["+", "-", "*", "/"], buyuk: [10, 20, 25],       min: 100, max: 300 };
    else if (k <= 20) a = { adim: 4, ops: ["+", "-", "*", "/"], buyuk: [25, 50],           min: 100, max: 500 };
    else if (k <= 25) a = { adim: 4, ops: ["+", "-", "*", "/"], buyuk: [25, 50, 75],       min: 100, max: 800 };
    else              a = { adim: 5, ops: ["+", "-", "*", "/"], buyuk: [25, 50, 75, 100], min: 100, max: 999 };
    // büyük sayı adedi: 10. seviyeye kadar 0-1, sonra 1-2
    a.buyukAdet = a.buyuk.length === 0 ? 0 : (k <= 10 ? 1 : (k <= 20 ? 1 : 2));
    return a;
}

function islemRastgele(dizi) { return dizi[Math.floor(Math.random() * dizi.length)]; }

// Verilen sayılardan rastgele işlemlerle bir hedef üretir (böylece hedef kesin ulaşılabilir olur)
function islemHedefUret(sayilar, a) {
    for (let deneme = 0; deneme < 300; deneme++) {
        let havuz = sayilar.map(s => ({ v: s, e: String(s) }));
        for (let adim = 0; adim < a.adim; adim++) {
            if (havuz.length < 2) break;
            const i = Math.floor(Math.random() * havuz.length);
            let j = Math.floor(Math.random() * (havuz.length - 1));
            if (j >= i) j++;
            let x = havuz[i], y = havuz[j];
            const op = islemRastgele(a.ops);
            let v = null;
            if (op === "+") v = x.v + y.v;
            else if (op === "*") { if (x.v > 1 && y.v > 1) v = x.v * y.v; }
            else if (op === "-") { if (x.v < y.v) { const t = x; x = y; y = t; } if (x.v - y.v > 0) v = x.v - y.v; }
            else if (op === "/") { if (x.v < y.v) { const t = x; x = y; y = t; } if (y.v > 1 && x.v % y.v === 0) v = x.v / y.v; }
            if (v === null) { adim--; if (deneme % 7 === 6) break; continue; }
            const yeni = { v: v, e: "(" + x.e + " " + (op === "*" ? "×" : op === "/" ? "÷" : op) + " " + y.e + ")" };
            havuz = havuz.filter((_, idx) => idx !== i && idx !== j);
            havuz.push(yeni);
            if (adim === a.adim - 1 && v >= a.min && v <= a.max && sayilar.indexOf(v) === -1) {
                return { hedef: v, cozum: yeni.e.replace(/^\((.*)\)$/, "$1") + " = " + v };
            }
        }
    }
    return null;
}

function islemSayilariSec(a) {
    const s = [];
    const kucukSayi = a.buyuk.length === 0 && a.max <= 80 ? 9 : 9; // küçük sayılar hep 1-9
    const kucukAdet = 6 - a.buyukAdet;
    for (let i = 0; i < kucukAdet; i++) s.push(Math.floor(Math.random() * kucukSayi) + 1);
    for (let i = 0; i < a.buyukAdet; i++) s.push(islemRastgele(a.buyuk));
    return s;
}

function islemOyununuBaslat() {
    const a = islemSeviyeAyari(islemSeviyeNo);
    let sonuc = null;
    for (let t = 0; t < 200 && !sonuc; t++) {
        verilenSayilar = islemSayilariSec(a);
        sonuc = islemHedefUret(verilenSayilar, a);
    }
    if (!sonuc) { // çok nadir: yedek, kolay bir hedef
        verilenSayilar = [1, 2, 3, 4, 5, 6];
        sonuc = { hedef: 21, cozum: "1 + 2 + 3 + 4 + 5 + 6 = 21" };
    }
    hedefSayi = sonuc.hedef;
    islemCozumu = sonuc.cozum;

    // Ekrana Yansıt
    const hedefElement = document.getElementById("hedef-sayi");
    if (hedefElement) {
        hedefElement.innerText = hedefSayi;
    }

    const sayiKutulari = document.querySelectorAll(".sayi-kutusu");
    verilenSayilar.forEach((sayi, index) => {
        if (sayiKutulari[index]) {
            sayiKutulari[index].innerText = sayi;
        }
    });

    islemSeviyeYaz();
}

// Seviye etiketini (varsa) günceller. Ekranda id="islem-seviye" olan bir öğe varsa "Seviye N" yazar.
function islemSeviyeYaz() {
    const el = document.getElementById("islem-seviye");
    if (el) el.innerText = "Seviye " + islemSeviyeNo;
}

// Oyuncu hedefi bulunca BUNU çağır -> bir üst seviyeye geçer (kaydeder). Sonra islemOyununuBaslat() ile yeni tur başlar.
function islemSeviyeTamamla() {
    islemSeviyeNo++;
    try { localStorage.setItem("islemSeviye", islemSeviyeNo); } catch (e) {}
    islemSeviyeYaz();
    return islemSeviyeNo;
}

function islemSeviyeSifirla() {
    islemSeviyeNo = 1;
    try { localStorage.setItem("islemSeviye", 1); } catch (e) {}
    islemSeviyeYaz();
}

window.islemOyununuBaslat = islemOyununuBaslat;
window.islemSeviyeTamamla = islemSeviyeTamamla;
window.islemSeviyeSifirla = islemSeviyeSifirla;
window.islemSeviyeNo = function () { return islemSeviyeNo; };
window.islemCozumuGetir = function () { return islemCozumu; };
