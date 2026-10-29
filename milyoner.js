// Milyoner Oyunu Değişkenleri
let mevcutSeviye = 1;
let soruIndex = 0;
let jokerler = { elliElli: true, seyirci: true, ciftCevap: true };

// Çift cevap durumu: "kapali" | "aktif" (joker basıldı, hak duruyor) | "ikinciHak" (ilk yanlış yapıldı)
let ciftCevapDurumu = "kapali";

// Ana menüdeki Milyoner butonuna tıklama olayı
document.addEventListener("DOMContentLoaded", () => {
    const milyonerBtn = document.getElementById("milyoner-btn"); // Buton ID'nize göre kontrol edin
    if (milyonerBtn) {
        milyonerBtn.addEventListener("click", milyonerOyunuBaslat);
    }

    // Çift cevap jokeri butonu (eski pas butonunun yerine)
    const ciftBtn = document.getElementById("joker-cift-btn");
    if (ciftBtn) {
        ciftBtn.addEventListener("click", ciftCevapKullan);
    }
});

function milyonerOyunuBaslat() {
    mevcutSeviye = 1;
    soruIndex = 0;
    jokerleriSifirla();
    ekraniGuncelle();

    // Oyun alanını göster, ana menüyü gizle
    document.getElementById("ana-menu").style.display = "none";
    document.getElementById("milyoner-ekrani").style.display = "block";

    soruGetir();
}

function jokerleriSifirla() {
    jokerler = { elliElli: true, seyirci: true, ciftCevap: true };
    ciftCevapDurumu = "kapali";
    jokerButonlariniGuncelle();
}

function jokerleriYenile() {
    // Kullanılmış jokerleri tekrar aktif yapar
    jokerler.elliElli = true;
    jokerler.seyirci = true;
    jokerler.ciftCevap = true;
    jokerButonlariniGuncelle();
    alert("Tebrikler! 5 soruyu geride bıraktınız, tüm jokerleriniz yenilendi!");
}

// ÇİFT CEVAP JOKERİ: Bu soruda iki cevap hakkı verir.
function ciftCevapKullan() {
    if (!jokerler.ciftCevap || ciftCevapDurumu !== "kapali") return;

    jokerler.ciftCevap = false;
    ciftCevapDurumu = "aktif";
    jokerButonlariniGuncelle();
    alert("Çift cevap jokeri aktif! Bu soruda 2 cevap hakkın var.");
}

function soruGetir() {
    const seviyeSorulari = milyonerSorulari[`seviye${mevcutSeviye}`];

    if (!seviyeSorulari || soruIndex >= seviyeSorulari.length) {
        alert(`Tebrikler! Seviye ${mevcutSeviye}'yi tamamladınız!`);
        mevcutSeviye++;
        soruIndex = 0;
        jokerleriSifirla();

        if (!milyonerSorulari[`seviye${mevcutSeviye}`]) {
            alert("Tüm seviyeleri başardınız! Şampiyonsunuz!");
            anaMenuyeDon();
            return;
        }
    }

    // Her 5. soruda (index 5 ve 10'a ulaşıldığında) jokerleri yenile
    if (soruIndex === 5 || soruIndex === 10) {
        jokerleriYenile();
    }

    // Yeni soruya geçerken çift cevap hakkı sıfırlanır
    ciftCevapDurumu = "kapali";

    const mevcutSoru = milyonerSorulari[`seviye${mevcutSeviye}`][soruIndex];

    // UI Güncelleme
    document.getElementById("seviye-bilgi").innerText = `Seviye ${mevcutSeviye}`;
    document.getElementById("soru-bilgi").innerText = `Soru ${soruIndex + 1}/15`;
    document.getElementById("soru-metni").innerText = mevcutSoru.soru;

    const secenekBtns = document.querySelectorAll(".secenek-btn");
    secenekBtns.forEach((btn, index) => {
        btn.innerText = `${String.fromCharCode(65 + index)}) ${mevcutSoru.secenekler[index]}`;
        btn.style.display = "block"; // 50:50 veya çift cevapla gizlenen seçeneği geri aç
        btn.onclick = () => cevapKontrol(btn, mevcutSoru.secenekler[index], mevcutSoru.cevap);
    });
}

function cevapKontrol(btn, secilen, dogruCevap) {
    if (secilen === dogruCevap) {
        soruIndex++;
        soruGetir();
        return;
    }

    // Yanlış cevap ama çift cevap jokeri aktif: ikinci hak ver
    if (ciftCevapDurumu === "aktif") {
        ciftCevapDurumu = "ikinciHak";
        btn.style.display = "none"; // yanlış seçeneği kaldır
        alert("Yanlış! Ama çift cevap jokerin var, bir hakkın daha var.");
        return;
    }

    // Yanlış cevap, hak kalmadı
    alert("Yanlış cevap!");
    if (mevcutSeviye > 1) {
        alert(`Bir alt seviyeye (Seviye ${mevcutSeviye - 1}) düşüyorsunuz.`);
        mevcutSeviye--;
        soruIndex = 0;
        jokerleriSifirla();
        soruGetir();
    } else {
        alert("Oyun bitti! Ana menüye dönülüyor.");
        anaMenuyeDon();
    }
}

function anaMenuyeDon() {
    document.getElementById("milyoner-ekrani").style.display = "none";
    document.getElementById("ana-menu").style.display = "block";
}
