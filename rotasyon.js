/* Rotasyon - Words of Wonders tarzı oyun. Butonunu ana menüye (#ana) kendisi ekler. */
(function () {
// w: ana kelimeler (bulmaca tablosunda çaprazlama yerleşir), b: bonus kelimeler (tabloda yok, bulununca bonus puan)
// Tabloya sığmayan ana kelimeler otomatik bonus kelime olur.
var LEVELS = [
  { l: "KALEM",  w: ["KALEM", "KALE", "ELMA", "ALEM", "KEL", "KAL"],
                 b: ["EMLAK", "KELAM", "AMEL", "LAME", "MAL", "ELA", "LAM", "KAM", "KEM", "AL", "EL", "AK"] },
  { l: "KİTAP",  w: ["KİTAP", "KAP", "TAK", "KİT", "TİP", "PİK"],
                 b: ["TAKİP", "PATİK", "KATİP", "AKİT", "ATİK", "PAKT", "KAT", "KİP", "PAK", "TİK", "AİT", "PAT", "AT", "İP", "İT", "AK"] },
  { l: "GÜNEŞ",  w: ["GÜNEŞ", "GÜN", "ŞEN", "GEN", "EŞ", "ÜN"],
                 b: ["EN", "NE"] },
  { l: "DENİZ",  w: ["DENİZ", "DİZ", "DİN", "DEN", "İZ", "EZ"],
                 b: ["ZİNDE", "DİZE", "EN", "NE", "İN", "DE"] },
  { l: "YAĞMUR", w: ["YAĞMUR", "YAĞ", "MAY", "RAY", "YAR", "YUM"],
                 b: ["AĞ", "AY", "AR", "YA"] },
  { l: "ATLAS", w: ["ATLAS", "SAAT", "ALT", "SAT", "ALA", "TAS"],
    b: ["ASA", "ATA", "SAL", "AL", "AT"] },
  { l: "AYRIK", w: ["AYRIK", "AYRI", "AYI", "YAR", "KIR", "RAY", "ARI"],
    b: ["AKI", "IRK", "KAR", "AK", "AR", "AY", "YA"] },
  { l: "KALIN", w: ["KALIN", "AKIN", "KANI", "ALIN", "AKIL", "NAL", "KAN"],
    b: ["AKI", "KAL", "KIL", "AK", "AL"] },
  { l: "SAKLI", w: ["SAKLI", "AKIL", "ASIL", "KISA", "KIL", "SAL", "KIS"],
    b: ["AKI", "KAL", "KAS", "AK", "AL"] },
  { l: "SANAT", w: ["SANAT", "SANA", "SAAT", "SAT", "ANA", "ANT", "ATA"],
    b: ["ASA", "TAN", "TAS", "AT"] },
  { l: "TASMA", w: ["TASMA", "MASA", "SAAT", "TAM", "SAT", "ASA", "MAT"],
    b: ["AMA", "ATA", "TAS", "AT"] },
  { l: "ŞARKI", w: ["ŞARKI", "KAR", "AŞI", "AŞK", "KIR", "KAŞ", "AKI"],
    b: ["ARI", "IRK", "ŞIK", "AK", "AR"] },
  { l: "ALTIN", w: ["ALTIN", "ALIN", "ALTI", "ANIT", "ATLI", "TAN", "ALT"],
    b: ["ANT", "NAL", "AL", "AT"] },
  { l: "ASKER", w: ["ASKER", "KARE", "KAS", "SAR", "SER", "ERA", "ERK"],
    b: ["KAR", "KES", "AK", "AR", "EK"] },
  { l: "DAMLA", w: ["DAMLA", "ADAM", "DAL", "LAM", "ADA", "ALA", "AMA"],
    b: ["DAM", "MAL", "AL", "DA"] },
  { l: "KOLAY", w: ["KOLAY", "OLAY", "YOLA", "KOLA", "YOK", "KAL", "OYA"],
    b: ["KOL", "YOL", "AK", "AL", "AY", "OK", "OL", "OY", "YA"] },
  { l: "NOKTA", w: ["NOKTA", "NOTA", "ANT", "TON", "KAT", "TAN", "TAK"],
    b: ["KAN", "TOK", "AK", "AT", "OK", "ON", "OT"] },
  { l: "POSTA", w: ["POSTA", "POST", "POTA", "SAT", "PAT", "TAS", "PAS"],
    b: ["SAP", "TOP", "AT", "OT"] },
  { l: "ANLAM", w: ["ANLAM", "ALAN", "ANA", "AMA", "LAM", "ALA", "NAL"],
    b: ["MAL", "AL"] },
  { l: "ASLAN", w: ["ASLAN", "ALAN", "SANA", "ALA", "ANA", "ASA", "NAL"],
    b: ["SAL", "AL"] },
  { l: "AYRAN", w: ["AYRAN", "YARA", "AYNA", "YAN", "RAY", "ANA", "NAR"],
    b: ["YAR", "AR", "AY", "YA"] },
  { l: "DİLEK", w: ["DİLEK", "KEDİ", "DELİ", "DİL", "İLK", "İLE", "KEL"],
    b: ["KİL", "DE", "EK", "EL", "İL"] },
  { l: "HASTA", w: ["HASTA", "SAAT", "ASA", "HAS", "HAT", "TAS", "SAT"],
    b: ["ATA", "AH", "AT"] },
  { l: "KANAT", w: ["KANAT", "TAN", "TAK", "ATA", "KAT", "KAN", "ANT"],
    b: ["ANA", "AK", "AT"] },
  { l: "KENAR", w: ["KENAR", "RENK", "KARE", "ERA", "NAR", "KAN", "KAR"],
    b: ["ERK", "AK", "AR", "EK", "EN", "NE"] },
  { l: "LOKMA", w: ["LOKMA", "MOLA", "KOLA", "LAM", "KAL", "KAM", "MAL"],
    b: ["KOL", "AK", "AL", "OK", "OL"] },
  { l: "MASAL", w: ["MASAL", "MASA", "ASA", "LAM", "ALA", "MAL", "SAL"],
    b: ["AMA", "AL"] },
  { l: "SAKAL", w: ["SAKAL", "SALAK", "KASA", "KAS", "ALA", "SAL", "KAL"],
    b: ["ASA", "AK", "AL"] },
  { l: "SATIR", w: ["SATIR", "SIRA", "SARI", "ARI", "TAS", "SIR", "SAT"],
    b: ["SAR", "AR", "AT"] },
  { l: "TAKIM", w: ["TAKIM", "ATKI", "KAT", "KAM", "TAM", "AKI", "MAT"],
    b: ["TAK", "AK", "AT"] },
  { l: "TARAK", w: ["TARAK", "KARA", "ATAR", "ARKA", "ATA", "KAT", "TAK"],
    b: ["KAR", "AK", "AR", "AT"] },
  { l: "VAKİT", w: ["VAKİT", "ATİK", "AKİT", "AİT", "KİT", "KAT", "TAK"],
    b: ["TİK", "AK", "AT", "İT"] },
  { l: "YALAN", w: ["YALAN", "ALAN", "AYNA", "ALAY", "NAL", "ANA", "YAN"],
    b: ["ALA", "AL", "AY", "YA"] },
  { l: "YARIN", w: ["YARIN", "AYRI", "NAR", "YAN", "ARI", "YAR", "AYI"],
    b: ["RAY", "AR", "AY", "YA"] },
  { l: "YARIŞ", w: ["YARIŞ", "AYRI", "YAR", "YAŞ", "AŞI", "RAY", "AYI"],
    b: ["ARI", "AR", "AY", "YA"] },
  { l: "YAZAR", w: ["YAZAR", "AZAR", "YARA", "YAZ", "ARZ", "YAR", "ZAR"],
    b: ["RAY", "AR", "AY", "AZ", "YA"] },
  { l: "ADRES", w: ["ADRES", "DERS", "DAR", "DER", "SAR", "SER", "ERA"],
    b: ["AR", "DA", "DE"] },
  { l: "BAKIR", w: ["BAKIR", "IRK", "KAR", "BAR", "KIR", "ARI", "AKI"],
    b: ["AK", "AR"] },
  { l: "HAZIR", w: ["HAZIR", "AHIR", "ARI", "HIZ", "HAZ", "ARZ", "ZAR"],
    b: ["AH", "AR", "AZ"] },
  { l: "IRMAK", w: ["IRMAK", "KIR", "KAM", "IRK", "ARI", "AKI", "KAR"],
    b: ["AK", "AR"] },
  { l: "MAKAS", w: ["MAKAS", "MASA", "KASA", "KAS", "KAM", "AMA", "ASA"],
    b: ["AK"] },
  { l: "PAZAR", w: ["PAZAR", "PARA", "AZAR", "ARPA", "RAP", "ARZ", "ZAR"],
    b: ["AR", "AZ"] },
  { l: "SARAY", w: ["SARAY", "YARA", "ASA", "YAR", "YAS", "SAR", "RAY"],
    b: ["AR", "AY", "YA"] },
  { l: "TAVAN", w: ["TAVAN", "TAVA", "VANA", "ATA", "TAN", "ANA", "ANT"],
    b: ["AT"] },
  { l: "ÇELİK", w: ["ÇELİK", "ÇİLEK", "KEL", "ÇEK", "İLE", "KİL", "İLK"],
    b: ["EK", "EL", "İL"] },
  { l: "BALIK", w: ["BALIK", "AKIL", "KIL", "KAL", "AKI", "BAL"],
    b: ["AK", "AL"] },
  { l: "BANYO", w: ["BANYO", "ONAY", "YAN", "BOY", "BAN", "OYA"],
    b: ["AY", "ON", "OY", "YA"] },
  { l: "BASİT", w: ["BASİT", "TAS", "ASİ", "AİT", "BİT", "SAT"],
    b: ["AT", "İT"] },
  { l: "KASIM", w: ["KASIM", "KISA", "KAS", "KIS", "AKI", "KAM"],
    b: ["AK"] },
  { l: "KAŞIK", w: ["KAŞIK", "KAŞ", "ŞIK", "AKI", "AŞK", "AŞI"],
    b: ["AK"] },
  { l: "KEMAN", w: ["KEMAN", "MEKAN", "KEM", "KAN", "KAM", "NEM"],
    b: ["AK", "EK", "EN", "NE"] },
  { l: "KOPYA", w: ["KOPYA", "PAK", "PAY", "OYA", "YOK", "KAP"],
    b: ["AK", "AY", "OK", "OY", "YA"] },
  { l: "KUMAŞ", w: ["KUMAŞ", "AŞK", "KAŞ", "KUŞ", "KAM", "KUM"],
    b: ["AK"] },
  { l: "LAMBA", w: ["LAMBA", "MAL", "BAL", "AMA", "LAM", "ALA"],
    b: ["AL"] },
  { l: "RADYO", w: ["RADYO", "RAY", "OYA", "YAR", "ODA", "DAR"],
    b: ["AR", "AY", "DA", "OY", "YA"] },
  { l: "RAKAM", w: ["RAKAM", "KARA", "ARKA", "KAR", "KAM", "AMA"],
    b: ["AK", "AR"] },
  { l: "SAMAN", w: ["SAMAN", "SANA", "MASA", "AMA", "ASA", "ANA"],
    b: [] },
  { l: "SICAK", w: ["SICAK", "KISA", "KIS", "AKI", "SAC", "KAS"],
    b: ["AK"] },
  { l: "TABAN", w: ["TABAN", "ATA", "TAN", "BAN", "ANT", "ANA"],
    b: ["AT"] },
  { l: "TANIM", w: ["TANIM", "ANIT", "MAT", "TAM", "TAN", "ANT"],
    b: ["AT"] },
  { l: "TAVLA", w: ["TAVLA", "TAVA", "ALA", "LAV", "ALT", "ATA"],
    b: ["AL", "AT"] },
  { l: "TUZAK", w: ["TUZAK", "UZAK", "KAZ", "KAT", "TUZ", "TAK"],
    b: ["AK", "AT", "AZ", "UT", "UZ"] },
  { l: "YAVRU", w: ["YAVRU", "YUVA", "RAY", "VAR", "YAR", "VUR"],
    b: ["AR", "AY", "YA"] },
  { l: "YILAN", w: ["YILAN", "ALIN", "YAN", "NAL", "AYI", "YIL"],
    b: ["AL", "AY", "YA"] },
  { l: "KARTON", w: ["KARTON", "NOKTA", "ORTA", "NOTA", "ORAN", "NAR", "KOR"],
    b: ["ANT", "KAN", "KAR", "KAT", "TAK", "TAN", "TOK", "TON", "AK", "AR", "AT", "OK", "ON", "OT"] },
  { l: "TOPRAK", w: ["TOPRAK", "PAKT", "POTA", "ORTA", "PARK", "KAT", "TOP"],
    b: ["KAP", "KAR", "KOR", "PAK", "PAT", "RAP", "TAK", "TOK", "AK", "AR", "AT", "OK", "OT"] },
  { l: "YAPRAK", w: ["YAPRAK", "KARA", "AYAK", "YARA", "ARKA", "PARA", "PARK"],
    b: ["ARPA", "KAP", "KAR", "PAK", "PAY", "RAP", "RAY", "YAR", "AK", "AR", "AY", "YA"] },
  { l: "ASKERİ", w: ["ASKERİ", "ASKER", "KARE", "ESKİ", "KİRA", "KİR", "ASİ"],
    b: ["ERA", "ERK", "KAR", "KAS", "KES", "SAR", "SER", "AK", "AR", "EK"] },
  { l: "KARTAL", w: ["KARTAL", "TARAK", "TARLA", "ATAR", "ARKA", "KARA", "TAK"],
    b: ["ALA", "ALT", "ATA", "KAL", "KAR", "KAT", "AK", "AL", "AR", "AT"] },
  { l: "KATMAN", w: ["KATMAN", "KANAT", "TAN", "KAT", "AMA", "ATA", "MAT"],
    b: ["ANA", "ANT", "KAM", "KAN", "TAK", "TAM", "AK", "AT"] },
  { l: "TAKVİM", w: ["TAKVİM", "VAKİT", "AKİT", "ATİK", "MAVİ", "TİK", "KAT"],
    b: ["AİT", "KAM", "KİT", "MAT", "TAK", "TAM", "AK", "AT", "İT"] },
  { l: "TASARI", w: ["TASARI", "SATIR", "SARI", "SAAT", "SIRA", "ATAR", "SAT"],
    b: ["ARI", "ASA", "ATA", "SAR", "SIR", "TAS", "AR", "AT"] },
  { l: "YASTIK", w: ["YASTIK", "ATKI", "SAYI", "KISA", "KAS", "AYI", "TAS"],
    b: ["AKI", "KAT", "KIS", "SAT", "TAK", "YAS", "AK", "AT", "AY", "YA"] },
  { l: "İSKELE", w: ["İSKELE", "ESKİ", "LİSE", "LEKE", "KESE", "SEL", "İLK"],
    b: ["ELE", "KEL", "KES", "KİL", "İLE", "EK", "EL", "İL"] },
  { l: "KANTİN", w: ["KANTİN", "ATİK", "AKİT", "TAK", "KİT", "AİT", "TAN"],
    b: ["ANT", "KAN", "KAT", "TİK", "AK", "AT", "İN", "İT"] },
  { l: "KAPLAN", w: ["KAPLAN", "PLAN", "KALP", "ALAN", "ANA", "KAL", "KAN"],
    b: ["ALA", "KAP", "NAL", "PAK", "AK", "AL"] },
  { l: "SALATA", w: ["SALATA", "ATLAS", "SAAT", "TAS", "SAL", "ALT"],
    b: ["ALA", "ASA", "ATA", "SAT", "AL", "AT"] },
  { l: "BALKON", w: ["BALKON", "KOLA", "BANK", "KAN", "KOL", "BOL", "KAL"],
    b: ["BAL", "BAN", "NAL", "AK", "AL", "OK", "OL", "ON"] },
  { l: "FIRSAT", w: ["FIRSAT", "SATIR", "SIRA", "SARI", "ARI", "SIR", "RAF"],
    b: ["SAR", "SAT", "TAS", "AR", "AT"] },
  { l: "KARPUZ", w: ["KARPUZ", "UZAK", "PARK", "KAZ", "KAR", "KAP", "RAP"],
    b: ["ARZ", "PAK", "ZAR", "AK", "AR", "AZ", "UZ"] },
  { l: "KELİME", w: ["KELİME", "LİME", "EMEK", "LEKE", "KEL", "KİL", "İLK"],
    b: ["ELE", "KEM", "İLE", "EK", "EL", "İL"] },
  { l: "KURALI", w: ["KURALI", "KURAL", "AKIL", "KIR", "IRK", "AKI", "ARI"],
    b: ["KAL", "KAR", "KIL", "AK", "AL", "AR"] },
  { l: "MANTAR", w: ["MANTAR", "ATAR", "ATA", "TAM", "ANT", "TAN", "ANA"],
    b: ["AMA", "MAT", "NAR", "AR", "AT"] },
  { l: "TAVŞAN", w: ["TAVŞAN", "TAVAN", "TAVA", "VANA", "ANT", "TAN", "ŞAN"],
    b: ["ANA", "ATA", "TAŞ", "AT"] },
  { l: "BAYRAK", w: ["BAYRAK", "YARA", "AYAK", "ARKA", "KARA", "YAR", "BAR"],
    b: ["KAR", "RAY", "AK", "AR", "AY", "YA"] },
  { l: "KARDEŞ", w: ["KARDEŞ", "KARE", "DAR", "ERA", "KAŞ", "ERK", "KAR"],
    b: ["AŞK", "DER", "AK", "AR", "DA", "DE", "EK", "EŞ"] },
  { l: "SANDIK", w: ["SANDIK", "KADIN", "KISA", "AKIN", "KANI", "KAN", "KAS"],
    b: ["AKI", "KIS", "AK", "DA"] },
  { l: "YORGAN", w: ["YORGAN", "ONAY", "ORAN", "YAN", "RAY", "GAR", "YAR"],
    b: ["NAR", "OYA", "AR", "AY", "ON", "OY", "YA"] },
  { l: "BALİNA", w: ["BALİNA", "BİNA", "ALAN", "BAN", "BAL", "NAL", "ANA"],
    b: ["ALA", "AL", "İL", "İN"] },
  { l: "MAKİNE", w: ["MAKİNE", "MEKAN", "KEMAN", "EKİN", "KAM", "NEM", "KAN"],
    b: ["KEM", "AK", "EK", "EN", "NE", "İN"] },
  { l: "BARDAK", w: ["BARDAK", "KARA", "ARKA", "DAR", "BAR", "KAR", "ADA"],
    b: ["AK", "AR", "DA"] },
  { l: "HARİTA", w: ["HARİTA", "TARİH", "RAHAT", "ATAR", "ATA", "HAT", "AİT"],
    b: ["AH", "AR", "AT", "İT"] },
  { l: "MUTFAK", w: ["MUTFAK", "KAT", "TAM", "KUM", "MAT", "TAK", "KAM"],
    b: ["AK", "AT", "UT"] },
  { l: "TASVİR", w: ["TASVİR", "AİT", "SAT", "SAR", "ASİ", "VAR", "TAS"],
    b: ["AR", "AT", "İT"] },
  { l: "AKILLI", w: ["AKILLI", "AKIL", "KAL", "KIL", "LAL", "AKI"],
    b: ["AK", "AL"] },
  { l: "BOYAMA", w: ["BOYAMA", "YAMA", "OYA", "BOY", "AMA", "MAY"],
    b: ["AY", "OY", "YA"] },
  { l: "DAĞLIK", w: ["DAĞLIK", "AKIL", "KAL", "DAL", "AKI", "KIL"],
    b: ["AK", "AL", "AĞ", "DA"] },
  { l: "DEFTER", w: ["DEFTER", "DERT", "DERE", "DER", "RET", "TER"],
    b: ["DE", "ET"] },
  { l: "ELBİSE", w: ["ELBİSE", "LİSE", "ELE", "İLE", "SEL", "EBE"],
    b: ["EL", "İL"] },
  { l: "GÖZLÜK", w: ["GÖZLÜK", "GÜZ", "GÖZ", "GÜL", "GÖL", "ÖLÜ"],
    b: ["ÖZ"] }
];
/* KELİME ÜRETİCİ: "var LEVELS = [ ... ];" satırından HEMEN SONRA yapıştır.
   1) Geçersiz kelimeleri ve KURALI bölümünü siler.
   2) Aşağıdaki sözlükten otomatik yeni bölümler üretir.
   Daha çok bölüm için sadece SOZLUK'e TDK'da olan kelime ekle. */
(function () {
var YASAK = { YUM: 1, KIS: 1, YOLA: 1, VUR: 1 };
LEVELS = LEVELS.filter(function (L) { return L.l !== "KURALI"; });
LEVELS.forEach(function (L) {
  L.w = L.w.filter(function (x) { return !YASAK[x]; });
  L.b = L.b.filter(function (x) { return !YASAK[x]; });
});
var SOZLUK = "AL AT EL EN ET AK AY AŞ DA DE İL İN İP İT OK OL ON OT OY ÖN ÖZ SU UN UT UZ YA YE AH AĞ AR AZ EK İZ EZ " +
"ABA ACI ADA AĞA AĞI ALA ANA ARA ARI ASA ATA AYI BAL BAN BAR BAŞ BEL BEN BİN BİR BİT BOL BOY BUZ CAM CAN ÇAM ÇAY ÇEK DAĞ DAL DAM DAR DEL DER DİL DİN DİŞ DOL DUA DUL DUR ELE ERK FİL GAZ GEN GÖL GÖZ GÜL GÜN GÜZ HAL HAN HAS HAT HAZ HIZ İLE İLK KAL KAM KAN KAP KAR KAS KAT KEL KEM KİL KİP KİR KİT KOL KUM KUŞ MAL MAT MAY MOR MUM MUZ NAL NAR NEM NOT ODA OYA PAK PAS PAY PİL RAF RAY SAÇ SAĞ SAL SAN SAP SAR SAT SAY SEL SER SES SİL SIR TAK TAM TAN TAŞ TAT TEL TEN TER TİP TOP TOZ TUZ ULU VAR YAĞ YAN YAR YAŞ YAZ YEL YER YOK YOL ZAM ZAR ZİL ZOR " +
"ADAM ALAN ALAY ALIN ALTI ANIT ARKA ARPA ARZU ASIL ATKI AYAK AYNA AYRI BACA BANK BANT BİNA BOYA BURÇ ÇARK ÇATI DARI DEDE DERE DERİ DERT DERS DİZE DİZİ DOST EKİN ELMA ERİK ESKİ EVET GECE GEMİ GENÇ GERİ GÖÇ HALK HAVA İLAÇ İNCİ İNEK İSİM KAFA KALE KAPI KARA KASA KAYA KEDİ KESE KIRK KISA KİRA KOLA KURU KUZU LEKE LİSE MASA MAVİ MİDE NANE NOTA OLAY ONAY ORAN ORTA OYUN ÖDEV ÖĞLE PARA PARK PLAN POTA RENK SARI SAYI SOBA SORU SÜRE TARİH TAVA TOZ UZAK YASAK YEMİŞ ZAMAN " +
"ADRES AKIL AKIN AKİT ALIŞ ANLAM ARABA ASLAN ATLAS AYRAN BAKIR BALIK BALON BANKA BARIŞ BASIN BAYRAK BEYAZ BİLGİ BOYUN BULUT BÜYÜK ÇALAR ÇANTA ÇİÇEK DAMLA DENİZ DEFTER DERGİ DOKUZ DOLAP DUMAN DURAK DUVAR EKMEK ELBİSE ERKEK FIRÇA GÖMLEK GÜNEŞ GÜZEL HAKLI HAYAT HEDEF İKRAM İSTEK KADIN KALEM KANAT KAPAK KARAR KAYIK KAZAN KELİME KENAR KİTAP KOKU KONAK KORKU KUMAŞ KUYRUK LAMBA LİMON MAKAS MANTAR MASAL MEKAN MERAK MERKEZ MEYVE MUTLU NAKIŞ NEHİR NOKTA ODUN ORMAN ÖRDEK PAZAR PEYNİR PİLAV RESİM SABAH SALON SAMAN SANAT SARAY SATIR SEBZE SELAM SEVGİ SINIF SİYAH SOKAK SÜRAT TABAK TAKIM TARAK TATLI TAVAN TAVLA TEMİZ TOPRAK TUZAK UYKU YAKIN YALAN YAPRAK YARIN YAZAR YILAN YOLCU YUMURTA ZEMİN KALKAN KARTAL KAPLAN KARPUZ KİRAZ KELEBEK KALEMLİK DAĞLIK KAŞIK TAKVİM BAKLAVA SAKAL SALATA PANTOLON KAVUN KİLİM KALIP KALAS TEPE TEPSİ";
var D = SOZLUK.split(/\s+/).filter(function (x, i, a) { return x && a.indexOf(x) === i && !YASAK[x]; });
function sayac(s) { var m = {}; for (var i = 0; i < s.length; i++) m[s[i]] = (m[s[i]] || 0) + 1; return m; }
function sigar(w, m) { var c = {}; for (var i = 0; i < w.length; i++) { var h = w[i]; c[h] = (c[h] || 0) + 1; if (c[h] > (m[h] || 0)) return false; } return true; }
var var_ = {};
LEVELS.forEach(function (L) { var_[L.l] = 1; });
D.forEach(function (r) {
  if (r.length < 5 || r.length > 7 || var_[r]) return;
  var m = sayac(r), alt = D.filter(function (w) { return w !== r && sigar(w, m); });
  var ana = alt.filter(function (w) { return w.length >= 3; })
    .sort(function (a, b) { return b.length - a.length || (a < b ? -1 : 1); }).slice(0, 6);
  if (ana.length < 4) return;
  LEVELS.push({ l: r, w: [r].concat(ana), b: alt.filter(function (w) { return ana.indexOf(w) < 0; }) });
  var_[r] = 1;
});
})();

var ANA_PUAN = 10, BONUS_PUAN = 15; // harf başına puan
var MAVI = "#1f55b8";
var HAK_IPUCU = 7, HAK_TOKMAK = 5; // başlangıç hakları: ampül 7, tokmak 5
var HAK_SURUM = "2"; // başlangıç hakları değişince artır: kayıtlı eski haklar da yeni değere çekilir

// LAYOUT-BEGIN
// Kelimeleri çapraz bulmaca gibi yerleştirir. d: 0 yatay, 1 dikey
function makeLayout(words) {
  var best = null;
  for (var t = 0; t < 80; t++) {
    var keyed = words.map(function (w) { return { w: w, k: w.length + Math.random() * 2.5 }; });
    keyed.sort(function (a, b) { return b.k - a.k; });
    var order = keyed.map(function (x) { return x.w; });
    var li = 0;
    for (var q = 1; q < order.length; q++) if (order[q].length > order[li].length) li = q;
    var first = order.splice(li, 1)[0];
    order.unshift(first);

    var grid = {}, dirs = {}, placed = [], un = [];
    var put = function (w, r, c, d) {
      for (var i = 0; i < w.length; i++) {
        var k = (r + (d ? i : 0)) + "," + (c + (d ? 0 : i));
        grid[k] = w[i];
        dirs[k] = (dirs[k] || 0) | (d ? 2 : 1);
      }
      placed.push({ w: w, r: r, c: c, d: d });
    };
    var ok = function (w, r, c, d) {
      var dr = d ? 1 : 0, dc = d ? 0 : 1, n = w.length, cross = 0;
      if (grid[(r - dr) + "," + (c - dc)] !== undefined) return false;
      if (grid[(r + dr * n) + "," + (c + dc * n)] !== undefined) return false;
      for (var i = 0; i < n; i++) {
        var rr = r + dr * i, cc = c + dc * i, k = rr + "," + cc, g = grid[k];
        if (g !== undefined) {
          if (g !== w[i]) return false;
          if (dirs[k] & (d ? 2 : 1)) return false;
          cross++;
        } else if (grid[(rr + dc) + "," + (cc + dr)] !== undefined || grid[(rr - dc) + "," + (cc - dr)] !== undefined) {
          return false;
        }
      }
      return cross >= 1 && cross < n;
    };

    put(order[0], 0, 0, 0);
    for (var k = 1; k < order.length; k++) {
      var w = order[k], cands = [];
      Object.keys(grid).forEach(function (key) {
        var p = key.split(","), r = +p[0], c = +p[1];
        for (var j = 0; j < w.length; j++) {
          if (w[j] !== grid[key]) continue;
          for (var d = 0; d < 2; d++) {
            var rr = r - (d ? j : 0), cc = c - (d ? 0 : j);
            if (ok(w, rr, cc, d)) cands.push([rr, cc, d]);
          }
        }
      });
      if (!cands.length) un.push(w);
      else { var pk = cands[Math.floor(Math.random() * cands.length)]; put(w, pk[0], pk[1], pk[2]); }
    }

    var minr = 1e9, minc = 1e9, maxr = -1e9, maxc = -1e9;
    placed.forEach(function (p) {
      var er = p.r + (p.d ? p.w.length - 1 : 0), ec = p.c + (p.d ? 0 : p.w.length - 1);
      minr = Math.min(minr, p.r); minc = Math.min(minc, p.c);
      maxr = Math.max(maxr, er); maxc = Math.max(maxc, ec);
    });
    var rows = maxr - minr + 1, cols = maxc - minc + 1;
    var score = placed.length * 1000 - rows * cols - (cols > 7 ? (cols - 7) * 40 : 0) - (rows > 9 ? (rows - 9) * 40 : 0);
    if (!best || score > best.score) best = { score: score, placed: placed, un: un, rows: rows, cols: cols, minr: minr, minc: minc };
  }
  best.placed.forEach(function (p) { p.r -= best.minr; p.c -= best.minc; });
  return { words: best.placed, un: best.un, rows: best.rows, cols: best.cols };
}
// LAYOUT-END

var css = document.createElement("style");
css.textContent =
"#cm{position:fixed;top:0;left:0;right:0;bottom:0;height:100dvh;color:#fff;color-scheme:dark;z-index:9999;display:none;flex-direction:column;align-items:center;font-family:inherit;overflow:hidden;box-sizing:border-box;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);-webkit-user-select:none;user-select:none}" +
"#cm .cm-top{width:100%;display:flex;align-items:center;gap:8px;padding:0;box-sizing:border-box;flex:none}" +
"#cm button.cm-sm{width:100%;background:transparent!important;background-image:none!important;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.7);border:0!important;border-radius:0;padding:0;height:var(--bas-yuk);line-height:var(--bas-yuk);font-family:inherit;font-size:var(--bas-yazi);font-weight:800;letter-spacing:.3px;text-align:center;white-space:nowrap}" +
"#cm .cm-pill{background:rgba(10,24,64,.72);border:2px solid rgba(255,255,255,.35);border-radius:999px;padding:6px 14px;font-size:16px;font-weight:700}" +
"#cm .cm-gridbox{flex:1;width:100%;min-height:0;display:flex;align-items:center;justify-content:center;padding:6px 12px;box-sizing:border-box}" +
"#cm .cm-gridin{position:relative}" +
"#cm .cm-cell{position:absolute;display:flex;align-items:center;justify-content:center;border-radius:20%;background:rgba(255,255,255,.78);color:#fff;font-weight:800;box-sizing:border-box;box-shadow:0 2px 0 rgba(0,40,120,.25)}" +
"#cm .cm-cell.cm-on{background:#1e56c0}" +
"#cm .cm-cell.cm-hint{color:#1e56c0}" +
"#cm .cm-hm .cm-cell:not(.cm-on):not(.cm-hint){outline:3px solid #ffb300;outline-offset:-3px}" +
"#cm .cm-bonus{width:100%;box-sizing:border-box;padding:2px 14px;text-align:center;flex:none;max-height:64px;overflow:auto}" +
"#cm .cm-bonus .cm-bt{display:inline-block;font-size:13px;color:#fff;background:rgba(10,24,64,.6);border-radius:999px;padding:2px 10px;margin-bottom:3px}" +
"#cm .cm-chip{display:inline-block;background:#fff6d6;color:#8a5a00;border:1px solid #f2c14e;border-radius:10px;padding:1px 8px;margin:2px 3px;font-size:13px;font-weight:700}" +
"#cm .cm-cur{height:42px;margin:6px 0 8px;flex:none;display:flex;align-items:center;justify-content:center}" +
"#cm .cm-curp{display:inline-block;background:" + MAVI + ";color:#fff;font-weight:800;font-size:24px;letter-spacing:3px;padding:4px 22px;border-radius:999px;box-shadow:0 2px 6px rgba(0,0,0,.3)}" +
"#cm .cm-curp.ok{background:#1fa63a}#cm .cm-curp.bonus{background:#e0892b}#cm .cm-curp.bad{background:#c0392b}#cm .cm-curp.info{background:#5a6a8a}" +
"#cm .cm-wrap{position:relative;width:100%;display:flex;justify-content:center;flex:none;margin-bottom:18px}" +
"#cm .cm-wheel{position:relative;border-radius:50%;background:rgba(255,255,255,.88);box-shadow:0 4px 18px rgba(0,0,0,.3);touch-action:none}" +
"#cm .cm-wheel svg{position:absolute;left:0;top:0;pointer-events:none}" +
"#cm .cm-let{position:absolute;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:800;color:#111;pointer-events:none;transform:translate(-50%,-50%)}" +
"#cm .cm-let.cm-sel{background:" + MAVI + ";color:#fff}" +
"#cm button.cm-shuf{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:transparent;border:0;padding:0;display:flex;align-items:center;justify-content:center}" +
"#cm button.cm-tool{position:absolute;top:4px;width:54px;height:54px;border-radius:50%;background:#3a3f48;border:3px solid rgba(255,255,255,.55);font-size:26px;line-height:1;padding:0;box-shadow:0 3px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;overflow:visible}" +
"#cm button.cm-tool.cm-act{border-color:#ffb300;background:#6b4a00}" +
"#cm button.cm-bulb{right:14px}" +
"#cm button.cm-ham{left:14px}" +
"#cm .cm-score{position:absolute;left:14px;bottom:0}" +
"#cm .cm-banner{position:absolute;top:28%;left:50%;transform:translate(-50%,-50%);background:rgba(10,24,64,.82);color:#fff;font-size:34px;font-weight:800;padding:10px 30px;border-radius:999px;opacity:0;transition:opacity .3s;pointer-events:none;z-index:5;white-space:nowrap}" +
"#cm .cm-banner.show{opacity:1}" +
"#cm .cm-badge{position:absolute;top:-6px;right:-6px;min-width:22px;height:22px;border-radius:11px;background:#e53935;color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-sizing:border-box;padding:0 4px;font-family:inherit}" +
"#cm .cm-badge.zero{background:#2e9e4a}" +
"#cm button.cm-ekstra{position:absolute;right:14px;bottom:0;width:54px;height:54px;border-radius:50%;background:#3a3f48;border:3px solid rgba(255,255,255,.55);padding:0;box-shadow:0 3px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;overflow:visible}" +
"#cm .cm-ov{position:absolute;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;z-index:20}" +
"#cm .cm-ov.show{display:flex}" +
"#cm .cm-dlg{width:min(92%,420px);background:linear-gradient(#fdf3d8,#fbeabc);border:2px solid #e3c04a;border-radius:20px;padding:18px 16px 16px;box-sizing:border-box;position:relative;color:#5a3a12;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.5)}" +
"#cm .cm-dlg h3{margin:4px 0 14px;font-size:24px;font-weight:800;color:#5a3a12;letter-spacing:.3px}" +
"#cm button.cm-dx{position:absolute;right:8px;top:6px;background:transparent;border:0;color:#9a8a70;font-size:28px;line-height:1;padding:4px 10px}" +
"#cm .cm-box{border:2px solid #e3c04a;border-radius:14px;overflow:hidden;background:#faecc0}" +
"#cm .cm-box .cm-bh{background:#f3de7a;color:#5a3a12;font-weight:800;font-size:15px;padding:6px 8px}" +
"#cm .cm-box .cm-bl{min-height:150px;max-height:40vh;overflow:auto;padding:8px;display:flex;flex-wrap:wrap;gap:4px;align-content:flex-start;justify-content:center}" +
"#cm .cm-prog{margin-top:14px;height:30px;border-radius:15px;background:#bdb88a;position:relative;overflow:hidden}" +
"#cm .cm-prog i{position:absolute;left:0;top:0;bottom:0;background:#e0892b;border-radius:15px;width:0}" +
"#cm .cm-prog b{position:absolute;left:0;right:0;top:0;line-height:30px;color:#fff;font-weight:800;font-size:17px;text-shadow:0 1px 3px rgba(0,0,0,.4)}";
document.head.appendChild(css);

var root = document.createElement("div");
root.id = "cm";
root.innerHTML =
  '<div class="cm-top"><button class="cm-sm" id="cmBack">' + (document.querySelector("h1") ? document.querySelector("h1").textContent : "") + '</button></div><div class="cm-banner" id="cmBanner"></div>' +
  '<div class="cm-gridbox" id="cmGrid"></div><div class="cm-bonus" id="cmBonus"></div>' +
  '<div class="cm-cur" id="cmCur"></div>' +
  '<div class="cm-wrap"><div class="cm-wheel" id="cmWheel"><svg id="cmSvg"></svg>' +
  '<button class="cm-shuf" id="cmShuf" aria-label="Karıştır"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#9aa3b4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h3c4 0 5 10 9 10h5"/><path d="M3 17h3c1.6 0 2.7-1.4 3.7-3"/><path d="M13.3 10C14.3 8.4 15.4 7 17 7h3"/><path d="M17 4l3 3-3 3"/><path d="M17 14l3 3-3 3"/></svg></button></div>' +
  '<button class="cm-tool cm-ham" id="cmHam" aria-label="Tokmak">🔨<span class="cm-badge" id="cmHamN"></span></button>' +
  '<button class="cm-tool cm-bulb" id="cmHint" aria-label="İpucu">💡<span class="cm-badge" id="cmHintN"></span></button>' +
  '<button class="cm-ekstra" id="cmEks" aria-label="Ekstra kelimeler"><svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="17" width="22" height="11" rx="2" fill="#e8b865"/><g transform="rotate(-8 16 12)"><rect x="10" y="4" width="13" height="15" rx="2.5" fill="#fff"/><text x="16.5" y="15.5" text-anchor="middle" font-size="10" font-weight="800" fill="#6a4a1a" font-family="sans-serif">A</text></g></svg><span class="cm-badge zero" id="cmEksN">0</span></button>' +
  '<div class="cm-pill cm-score" id="cmPuan"></div>' +
  '<div class="cm-ov" id="cmOv"><div class="cm-dlg"><button class="cm-dx" id="cmOvX" aria-label="Kapat">✕</button><h3>EKSTRA KELİMELER</h3><div class="cm-box"><div class="cm-bh">Bulmacada olmayan kelimeler</div><div class="cm-bl" id="cmOvL"></div></div><div class="cm-prog"><i id="cmOvB"></i><b id="cmOvT"></b></div></div></div></div>';
document.body.appendChild(root);

var $ = function (id) { return document.getElementById(id); };
var lvIdx = 0, found = {}, foundB = {}, hintCells = {}, letters = [], sel = [], drag = false, puan = 0;
var cur = null, bonusList = [], placedMap = {}, S = 260, D = 54, ptr = null, flashT = null;
// Arka plan sahneleri: her bölümde sırayla değişir (dışarıdan resim gerekmez)
function RND(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
function svgSar(ic) { return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 800' preserveAspectRatio='xMidYMid slice'>" + ic + "</svg>"; }
function agac(x, y, s, c) { return `<g transform='translate(${x} ${y}) scale(${s})' fill='${c}'><path d='M0 -70 L16 -34 L8 -34 L22 -4 L10 -4 L26 28 L-26 28 L-10 -4 L-22 -4 L-8 -34 L-16 -34Z'/><rect x='-3' y='28' width='6' height='10'/></g>`; }
function geyik(x, y, s, c) { return `<g transform='translate(${x} ${y}) scale(${s})' fill='${c}' stroke='${c}'><ellipse cx='0' cy='0' rx='22' ry='10' stroke='none'/><path d='M14 -4 L24 -22 L30 -20 L22 2Z' stroke='none'/><ellipse cx='31' cy='-23' rx='7' ry='4' transform='rotate(25 31 -23)' stroke='none'/><path d='M30 -27 l-4 -14 m4 14 l5 -15 m-9 5 l-7 -2 m12 -4 l6 -3' fill='none' stroke-width='1.6'/><rect x='-18' y='6' width='3' height='22' stroke='none'/><rect x='-11' y='6' width='3' height='22' stroke='none'/><rect x='12' y='6' width='3' height='22' stroke='none'/><rect x='18' y='6' width='3' height='22' stroke='none'/><path d='M-22 -3 l-6 -4' fill='none' stroke-width='3'/></g>`; }
function zurafa(x, y, s, c) { return `<g transform='translate(${x} ${y}) scale(${s})' fill='${c}' stroke='${c}'><ellipse cx='0' cy='0' rx='20' ry='9' stroke='none'/><path d='M12 -4 L28 -52 L35 -50 L24 2Z' stroke='none'/><ellipse cx='38' cy='-54' rx='8' ry='4.5' transform='rotate(20 38 -54)' stroke='none'/><path d='M34 -58 l-2 -7 m7 8 l2 -7' fill='none' stroke-width='1.8'/><rect x='-16' y='6' width='3' height='34' stroke='none'/><rect x='-9' y='6' width='3' height='34' stroke='none'/><rect x='9' y='6' width='3' height='34' stroke='none'/><rect x='16' y='6' width='3' height='34' stroke='none'/><path d='M-20 -2 q-6 8 -4 20' fill='none' stroke-width='1.6'/></g>`; }
function fil(x, y, s, c) { return `<g transform='translate(${x} ${y}) scale(${s})' fill='${c}' stroke='${c}'><ellipse cx='0' cy='0' rx='30' ry='20' stroke='none'/><circle cx='34' cy='-6' r='14' stroke='none'/><path d='M44 -2 q12 10 5 28 q-2 4 -5 2 q4 -14 -8 -22Z' stroke='none'/><ellipse cx='26' cy='-6' rx='9' ry='13' stroke='none'/><rect x='-24' y='12' width='8' height='20' stroke='none'/><rect x='-10' y='12' width='8' height='20' stroke='none'/><rect x='8' y='12' width='8' height='20' stroke='none'/><rect x='20' y='12' width='8' height='20' stroke='none'/><path d='M-30 -4 q-6 10 -3 22' fill='none' stroke-width='2'/></g>`; }
function deve(x, y, s, c) { return `<g transform='translate(${x} ${y}) scale(${s})' fill='${c}' stroke='${c}'><ellipse cx='0' cy='0' rx='24' ry='9' stroke='none'/><ellipse cx='-8' cy='-12' rx='8' ry='9' stroke='none'/><ellipse cx='8' cy='-12' rx='8' ry='9' stroke='none'/><path d='M20 -4 L30 -30 L35 -28 L28 2Z' stroke='none'/><ellipse cx='38' cy='-31' rx='8' ry='4' transform='rotate(15 38 -31)' stroke='none'/><rect x='-20' y='6' width='3' height='28' stroke='none'/><rect x='-12' y='6' width='3' height='28' stroke='none'/><rect x='10' y='6' width='3' height='28' stroke='none'/><rect x='18' y='6' width='3' height='28' stroke='none'/></g>`; }
function yunus(x, y, s, c, r) { return `<g transform='translate(${x} ${y}) rotate(${r}) scale(${s})' fill='${c}'><path d='M0 0 Q20 -30 55 -22 Q70 -18 80 -28 L74 -12 Q82 -10 90 -2 Q76 -8 64 -4 Q30 8 0 0Z'/><path d='M34 -22 L42 -36 L46 -20Z'/></g>`; }
function kus(x, y, s, c) { return `<path transform='translate(${x} ${y}) scale(${s})' d='M0 0 q6 -9 12 0 q6 -9 12 0' fill='none' stroke='${c}' stroke-width='1.8' stroke-linecap='round'/>`; }
function kelebek(x, y, s, a, b) { return `<g transform='translate(${x} ${y}) scale(${s})'><ellipse cx='-6' cy='-4' rx='6' ry='8' transform='rotate(-30 -6 -4)' fill='${a}'/><ellipse cx='6' cy='-4' rx='6' ry='8' transform='rotate(30 6 -4)' fill='${a}'/><ellipse cx='-4' cy='5' rx='4' ry='5' transform='rotate(20 -4 5)' fill='${b}'/><ellipse cx='4' cy='5' rx='4' ry='5' transform='rotate(-20 4 5)' fill='${b}'/><rect x='-0.8' y='-6' width='1.6' height='14' fill='#222'/></g>`; }
function yildizlar(n, ymax, seed) { var r = RND(seed), h = ""; for (var i = 0; i < n; i++) h += `<circle cx='${(r() * 400).toFixed(0)}' cy='${(r() * ymax).toFixed(0)}' r='${(0.5 + r() * 1.1).toFixed(1)}' fill='#fff' opacity='${(0.4 + r() * 0.6).toFixed(2)}'/>`; return h; }

var SAHNELER = [
// 1) Dağ gölü, gün doğumu, geyik
function () { return svgSar(`<defs><linearGradient id='a' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3b4a9c'/><stop offset='.35' stop-color='#b0689e'/><stop offset='.55' stop-color='#ffa88a'/><stop offset='.66' stop-color='#ffe0a0'/></linearGradient><linearGradient id='b' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#ffc890'/><stop offset='.4' stop-color='#6a7fc4'/><stop offset='1' stop-color='#1f2f6a'/></linearGradient></defs><rect width='400' height='800' fill='url(#a)'/>` + yildizlar(25, 200, 5) + `<circle cx='200' cy='430' r='80' fill='#fff2c4' opacity='.25'/><circle cx='200' cy='430' r='42' fill='#fff6d6'/><path d='M0 470 L60 400 L110 450 L170 380 L230 450 L290 395 L340 440 L400 400 L400 540 L0 540Z' fill='#8a78b4'/><path d='M0 500 L50 450 L100 490 L160 440 L240 500 L300 455 L360 495 L400 470 L400 540 L0 540Z' fill='#5a5c9a'/><rect y='520' width='400' height='280' fill='url(#b)'/><g fill='#ffe9b0' opacity='.55'><rect x='170' y='528' width='60' height='4' rx='2'/><rect x='180' y='540' width='40' height='3' rx='2'/><rect x='188' y='551' width='24' height='3' rx='2'/></g><path d='M0 540 Q100 515 200 535 T400 525 L400 580 Q300 560 200 575 T0 585Z' fill='#243a52'/>` + agac(30, 520, 1.5, '#16313a') + agac(75, 535, 1.1, '#1b3d3f') + agac(360, 515, 1.7, '#16313a') + agac(320, 535, 1.2, '#1b3d3f') + geyik(235, 548, 0.9, '#10222c') + kus(60, 330, 1, '#2a2a4a') + kus(100, 350, 0.8, '#2a2a4a') + kus(300, 300, 1.1, '#2a2a4a') + kus(335, 322, .7, '#2a2a4a')); },
// 2) Savan günbatımı: zürafa, fil
function () { return svgSar(`<defs><linearGradient id='a' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#4a2a72'/><stop offset='.3' stop-color='#d0466e'/><stop offset='.52' stop-color='#ff8f3a'/><stop offset='.66' stop-color='#ffd36a'/></linearGradient><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#8a4a22'/><stop offset='1' stop-color='#2a1618'/></linearGradient></defs><rect width='400' height='800' fill='url(#a)'/><circle cx='270' cy='455' r='90' fill='#ffd88a' opacity='.25'/><circle cx='270' cy='455' r='56' fill='#ffe59a'/><g fill='#fff' opacity='.28'><ellipse cx='90' cy='300' rx='70' ry='10'/><ellipse cx='140' cy='286' rx='45' ry='8'/><ellipse cx='320' cy='360' rx='60' ry='9'/></g><path d='M0 520 Q100 505 200 520 T400 515 L400 800 L0 800Z' fill='url(#g)'/><g fill='#1c1020'><path d='M70 470 q-2 -34 -8 -48 l5 -1 q4 14 5 30 q4 -18 12 -30 l5 2 q-8 14 -10 32Z'/><ellipse cx='72' cy='418' rx='46' ry='9'/><ellipse cx='50' cy='424' rx='28' ry='7'/><path d='M330 478 l1 -40 l5 0 l1 36 q6 -14 14 -26 l4 3 q-10 14 -12 32Z'/><ellipse cx='338' cy='432' rx='44' ry='9'/><ellipse cx='360' cy='437' rx='26' ry='7'/></g>` + zurafa(150, 505, 1.15, '#1c1020') + fil(250, 512, 0.95, '#1c1020') + zurafa(335, 510, 0.8, '#1c1020') + kus(40, 330, 1.1, '#2a1230') + kus(80, 350, .8, '#2a1230') + kus(210, 280, 1, '#2a1230') + kus(240, 300, .7, '#2a1230')); },
// 3) Okyanus, gün batımı, yunuslar
function () { var r = RND(11), d = ""; for (var i = 0; i < 26; i++) d += `<rect x='${(r() * 380).toFixed(0)}' y='${(525 + r() * 240).toFixed(0)}' width='${(18 + r() * 40).toFixed(0)}' height='2' rx='1' fill='#fff' opacity='${(0.15 + r() * 0.3).toFixed(2)}'/>`; return svgSar(`<defs><linearGradient id='a' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#232f78'/><stop offset='.32' stop-color='#a0509a'/><stop offset='.52' stop-color='#ff9a7a'/><stop offset='.64' stop-color='#ffd09a'/></linearGradient><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#f6a27a'/><stop offset='.25' stop-color='#6a68b4'/><stop offset='1' stop-color='#0f2a5a'/></linearGradient></defs><rect width='400' height='800' fill='url(#a)'/>` + yildizlar(25, 180, 9) + `<circle cx='140' cy='505' r='70' fill='#ffe0a0' opacity='.3'/><circle cx='140' cy='505' r='38' fill='#fff0c0'/><g fill='#fff' opacity='.3'><ellipse cx='300' cy='330' rx='70' ry='10'/><ellipse cx='260' cy='318' rx='40' ry='7'/></g><rect y='505' width='400' height='295' fill='url(#s)'/><rect x='110' y='510' width='60' height='3' fill='#fff2c4' opacity='.7'/><rect x='118' y='520' width='44' height='3' fill='#fff2c4' opacity='.6'/>` + d + yunus(215, 470, 0.8, '#102446', -8) + yunus(120, 560, 0.55, '#0e2040', -20) + `<path d='M0 640 Q100 625 200 640 T400 630' fill='none' stroke='#fff' stroke-width='2' opacity='.18'/>` + kus(60, 360, 1.1, '#2a2a5a') + kus(100, 378, .8, '#2a2a5a') + kus(320, 420, 1, '#2a2a5a')); },
// 4) Çiçekli çayır, kelebekler
function () { var r = RND(21), f = "", cl = ["#ff5d8f", "#ffd23f", "#ffffff", "#ff8a3c", "#b86bff", "#ff6b6b"]; for (var i = 0; i < 90; i++) { var y = 500 + r() * 290, s = 2 + (y - 500) / 290 * 5; f += `<circle cx='${(r() * 400).toFixed(0)}' cy='${y.toFixed(0)}' r='${s.toFixed(1)}' fill='${cl[Math.floor(r() * cl.length)]}'/>`; } return svgSar(`<defs><linearGradient id='a' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2f8fe8'/><stop offset='.5' stop-color='#8fd0ff'/><stop offset='.66' stop-color='#e6f6ff'/></linearGradient></defs><rect width='400' height='800' fill='url(#a)'/><circle cx='320' cy='120' r='36' fill='#fff7c8'/><circle cx='320' cy='120' r='60' fill='#fff7c8' opacity='.25'/><g fill='#fff' opacity='.9'><ellipse cx='90' cy='220' rx='60' ry='18'/><ellipse cx='125' cy='204' rx='38' ry='16'/><ellipse cx='260' cy='330' rx='55' ry='16'/><ellipse cx='290' cy='316' rx='34' ry='14'/></g><path d='M0 480 Q100 430 220 470 T400 450 L400 800 L0 800Z' fill='#7cc86a'/><path d='M0 520 Q120 480 250 515 T400 500 L400 800 L0 800Z' fill='#55b04e'/><path d='M0 580 Q100 545 220 575 T400 565 L400 800 L0 800Z' fill='#3f9a3f'/>` + agac(50, 475, 1.2, '#2c7a3a') + agac(350, 462, 1.4, '#2c7a3a') + f + kelebek(120, 440, 1.4, '#ff7a3c', '#ffd23f') + kelebek(260, 395, 1.1, '#b86bff', '#ff9fd0') + kelebek(330, 520, 1.3, '#ffd23f', '#ff7a3c') + kus(60, 150, 1.2, '#35506a') + kus(110, 170, .9, '#35506a')); },
// 5) Karlı dağlar, kuzey ışıkları, geyik
function () { return svgSar(`<defs><linearGradient id='a' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#040a22'/><stop offset='.45' stop-color='#0c2a4c'/><stop offset='.66' stop-color='#1c5068'/></linearGradient><linearGradient id='u' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3cffb0' stop-opacity='0'/><stop offset='.5' stop-color='#3cffb0' stop-opacity='.55'/><stop offset='1' stop-color='#8a5cff' stop-opacity='0'/></linearGradient></defs><rect width='400' height='800' fill='url(#a)'/>` + yildizlar(110, 420, 3) + `<path d='M-20 260 Q80 120 190 230 T420 150 L420 330 Q300 250 190 340 T-20 340Z' fill='url(#u)'/><path d='M-20 330 Q100 220 220 300 T420 260 L420 400 Q300 330 200 410 T-20 410Z' fill='url(#u)' opacity='.6'/><circle cx='320' cy='110' r='34' fill='#f5f1d8' opacity='.2'/><circle cx='320' cy='110' r='22' fill='#f5f1d8'/><path d='M0 520 L70 430 L130 490 L210 390 L290 490 L350 440 L400 500 L400 560 L0 560Z' fill='#b8cae6'/><path d='M210 390 L170 450 L215 430 L240 470 L290 490Z' fill='#8aa3cc'/><path d='M70 430 L40 480 L80 470 L100 500 L130 490Z' fill='#8aa3cc'/><path d='M0 535 Q100 515 220 540 T400 530 L400 800 L0 800Z' fill='#e6eefa'/><path d='M0 590 Q120 570 240 592 T400 585 L400 800 L0 800Z' fill='#cfdcf0'/>` + agac(35, 548, 1.5, '#0f2a2e') + agac(80, 560, 1.1, '#0f3236') + agac(365, 545, 1.6, '#0f2a2e') + agac(320, 560, 1.2, '#0f3236') + geyik(225, 575, 0.95, '#0b1a2a')); },
// 6) Çöl alacakaranlığı, develer
function () { return svgSar(`<defs><linearGradient id='a' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#17235c'/><stop offset='.38' stop-color='#7a449a'/><stop offset='.56' stop-color='#ff7e5a'/><stop offset='.68' stop-color='#ffc27a'/></linearGradient><mask id='m'><rect width='400' height='800' fill='#fff'/><circle cx='88' cy='140' r='22' fill='#000'/></mask></defs><rect width='400' height='800' fill='url(#a)'/>` + yildizlar(60, 330, 7) + `<circle cx='76' cy='146' r='22' fill='#fff4c8' mask='url(#m)'/><path d='M0 500 Q90 450 200 495 T400 470 L400 800 L0 800Z' fill='#d4713e'/><path d='M0 540 Q120 500 250 535 T400 520 L400 800 L0 800Z' fill='#b25234'/><path d='M0 600 Q100 565 230 595 T400 585 L400 800 L0 800Z' fill='#7a3a34'/>` + deve(110, 520, 0.9, '#2a1420') + deve(185, 527, 0.9, '#2a1420') + deve(260, 520, 0.9, '#2a1420') + `<path d='M0 520 Q90 500 160 515' fill='none' stroke='#ffd9a0' stroke-width='1.5' opacity='.3'/>` + kus(300, 260, 1, '#3a1f4a') + kus(335, 282, .7, '#3a1f4a')); }
];
var sahneIdx = -1, sahneOnb = {};
function arkaYaz() {
  var i = lvIdx % SAHNELER.length;
  if (i === sahneIdx) return;
  sahneIdx = i;
  if (!sahneOnb[i]) sahneOnb[i] = encodeURIComponent(SAHNELER[i]());
  root.style.background = 'url("data:image/svg+xml,' + sahneOnb[i] + '") center/cover no-repeat, #2a6fd0';
}

// Üst yazı çubuğu şeffaf: sahne arka planı görünür. Tarayıcı üst rengi (theme-color) sahnenin üst rengine eşitlenir.
var TEMA = ["#3b4a9c", "#4a2a72", "#232f78", "#2f8fe8", "#040a22", "#17235c"];
var eskiTema = null;
function temaMeta() {
  var m = document.querySelector('meta[name="theme-color"]');
  if (!m) { m = document.createElement("meta"); m.name = "theme-color"; document.head.appendChild(m); }
  return m;
}
function barRenk() {
  try {
    var bar = $("cmBack");
    bar.removeAttribute("style"); // eski inline arka planı temizle
    var m = temaMeta();
    if (eskiTema === null) eskiTema = m.getAttribute("content") || "";
    m.setAttribute("content", TEMA[lvIdx % TEMA.length]);
  } catch (e) {}
}
function temaGeri() {
  try {
    if (eskiTema !== null) { temaMeta().setAttribute("content", eskiTema); eskiTema = null; }
  } catch (e) {}
}

var hakIpucu = HAK_IPUCU, hakTokmak = HAK_TOKMAK, hammerOn = false;
try { lvIdx = Math.min(parseInt(localStorage.getItem("cemberLv") || "0", 10) || 0, LEVELS.length - 1); } catch (e) {}
try { puan = parseInt(localStorage.getItem("cemberPuan") || "0", 10) || 0; } catch (e) {}
try {
  var h1 = localStorage.getItem("cemberHakIpucu"), h2 = localStorage.getItem("cemberHakTokmak");
  if (localStorage.getItem("cemberHakSurum") !== HAK_SURUM) {
    localStorage.setItem("cemberHakSurum", HAK_SURUM); // bir kerelik: yeni başlangıç haklarını uygula
  } else {
    if (h1 !== null) hakIpucu = Math.max(0, parseInt(h1, 10) || 0);
    if (h2 !== null) hakTokmak = Math.max(0, parseInt(h2, 10) || 0);
  }
} catch (e) {}

function puanKaydet() { try { localStorage.setItem("cemberPuan", puan); } catch (e) {} }
var bannerT = null;
function baslikYaz() { $("cmPuan").textContent = "⭐ " + puan; barYaz(); }
function bolumGoster() {
  var b = $("cmBanner");
  b.textContent = "Bölüm " + (lvIdx + 1);
  b.classList.add("show");
  if (bannerT) clearTimeout(bannerT);
  bannerT = setTimeout(function () { b.classList.remove("show"); }, 1000);
}

// Haklar: rozet sayı gösterir, 0 olunca "+" olur (ileride reklam/satın alma buraya bağlanacak)
function hakYaz() {
  var a = $("cmHintN"), b = $("cmHamN");
  a.textContent = hakIpucu > 0 ? hakIpucu : "+"; a.classList.toggle("zero", hakIpucu <= 0);
  b.textContent = hakTokmak > 0 ? hakTokmak : "+"; b.classList.toggle("zero", hakTokmak <= 0);
  try { localStorage.setItem("cemberHakIpucu", hakIpucu); localStorage.setItem("cemberHakTokmak", hakTokmak); } catch (e) {}
}
// İLERİDE: reklam izlenince veya satın alınca çağır -> window.cemberHakEkle("ipucu", 3)
window.cemberHakEkle = function (tur, n) {
  if (tur === "tokmak") hakTokmak += n; else hakIpucu += n;
  hakYaz();
};
function hakBitti(tur) { hakReklamSor(tur); }
function tokmakKapat() {
  hammerOn = false;
  $("cmGrid").classList.remove("cm-hm");
  $("cmHam").classList.remove("cm-act");
}

function shuffle(a) {
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}

// Oyun başlığı, ana sayfadaki başlıkla (body>h1) aynı yazı boyutu ve aynı konumda olur; oyuna girerken kıpırdamaz.
function baslikHizala() {
  var h = document.querySelector("h1"), top = root.querySelector(".cm-top"), b = $("cmBack");
  if (!h || !top || !b) return;
  top.style.transform = "";
  var mer = function (el) { // yazının kendi kutusu: satır yüksekliğinden bağımsız
    var r = document.createRange(); r.selectNodeContents(el);
    var q = r.getBoundingClientRect(); return q.height ? q : el.getBoundingClientRect();
  };
  var A = mer(h), B = mer(b);
  if (!A.height || !B.height) return;
  var d = (A.top + A.height / 2) - (B.top + B.height / 2);
  if (Math.abs(d) > 0.4 && Math.abs(d) < 80) top.style.transform = "translateY(" + d + "px)";
}

function boyut() {
  S = Math.max(180, Math.min(300, Math.round(window.innerWidth * 0.74), Math.round(window.innerHeight * 0.36)));
  D = Math.round(S * 0.21);
  var w = $("cmWheel");
  w.style.width = S + "px"; w.style.height = S + "px";
  var sv = $("cmSvg");
  sv.setAttribute("width", S); sv.setAttribute("height", S); sv.setAttribute("viewBox", "0 0 " + S + " " + S);
  var sh = $("cmShuf"); var ss = Math.round(S * 0.2);
  sh.style.width = ss + "px"; sh.style.height = ss + "px";
}

function startLevel() {
  var L = LEVELS[lvIdx];
  can = CAN_MAX; dlg.classList.remove("show");
  found = {}; foundB = {}; hintCells = {}; sel = []; drag = false;
  tokmakKapat();
  $("cmOv").classList.remove("show");
  cur = makeLayout(L.w);
  placedMap = {};
  cur.words.forEach(function (p) { placedMap[p.w] = p; });
  bonusList = L.b.concat(cur.un.filter(function (w) { return L.b.indexOf(w) === -1; }));
  letters = shuffle(L.l.split(""));
  arkaYaz(); barRenk(); baslikHizala(); baslikYaz(); hakYaz(); bolumGoster();
  $("cmCur").innerHTML = "";
  boyut();
  drawWords(); drawBonus(); drawWheel();
}

function drawWords() {
  var box = $("cmGrid");
  box.innerHTML = "";
  if (!cur) return;
  var g = 5, W = box.clientWidth - 24, H = box.clientHeight - 12;
  var cs = Math.floor(Math.min(46, (W - (cur.cols - 1) * g) / cur.cols, (H - (cur.rows - 1) * g) / cur.rows));
  if (cs < 14) cs = 14;
  var cells = {};
  cur.words.forEach(function (p) {
    for (var i = 0; i < p.w.length; i++) {
      var r = p.r + (p.d ? i : 0), c = p.c + (p.d ? 0 : i), k = r + "," + c;
      if (!cells[k]) cells[k] = { r: r, c: c, ch: p.w[i], on: false };
      if (found[p.w]) cells[k].on = true;
    }
  });
  var inner = document.createElement("div");
  inner.className = "cm-gridin";
  inner.style.width = (cur.cols * cs + (cur.cols - 1) * g) + "px";
  inner.style.height = (cur.rows * cs + (cur.rows - 1) * g) + "px";
  var h = "";
  Object.keys(cells).forEach(function (k) {
    var x = cells[k], cls = "cm-cell", txt = "";
    if (x.on) { cls += " cm-on"; txt = x.ch; }
    else if (hintCells[k]) { cls += " cm-hint"; txt = x.ch; }
    h += '<div class="' + cls + '" data-k="' + k + '" style="left:' + (x.c * (cs + g)) + "px;top:" + (x.r * (cs + g)) + "px;width:" + cs + "px;height:" + cs + "px;font-size:" + Math.round(cs * 0.6) + 'px">' + txt + "</div>";
  });
  inner.innerHTML = h;
  box.appendChild(inner);
}

function drawBonus() {
  var list = Object.keys(foundB);
  var h = '<div class="cm-bt">❤️ ' + can + '</div> <div class="cm-bt">⭐ Bonus kelimeler (' + list.length + (bonusList.length ? "/" + bonusList.length : "") + ")</div><br>";
  list.forEach(function (w) { h += '<span class="cm-chip">' + w + "</span>"; });
  $("cmBonus").innerHTML = h;
  var en = $("cmEksN");
  if (en) { en.textContent = list.length; en.className = "cm-badge" + (list.length ? "" : " zero"); }
  ekstraYaz();
}

function ekstraYaz() {
  var list = Object.keys(foundB), tot = bonusList.length, h = "";
  list.forEach(function (w) { h += '<span class="cm-chip">' + w + "</span>"; });
  if (!h) h = '<span style="color:#9a8a70;font-size:14px;padding:30px 10px">Bulmacada olmayan kelimeleri bulunca burada görünür.</span>';
  $("cmOvL").innerHTML = h;
  $("cmOvB").style.width = (tot ? Math.round(list.length * 100 / tot) : 0) + "%";
  $("cmOvT").textContent = list.length + "/" + tot;
}

function pos(i) {
  var n = letters.length, a = (i / n) * 2 * Math.PI - Math.PI / 2, R = S * 0.34;
  return { x: S / 2 + R * Math.cos(a), y: S / 2 + R * Math.sin(a) };
}

function drawWheel() {
  var w = $("cmWheel");
  Array.prototype.slice.call(w.querySelectorAll(".cm-let")).forEach(function (e) { e.remove(); });
  var sh = $("cmShuf");
  letters.forEach(function (ch, i) {
    var p = pos(i), d = document.createElement("div");
    d.className = "cm-let"; d.textContent = ch; d.dataset.i = i;
    d.style.left = p.x + "px"; d.style.top = p.y + "px";
    d.style.width = D + "px"; d.style.height = D + "px"; d.style.fontSize = Math.round(D * 0.62) + "px";
    w.insertBefore(d, sh);
  });
  drawLine();
}

function drawLine() {
  var pts = sel.map(function (i) { var p = pos(i); return p.x + "," + p.y; });
  if (drag && ptr && sel.length) pts.push(ptr.x + "," + ptr.y);
  $("cmSvg").innerHTML = '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + MAVI + '" stroke-width="' + Math.round(D * 0.3) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  Array.prototype.slice.call($("cmWheel").querySelectorAll(".cm-let")).forEach(function (e) {
    e.classList.toggle("cm-sel", sel.indexOf(+e.dataset.i) > -1);
  });
}

function word() { return sel.map(function (i) { return letters[i]; }).join(""); }
function drawCur() {
  if (flashT) { clearTimeout(flashT); flashT = null; }
  $("cmCur").innerHTML = sel.length ? '<span class="cm-curp">' + word() + "</span>" : "";
}
function flash(text, cls) {
  if (flashT) clearTimeout(flashT);
  $("cmCur").innerHTML = '<span class="cm-curp ' + cls + '">' + text + "</span>";
  flashT = setTimeout(function () { if (!drag) $("cmCur").innerHTML = ""; flashT = null; }, 1300);
}

function hit(e) {
  var r = $("cmWheel").getBoundingClientRect();
  ptr = { x: e.clientX - r.left, y: e.clientY - r.top };
  for (var i = 0; i < letters.length; i++) {
    var p = pos(i), dx = ptr.x - p.x, dy = ptr.y - p.y;
    if (Math.sqrt(dx * dx + dy * dy) <= D * 0.6) {
      if (sel.indexOf(i) === -1) sel.push(i);
      else if (sel.length > 1 && sel[sel.length - 2] === i) sel.pop();
      break;
    }
  }
  drawLine(); drawCur();
}

var wh = $("cmWheel");
wh.addEventListener("pointerdown", function (e) {
  if (e.target.closest && e.target.closest(".cm-shuf")) return;
  drag = true; sel = [];
  try { wh.setPointerCapture(e.pointerId); } catch (x) {}
  hit(e);
});
wh.addEventListener("pointermove", function (e) { if (drag) hit(e); });

function end() {
  if (!drag) return;
  drag = false;
  var w = word();
  if (w.length > 1) {
    if (placedMap[w] && !found[w]) {
      found[w] = true;
      var p = w.length * ANA_PUAN;
      puan += p; puanKaydet(); baslikYaz();
      flash("✅ " + w + " +" + p, "ok");
      drawWords();
      if (cur.words.every(function (x) { return found[x.w]; })) {
        flash("🎉 Seviye tamamlandı!", "ok");
        setTimeout(function () {
          lvIdx = (lvIdx + 1) % LEVELS.length;
          try { localStorage.setItem("cemberLv", lvIdx); } catch (e) {}
          // Her yeni bölümde haklar tazelenir (ampül 7, tokmak 5). Satın alınan/kazanılan fazla hak varsa korunur.
          hakIpucu = Math.max(hakIpucu, HAK_IPUCU);
          hakTokmak = Math.max(hakTokmak, HAK_TOKMAK);
          gecisGoster(); // Seri ekranı (günde ilk kez) -> Yolculuk ekranı -> BÖLÜM N
        }, 1500);
      }
    } else if (bonusList.indexOf(w) > -1 && !foundB[w]) {
      foundB[w] = true;
      var bp = w.length * BONUS_PUAN;
      puan += bp; puanKaydet(); baslikYaz();
      flash("⭐ BONUS " + w + " +" + bp, "bonus");
      drawBonus();
    } else if (found[w] || foundB[w]) {
      flash("Zaten buldun", "info");
    } else {
      flash("❌ Yanlış", "bad"); canEksil();
    }
  } else {
    $("cmCur").innerHTML = "";
  }
  sel = []; ptr = null; drawLine();
}
window.addEventListener("pointerup", end);
window.addEventListener("pointercancel", end);

$("cmShuf").onclick = function () { letters = shuffle(letters); sel = []; drawWheel(); };

// Ampül: ilk kapalı harfi açar. Hak sadece gerçekten bir harf açılırsa düşer.
$("cmEks").onclick = function () { ekstraYaz(); $("cmOv").classList.add("show"); };
$("cmOvX").onclick = function () { $("cmOv").classList.remove("show"); };
$("cmOv").onclick = function (e) { if (e.target === this) this.classList.remove("show"); };
$("cmHint").onclick = function () {
  if (!cur) return;
  if (hakIpucu <= 0) { hakBitti("ipucu"); return; }
  tokmakKapat();
  for (var k = 0; k < cur.words.length; k++) {
    var p = cur.words[k];
    if (found[p.w]) continue;
    for (var i = 0; i < p.w.length; i++) {
      var r = p.r + (p.d ? i : 0), c = p.c + (p.d ? 0 : i), key = r + "," + c;
      if (hintCells[key]) continue;
      // başka bir bulunmuş kelimeyle zaten açılmış harfi atla
      var acik = cur.words.some(function (q) {
        if (!found[q.w]) return false;
        for (var j = 0; j < q.w.length; j++) {
          if ((q.r + (q.d ? j : 0)) + "," + (q.c + (q.d ? 0 : j)) === key) return true;
        }
        return false;
      });
      if (acik) continue;
      hintCells[key] = true; hakIpucu--; hakYaz(); drawWords(); return;
    }
  }
};

// Tokmak: önce butona bas, sonra tablodan açmak istediğin kutuya dokun.
$("cmHam").onclick = function () {
  if (!cur) return;
  if (hammerOn) { tokmakKapat(); return; }
  if (hakTokmak <= 0) { hakBitti("tokmak"); return; }
  hammerOn = true;
  $("cmGrid").classList.add("cm-hm");
  $("cmHam").classList.add("cm-act");
  flash("🔨 Açmak istediğin kutuya dokun", "info");
};
$("cmGrid").addEventListener("click", function (e) {
  if (!hammerOn) return;
  var el = e.target.closest ? e.target.closest(".cm-cell") : null;
  if (!el || el.classList.contains("cm-on") || el.classList.contains("cm-hint")) return;
  hintCells[el.getAttribute("data-k")] = true;
  hakTokmak--; hakYaz();
  tokmakKapat();
  drawWords();
});

// ===== BÖLÜM GEÇİŞ EKRANLARI: 1) Mevcut Seri  2) Yolculuk (ilerleme + BÖLÜM N) =====
// Aynı alan adında birden fazla uygulama varsa (firtina/, arena/) altın, seri, premium ayrı tutulur
var UYG = location.pathname.replace(/[^\/]*$/, "").replace(/[^a-z0-9]/gi, "").slice(0, 24);
var gcss = document.createElement("style");
gcss.textContent =
"#cmGec{position:absolute;top:0;left:0;right:0;bottom:0;z-index:30;display:none;flex-direction:column;align-items:center;color:#fff;text-align:center;overflow:hidden;box-sizing:border-box;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);background:radial-gradient(ellipse 90% 40% at 50% 30%,rgba(20,190,245,.85),rgba(20,190,245,0) 70%),linear-gradient(#0b86c8,#065a99 50%,#042b52)}" +
"#cmGec .gc-koral{position:absolute;left:0;bottom:0;width:100%;height:24%;opacity:.55;pointer-events:none}" +
"#cmGec .gc-pan{display:none;flex:1;width:100%;min-height:0;flex-direction:column;align-items:center;position:relative;z-index:1}" +
"#cmGec .gc-pan.on{display:flex}" +
"#cmGec .gc-mid{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;padding:0 16px;box-sizing:border-box}" +
"#cmGec .gc-t1{font-size:30px;font-weight:700;margin-top:30px;letter-spacing:.5px}" +
"#cmGec .gc-t2{font-size:56px;font-weight:800;margin:4px 0 26px;line-height:1.1}" +
"#cmGec .gc-days{display:flex;gap:14px;padding:8px 18px 14px;border-radius:22px;background:rgba(150,190,215,.85);box-shadow:0 4px 10px rgba(0,0,0,.25)}" +
"#cmGec .gc-d{display:flex;flex-direction:column;align-items:center;gap:4px;font-weight:800;font-size:20px}" +
"#cmGec .gc-d i{width:44px;height:44px;border-radius:50%;background:#dbe6ee;border:3px solid #fff;box-sizing:border-box;font-style:normal;display:flex;align-items:center;justify-content:center;font-size:26px}" +
"#cmGec .gc-d i.on{background:#2fb81a;border-color:#167a0a;box-shadow:0 0 0 2px #1d9a0d}" +
"#cmGec .gc-info{margin-top:28px;font-size:21px;font-weight:600;line-height:1.35;max-width:92%}" +
"#cmGec button.gc-btn{width:min(80%,340px);height:64px;border:0;border-radius:32px;background:linear-gradient(#37cc1e,#22a80f);box-shadow:0 5px 0 #17780a,0 8px 14px rgba(0,0,0,.3);color:#fff;font-family:inherit;font-size:28px;font-weight:800;letter-spacing:1px;margin:0 0 44px;flex:none}" +
"#cmGec .gc-top{width:100%;display:flex;justify-content:space-between;padding:14px 14px 0;box-sizing:border-box}" +
"#cmGec .gc-pill{background:rgba(5,20,44,.72);border:2px solid rgba(255,255,255,.3);border-radius:999px;padding:6px 16px;font-size:18px;font-weight:800}" +
"#cmGec .gc-logo{margin-top:6vh;font-size:38px;font-weight:300;letter-spacing:6px;opacity:.55}" +
"#cmGec .gc-circ{width:min(52vw,210px);height:min(52vw,210px);border-radius:50%;background:rgba(120,170,200,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:6vh}" +
"#cmGec .gc-circ b{font-size:64px;line-height:1}#cmGec .gc-circ span{font-size:22px;font-weight:800;letter-spacing:1px;margin-top:10px}" +
"#cmGec .gc-bars{width:min(68%,290px)}" +
"#cmGec .gc-bar{position:relative;height:34px;border-radius:17px;background:#04182c;border:2px solid rgba(255,255,255,.35);box-sizing:border-box}" +
"#cmGec .gc-bar i{position:absolute;left:0;top:0;bottom:0;width:0;background:#2fb81a;border-radius:15px;transition:width .9s ease}" +
"#cmGec .gc-bar b{position:absolute;left:0;right:0;top:0;line-height:30px;font-size:21px;font-weight:800}" +
"#cmGec .gc-bar em{position:absolute;right:-16px;top:-16px;font-style:normal;font-size:38px;line-height:1}" +
"#cmGec .gc-reg{font-size:21px;font-weight:800;margin:24px 0 6px;letter-spacing:.5px}" +
"#cmGec .gc-msg{min-height:28px;margin-top:22px;font-size:19px;font-weight:800;color:#ffe27a}" +
"#cmGec button.gc-home{position:absolute;left:20px;bottom:calc(20px + env(safe-area-inset-bottom));width:56px;height:56px;border-radius:50%;background:rgba(10,24,40,.8);border:2px solid rgba(255,255,255,.5);font-size:26px;padding:0;z-index:2}";
document.head.appendChild(gcss);

var gec = document.createElement("div");
gec.id = "cmGec";
gec.innerHTML =
'<svg class="gc-koral" viewBox="0 0 400 200" preserveAspectRatio="none"><g fill="none" stroke-width="7" stroke-linecap="round"><path stroke="#e8553a" d="M20 200Q34 140 10 100M34 175Q64 135 52 90M44 200Q74 150 96 128"/><path stroke="#8a46c0" d="M380 200Q368 150 392 108M366 190Q338 150 350 108M350 200Q320 160 300 140"/></g></svg>' +
'<div class="gc-pan" id="gcSeri"><div class="gc-mid">' +
'<svg width="150" height="180" viewBox="0 0 100 120"><defs><linearGradient id="gcF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe000"/><stop offset="1" stop-color="#ff9a2e"/></linearGradient></defs><path d="M50 4C58 28 90 46 90 80C90 104 72 116 50 116C28 116 10 104 10 80C10 60 24 48 32 34C34 46 40 52 46 54C42 36 44 18 50 4Z" fill="#f04a1a"/><path d="M50 26C56 44 76 58 76 82C76 98 64 106 50 106C36 106 24 98 24 82C24 68 34 58 39 50C41 60 46 64 50 64C48 48 48 36 50 26Z" fill="url(#gcF)"/></svg>' +
'<div class="gc-t1">Mevcut Seri</div><div class="gc-t2" id="gcN"></div><div class="gc-days" id="gcDays"></div>' +
'<div class="gc-info">Her gün bir bulmaca çözmek serini ilerletir<br>Ama bir gün kaçırırsan sıfırlanır!</div></div>' +
'<button class="gc-btn" id="gcDevam">DEVAM ET</button></div>' +
'<div class="gc-pan" id="gcYol"><div class="gc-top"><div class="gc-pill" id="gcPuan"></div><div class="gc-pill" id="gcSeriP"></div></div>' +
'<div class="gc-logo">ROTASYON</div><div class="gc-mid"><div class="gc-circ"><b id="gcTam"></b><span>YOLCULUK</span></div>' +
'<div class="gc-bars"><div class="gc-bar"><i id="gcB1"></i><b id="gcB1t"></b><em>🎁</em></div>' +
'<div class="gc-reg" id="gcReg"></div><div class="gc-bar"><i id="gcB2"></i><b id="gcB2t"></b><em>📱</em></div></div>' +
'<div class="gc-msg" id="gcMsg"></div></div>' +
'<button class="gc-btn" id="gcBol"></button><button class="gc-home" id="gcHome" aria-label="Ana menü">🏠</button></div>';
root.appendChild(gec);

var GUN_HARF = ["P", "P", "S", "Ç", "P", "C", "C"]; // Pazar, Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi
var BOLGE = ["KIZILDENİZ", "AKDENİZ", "EGE DENİZİ", "KARADENİZ", "MARMARA", "HAZAR DENİZİ", "BASRA KÖRFEZİ", "ADRİYATİK"];
var tamam = lvIdx, gcV = null;
try { var tm = parseInt(localStorage.getItem(UYG + "cemberTamam"), 10); if (!isNaN(tm)) tamam = tm; } catch (e) {}

function gunKey(d) { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
function seriGuncelle() {
  var s = { n: 0, days: [] };
  try { var k = JSON.parse(localStorage.getItem(UYG + "cemberSeri")); if (k && k.days) s = k; } catch (e) {}
  var bugun = gunKey(new Date()), dun = new Date(); dun.setDate(dun.getDate() - 1);
  var ilk = s.days.indexOf(bugun) < 0;
  if (ilk) {
    s.n = s.days.indexOf(gunKey(dun)) > -1 ? s.n + 1 : 1;
    s.days.push(bugun); s.days = s.days.slice(-14);
    try { localStorage.setItem(UYG + "cemberSeri", JSON.stringify(s)); } catch (e) {}
  }
  return { n: s.n, ilk: ilk };
}
function gcPanel(id) {
  $("gcSeri").classList.toggle("on", id === "gcSeri");
  $("gcYol").classList.toggle("on", id === "gcYol");
}
function gecisGoster() {
  tamam++;
  try { localStorage.setItem(UYG + "cemberTamam", tamam); } catch (e) {}
  if (tamam % REKLAM_ARALIK === 0) { reklamBekle = true; try { localStorage.setItem(UYG + "cemberRekBekle", "1"); } catch (e) {} }
  var sr = seriGuncelle(), c1 = ((tamam - 1) % 8) + 1, reg = Math.floor((tamam - 1) / 64);
  var hediye = c1 === 8;
  if (hediye) { hakIpucu += 2; hakTokmak += 1; hakYaz(); }
  gcV = { n: sr.n, tam: tamam, c1: c1, c2: Math.floor(tamam / 8) - reg * 8, c2p: Math.floor((tamam - 1) / 8) - reg * 8, reg: reg, hediye: hediye };
  gec.style.display = "flex";
  if (sr.ilk) {
    $("gcN").textContent = sr.n + " Gün";
    var h = "", t = new Date();
    for (var o = -2; o <= 2; o++) {
      var d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + o);
      h += '<div class="gc-d"><span>' + GUN_HARF[d.getDay()] + '</span><i class="' + (o <= 0 && o > -sr.n ? "on" : "") + '">' + (o <= 0 && o > -sr.n ? "✓" : "") + "</i></div>";
    }
    $("gcDays").innerHTML = h;
    gcPanel("gcSeri");
  } else yolGoster();
}
function yolGoster() {
  var v = gcV; if (!v) return;
  $("gcPuan").textContent = "⭐ " + puan;
  $("gcSeriP").textContent = v.n + " 🔥";
  $("gcTam").textContent = v.tam;
  $("gcReg").textContent = BOLGE[v.reg % BOLGE.length];
  $("gcB1t").textContent = v.c1 + "/8"; $("gcB2t").textContent = v.c2 + "/8";
  $("gcMsg").textContent = v.hediye ? "🎁 Hediye: +2 💡  +1 🔨" : "";
  $("gcBol").textContent = "BÖLÜM " + (lvIdx + 1);
  var b1 = $("gcB1"), b2 = $("gcB2");
  b1.style.transition = b2.style.transition = "none";
  b1.style.width = Math.round((v.c1 - 1) * 12.5) + "%"; b2.style.width = Math.round(v.c2p * 12.5) + "%";
  gcPanel("gcYol");
  void b1.offsetWidth;
  b1.style.transition = b2.style.transition = "";
  setTimeout(function () { b1.style.width = Math.round(v.c1 * 12.5) + "%"; b2.style.width = Math.round(v.c2 * 12.5) + "%"; }, 150);
}
$("gcDevam").onclick = yolGoster;
$("gcBol").onclick = function () { gec.style.display = "none"; levelBaslat(); };
$("gcHome").onclick = function () { kapat(); };

// ===== CAN (yanlış hakkı), REKLAMLAR, KAYBETME / HAK DİYALOGLARI =====
var CAN_MAX = 5;          // bir bölümde en fazla kaç yanlış yapılabilir
var REKLAM_ARALIK = 10;   // kaç bölümde bir ara reklam
var ODUL_HAK = 3;         // ampül/tokmak için reklam izleyince kazanılan hak
var can = CAN_MAX, reklamBekle = false, adT = null;
try { reklamBekle = localStorage.getItem(UYG + "cemberRekBekle") === "1"; } catch (e) {}

var ecss = document.createElement("style");
ecss.textContent =
"#cm .cm-ov.cm-ad{z-index:40;background:#000;flex-direction:column;color:#fff;text-align:center}" +
"#cm button.cm-opt{display:block;width:100%;margin:10px 0 0;padding:14px 10px;border:0;border-radius:14px;font-family:inherit;font-size:17px;font-weight:800;color:#fff;background:#2fb81a;box-shadow:0 3px 0 #17780a}" +
"#cm button.cm-opt.gri{background:#8a8f99;box-shadow:0 3px 0 #5f636b}" +
"#cm button.cm-opt:disabled{opacity:.5}";
document.head.appendChild(ecss);

var dlg = document.createElement("div"); dlg.className = "cm-ov"; dlg.style.zIndex = 25; root.appendChild(dlg);
var adEl = document.createElement("div"); adEl.className = "cm-ov cm-ad"; root.appendChild(adEl);

function soruGoster(baslik, mesaj, ops) {
  dlg.innerHTML = '<div class="cm-dlg"><h3>' + baslik + '</h3><div style="font-size:17px;font-weight:600;line-height:1.35">' + mesaj + '</div><div class="cm-dlgo"></div></div>';
  var kap = dlg.querySelector(".cm-dlgo");
  ops.forEach(function (o) {
    var b = document.createElement("button");
    b.className = "cm-opt " + (o.c || ""); if (o.h) b.innerHTML = o.h; else b.textContent = o.t;
    b.onclick = function () { dlg.classList.remove("show"); o.f(); };
    kap.appendChild(b);
  });
  dlg.classList.add("show");
}

// REKLAM: tur "gecis" (ara reklam) veya "odul" (ödüllü). cb(true) = reklam tamamlandı.
// Gerçek reklam SDK'sını bağlamak için sayfada window.cemberReklam = function (tur, cb) { ... } tanımla.
// Tanımlı değilse aşağıdaki 5 saniyelik TEST reklamı gösterilir.
function reklamIptal() { if (adT) { clearInterval(adT); adT = null; } adEl.classList.remove("show"); }
function reklamGoster(tur, cb) {
  if (premium) { cb(true); return; } // Premium: reklam yok, ödül direkt
  if (typeof window.cemberReklam === "function") { window.cemberReklam(tur, cb); return; }
  var odul = tur === "odul", sn = 5;
  adEl.innerHTML = '<div style="font-size:13px;opacity:.6;letter-spacing:2px">REKLAM · TEST</div><div style="font-size:24px;font-weight:800;margin:16px 0 8px;padding:0 20px">Gerçek reklam buraya gelecek</div><div class="cm-ads" style="font-size:54px;font-weight:800;margin:10px 0 24px"></div><button class="cm-opt gri cm-adb" style="width:min(80%,300px)"></button>';
  adEl.classList.add("show");
  var s = adEl.querySelector(".cm-ads"), b = adEl.querySelector(".cm-adb");
  var yaz = function () {
    s.textContent = sn > 0 ? sn : "✓";
    b.textContent = sn > 0 ? (odul ? "Vazgeç" : "Bekleniyor…") : (odul ? "Ödülü al" : "Kapat");
    b.disabled = sn > 0 && !odul;
  };
  if (adT) clearInterval(adT);
  adT = setInterval(function () { sn--; if (sn <= 0) { sn = 0; clearInterval(adT); adT = null; } yaz(); }, 1000);
  yaz();
  b.onclick = function () { if (sn > 0 && !odul) return; var ok = sn <= 0; reklamIptal(); cb(ok); };
}

// Her REKLAM_ARALIK bölümde bir, sonraki bölüm başlarken ara reklam (menüden çıkıp girerek atlanamaz)
function levelBaslat() {
  if (reklamBekle) {
    reklamGoster("gecis", function () {
      reklamBekle = false;
      try { localStorage.removeItem(UYG + "cemberRekBekle"); } catch (e) {}
      startLevel();
    });
  } else startLevel();
}

// Çekiç / ampül hakkı bitince: reklam izle -> +ODUL_HAK
function hakReklamSor(tur) {
  var ip = tur !== "tokmak", ad = ip ? "ampül" : "tokmak", ic = ip ? "💡" : "🔨";
  soruGoster("Hakkın bitti", "Reklam izleyerek " + ODUL_HAK + " " + ad + " " + ic + " kazanabilirsin.", [
    { t: "📺 Reklam izle (+" + ODUL_HAK + " " + ic + ")", f: function () {
      reklamGoster("odul", function (ok) { if (ok) { window.cemberHakEkle(ip ? "ipucu" : "tokmak", ODUL_HAK); flash("+" + ODUL_HAK + " " + ic, "ok"); } });
    } },
    { t: "Vazgeç", c: "gri", f: function () {} }
  ]);
}

// Yanlış kelime = 1 can gider. Can bitince: bir alt bölüm VEYA reklam izleyip devam
function canEksil() {
  can = Math.max(0, can - 1); drawBonus();
  if (can <= 0) { tokmakKapat(); setTimeout(kayipSor, 700); }
}
function altBolum() {
  if (lvIdx > 0) lvIdx--;
  try { localStorage.setItem("cemberLv", lvIdx); } catch (e) {}
  startLevel();
}
function kayipSor() {
  if (root.style.display !== "flex" || can > 0) return;
  var alt = lvIdx > 0;
  soruGoster("Canın bitti! 💔", "Altınla kaldığın yerden devam edebilir ya da " + (alt ? "bir alt bölümden" : "bölümü baştan") + " başlayabilirsin.", [
    { h: '<span class="cm-chip">🪙 ' + KAYIP_BEDEL + '</span>Devam et', f: function () {
      if (altin >= KAYIP_BEDEL) { altinEkle(-KAYIP_BEDEL); can = CAN_MAX; drawBonus(); }
      else altinDukkan(kayipSor, "Altının yetmiyor");
    } },
    { t: alt ? "⬇️ Bir alt bölümden başla" : "🔄 Bölümü baştan başla", c: "gri", f: altBolum },
    { t: "🪙 Altın al", c: "alt", f: function () { altinDukkan(kayipSor); } }
  ]);
}

// ===== ALTIN, ALT BAR (kullanıcı adı / altın / puan), ALTIN AL MAĞAZASI, PREMIUM =====
var KAYIP_BEDEL = 50;       // kaybedince "Devam et" kaç altın
var ODUL_ALTIN = 30;        // mağazada reklam izleyince kazanılan altın
var SATIN_ALMA_TEST = true; // true: window.cemberSatinAl tanımlı değilse satın alma ücretsiz simüle edilir. YAYINDA false YAP!
var URUNLER = [             // fiyatlar örnektir
  { id: "altin100", t: "🪙 100 Altın", f: "₺29,99", n: 100 },
  { id: "altin550", t: "🪙 550 Altın", f: "₺129,99", n: 550 },
  { id: "altin1200", t: "🪙 1.200 Altın", f: "₺249,99", n: 1200 }
];
var PREMIUM_URUN = { id: "premium", t: "👑 Premium Üyelik", f: "₺79,99/ay" };
var altin = 100, premium = false, kullanici = "Oyuncu" + (1000 + Math.floor(Math.random() * 9000));
try {
  var ga = localStorage.getItem(UYG + "cemberAltin"); if (ga !== null) altin = Math.max(0, parseInt(ga, 10) || 0);
  premium = localStorage.getItem(UYG + "cemberPremium") === "1";
  var gu = localStorage.getItem(UYG + "cemberAd"); if (gu) kullanici = gu; else localStorage.setItem(UYG + "cemberAd", kullanici);
} catch (e) {}

var fcss = document.createElement("style");
fcss.textContent =
"#cm .cm-score{display:none}" +
"#cm .cm-alt{flex:none;width:100%;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 12px calc(12px + env(safe-area-inset-bottom))}" +
"#cm .cm-bp,#cm button.cm-bp{background:rgba(10,24,64,.72);border:2px solid rgba(255,255,255,.35);border-radius:999px;padding:7px 12px;font-family:inherit;font-size:15px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;box-shadow:none}" +
"#cm button#cmKul{flex:1 1 auto;max-width:42%;text-align:left}" +
"#cm button#cmAlt{border-color:#ffb300;color:#ffe27a}" +
"#cm button.cm-opt.alt{background:#e0892b;box-shadow:0 3px 0 #a8641a}" +
"#cm .cm-chip{display:inline-block;background:rgba(0,0,0,.28);border-radius:999px;padding:2px 10px;margin-right:8px;font-size:15px}";
document.head.appendChild(fcss);

var bar = document.createElement("div"); bar.className = "cm-alt"; root.appendChild(bar);
function barYaz() {
  if (!bar) return;
  bar.innerHTML = '<button class="cm-bp" id="cmKul">👤 ' + kullanici + (premium ? " 👑" : "") + '</button><button class="cm-bp" id="cmAlt">🪙 ' + altin + ' ＋</button><div class="cm-bp">⭐ ' + puan + '</div>';
  $("cmKul").onclick = adDegistir;
  $("cmAlt").onclick = function () { altinDukkan(); };
}
function adDegistir() {
  var v = null;
  try { v = prompt("Kullanıcı adın:", kullanici); } catch (e) {}
  v = (v || "").replace(/[<>&"]/g, "").trim().slice(0, 14);
  if (!v) return;
  kullanici = v;
  try { localStorage.setItem(UYG + "cemberAd", kullanici); } catch (e) {}
  barYaz();
}
function altinEkle(n) {
  altin = Math.max(0, altin + n);
  try { localStorage.setItem(UYG + "cemberAltin", altin); } catch (e) {}
  barYaz();
}
function satinAl(urun, ok) {
  var bitir = function (b) { if (b) ok(); else altinDukkan(null, "Satın alma tamamlanmadı"); };
  if (typeof window.cemberSatinAl === "function") window.cemberSatinAl(urun.id, bitir); // gerçek ödeme: bunu bağla
  else if (SATIN_ALMA_TEST) bitir(true);
  else altinDukkan(null, "Satın alma henüz bağlı değil");
}
function altinDukkan(geri, not) {
  var ops = [{ t: "📺 Reklam izle  +" + ODUL_ALTIN + " 🪙", f: function () {
    reklamGoster("odul", function (ok) { altinDukkan(geri, ok ? "+" + ODUL_ALTIN + " 🪙 kazandın" : ""); if (ok) altinEkle(ODUL_ALTIN); });
  } }];
  URUNLER.forEach(function (u) {
    ops.push({ t: u.t + " · " + u.f, f: function () { satinAl(u, function () { altinEkle(u.n); altinDukkan(geri, "+" + u.n + " 🪙 eklendi"); }); } });
  });
  if (!premium) ops.push({ t: PREMIUM_URUN.t + " · " + PREMIUM_URUN.f, c: "alt", f: function () {
    satinAl(PREMIUM_URUN, function () {
      premium = true; try { localStorage.setItem(UYG + "cemberPremium", "1"); } catch (e) {}
      barYaz(); altinDukkan(geri, "👑 Premium aktif!");
    });
  } });
  ops.push({ t: "Kapat", c: "gri", f: function () { if (geri) geri(); } });
  soruGoster("Altın Al 🪙", (not ? "<b>" + not + "</b><br>" : "") + "Bakiyen: 🪙 " + altin + "<br>" + (premium ? "👑 Premium: reklamsız oyun" : "👑 Premium ile reklamsız oyna"), ops);
}
barYaz();

window.addEventListener("resize", function () {
  if (root.style.display !== "flex") return;
  baslikHizala(); boyut(); drawWheel(); drawWords();
});
function kapat() { tokmakKapat(); temaGeri(); gec.style.display = "none"; dlg.classList.remove("show"); reklamIptal(); root.style.display = "none"; }
$("cmBack").onclick = kapat;
document.addEventListener("anasayfa", kapat);

// Ana menüye (#ana) buton ekler; diğer oyun butonları gibi oyun açılınca otomatik gizlenir.
var ekli = null;
function boya() {
  if (!ekli) return;
  ekli.style.setProperty("background", "#e0892b", "important");
  ekli.style.setProperty("color", "#fff", "important");
}
function addButton(zorla) {
  if (ekli) return;
  var ana = $("ana");
  if (!ana) return;
  var hedef = null;
  ana.querySelectorAll("button").forEach(function (b) {
    if (/İşlem/.test(b.textContent)) hedef = b;
  });
  if (!hedef && !zorla) return; // İşlem butonu henüz eklenmedi, bekle
  var b;
  if (hedef) {
    b = hedef.cloneNode(false);
  } else {
    b = document.createElement("button");
    b.className = "btn";
  }
  b.removeAttribute("id");
  b.textContent = "🔤 Rotasyon";
  b.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    root.style.display = "flex";
    baslikHizala();
    levelBaslat();
  });
  if (hedef) hedef.parentNode.insertBefore(b, hedef.nextSibling);
  else ana.appendChild(b);
  ekli = b;
  boya();
}
addButton(false);
var anaEl = $("ana");
if (anaEl) {
  var mo = new MutationObserver(function () {
    addButton(false);
    if (ekli) mo.disconnect();
  });
  mo.observe(anaEl, { childList: true, subtree: true });
}
window.addEventListener("load", function () { addButton(true); boya(); });
})();
