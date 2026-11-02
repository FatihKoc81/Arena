// PASSAPAROLA MODU
// Kullanım: index.html'de </body> öncesine şunu ekle:  <script src="passaparola.js"></script>
// Bu dosya kendi butonunu ("İlerlemeyi Sıfırla" altına), ekranını ve stilini kendisi ekler.
(function () {
  const SURE = 240; // saniye (süreyi buradan değiştir)

  const HARFLER = ["A","B","C","Ç","D","E","F","G","H","I","İ","J","K","L","M","N","O","Ö","P","R","S","Ş","T","U","Ü","V","Y","Z"];

  // Her harf için: [ ["ipucu", ["Doğru cevap", "kabul edilen diğer yazım"]], ... ]
  // Bir harfe istediğin kadar soru ekle; oyun her seferinde rastgele birini seçer.
  // Cevaplarda büyük/küçük harf farkı önemsenmez; Türkçe karakterler (ş, ç, ğ, ı, ö, ü) birebir yazılmalıdır.
  const SORU = {
    "A": [
      ["Türkiye'nin başkenti", ["Ankara"]],
      ["Dünyanın en büyük kıtası", ["Asya"]],
      ["Ormanlar kralı olarak bilinen hayvan", ["Aslan"]],
      ["Nuh'un gemisinin karaya oturduğu rivayet edilen, Türkiye'nin en yüksek dağı", ["Ağrı", "Ağrı Dağı"]],
      ["Kışın uykuya yatan, balı seven iri ve tüylü hayvan", ["Ayı"]],
      ["Dünyanın en küçük kıtası", ["Avustralya"]],
      ["Yunanistan'ın başkenti", ["Atina"]],
      ["Türkiye Cumhuriyeti'nin kurucusu", ["Atatürk", "Mustafa Kemal Atatürk"]],
      ["Kökü toprakta, dalları ve yaprakları olan büyük bitki", ["Ağaç"]],
      ["Bal yapan, iğnesi olan böcek", ["Arı"]],
      ["Dört tekerlekli, motorlu kara taşıtı", ["Araba", "Otomobil"]],
      ["Dünya'nın tek doğal uydusu", ["Ay"]],
      ["Kebabıyla ünlü Akdeniz şehri", ["Adana"]],
      ["Dünyanın en büyük yağmur ormanlarının bulunduğu Güney Amerika nehri", ["Amazon"]],
      ["Turizm başkenti sayılan Akdeniz şehri", ["Antalya"]],
      ["Sahra Çölü ve Nil'in bulunduğu kıta", ["Afrika"]],
      ["Penguenlerin yaşadığı, buzlarla kaplı en güney kıta", ["Antarktika"]],
      ["Bira yapımında da kullanılan, buğdaygillerden tahıl", ["Arpa"]],
      ["Güneşin battığı, günün son bölümü", ["Akşam"]],
      ["Yansımamızı gördüğümüz cam yüzey", ["Ayna"]],
      ["Çocuğunu doğuran kadın", ["Anne"]],
      ["Etrafı sularla çevrili kara parçası", ["Ada"]],
      ["Yılın sekizinci ayı", ["Ağustos"]],
      ["Ayağa giyilen, bağcıklı veya bağcıksız giysi", ["Ayakkabı"]],
      ["Kapıyı açmaya yarayan küçük metal araç", ["Anahtar"]],
      ["Yılın son ayı", ["Aralık"]],
      ["Paris ve Roma'nın bulunduğu kıta", ["Avrupa"]],
      ["Hastaları hastaneye taşıyan, sirenli araç", ["Ambulans"]],
      ["Başkenti Berlin olan ülke", ["Almanya"]],
      ["Mutfakta yemek pişirmeyi meslek edinen kişi", ["Aşçı"]],
      ["Bir dilin harflerinin sıralı bütünü", ["Alfabe"]],
      ["Binalarda insanları katlar arasında taşıyan kabin", ["Asansör"]],
      ["Sapı uzun, alt kısmı iri, tatlı ve sulu ağaç meyvesi", ["Armut"]],
      ["Sekiz kolu olan, mürekkep püskürtebilen deniz canlısı", ["Ahtapot"]],
      ["Kuyruğunun ucundaki iğneyle zehirleyen, kum rengi eklem bacaklı", ["Akrep"]],
      ["Güneşe doğru dönen, çerezi ve yağı yapılan sarı çiçek", ["Ayçiçeği"]],
      ["Takı yapımında kullanılan, sarı renkli değerli maden", ["Altın"]],
      ["Hayvan peşinde koşan, tüfek taşıyan kişi", ["Avcı"]],
      ["Televizyon ve radyo yayınlarını yakalayan çatı aleti", ["Anten"]],
      ["Odun yanınca çıkan alevli ısı kaynağı", ["Ateş"]]
    ],
    "B": [
      ["Çocukların oynadığı, üflenince şişen renkli lastik oyuncak", ["Balon"]],
      ["Gökyüzünde yağmur getiren beyaz veya gri kümeler", ["Bulut"]],
      ["Marmara Bölgesi'nde, Osmanlı'nın ilk başkenti olan şehir", ["Bursa"]],
      ["Çiçeklerin açtığı, kıştan sonra gelen mevsim", ["Bahar"]],
      ["Suda yaşayan, solungaçlarıyla soluyan hayvan", ["Balık"]],
      ["İki tekerlekli, pedal çevirerek giden taşıt", ["Bisiklet"]],
      ["Almanya'nın başkenti", ["Berlin"]],
      ["Suyun donmuş hâli", ["Buz"]],
      ["Kartal simgeli, siyah beyaz renkli İstanbul futbol kulübü", ["Beşiktaş"]],
      ["Geceleri avlanan, büyük gözlü kuş", ["Baykuş"]],
      ["Suyun içildiği, genelde silindir biçimli cam kap", ["Bardak"]],
      ["Yeni doğmuş küçük çocuk", ["Bebek"]],
      ["Klavyesi ve ekranı olan, internete bağlanabilen elektronik cihaz", ["Bilgisayar"]],
      ["Ekmek ve et kesmeye yarayan keskin alet", ["Bıçak"]],
      ["İstanbul'u ikiye ayıran, Karadeniz ile Marmara'yı bağlayan su yolu", ["Boğaz", "İstanbul Boğazı"]],
      ["Arıların çiçeklerden yaptığı tatlı besin", ["Bal"]],
      ["Küçük ağaca benzeyen yeşil sebze", ["Brokoli"]],
      ["Abant Gölü'nün bulunduğu Batı Karadeniz şehri", ["Bolu"]],
      ["Karnavalıyla ünlü, Amazon ormanlarının bulunduğu Güney Amerika ülkesi", ["Brezilya"]],
      ["Kırmızımsı renkli, elektriği iyi ileten maden", ["Bakır"]],
      ["Ülkeleri simgeleyen, direğe çekilen kumaş", ["Bayrak"]],
      ["Sebze, meyve ve çiçek yetiştirilen evin açık alanı", ["Bahçe"]],
      ["Yürümemizi sağlayan vücut bölümü", ["Bacak"]],
      ["Boynun üzerinde bulunan, beyni taşıyan vücut bölümü", ["Baş"]],
      ["Belçika'nın başkenti", ["Brüksel"]],
      ["Evin dışa açılan, korkuluklu çıkıntısı", ["Balkon"]],
      ["Otobüse veya sinemaya girerken alınan kâğıt", ["Bilet"]],
      ["Karın rengi", ["Beyaz"]],
      ["Mahalledeki küçük market", ["Bakkal"]],
      ["Türkiye'nin kuzeybatı komşusu", ["Bulgaristan"]],
      ["Pilav ve köfte yapımında kullanılan, kırılmış buğday", ["Bulgur"]],
      ["Üst dudağın üstünde çıkan kıllar", ["Bıyık"]],
      ["Duvarları renklendirmek için sürülen sıvı madde", ["Boya"]],
      ["İnşaat işçilerinin başına taktığı koruyucu sert şapka", ["Baret"]],
      ["Seyahatte eşyaların konduğu, kulplu büyük çanta", ["Bavul"]],
      ["Yufkadan yapılan peynirli veya kıymalı hamur işi", ["Börek"]],
      ["Muğla'da kalesiyle ünlü tatil ilçesi", ["Bodrum"]],
      ["Acısı ve dolması olan, kırmızı veya yeşil sebze", ["Biber"]],
      ["Küçük benekli yumurtalarıyla bilinen, ufak yabani kuş", ["Bıldırcın"]],
      ["Ramazan ve Kurban olmak üzere kutlanan özel gün", ["Bayram"]]
    ],
    "C": [
      ["Yumurtadan yeni çıkmış tavuk yavrusu", ["Civciv"]],
      ["Pantolon ve ceketlerde eşya koymaya yarayan bölüm", ["Cep"]],
      ["Haftanın beşinci günü", ["Cuma"]],
      ["Atatürk'ün 1923'te ilan ettiği yönetim biçimi", ["Cumhuriyet"]],
      ["Para ve kartları koyduğumuz küçük kap", ["Cüzdan"]],
      ["Çizgi çekmek ve uzunluk ölçmek için kullanılan araç", ["Cetvel"]],
      ["Kabuğu sert, içi beyni andıran kuruyemiş", ["Ceviz"]],
      ["Haftanın altıncı günü", ["Cumartesi"]],
      ["Pencerelerde kullanılan şeffaf ve kırılgan madde", ["Cam"]],
      ["Türk kahvesi pişirilen, uzun saplı küçük kap", ["Cezve"]],
      ["Pantolonun üstüne giyilen, kollu üst giysi", ["Ceket"]],
      ["Şehirlerde araçların geçtiği geniş yol", ["Cadde"]],
      ["İp üzerinde yürüyen, sirkte hüner gösteren kişi", ["Cambaz"]],
      ["Fas'ın doğu komşusu olan Kuzey Afrika ülkesi", ["Cezayir"]],
      ["Zarif ve hızlı koşan, boynuzlu bozkır hayvanı", ["Ceylan"]],
      ["Kaş almada kullanılan ince uçlu alet", ["Cımbız"]],
      ["Somunla birlikte kullanılan, vidalı bağlantı elemanı", ["Cıvata"]],
      ["Cumhuriyetlerde devletin başı", ["Cumhurbaşkanı"]],
      ["Korkusuzluk, yüreklilik", ["Cesaret"]],
      ["Eli açık, vermeyi seven", ["Cömert"]],
      ["Sorulara verilen karşılık", ["Cevap"]],
      ["Korkusuz, yürekli", ["Cesur"]],
      ["Vücudumuzu kaplayan en dış tabaka", ["Cilt"]],
      ["Amerika'da doğan, doğaçlamaya dayalı müzik türü", ["Caz"]],
      ["Havaya, suya ve toprağa düştüğüne inanılan sıcaklık", ["Cemre"]],
      ["Kebabı yapılan, akciğerle birlikte anılan iç organ", ["Ciğer"]],
      ["Masallarda süpürgeyle uçan kötü büyücü kadın", ["Cadı"]],
      ["Boyu normalden çok kısa olan kişi", ["Cüce"]],
      ["Korkutucu ve zararlı masal yaratığı", ["Canavar"]],
      ["Gözle görülmeyen, ateşten yaratıldığına inanılan varlık", ["Cin"]],
      ["Plajlarda boğulma tehlikesine karşı bekleyen görevli", ["Cankurtaran"]],
      ["İnce dilimlenmiş kızarmış patates atıştırmalığı", ["Cips"]],
      ["Harflerle denklemleri çözen matematik dalı", ["Cebir"]],
      ["Yeryüzünün şekillerini, iklimini ve ülkeleri inceleyen bilim", ["Coğrafya"]],
      ["Madenin işlenmemiş, taşlı hâli", ["Cevher"]],
      ["Müslümanların ibadet için toplandığı yapı", ["Cami"]],
      ["Suç işleyene verilen yaptırım", ["Ceza"]],
      ["Eski evlerde üst katın dışa taşan çıkması", ["Cumba"]],
      ["Hâkimlerin ve din görevlilerinin giydiği uzun, geniş giysi", ["Cüppe"]],
      ["Müminlerin ahirette gireceğine inandığı güzel yurt", ["Cennet"]]
    ],
    "Ç": [
      ["Yemek yerken kullanılan, uçları dişli sofra aleti", ["Çatal"]],
      ["Kum tepeleriyle kaplı, yağmurun çok az düştüğü kurak bölge", ["Çöl"]],
      ["Türklerin en çok içtiği, demlenerek hazırlanan sıcak içecek", ["Çay"]],
      ["Okula giderken sırtta veya omuzda taşınan eşya taşıma aracı", ["Çanta"]],
      ["Kaşıkla içilen, sıvı sıcak yemek", ["Çorba"]],
      ["Arıların nektar topladığı, rengârenk bitki parçası", ["Çiçek"]],
      ["Haftanın üçüncü günü", ["Çarşamba"]],
      ["Kırmızı, yüzeyinde minik tohumlar olan yaz meyvesi", ["Çilek"]],
      ["Çivi çakmaya yarayan alet", ["Çekiç"]],
      ["Boğazıyla ünlü, 1915 savaşlarının yaşandığı il", ["Çanakkale"]],
      ["Bebeklikten sonraki, henüz büyümemiş kişi", ["Çocuk"]],
      ["Ayağa ayakkabının içine giyilen giysi", ["Çorap"]],
      ["Dükkânların bir arada bulunduğu alışveriş yeri", ["Çarşı"]],
      ["Kozalak veren, yılın her mevsimi yeşil kalan ağaç", ["Çam"]],
      ["Kamp yaparken kurulan bez barınak", ["Çadır"]],
      ["Meyvenin içindeki sert tohum", ["Çekirdek"]],
      ["Çin Seddi ile ünlü, dünyanın en kalabalık ülkelerinden Asya ülkesi", ["Çin"]],
      ["Leblebisiyle ünlü Orta Karadeniz şehri", ["Çorum"]],
      ["Yağmurdan sonra toprağın ıslanıp yapış yapış olmuş hâli", ["Çamur"]],
      ["Tablonun veya fotoğrafın etrafına takılan kenarlık", ["Çerçeve"]],
      ["Tarlada ekip biçen kişi", ["Çiftçi"]],
      ["Evin en üstündeki, yağmuru geçirmeyen kapak", ["Çatı"]],
      ["Ocak veya sigara yakmaya yarayan küçük alet", ["Çakmak"]],
      ["Kalemle çekilen uzun ve ince iz", ["Çizgi"]],
      ["Bebeklerin salladığı, ses çıkaran oyuncak", ["Çıngırak"]],
      ["Gölgesiyle ünlü, çok uzun yaşayan geniş yapraklı büyük ağaç", ["Çınar"]],
      ["Topraktan yapılan yemek pişirme kabı", ["Çömlek"]],
      ["Tuz Mağarası ile bilinen İç Anadolu şehri", ["Çankırı"]],
      ["Kışın sonunda açan, küçük soğanlı çiçek", ["Çiğdem"]],
      ["Tahıl veya un konan kalın kumaş torba", ["Çuval"]],
      ["Kilitleri açan usta", ["Çilingir"]],
      ["Masanın içinde kayarak açılan göz", ["Çekmece"]],
      ["Çocukların sopayla yuvarladığı halka", ["Çember"]],
      ["Ustanın yanında meslek öğrenen genç", ["Çırak"]],
      ["Musluğundan su akan, yol kenarındaki yapı", ["Çeşme"]],
      ["Çekiçle çakılan sivri metal parça", ["Çivi"]],
      ["Makinede yıkanan giysiler", ["Çamaşır"]],
      ["Hayvan ve tarım işlerinin yapıldığı kırsal işletme", ["Çiftlik"]],
      ["Kara ekmeği yapılan tahıl", ["Çavdar"]],
      ["Ayçekirdeği, fıstık, leblebi gibi atıştırılan kuruyemişler", ["Çerez"]]
    ],
    "D": [
      ["Yemekleri çiğnememizi sağlayan, ağızdaki sert yapılar", ["Diş"]],
      ["Karadeniz ve Akdeniz gibi tuzlu su kütlesi", ["Deniz"]],
      ["Üzerinde yaşadığımız gezegen", ["Dünya"]],
      ["Ağızda bulunan, tat almamızı sağlayan organ", ["Dil"]],
      ["Zirvesi karla kaplı olabilen, yerden yüksek doğal yükselti", ["Dağ"]],
      ["Hastaları muayene edip tedavi eden kişi", ["Doktor"]],
      ["Salatalarda kullanılan, kırmızı ve sulu sebze", ["Domates"]],
      ["Çubukla vurularak çalınan vurmalı çalgı", ["Davul"]],
      ["Yazın külahta yenen soğuk tatlı", ["Dondurma"]],
      ["Pamukkale'nin bulunduğu Ege şehri", ["Denizli"]],
      ["Babanın veya annenin babası", ["Dede"]],
      ["Ders notlarının yazıldığı çizgili kâğıt cilt", ["Defter"]],
      ["Surlarıyla ve karpuzuyla ünlü Güneydoğu şehri", ["Diyarbakır"]],
      ["Hakemin üflediği, keskin ses çıkaran araç", ["Düdük"]],
      ["Giysilerin asıldığı veya yiyeceklerin saklandığı mobilya", ["Dolap"]],
      ["Üçten sonra gelen sayı", ["Dört"]],
      ["Evin odalarını ayıran, tuğlalardan örülen yapı", ["Duvar"]],
      ["Ağzın etrafındaki pembe etli bölüm", ["Dudak"]],
      ["Belirli güzergâhta yolcu toplayan minibüs", ["Dolmuş"]],
      ["Dişleri tedavi eden doktor", ["Dişçi"]],
      ["Çölde yaşayan, hörgüçlü hayvan", ["Deve"]],
      ["Denizde kıyıya doğru yuvarlanan su kabarması", ["Dalga"]],
      ["Hayvanların vücudunu örten, ayakkabı yapımında da kullanılan madde", ["Deri"]],
      ["Buz taneleri hâlinde yağan yağış", ["Dolu"]],
      ["Evlenme töreni", ["Düğün"]],
      ["Güneşin doğduğu yön", ["Doğu"]],
      ["Başkenti Kopenhag olan ülke", ["Danimarka"]],
      ["Çemberin iç kısmıyla oluşan yuvarlak geometrik şekil", ["Daire"]],
      ["Yaprağı yemeklerde kullanılan, kokulu ağaç", ["Defne"]],
      ["Milyonlarca yıl önce yaşamış devasa sürüngen", ["Dinozor"]],
      ["Bir kuruma yazılan resmî istek yazısı", ["Dilekçe"]],
      ["Zeytinyağlı, içi pirinç doldurulmuş biber veya patlıcan yemeği", ["Dolma"]],
      ["Denizin altına dalan kişi", ["Dalgıç"]],
      ["Lavaşa sarılan et yemeği", ["Dürüm"]],
      ["Annenin erkek kardeşi", ["Dayı"]],
      ["Birbirine geçerek hareket ileten çark", ["Dişli"]],
      ["Gizemli olayları çözen araştırmacı", ["Dedektif"]],
      ["Kahramanlıkları anlatan uzun manzum anlatı", ["Destan"]],
      ["Uzaktaki şeyleri yakın gösteren, iki gözlü alet", ["Dürbün"]],
      ["Pastadan veya ekmekten kesilen parça", ["Dilim"]]
    ],
    "E": [
      ["Adem ile Havva'nın yediği rivayet edilen meyve", ["Elma"]],
      ["Dünyanın en yüksek dağı", ["Everest", "Everest Dağı"]],
      ["Eylül'den sonra gelen ay", ["Ekim"]],
      ["Uzun kulaklı, 'anıran' çiftlik hayvanı", ["Eşek"]],
      ["Fırında pişirilen, sofranın vazgeçilmez yiyeceği", ["Ekmek"]],
      ["Paris'te bulunan, demirden yapılmış ünlü kule", ["Eyfel", "Eyfel Kulesi"]],
      ["Palandöken kayak merkeziyle ünlü Doğu Anadolu şehri", ["Erzurum"]],
      ["Yılın dokuzuncu ayı", ["Eylül"]],
      ["Prizden gelen, ampulleri yakan enerji", ["Elektrik"]],
      ["Selimiye Camii ile ünlü Trakya şehri", ["Edirne"]],
      ["Kadınların giydiği, tek parça giysi", ["Elbise"]],
      ["Elleri soğuktan koruyan giysi", ["Eldiven"]],
      ["Masallarda ateş püskürten, uçan canavar", ["Ejderha"]],
      ["Küçük, mor veya sarı çekirdekli meyve", ["Erik"]],
      ["Porsuk Çayı ile ünlü, üniversite şehri", ["Eskişehir"]],
      ["Dünyanın en sert, değerli taşı", ["Elmas"]],
      ["Televizyonda görüntünün göründüğü yüzey", ["Ekran"]],
      ["Belden aşağı giyilen, bacakları ayrı olmayan kadın giysisi", ["Etek"]],
      ["İlaçların satıldığı yer", ["Eczane"]],
      ["Uzay, yıldızlar ve galaksilerin tümü", ["Evren"]],
      ["Dünyayı kuzey ve güney yarım küreye ayıran hayali çizgi", ["Ekvator"]],
      ["Başa veya boyuna takılan ince kumaş", ["Eşarp"]],
      ["Müslümanlara namaz vaktini bildirmek için okunur", ["Ezan"]],
      ["Bir devleti başka bir ülkede temsil eden kişi", ["Elçi", "Büyükelçi"]],
      ["Para, üretim ve tüketimi inceleyen bilim", ["Ekonomi"]],
      ["Hazar Gölü'nün bulunduğu Doğu Anadolu şehri", ["Elazığ"]],
      ["Dağlarda yol kesen, soygun yapan haydut", ["Eşkıya"]],
      ["Boynun arka bölümü", ["Ense"]],
      ["Tırnağı veya metali düzeltmede kullanılan pürüzlü araç", ["Eğe"]],
      ["Roman, şiir ve hikâyeleri inceleyen sanat dalı", ["Edebiyat"]],
      ["Ata binmek için sırta konan deri takım", ["Eyer"]],
      ["Çalışma hayatını bitirip aylık alan kimse", ["Emekli"]],
      ["Spor yaparken giyilen rahat altlı üstlü giysi", ["Eşofman"]],
      ["Ürünlerin üzerine yapıştırılan fiyat kâğıdı", ["Etiket"]],
      ["Fiyatların genel olarak artması", ["Enflasyon"]],
      ["Küçük dükkân sahibi, çarşı ticaretiyle uğraşan kimse", ["Esnaf"]],
      ["Su üzerine boya damlatılarak yapılan geleneksel kâğıt sanatı", ["Ebru"]],
      ["Aynı işi birlikte yapan topluluk", ["Ekip"]],
      ["Anne ve babaya birlikte verilen ad", ["Ebeveyn"]],
      ["Bebeklerin ağlamasını kesmek için ağzına verilen lastik uç", ["Emzik"]]
    ],
    "F": [
      ["Hortumu olan, karaların en büyük hayvanı", ["Fil"]],
      ["Kadıköy'de stadı bulunan sarı lacivert futbol kulübü", ["Fenerbahçe"]],
      ["Başkenti Paris olan ülke", ["Fransa"]],
      ["Türkiye'nin Karadeniz kıyılarında en çok yetiştirilen kuruyemiş", ["Fındık"]],
      ["Kediler tarafından kovalanan küçük kemirgen", ["Fare"]],
      ["Kaleye gol atılarak oynanan, on birer kişilik takım sporu", ["Futbol"]],
      ["Ekmek ve kek pişirilen, kapalı ve sıcak bölme", ["Fırın"]],
      ["Makineyle çekilen, anıları saklamaya yarayan görüntü", ["Fotoğraf"]],
      ["İstanbul'u 1453'te fetheden Osmanlı padişahı", ["Fatih", "Fatih Sultan Mehmet"]],
      ["Şiddetli rüzgârlı ve yağışlı hava olayı", ["Fırtına"]],
      ["Yeşil veya kuru kullanılan, yemeği yapılan bakliyat", ["Fasulye"]],
      ["Kahvenin içildiği küçük kap", ["Fincan"]],
      ["Diş temizlemede veya boyamada kullanılan saplı araç", ["Fırça"]],
      ["Binlerce gölü olan, başkenti Helsinki olan ülke", ["Finlandiya"]],
      ["Başkenti Rabat olan Kuzey Afrika ülkesi", ["Fas"]],
      ["Madde ve enerjiyi inceleyen bilim", ["Fizik"]],
      ["Ürünlerin seri üretildiği büyük yapı", ["Fabrika"]],
      ["Genç ağaç", ["Fidan"]],
      ["Ceket veya pantolonu kapatan dişli kapama", ["Fermuar"]],
      ["Karanlıkta yolu aydınlatan taşınabilir ışık", ["Fener"]],
      ["Havuzlarda suyu yukarı fışkırtan düzenek", ["Fıskiye"]],
      ["Sinemada gösterilen, görüntülü hikâye", ["Film"]],
      ["Üflemeli bir çalgı", ["Flüt"]],
      ["Varlık, bilgi ve doğruyu sorgulayan düşünce alanı", ["Felsefe"]],
      ["Türkiye'den doğup Irak'a akan, Mezopotamya'yı oluşturan nehir", ["Fırat"]],
      ["Firmaların ürünlerini sergilediği büyük organizasyon", ["Fuar"]],
      ["Kutuplarda yaşayan, yüzgeçli sevimli deniz memelisi", ["Fok"]],
      ["Domatesli yemeklerde kullanılan, kokulu yeşil ot", ["Fesleğen"]],
      ["Rüzgârda dönen kâğıt oyuncak", ["Fırıldak"]],
      ["Filin uzun dişlerinden elde edilen beyaz madde", ["Fildişi"]],
      ["Banyo ve mutfak duvarlarına döşenen sırlı çini", ["Fayans"]],
      ["Araçları ve yolcuları karşıya geçiren gemi", ["Feribot"]],
      ["Bir belgenin makineyle çoğaltılmış hâli", ["Fotokopi"]],
      ["Bir malın satış bedeli", ["Fiyat"]],
      ["Baklavanın üstüne serpilen yeşil kuruyemiş", ["Fıstık", "Antep fıstığı"]],
      ["Hayvanların konuştuğu, ders veren kısa hikâye", ["Fabl"]],
      ["Zihinde beliren düşünce", ["Fikir"]],
      ["Taşlaşmış canlı kalıntısı", ["Fosil"]],
      ["Turşu ve şarap konulan, tahtadan yapılmış büyük kap", ["Fıçı"]],
      ["Gömleğin altına giyilen kolsuz iç giysisi", ["Fanila"]]
    ],
    "G": [
      ["Dünyamızı ısıtan ve aydınlatan yıldız", ["Güneş"]],
      ["Yağmurdan sonra gökyüzünde beliren yedi renkli yay", ["Gökkuşağı"]],
      ["Aslan simgeli, sarı kırmızı renkli İstanbul futbol kulübü", ["Galatasaray"]],
      ["Görmemizi sağlayan organ", ["Göz"]],
      ["Güneş battıktan sonra gelen karanlık zaman", ["Gece"]],
      ["Altından sonra en değerli sayılan, parlak beyaz maden", ["Gümüş"]],
      ["Altı telli çalgı", ["Gitar"]],
      ["Her gün çıkan, haberleri içeren basılı yayın", ["Gazete"]],
      ["Baklavası ve fıstığıyla ünlü Güneydoğu şehri", ["Gaziantep"]],
      ["Çevresi karayla çevrili tatlı su kütlesi", ["Göl"]],
      ["Dikenli saplı, güzel kokulu, kırmızı çiçek", ["Gül"]],
      ["Düğmeli, yakalı üst giysi", ["Gömlek"]],
      ["Görmeyi düzelten camlı araç", ["Gözlük"]],
      ["Burun akıntısı ve ateşle seyreden hastalık", ["Grip"]],
      ["Tarlalarda açan kırmızı yabani çiçek", ["Gelincik"]],
      ["Denizde yük ve yolcu taşıyan büyük taşıt", ["Gemi"]],
      ["Çok katlı, bulutlara değecek kadar yüksek bina", ["Gökdelen"]],
      ["Güneş'in çevresinde dönen, Dünya gibi gök cismi", ["Gezegen"]],
      ["Memleketten uzakta yaşanan yer", ["Gurbet"]],
      ["Siyah ile beyazın karışımı renk", ["Gri"]],
      ["Çanakkale'nin Ege'deki en büyük adası", ["Gökçeada"]],
      ["Fındığıyla ünlü Karadeniz şehri", ["Giresun"]],
      ["Barışı simgeleyen, boz renkli kuş", ["Güvercin"]],
      ["Düğünde beyaz giyen, evlenen kadın", ["Gelin"]],
      ["Kuzeyin tersi yön", ["Güney"]],
      ["Her gün tutulan hatıra defteri", ["Günlük"]],
      ["Afrika ormanlarında yaşayan dev maymun", ["Goril"]],
      ["Acımsı, büyük sarı veya pembe narenciye", ["Greyfurt"]],
      ["Başımızın üstündeki mavi alan", ["Gökyüzü"]],
      ["Rahatsız eden yüksek ses", ["Gürültü"]],
      ["Çikolata kaplı, katmanlı ince bisküvi", ["Gofret"]],
      ["Giysilerin asıldığı büyük mobilya", ["Gardırop"]],
      ["Boynuzları dallı, ormanda yaşayan hayvan", ["Geyik"]],
      ["Kuşaktan kuşağa aktarılan âdetler", ["Gelenek"]],
      ["Sınırdan geçen malların kontrol edildiği yer", ["Gümrük"]],
      ["Kuşların yemek yediği sert ağız", ["Gaga"]],
      ["Işığın önüne çıkan cismin yere düşen karartısı", ["Gölge"]],
      ["Arabanın park edildiği kapalı yer", ["Garaj"]],
      ["Yünlü giysileri delen küçük kelebek", ["Güve"]],
      ["Çalışarak veya yatırımla kazanılan para", ["Gelir"]]
    ],
    "H": [
      ["Mekke'ye yapılan kutsal ziyaret", ["Hac"]],
      ["Yeryüzünü saran, soluduğumuz gaz karışımı", ["Hava"]],
      ["Doktorun muayene ettiği kişi", ["Hasta"]],
      ["Futbol maçını yöneten ve düdük çalan kişi", ["Hakem"]],
      ["Turuncu renkli, tavşanın sevdiği kök sebze", ["Havuç"]],
      ["Yere serilen, desenli dokuma örtü", ["Halı"]],
      ["Yıkanmak için kullanılan, buharlı yapı", ["Hamam"]],
      ["Antakya'nın da içinde bulunduğu Akdeniz şehri", ["Hatay"]],
      ["Yılın altıncı ayı", ["Haziran"]],
      ["Pervaneleriyle dikey kalkıp inebilen hava aracı", ["Helikopter"]],
      ["Karadeniz'in en meşhur küçük balığı", ["Hamsi"]],
      ["Taç Mahal'in bulunduğu Güney Asya ülkesi", ["Hindistan"]],
      ["Lale ve yel değirmenleriyle ünlü ülke", ["Hollanda"]],
      ["Doktora yardım eden, hastalara bakan sağlık görevlisi", ["Hemşire"]],
      ["Birine armağan olarak verilen şey", ["Hediye"]],
      ["Ramazanda oruç açarken yenen tatlı kuru meyve", ["Hurma"]],
      ["Hastaların tedavi edildiği yer", ["Hastane"]],
      ["Başkasının malını çalan kişi", ["Hırsız"]],
      ["Un ve suyla yoğrulan, ekmek yapımında kullanılan karışım", ["Hamur"]],
      ["Yeni ayın ince, orak biçimli görünümü", ["Hilal"]],
      ["Yeryüzünün kâğıt üzerine küçültülmüş çizimi", ["Harita"]],
      ["Korsanların gömdüğü değerli şeylerin toplamı", ["Hazine"]],
      ["Taştan veya tunçtan yapılan üç boyutlu sanat eseri", ["Heykel"]],
      ["Kelimelerin tek soluk ile söylenen parçası", ["Hece"]],
      ["Alfabeyi oluşturan işaretlerden her biri", ["Harf"]],
      ["Sesi yükselten cihaz", ["Hoparlör"]],
      ["Banyodan sonra kurulanmak için kullanılan bez", ["Havlu"]],
      ["Kafeste çark çeviren küçük kemirgen", ["Hamster"]],
      ["Burnu gıdıklayınca istemsizce yapılan hareket", ["Hapşırık"]],
      ["Sabahları öten, ibiği olan erkek kümes hayvanı", ["Horoz"]],
      ["Önü düğmeli örgü üst giysi", ["Hırka"]],
      ["Toplama, çıkarma gibi sayılarla yapılan işlem", ["Hesap"]],
      ["Olgunlaşan ürünlerin toplanması", ["Hasat"]],
      ["Kısa, sivri uçlu bıçak", ["Hançer"]],
      ["Gemileri bağlamakta kullanılan kalın ip", ["Halat"]],
      ["Bilgileri akılda tutma yetisi", ["Hafıza"]],
      ["Uçakların kalkıp indiği yer", ["Havaalanı", "Havalimanı"]],
      ["Başkalarının farklılıklarına anlayış gösterme", ["Hoşgörü"]],
      ["Kısa anlatı türü, öykü", ["Hikâye", "Hikaye"]],
      ["Şükran Günü sofralarının iri kümes hayvanı", ["Hindi"]]
    ],
    "I": [
      ["Lambadan ve güneşten yayılan, aydınlatan şey", ["Işık"]],
      ["Yeşil yapraklı, Temel Reis'in güç almak için yediği sebze", ["Ispanak"]],
      ["Başkenti Bağdat olan ülke", ["Irak"]],
      ["Nehir sözcüğünün Türkçe karşılığı", ["Irmak"]],
      ["Köfte ve et pişirmede kullanılan, demir çubuklu pişirme aracı", ["Izgara"]],
      ["Soğuk algınlığında içilen, çiçeğinden yapılan çay", ["Ihlamur"]],
      ["Gülüyle ünlü Göller Yöresi şehri", ["Isparta"]],
      ["Ne sıcak ne soğuk olan", ["Ilık"]],
      ["Dokununca yakan, çorbası yapılan bitki", ["Isırgan"]],
      ["Ağrı Dağı'nın eteğinde, Ermenistan sınırındaki il", ["Iğdır"]],
      ["Karanlıkta ışık huzmesi gönderen el feneri", ["Işıldak"]],
      ["Dudaklarla çıkarılan ince ses", ["Islık"]],
      ["Ne çok sıcak ne çok soğuk olan iklim", ["Ilıman"]],
      ["Helva ve pilavda kullanılan, buğdaydan elde edilen iri tane", ["Irmik"]],
      ["Su ile temas edip nemlenmiş", ["Islak"]],
      ["Gündelik işçi", ["Irgat"]],
      ["İplik eğirmeye yarayan ahşap alet", ["Iğ"]],
      ["Yaşlı kişi", ["Ihtiyar"]],
      ["Sigaranın yanıp bitmiş kalıntısı", ["Izmarit"]],
      ["Parlak, göz alan ışık", ["Işıltı"]],
      ["Güneşten çıkan ince ışık demeti", ["Işın"]],
      ["Bir şeyin dişle koparılan parçası", ["Isırık"]],
      ["Çankırı ile Kastamonu sınırındaki kayak merkezi olan dağ", ["Ilgaz", "Ilgaz Dağı"]],
      ["Olasılık", ["Ihtimal"]],
      ["Gereksinim", ["Ihtiyaç"]],
      ["Fiyattan yapılan indirim", ["Iskonto"]],
      ["Suyu kaynatan veya odayı ısıtan cihaza verilen genel ad", ["Isıtıcı"]],
      ["Üşüyen birinin sıcaklık kazanması", ["Isınmak"]],
      ["Hedefi vuramamak", ["Iskalamak"]],
      ["Aşırıya kaçmayan, ölçülü", ["Ilımlı"]],
      ["Soğuk ve sıcak ölçüsünü belirleyen fiziksel nicelik", ["Isı"]],
      ["Kırmızı kabuklu, kıskaçlı büyük deniz canlısı", ["Istakoz"]],
      ["Mühür basılan mürekkepli ped", ["Istampa"]],
      ["Kullanılmayacak kadar bozuk, ayıklanan mal", ["Iskarta"]],
      ["Dişle koparmak", ["Isırmak"]],
      ["Doğruluğunu kanıtlamak", ["Ispatlamak"]],
      ["Suyla ıslak hâle getirmek", ["Islatmak"]],
      ["Soğuk yemeği tekrar sıcak yapmak", ["Isıtmak"]],
      ["Sıcak su kaynağı bulunan yer", ["Ilıca"]],
      ["Karanlık, harap ve kasvetli yer", ["Izbe"]]
    ],
    "İ": [
      ["Türkiye'nin en kalabalık şehri", ["İstanbul"]],
      ["Ege'nin en büyük limanı olan, Kordon'uyla ünlü şehir", ["İzmir"]],
      ["Dikiş dikmeye yarayan, ucu sivri ve iplik geçirilen araç", ["İğne"]],
      ["Sütü içilen, boynuzlu çiftlik hayvanı", ["İnek"]],
      ["Düğümlenen, ince uzun bağlama malzemesi", ["İp"]],
      ["Başkenti Londra olan ülke", ["İngiltere"]],
      ["Başkenti Madrid olan ülke", ["İspanya"]],
      ["Çizme biçimindeki Avrupa ülkesi", ["İtalya"]],
      ["İpekböceğinin kozasından elde edilen parlak kumaş", ["İpek"]],
      ["Düşünebilen ve konuşabilen canlı", ["İnsan"]],
      ["Kıştan sonra gelen mevsim", ["İlkbahar"]],
      ["Çikolatası, saatleri ve Alpleri ile ünlü ülke", ["İsviçre"]],
      ["Başkenti Tahran olan komşu ülke", ["İran"]],
      ["Dünyada en çok konuşulan ortak dil", ["İngilizce"]],
      ["Hastalıkları tedavi etmek için kullanılan madde", ["İlaç"]],
      ["Çalışanların her gün yaptığı görev", ["İş"]],
      ["Bina yapma işi", ["İnşaat"]],
      ["Kişilere ve nesnelere verilen ad", ["İsim"]],
      ["Belgelere atılan, kişiye özgü işaret", ["İmza"]],
      ["Yangınları söndüren ekip", ["İtfaiye"]],
      ["Dünyayı birbirine bağlayan bilgisayar ağı", ["İnternet"]],
      ["İstiridyenin içinde oluşan değerli beyaz küre", ["İnci"]],
      ["Kamp yapan, doğada yaşamayı öğrenen çocuk", ["İzci"]],
      ["Beyoğlu'ndaki ünlü yaya caddesi", ["İstiklal", "İstiklal Caddesi"]],
      ["Başkenti Stockholm olan İskandinav ülkesi", ["İsveç"]],
      ["Gemi ve vapurların yanaştığı yer", ["İskele"]],
      ["Ayak basılan yerde kalan işaret", ["İz"]],
      ["Ağzı kapaklı, sapı olan su kabı", ["İbrik"]],
      ["İlin alt bölgesi", ["İlçe"]],
      ["Trenlerin durduğu yer", ["İstasyon"]],
      ["Aynı anda doğan kardeşlerden biri", ["İkiz"]],
      ["Fabrikada çalışan kimse", ["İşçi"]],
      ["Dört yıl süren ilk okul", ["İlkokul"]],
      ["Su, ayran, meyve suyu gibi sıvılar", ["İçecek"]],
      ["Papaz, kız ve vale kartlarının bulunduğu oyun destesi", ["İskambil"]],
      ["Büyük bir devletin en üst yöneticisi", ["İmparator"]],
      ["Bir şeyi bulmaya yardım eden küçük bilgi", ["İpucu"]],
      ["Daha önce olmayan bir şeyi ilk kez yapma", ["İcat"]],
      ["Pusula ve saatte yön gösteren çubuk", ["İbre"]],
      ["Bir yerin uzun yıllar boyu süren hava durumu", ["İklim"]]
    ],
    "J": [
      ["Kırsal bölgelerde görev yapan askeri güvenlik gücü", ["Jandarma"]],
      ["Yarışmalarda puan veren veya karar veren kurul", ["Jüri"]],
      ["Sakal tıraşında kullanılan keskin ince bıçak", ["Jilet"]],
      ["Başkenti Tokyo olan ülke", ["Japonya"]],
      ["Güneş Sistemi'nin en büyük gezegeni", ["Jüpiter"]],
      ["Güney Amerika'da yaşayan, benekli büyük kedi", ["Jaguar"]],
      ["Telefon veya oyun makinelerinde kullanılan küçük metal para", ["Jeton"]],
      ["Halka, barfiks ve yer hareketleri içeren spor dalı", ["Jimnastik"]],
      ["Yerkabuğunu ve kayaçları inceleyen bilim dalı", ["Jeoloji"]],
      ["El kol hareketiyle yapılan anlatım", ["Jest"]],
      ["Meyve suyundan yapılan, titreyen tatlı", ["Jöle"]],
      ["Endonezya'nın başkenti", ["Jakarta", "Cakarta"]],
      ["Dilimli sandviç malzemesi olan, tuzlanmış et", ["Jambon"]],
      ["Japonya kökenli, yere devirme sporu", ["Judo"]],
      ["Tatlılarda kıvam veren, hayvansal kökenli madde", ["Jelatin"]],
      ["Elektrik kesilince devreye giren enerji üreticisi", ["Jeneratör"]],
      ["Çok hızlı giden uçak", ["Jet"]],
      ["Lastiğin takıldığı metal tekerlek parçası", ["Jant"]],
      ["Kartlarda her yerde kullanılabilen özel kart", ["Joker"]],
      ["Akvaryumda beslenen turuncu balık", ["Japon balığı"]],
      ["Çuval yapımında kullanılan lif bitkisi", ["Jüt"]],
      ["Kabarcıklı su sistemi olan büyük küvet", ["Jakuzi"]],
      ["Pencerede ışığı ayarlayan yatay panjur", ["Jaluzi"]],
      ["Reggae müziği ile ünlü Karayip ülkesi", ["Jamaika"]],
      ["Kadın hastalıkları doktoru", ["Jinekolog"]],
      ["Yer bilimci", ["Jeolog"]],
      ["Meslek grubuna özgü özel konuşma dili", ["Jargon"]],
      ["Meyve aromalı, çiğnenen yumuşak şekerleme", ["Jelibon"]],
      ["At yarışlarında atı süren kişi", ["Jokey"]],
      ["Filmin başında veya sonunda geçen oyuncu ve yapımcı listesi", ["Jenerik"]],
      ["Arazide giden yüksek, dayanıklı araç", ["Jip", "Jeep"]],
      ["Topları havaya atıp yakalayan sirk sanatçısı", ["Jonglör"]],
      ["Japonya'da yaşayan kişi", ["Japon"]],
      ["Yerin ısısından elde edilen enerji türü", ["Jeotermal"]],
      ["Spor giysilerinde kullanılan esnek örme kumaş", ["Jarse"]],
      ["Judo yapan sporcu", ["Judoka"]],
      ["Jimnastik yapan sporcu", ["Jimnastikçi"]]
    ],
    "K": [
      ["Yazı yazmaya yarayan araç", ["Kalem"]],
      ["Sayfalardan oluşan, okumak için kullanılan ciltli eser", ["Kitap"]],
      ["Vücutta kanı pompalayan organ", ["Kalp"]],
      ["Kış mevsiminde gökten yağan beyaz taneler", ["Kar"]],
      ["Miyavlayan evcil hayvan", ["Kedi"]],
      ["Havlayan, insanın en sadık dostu sayılan hayvan", ["Köpek"]],
      ["Fincanda içilen, çekirdeklerinden yapılan koyu içecek", ["Kahve"]],
      ["Mantısı ve pastırmasıyla ünlü İç Anadolu şehri", ["Kayseri"]],
      ["Bayrağında akçaağaç yaprağı bulunan Kuzey Amerika ülkesi", ["Kanada"]],
      ["Güçlü pençeli, yüksekten uçan yırtıcı kuş", ["Kartal"]],
      ["Gagası ve kanatları olan, genellikle uçabilen hayvanlara verilen genel ad", ["Kuş"]],
      ["Odaya girip çıkmaya yarayan, kilitlenebilen bölüm", ["Kapı"]],
      ["Rahat oturmak için kullanılan, kolçaklı mobilya", ["Koltuk"]],
      ["Çizgili tüylü, Asya'nın büyük yırtıcı kedisi", ["Kaplan"]],
      ["Gölde vıraklayan, sıçrayan yeşil hayvan", ["Kurbağa"]],
      ["Ağır yük taşıyan kara taşıtı", ["Kamyon"]],
      ["Yılın on birinci ayı", ["Kasım"]],
      ["Pusulanın üst yönü", ["Kuzey"]],
      ["Mevlana'nın şehri", ["Konya"]],
      ["Peyniri ve sert kışı ile ünlü Doğu Anadolu şehri", ["Kars"]],
      ["Peri bacalarıyla ve balon turlarıyla ünlü bölge", ["Kapadokya"]],
      ["Asya ve Afrika gibi büyük kara parçası", ["Kıta"]],
      ["Bilgisayarda harf yazmaya yarayan tuşlu aygıt", ["Klavye"]],
      ["İskeleti oluşturan sert doku", ["Kemik"]],
      ["Dikenli, topaklanıp korunan küçük hayvan", ["Kirpi"]],
      ["Yazın yenen, içi kırmızı, kabuğu yeşil iri meyve", ["Karpuz"]],
      ["Malatya'nın en ünlü sarı meyvesi", ["Kayısı"]],
      ["Nehir ve boğazların iki yakasını bağlayan yapı", ["Köprü"]],
      ["Çorba içmeye yarayan sofra aleti", ["Kaşık"]],
      ["Rengârenk kanatlı, tırtıldan dönüşen böcek", ["Kelebek"]],
      ["Para biriktirilen küçük kap", ["Kumbara"]],
      ["Et satan esnaf", ["Kasap"]],
      ["Altın ve takı satan esnaf", ["Kuyumcu"]],
      ["Arıların bal yaptığı yer", ["Kovan"]],
      ["Çölde yetişen dikenli bitki", ["Kaktüs"]],
      ["Yünden dokunan, yere serilen süslü örtü", ["Kilim"]],
      ["Karnındaki keseyle yavrusunu taşıyan Avustralya hayvanı", ["Kanguru"]],
      ["Saç kesen ve şekillendiren kişi", ["Kuaför"]],
      ["Makineden geçirilmiş et", ["Kıyma"]],
      ["Denizin kıyısındaki kumlu yer", ["Kumsal"]]
    ],
    "L": [
      ["Sarı renkli, ekşi bir narenciye", ["Limon"]],
      ["Hollanda ile özdeşleşen, soğanından yetişen çiçek", ["Lale"]],
      ["Pudra şekerine bulanmış, jelatinimsi Türk tatlısı", ["Lokum"]],
      ["İngiltere'nin başkenti", ["Londra"]],
      ["Uzun bacaklı, yuvasını bacalara yapan göçmen kuş", ["Leylek"]],
      ["Odayı aydınlatan elektrikli eşya", ["Lamba"]],
      ["Sarma yapılan, yaprakları iç içe yapraklı sebze", ["Lahana"]],
      ["Koyu mavi renk", ["Lacivert"]],
      ["Başkenti Beyrut olan Akdeniz ülkesi", ["Lübnan"]],
      ["Vagonları çeken, trenin önündeki makine", ["Lokomotif"]],
      ["Benekli, Afrika ve Asya'da yaşayan büyük kedi", ["Leopar"]],
      ["Gemilerin yanaştığı, yük ve yolcu indirilen yer", ["Liman"]],
      ["İlkokul ve ortaokuldan sonra gelen okul", ["Lise"]],
      ["Türkiye'nin para birimi", ["Lira", "Türk Lirası"]],
      ["Yoğun ışık demeti", ["Lazer"]],
      ["Araba tekerleğinin dışındaki kauçuk kaplama", ["Lastik"]],
      ["Kavrulmuş nohut", ["Leblebi"]],
      ["İnce hamur üzerine kıymalı yemek", ["Lahmacun"]],
      ["Alt alta yazılmış öğeler", ["Liste"]],
      ["Portekiz'in başkenti", ["Lizbon"]],
      ["Güneybatıdan esen rüzgâr", ["Lodos"]],
      ["Yemek yenen, hazır yemek satılan yer", ["Lokanta"]],
      ["İstanbul Boğazı'nın meşhur balığı", ["Lüfer"]],
      ["Trafikte yolu gösteren işaret", ["Levha"]],
      ["Deney ve araştırma yapılan yer", ["Laboratuvar"]],
      ["Çıkışı bulmak zor olan dolambaçlı yapı", ["Labirent"]],
      ["El yıkamak için kullanılan banyo parçası", ["Lavabo"]],
      ["Yanardağdan çıkan kızgın erimiş kayaç", ["Lav"]],
      ["Limondan yapılan serinletici içecek", ["Limonata"]],
      ["Futbol takımlarının sezon boyunca oynadığı puanlı turnuva", ["Lig"]],
      ["Mor renkli, güzel kokulu bitki", ["Lavanta"]],
      ["Çamaşır veya el yıkamaya yarayan geniş kap", ["Leğen"]],
      ["Sözlük anlamında eski bir sözcük", ["Lügat"]],
      ["Atlıkarınca ve dönme dolabın bulunduğu eğlence yeri", ["Lunapark"]],
      ["Izgarası meşhur, gümüş renkli deniz balığı", ["Levrek"]],
      ["Eski çağlarda ölülerin konulduğu taş sandık", ["Lahit"]],
      ["Uzun, lüks otomobil", ["Limuzin"]],
      ["Gösterişli ve pahalı olma durumu", ["Lüks"]],
      ["Güney Amerika'da yaşayan tüylü, deve akrabası hayvan", ["Lama"]],
      ["Giysi üzerinde kalan kirli iz", ["Leke"]]
    ],
    "M": [
      ["Güneş Sistemi'nin Kızıl Gezegeni", ["Mars"]],
      ["Piramitleriyle ünlü, Nil kıyısındaki ülke", ["Mısır"]],
      ["Güneş'e en yakın gezegen", ["Merkür"]],
      ["Yanarak ışık veren, balmumundan yapılan eşya", ["Mum"]],
      ["Üzerine yemek konan, ayaklı mobilya", ["Masa"]],
      ["Sarı kabuklu, maymunların sevdiği meyve", ["Muz"]],
      ["İspanya'nın başkenti", ["Madrid"]],
      ["Tarihi eserlerin ve sanat yapıtlarının sergilendiği yer", ["Müze"]],
      ["Gözle görülemeyen küçük cisimleri büyütüp gösteren alet", ["Mikroskop"]],
      ["Taş evleriyle ünlü Güneydoğu Anadolu şehri", ["Mardin"]],
      ["Ağaçlarda yaşayan, muzu seven hayvan", ["Maymun"]],
      ["Yemeklerin pişirildiği oda", ["Mutfak"]],
      ["Yağmurdan sonra ormanda biten, şapkalı bitki", ["Mantar"]],
      ["Mesir macunu ve üzümüyle ünlü Ege şehri", ["Manisa"]],
      ["Kayısısıyla ünlü Doğu Anadolu şehri", ["Malatya"]],
      ["Türkiye'nin kuzeybatısındaki iç deniz", ["Marmara", "Marmara Denizi"]],
      ["Zarfa konup postayla gönderilen yazı", ["Mektup"]],
      ["Sesi yükseltmek için konuşulan alet", ["Mikrofon"]],
      ["Işığı kırarak görüntüyü büyüten cam parçası", ["Mercek"]],
      ["Tacoları ve sombrero şapkasıyla ünlü ülke", ["Meksika"]],
      ["Rusya'nın başkenti", ["Moskova"]],
      ["Yılın beşinci ayı", ["Mayıs"]],
      ["Gökyüzünün ve denizin rengi", ["Mavi"]],
      ["Kırmızı ile mavinin karışımı renk", ["Mor"]],
      ["Salatada kullanılan, yeşil yapraklı sebze", ["Marul"]],
      ["Seslerin uyumlu düzenlenişi", ["Müzik"]],
      ["Kâğıt ve kumaş kesen alet", ["Makas"]],
      ["Araçları hareket ettiren makine", ["Motor"]],
      ["Komşuların oturduğu, şehrin küçük bölümü", ["Mahalle"]],
      ["Sayılar ve işlemlerle uğraşan ders", ["Matematik"]],
      ["Spagetti ve penne gibi hamur yemeği", ["Makarna"]],
      ["Kayalarda doğal olarak oluşmuş boşluk", ["Mağara"]],
      ["Denizde yaşayan, kırmızısı süs taşı olarak kullanılan canlı", ["Mercan"]],
      ["Eve konuk olarak gelen kişi", ["Misafir"]],
      ["Yüzü örten, kimliği gizleyen veya koruyan ön yüz", ["Maske"]],
      ["Okulun veya kurumun yöneticisi", ["Müdür"]],
      ["Ahşaptan mobilya yapan usta", ["Marangoz"]],
      ["Bina tasarlayan meslek insanı", ["Mimar"]],
      ["Mahallenin seçilmiş başkanı", ["Muhtar"]],
      ["Köprü, yol ve bina tasarlayan teknik meslek insanı", ["Mühendis"]]
    ],
    "N": [
      ["Mısır'dan geçen, dünyanın en uzun nehirlerinden biri", ["Nil"]],
      ["Kırmızı, içi taneli, ekşi tatlı meyve", ["Nar"]],
      ["Cümlenin sonuna konulan noktalama işareti", ["Nokta"]],
      ["Yılın dördüncü ayı", ["Nisan"]],
      ["Ağız ferahlatan, yeşil yapraklı koku ve çay bitkisi", ["Nane"]],
      ["Leblebinin ham hâli olan yuvarlak bakliyat", ["Nohut"]],
      ["Fiyortlarıyla ünlü İskandinav ülkesi", ["Norveç"]],
      ["Güneş'e en uzak gezegen", ["Neptün"]],
      ["Su yüzeyinde açan, göl ve havuzlarda yetişen çiçek", ["Nilüfer"]],
      ["Müzikte sesleri gösteren işaret", ["Nota"]],
      ["Havadaki su buharı miktarı", ["Nem"]],
      ["Dağlardan doğup denize dökülen büyük akarsu", ["Nehir"]],
      ["Müslümanların günde beş vakit kıldığı ibadet", ["Namaz"]],
      ["Evlenmeden önce yüzük takılan tören", ["Nişan"]],
      ["Sınavlarda öğrencinin aldığı puan", ["Not"]],
      ["Aynı dönemde doğmuş kuşak", ["Nesil"]],
      ["Bir ülkede yaşayanların sayısı", ["Nüfus"]],
      ["Atatürk'ün Cumhuriyet'in kuruluşunu anlattığı büyük söylev", ["Nutuk"]],
      ["Fıkralarıyla bilinen Akşehirli bilge", ["Nasreddin Hoca", "Nasreddin"]],
      ["ABD'nin Özgürlük Anıtı ile ünlü kalabalık şehri", ["New York"]],
      ["Kapadokya'nın bulunduğu il", ["Nevşehir"]],
      ["Everest'in bulunduğu Himalaya ülkesi", ["Nepal"]],
      ["Resmî evlenme işlemi", ["Nikah"]],
      ["Patatesten ve mısırdan elde edilen, tatlılarda kullanılan toz", ["Nişasta"]],
      ["Sırayla yapılan bekleme görevi", ["Nöbet"]],
      ["Burun akıntısıyla geçen soğuk algınlığı", ["Nezle"]],
      ["Kışın sonunda açan sarı veya beyaz kokulu çiçek", ["Nergis"]],
      ["Mutluluktan doğan canlılık", ["Neşe"]],
      ["Afrika'nın en kalabalık ülkesi", ["Nijerya"]],
      ["Elmasıyla ünlü İç Anadolu şehri", ["Niğde"]],
      ["Atın ayağına çakılan demir", ["Nal"]],
      ["Mevlevi müziğinde üflenen kamıştan çalgı", ["Ney"]],
      ["Hedefi vuran kişi", ["Nişancı"]],
      ["Hristiyanların aralık ayında kutladığı bayram", ["Noel"]],
      ["Kumaşa iğneyle işlenen süsleme", ["Nakış"]],
      ["İnce ve saygılı davranış", ["Nezaket"]],
      ["Meyve, çiçek gibi cansız nesnelerin resmi", ["Natürmort"]],
      ["Kalp atışının bilekte hissedilen vuruşu", ["Nabız"]],
      ["Adıyaman'daki dev heykelleriyle ünlü dağ", ["Nemrut"]],
      ["Eşya veya yolcunun bir yerden başka yere taşınması", ["Nakliye", "Nakliyat"]]
    ],
    "O": [
      ["Öğrencilerin ders gördüğü yer", ["Okul"]],
      ["Askerlerin oluşturduğu büyük topluluk", ["Ordu"]],
      ["Çok sayıda ağacın bulunduğu geniş alan", ["Orman"]],
      ["Soluduğumuz havadaki, yaşam için gerekli gaz", ["Oksijen"]],
      ["Yılın ilk ayı", ["Ocak"]],
      ["Çok sayıda yolcu taşıyan kara taşıtı", ["Otobüs"]],
      ["Birçok müzisyenin birlikte çaldığı büyük topluluk", ["Orkestra"]],
      ["Pasifik ve Atlas gibi, denizlerden daha büyük su kütlesi", ["Okyanus"]],
      ["Osman Gazi tarafından kurulan büyük devlet", ["Osmanlı"]],
      ["Evin yatak odası veya salon gibi bölümlerinden her biri", ["Oda"]],
      ["Çocukların oynadığı eşya", ["Oyuncak"]],
      ["Ramazanda gün boyu yemek yememe ibadeti", ["Oruç"]],
      ["Dört yılda bir yapılan dünya spor oyunları", ["Olimpiyat"]],
      ["Kolun gövdeye bağlandığı yer", ["Omuz"]],
      ["Şarkıyla anlatılan, sahne sanatı türü", ["Opera"]],
      ["Sobada yakılan, kesilmiş ağaç parçası", ["Odun"]],
      ["Nobel Edebiyat Ödülü alan Türk yazar", ["Orhan Pamuk"]],
      ["Norveç'in başkenti", ["Oslo"]],
      ["Turistlerin konakladığı yer", ["Otel"]],
      ["Dünyayı güneşin zararlı ışınlarından koruyan gaz tabakası", ["Ozon"]],
      ["Çukurova'da bir il", ["Osmaniye"]],
      ["Çalışanların masa başında çalıştığı yer", ["Ofis"]],
      ["Filmlerde rol alan kişi", ["Oyuncu"]],
      ["Ekini biçmeye yarayan, yarım ay biçimli alet", ["Orak"]],
      ["Balık tutmaya yarayan, kamışlı alet", ["Olta"]],
      ["Yumurtadan yapılan, kızartılmış yemek", ["Omlet"]],
      ["Bir ana babanın erkek çocuğu", ["Oğul"]],
      ["Ok ve yay kullanan sporcu", ["Okçu"]],
      ["Türk ordusunda yüksek rütbeli asker", ["Orgeneral"]],
      ["Erden sonra gelen ilk askeri rütbe", ["Onbaşı"]],
      ["Gösterişli çiçekleriyle bilinen süs bitkisi", ["Orkide"]],
      ["Arabaların bırakıldığı yer", ["Otopark"]],
      ["Sırtımızdaki kemik dizisi", ["Omurga"]],
      ["Hamur açmakta kullanılan uzun değnek", ["Oklava"]],
      ["Saz çalıp şiir söyleyen halk şairi", ["Ozan"]],
      ["Çocukların eğlenmek için yaptığı etkinlik", ["Oyun"]],
      ["Kitap okuyan kişi", ["Okuyucu"]],
      ["Eski Türk yazıtlarının bulunduğu vadi", ["Orhun"]],
      ["Dört tekerlekli motorlu özel yolcu taşıtı", ["Otomobil"]],
      ["Kişinin saygınlığı, şeref", ["Onur"]]
    ],
    "Ö": [
      ["Okulda ders anlatan kişi", ["Öğretmen"]],
      ["Gölde yüzen, 'vak vak' diyen kuş", ["Ördek"]],
      ["Öğretmenin evde yapılmak üzere verdiği çalışma", ["Ödev"]],
      ["Ders gören kişi", ["Öğrenci"]],
      ["Ağ ören, sekiz bacaklı hayvan", ["Örümcek"]],
      ["Yarışmada kazananlara verilen şey", ["Ödül"]],
      ["Şişlerle yapılan, kazak ve atkı gibi şeylerin üretim biçimi", ["Örgü"]],
      ["Sabah ile akşam arasındaki, gün ortası zamanı", ["Öğle"]],
      ["Bağımsız ve baskısız olma hâli", ["Özgürlük"]],
      ["Tarlada sabanı çeken, boynuzlu erkek sığır", ["Öküz"]],
      ["Dudakla yapılan sevgi gösterisi", ["Öpücük"]],
      ["Boğazı temizlemek için ani nefes patlaması", ["Öksürük"]],
      ["Üzerini örten bez", ["Örtü"]],
      ["Hata sonrası dilenen af", ["Özür"]],
      ["Uzunluğu veya ağırlığı belirleyen birim", ["Ölçü"]],
      ["Bir canlının yaşadığı süre", ["Ömür"]],
      ["Okulda veya mutfakta kıyafeti koruyan giysi", ["Önlük"]],
      ["Aşırı kızgınlık", ["Öfke"]],
      ["Kısa anlatı türü", ["Öykü"]],
      ["Benzerini yapmak için örnek alınan model", ["Örnek"]],
      ["Uzun bir metnin kısa anlatımı", ["Özet"]],
      ["Yemek yenen zaman dilimi", ["Öğün"]],
      ["Geri verilmek üzere alınan", ["Ödünç"]],
      ["Demircinin çekiçlerken altına koyduğu demir blok", ["Örs"]],
      ["Uzakta olan birini görmek isteme duygusu", ["Özlem"]],
      ["Başkenti Taşkent olan Orta Asya ülkesi", ["Özbekistan"]],
      ["Kötü bir durumu engellemek için alınan tedbir", ["Önlem"]],
      ["Borcun veya fiyatın karşılığını verme", ["Ödeme"]],
      ["Bir işi dikkatle yapma", ["Özen"]],
      ["Birine verilen nasihat", ["Öğüt"]],
      ["Harita veya çizimde küçültme oranı", ["Ölçek"]],
      ["İş başvurusunda yazılan yaşam özeti", ["Özgeçmiş"]],
      ["Kitabın başında yazarın yazdığı kısa yazı", ["Önsöz"]],
      ["Başkası için kendinden fedakârlık etme", ["Özveri"]],
      ["Taneleri değirmende ezip un yapmak", ["Öğütmek"]],
      ["Metre veya cetvelle uzunluğunu bulma işi", ["Ölçmek"]],
      ["Bağımsız, kimseye bağlı olmayan", ["Özgür"]],
      ["Sevgi göstermek için dudakla dokunmak", ["Öpmek"]],
      ["Bir işte başkalarından önce ilerleyen kişi", ["Öncü"]],
      ["Yeni bilgi veya beceri edinmek", ["Öğrenmek"]]
    ],
    "P": [
      ["İtalyan mutfağından, yuvarlak hamur üzerine peynirli yemek", ["Pizza"]],
      ["Turuncu renkli, suyu içilen narenciye", ["Portakal"]],
      ["Doğum günlerinde mumlarla süslenen tatlı", ["Pasta"]],
      ["Kutuplarda yaşayan, uçamayan siyah beyaz kuş", ["Penguen"]],
      ["Sütten yapılan, kahvaltının vazgeçilmezi", ["Peynir"]],
      ["Beyaz lifli, kumaş yapımında kullanılan bitki", ["Pamuk"]],
      ["Fransa'nın başkenti", ["Paris"]],
      ["Uçağı kullanan kişi", ["Pilot"]],
      ["Haftanın yedinci günü", ["Pazar"]],
      ["Odaya ışık ve hava alan, camlı açıklık", ["Pencere"]],
      ["Kızartması yapılan, yerin altında yetişen yumru", ["Patates"]],
      ["Pirinçten yapılan yemek", ["Pilav"]],
      ["Haftanın ilk günü", ["Pazartesi"]],
      ["Haftanın dördüncü günü", ["Perşembe"]],
      ["Beyaz saplı, yeşil yapraklı soğangillerden sebze", ["Pırasa"]],
      ["Siyah beyaz tuşları olan çalgı", ["Piyano"]],
      ["Mektubun üzerine yapıştırılan küçük kâğıt", ["Pul"]],
      ["Bacakları saran alt giysi", ["Pantolon"]],
      ["Çocukların oynadığı yeşil alan", ["Park"]],
      ["Suçluları yakalayan, asayişi sağlayan görevli", ["Polis"]],
      ["Kayseri'nin meşhur, baharatlı kurutulmuş eti", ["Pastırma"]],
      ["Beyaz yapraklı, ortası sarı çiçek", ["Papatya"]],
      ["Işıltılı, kesilmiş elmas", ["Pırlanta"]],
      ["Yüksekten atlayanların taşıdığı, açılan kumaş şemsiye", ["Paraşüt"]],
      ["Gagasının altındaki torbayla balık yakalayan kuş", ["Pelikan"]],
      ["Yurt dışına çıkarken gösterilen resmî belge", ["Pasaport"]],
      ["Sirkte komik kıyafetli, güldüren kişi", ["Palyaço"]],
      ["Bambu yiyen siyah beyaz Çin ayısı", ["Panda"]],
      ["Kırmızı ile beyazın karışımı renk", ["Pembe"]],
      ["Mor renkli, musakkası yapılan sebze", ["Patlıcan"]],
      ["Kışın giyilen kalın, uzun dış giysi", ["Palto"]],
      ["Yemekte ağız silmeye yarayan ince kâğıt", ["Peçete"]],
      ["Uçak ve vantilatörde dönen kanatlı parça", ["Pervane"]],
      ["Denizde yüzülen kumsal", ["Plaj"]],
      ["Yeşillik alanda yemek yeme etkinliği", ["Piknik"]],
      ["Fener ve kumandalarda kullanılan enerji kaynağı", ["Pil"]],
      ["Pilavın yapıldığı tane", ["Pirinç"]],
      ["Sütle yapılan, kaşıkla yenen tatlı", ["Puding"]],
      ["Masallarda sihirli değnekli, kanatlı küçük karakter", ["Peri"]],
      ["Yönü gösteren ibreli alet", ["Pusula"]]
    ],
    "R": [
      ["Kırmızı, mavi, sarı gibi şeylere verilen genel ad", ["Renk"]],
      ["Kalem veya boyayla kâğıda yapılan çizim", ["Resim"]],
      ["Müzik ve haber dinlemek için kullanılan, sesi dalgalarla alan cihaz", ["Radyo"]],
      ["İtalya'nın başkenti", ["Roma"]],
      ["Havanın yatay yönde hareketi", ["Rüzgar"]],
      ["Uykuda görülen hayaller", ["Rüya"]],
      ["İnsan gibi hareket edebilen, programlanmış makine", ["Robot"]],
      ["Çayıyla ünlü Doğu Karadeniz şehri", ["Rize"]],
      ["Yüzölçümü bakımından dünyanın en büyük ülkesi", ["Rusya"]],
      ["Müslümanların oruç tuttuğu, hicri yılın dokuzuncu ayı", ["Ramazan"]],
      ["Trenin üzerinde gittiği demir yol", ["Ray"]],
      ["Uzaya fırlatılan araç", ["Roket"]],
      ["Kitapların dizildiği tahta bölme", ["Raf"]],
      ["Meyve ve şekerle kaynatılan, kahvaltıda sürülen tatlı", ["Reçel"]],
      ["Sayıları yazmaya yarayan işaret", ["Rakam"]],
      ["İnceleme sonucunu anlatan yazı", ["Rapor"]],
      ["Gezide yol gösteren kişi", ["Rehber"]],
      ["Uçak ve gemileri tespit eden dalga sistemi", ["Radar"]],
      ["Önceden belirlenen görüşme zamanı", ["Randevu"]],
      ["Yarışmada karşı taraf", ["Rakip"]],
      ["Peynir veya havuç ezmek için kullanılan delikli araç", ["Rende"]],
      ["Gemilerin yanaştığı taş set", ["Rıhtım"]],
      ["Askerlikte seviyeyi gösteren sıra", ["Rütbe"]],
      ["Ürünleri tanıtmak için yapılan duyuru", ["Reklam"]],
      ["Yemek yenen, servis yapılan lüks lokanta", ["Restoran"]],
      ["Resim yapan sanatçı", ["Ressam"]],
      ["Türkiye kıyısına yakın, Yunanistan'a ait ada", ["Rodos"]],
      ["Eğimli çıkış yolu", ["Rampa"]],
      ["Uzun, kurgusal edebiyat eseri", ["Roman"]],
      ["Marketlerde ürünlerin sergilendiği bölüm", ["Reyon"]],
      ["Kalorifer peteği", ["Radyatör"]],
      ["Üç dakika kaynatılan, sarısı akışkan yumurta", ["Rafadan"]],
      ["Sarılmış kâğıt tomarı", ["Rulo"]],
      ["Müzikte düzenli vuruş akışı", ["Ritim"]],
      ["Yakaya iğnelenen küçük nişan", ["Rozet"]],
      ["Geminin veya uçağın izleyeceği yol", ["Rota"]],
      ["Yüzü maskeli, yiyeceğini suda yıkayan Amerika hayvanı", ["Rakun"]],
      ["Evin duvarlarında oluşan nem", ["Rutubet"]],
      ["Kokulu, yeşil, otsu bitki", ["Reyhan"]],
      ["Bir sporda ulaşılan en yüksek derece", ["Rekor"]]
    ],
    "S": [
      ["İnekten elde edilen beyaz içecek", ["Süt"]],
      ["Zamanı gösteren araç", ["Saat"]],
      ["Dünyanın en büyük sıcak çölü", ["Sahra", "Sahra Çölü"]],
      ["64 kareli tahtada oynanan, şah ve vezirli zeka oyunu", ["Satranç"]],
      ["Üzerine oturulan, dört ayaklı mobilya", ["Sandalye"]],
      ["Ellerimizi yıkarken kullandığımız, köpüren madde", ["Sabun"]],
      ["Fındık toplayan, ağaçlarda yaşayan kuyruklu hayvan", ["Sincap"]],
      ["Limonun ve muzun rengi", ["Sarı"]],
      ["Filmlerin beyaz perdede izlendiği salon", ["Sinema"]],
      ["Kafa derisinde çıkan kıllar", ["Saç"]],
      ["Hayat kaynağı, içilen renksiz sıvı", ["Su"]],
      ["Yeşil, uzun ve çıtır sebze", ["Salatalık"]],
      ["Palyaço ve hayvan gösterilerinin yapıldığı çadır", ["Sirk"]],
      ["İki kanatlı, çöpe konan küçük böcek", ["Sinek"]],
      ["Kömürün rengi", ["Siyah"]],
      ["Evlerin sıralandığı dar yol", ["Sokak"]],
      ["Çiğnenen şekerleme", ["Sakız"]],
      ["Misafirlerin ağırlandığı büyük oda", ["Salon"]],
      ["Kangal köpeğiyle ünlü İç Anadolu şehri", ["Sivas"]],
      ["Atatürk'ün 19 Mayıs 1919'da çıktığı Karadeniz şehri", ["Samsun"]],
      ["Türkiye'nin en kuzey ucundaki il", ["Sinop"]],
      ["Denizin karaya değdiği kıyı", ["Sahil"]],
      ["Doğrayınca gözleri yaşartan sebze", ["Soğan"]],
      ["Haftanın ikinci günü", ["Salı"]],
      ["Haber okuyan kişi", ["Spiker"]],
      ["Padişahların yaşadığı büyük yapı", ["Saray"]],
      ["Yerleri temizlemeye yarayan araç", ["Süpürge"]],
      ["Ağız kokusu yapan, dişli beyaz baharat", ["Sarımsak"]],
      ["Kışın odayı ısıtan, odunlu veya kömürlü cihaz", ["Soba"]],
      ["Su doldurup masaya konan cam kap", ["Sürahi"]],
      ["Parkta ileri geri sallanılan oyun aracı", ["Salıncak"]],
      ["Pazarda meyve taşınan örgü kap", ["Sepet"]],
      ["Banyoda ve bulaşıkta kullanılan emici malzeme", ["Sünger"]],
      ["Çiçeklerin dikildiği kap", ["Saksı"]],
      ["Eşyaların konulduğu ahşap kutu", ["Sandık"]],
      ["Yemek yenen masa veya örtü", ["Sofra"]],
      ["Çay kaynatılan metal kap", ["Semaver"]],
      ["Ekşi, salatalarda kullanılan sıvı", ["Sirke"]],
      ["Süt ve et için beslenen büyükbaş", ["Sığır"]],
      ["Havuç, ıspanak gibi toprakta yetişen yiyecek", ["Sebze"]]
    ],
    "Ş": [
      ["Çaya katılan tatlı beyaz kristal", ["Şeker"]],
      ["Yağmurdan korunmak için açılan araç", ["Şemsiye"]],
      ["Köyden büyük, kalabalık yerleşim yeri", ["Şehir"]],
      ["Dizelerden oluşan edebi tür", ["Şiir"]],
      ["Başa takılan giysi", ["Şapka"]],
      ["Yağmurlu havada gökte çakan ışık", ["Şimşek"]],
      ["Tüylü kabuklu, sulu yaz meyvesi", ["Şeftali"]],
      ["Balıklıgöl ve Göbeklitepe'nin bulunduğu il", ["Şanlıurfa"]],
      ["Yılın en kısa ayı", ["Şubat"]],
      ["Sözlü veya sözsüz müzik eseri", ["Şarkı"]],
      ["Su veya süt konulan, boynu dar kap", ["Şişe"]],
      ["Elektriği açıp kapatan düğme", ["Şalter"]],
      ["Avrupa'da krallar ve soyluların yaşadığı, kaleye benzeyen yapı", ["Şato"]],
      ["Omuza örtülen büyük kumaş", ["Şal"]],
      ["Geniş paçalı, geleneksel pantolon", ["Şalvar"]],
      ["Talih", ["Şans"]],
      ["Turnuvayı kazanan", ["Şampiyon"]],
      ["Saç yıkamak için kullanılan, köpüren sıvı", ["Şampuan"]],
      ["Mutfağın başındaki usta", ["Şef"]],
      ["Kebabın dizildiği uzun metal çubuk", ["Şiş"]],
      ["Büyük ziyafet", ["Şölen"]],
      ["Hastalıktan iyileşme", ["Şifa"]],
      ["Hesaba girmek için yazılan gizli kelime", ["Şifre"]],
      ["Ticaret yapan kuruluş", ["Şirket"]],
      ["Aracı kullanan kişi", ["Şoför"]],
      ["Yüksekten dökülen su", ["Şelale"]],
      ["Avını pençeleyen, hızlı yırtıcı kuş", ["Şahin"]],
      ["Gülmek için yapılan eğlence", ["Şaka"]],
      ["Verilen nimete teşekkür", ["Şükür"]],
      ["Üçgen, kare gibi biçim", ["Şekil"]],
      ["Gözün yanındaki yüz bölümü", ["Şakak"]],
      ["İran'ın eski hükümdarlarına verilen ad", ["Şah"]],
      ["Baklavanın üzerine dökülen tatlı sıvı", ["Şerbet"]],
      ["Bir olayı gören ve mahkemede anlatan kişi", ["Şahit"]],
      ["Eğlenceli kutlama", ["Şenlik"]],
      ["İğneyle ilaç veren tıbbi alet", ["Şırınga"]],
      ["Padişahın oğlu", ["Şehzade"]],
      ["Şarkı söyleyen sanatçı", ["Şarkıcı"]],
      ["Mavi renkli, beyaz külahlı çizgi film karakteri", ["Şirin"]],
      ["Adana'nın morumsu, ekşi içeceği", ["Şalgam"]]
    ],
    "T": [
      ["Raylar üzerinde giden ulaşım aracı", ["Tren"]],
      ["Uzun kulaklı, havuç yemeyi seven hayvan", ["Tavşan"]],
      ["Görüntü ve ses yayınlayan ev eşyası", ["Televizyon"]],
      ["Yemeklere lezzet veren beyaz mineral", ["Tuz"]],
      ["Yumurtlayan, 'gıt gıt' ötüp kümeste yaşayan çiftlik kuşu", ["Tavuk"]],
      ["Uzaktaki kişiyle konuşmaya yarayan cihaz", ["Telefon"]],
      ["Yılın yedinci ayı", ["Temmuz"]],
      ["Japonya'nın başkenti", ["Tokyo"]],
      ["Hamsisi ve Sümela Manastırı ile ünlü Karadeniz şehri", ["Trabzon"]],
      ["Kurnaz olarak bilinen, turuncu tüylü orman hayvanı", ["Tilki"]],
      ["Yemek konulan yuvarlak sofra kabı", ["Tabak"]],
      ["Okul ve işten izin dönemi", ["Tatil"]],
      ["Parmak uçlarını koruyan sert yapı", ["Tırnak"]],
      ["Para karşılığı yolcu taşıyan sarı araç", ["Taksi"]],
      ["Saçı taramaya yarayan araç", ["Tarak"]],
      ["Ekin ekilen geniş toprak", ["Tarla"]],
      ["Geçmişi inceleyen bilim", ["Tarih"]],
      ["Odanın üst yüzeyi", ["Tavan"]],
      ["Yemeğin pişirildiği derin kap", ["Tencere"]],
      ["Kıyafet diken meslek sahibi", ["Terzi"]],
      ["Oyuncuların sahnede canlı oynadığı sanat dalı", ["Tiyatro"]],
      ["Futbolda kullanılan yuvarlak nesne", ["Top"]],
      ["İran'ın başkenti", ["Tahran"]],
      ["Başkenti Tunus olan Kuzey Afrika ülkesi", ["Tunus"]],
      ["Kırmızı veya beyaz, acımsı kök sebze", ["Turp"]],
      ["Küçük deniz taşıtı", ["Tekne"]],
      ["Kuşların vücudunu kaplayan yumuşak yapı", ["Tüy"]],
      ["Evlerin yapımında kullanılan, kırmızı pişmiş toprak blok", ["Tuğla"]],
      ["Sıcaklığı ölçen araç", ["Termometre"]],
      ["Zar atılarak oynanan masa oyunu", ["Tavla"]],
      ["Okul tahtasına yazı yazmaya yarayan beyaz çubuk", ["Tebeşir"]],
      ["Yemek veya çay taşımada kullanılan yassı kap", ["Tepsi"]],
      ["Evde ayağa giyilen hafif ayakkabı", ["Terlik"]],
      ["Dükkânın adı yazılı levha", ["Tabela"]],
      ["Arkalıksız küçük oturak", ["Tabure"]],
      ["Günleri ve ayları gösteren çizelge", ["Takvim"]],
      ["Gökyüzünü uzaktan gözlemeye yarayan alet", ["Teleskop"]],
      ["Toprağa ekilince bitkiye dönüşen küçük parça", ["Tohum"]],
      ["Kelebeğe dönüşmeden önceki böcek", ["Tırtıl"]],
      ["Doğalgaz yoksa kullanılan metal gaz kabı", ["Tüp"]]
    ],
    "U": [
      ["Gökyüzünde uçan, yolcu taşıyan araç", ["Uçak"]],
      ["Geceleri yatakta uzanıp yaptığımız dinlenme hâli", ["Uyku"]],
      ["Gezegenlerin ve yıldızların bulunduğu sonsuz boşluk", ["Uzay"]],
      ["Rüzgârda ipiyle uçurulan kâğıt oyuncak", ["Uçurtma"]],
      ["Buğdaydan öğütülerek elde edilen, ekmek yapımında kullanılan toz", ["Un"]],
      ["İyi şeylerin olacağına dair beklenti", ["Umut"]],
      ["Boğaz'da balık ekmekte sıkça kullanılan, çizgili küçük balık", ["Uskumru"]],
      ["Kırmızı üzerinde siyah benekleri olan, şans getirdiğine inanılan böcek", ["Uğurböceği", "Uğur Böceği"]],
      ["Ege Bölgesi'nde, halıcılığıyla bilinen il", ["Uşak"]],
      ["Çok dik ve derin yamaç", ["Uçurum"]],
      ["Tehlikeyi bildiren işaret", ["Uyarı"]],
      ["Aynı topraklarda yaşayan topluluk", ["Ulus"]],
      ["Yakının zıttı", ["Uzak"]],
      ["Pahalının zıttı", ["Ucuz"]],
      ["Gökyüzü ile yerin birleşiyor göründüğü çizgi", ["Ufuk"]],
      ["Bir yerden başka bir yere gitme, taşınma", ["Ulaşım"]],
      ["Gezegenin etrafında dönen gök cismi", ["Uydu"]],
      ["Birbirine uygunluk", ["Uyum"]],
      ["Uykusu olmayan, dikkatli", ["Uyanık"]],
      ["Kısanın zıttı", ["Uzun"]],
      ["Telefonlara indirilen program", ["Uygulama"]],
      ["Başkenti Kiev olan Doğu Avrupa ülkesi", ["Ukrayna"]],
      ["Bursa'da kayak merkezi olan dağ", ["Uludağ"]],
      ["Mesleğini çok iyi bilen kişi", ["Usta"]],
      ["Sakal tıraşında kullanılan, kemikli saplı keskin bıçak", ["Ustura"]],
      ["Uzaylıların bindiği düşünülen gökyüzü cismi", ["Uçan daire", "Uçandaire"]],
      ["Bir konuda çok bilgili ve deneyimli kişi", ["Uzman"]],
      ["Fişi uzaktaki prize ulaştıran, çoklu prizli kablo", ["Uzatma"]],
      ["Kuşların kanatlarını çırparak havada gitmesi", ["Uçmak"]],
      ["Geceleri gözleri kapatıp dinlenmek", ["Uyumak"]],
      ["Başka gezegenden geldiği düşünülen yaratık", ["Uzaylı"]],
      ["Bir toplumun ilerlemiş kültür düzeyi", ["Uygarlık"]],
      ["Hatırlamamak, aklından çıkarmak", ["Unutmak"]],
      ["Haber taşıyan kişi", ["Ulak"]],
      ["Ayağın kan dolaşımı azalınca his kaybetmesi", ["Uyuşmak"]],
      ["Kamp yaparken içine girilen torba", ["Uyku tulumu"]],
      ["İki tarafın anlaşması", ["Uzlaşma"]],
      ["Çekingen, kolay kızaran kimse", ["Utangaç"]],
      ["Televizyonu uzaktan açıp kapatan düğmeli alet", ["Uzaktan kumanda"]],
      ["Gece uyuyamama durumu", ["Uykusuzluk"]]
    ],
    "Ü": [
      ["Salkım halinde yetişen, şarabı yapılan meyve", ["Üzüm"]],
      ["Liseden sonra eğitim alınan yüksek öğretim kurumu", ["Üniversite"]],
      ["Sınırları belli, bir devletin yönettiği toprak parçası", ["Ülke"]],
      ["Kıyafetlerin kırışıklıklarını gideren cihaz", ["Ütü"]],
      ["Üç kenarı ve üç köşesi olan geometrik şekil", ["Üçgen"]],
      ["Başkenti Amman olan Orta Doğu ülkesi", ["Ürdün"]],
      ["Umut sözcüğünün eş anlamlısı", ["Ümit"]],
      ["Türkçede a, e, ı, i, o, ö, u, ü harflerine verilen genel ad", ["Ünlü"]],
      ["Altın zıttı olan yön veya konum", ["Üst"]],
      ["Askerin, polisin veya öğrencinin giydiği standart kıyafet", ["Üniforma"]],
      ["Mutsuzluk, keder", ["Üzüntü"]],
      ["Ders kitabında konu bölümü", ["Ünite"]],
      ["Kişinin mesleğini veya rütbesini gösteren ad", ["Ünvan"]],
      ["Mal yapma işi", ["Üretim"]],
      ["Ana veya babanın sonradan evlendiği kişinin çocukları için kullanılan sıfat", ["Üvey"]],
      ["Çalışanın aldığı para", ["Ücret"]],
      ["Çabuk korkan", ["Ürkek"]],
      ["İkiden sonra gelen sayı", ["Üç"]],
      ["Ustaların ustası", ["Üstat"]],
      ["Atın eyerinde ayağın konulduğu halka", ["Üzengi"]],
      ["Soğuktan titremek", ["Üşümek"]],
      ["Para ödenmeyen", ["Ücretsiz"]],
      ["Üretilen mal", ["Ürün"]],
      ["Alfabede ünlü olmayan harf", ["Ünsüz"]],
      ["Hayranlık veya şaşkınlık bildiren işaret (!)", ["Ünlem"]],
      ["İstanbul'un Asya yakasındaki, Kız Kulesi'yle bilinen ilçesi", ["Üsküdar"]],
      ["Ordu'da, deniz kıyısında bir ilçe", ["Ünye"]],
      ["Diğerlerinden daha iyi olan", ["Üstün"]],
      ["Ağızla hava vermek", ["Üflemek"]],
      ["İkinciden sonra gelen sıra sayısı", ["Üçüncü"]],
      ["Hüzünlü, kederli kişi", ["Üzgün"]],
      ["Ulaşılmak istenen yüce amaç", ["Ülkü"]],
      ["Bir topluluğun içindeki kişi", ["Üye"]],
      ["İş yapmaya isteksiz, tembel kimse", ["Üşengeç"]],
      ["Canlıların yavru vermesi", ["Üreme"]],
      ["Soğuktan veya korkudan titreme hissi", ["Ürperti"]],
      ["Uzak ve ıssız yer", ["Ücra"]],
      ["Mide gibi yerlerde oluşan yara", ["Ülser"]],
      ["Yazarın anlatım biçimi", ["Üslup"]],
      ["Sorumluluğu üzerine almak", ["Üstlenmek"]]
    ],
    "V": [
      ["Elektrik geriliminin birimi", ["Volt"]],
      ["Çiçek koymak için kullanılan süs kabı", ["Vazo"]],
      ["İnsan veya hayvan bedeninin tamamı", ["Vücut"]],
      ["Kirazı andıran, ekşi kırmızı meyve", ["Vişne"]],
      ["Boğaz'da yolcu taşıyan deniz taşıtı", ["Vapur"]],
      ["Gölü ve kedisiyle ünlü Doğu Anadolu şehri", ["Van"]],
      ["Doğduğumuz, bağlı olduğumuz ülke", ["Vatan"]],
      ["Avusturya'nın başkenti", ["Viyana"]],
      ["İnşaatlarda ağır yük kaldıran makine", ["Vinç"]],
      ["Fileli, altışar kişilik takım sporu", ["Voleybol"]],
      ["Mağazada ürünlerin sergilendiği camlı bölme", ["Vitrin"]],
      ["Devletin vatandaştan aldığı para", ["Vergi"]],
      ["Kan emen masal yaratığı", ["Vampir"]],
      ["Trenin yolcu taşıyan bölümü", ["Vagon"]],
      ["Arabada hızı değiştiren kol", ["Vites"]],
      ["Tornavidayla sıkılan, dişli metal çivi", ["Vida"]],
      ["Öğrencinin anne babası", ["Veli"]],
      ["İlin en üst yöneticisi", ["Vali"]],
      ["Satrançta ve devlet yönetiminde şahın yardımcısı", ["Vezir"]],
      ["Kulaklarında püskül olan yabani kedi", ["Vaşak"]],
      ["Güneş'e yakınlık sırasında ikinci gezegen", ["Venüs"]],
      ["Başkenti Hanoi olan Güneydoğu Asya ülkesi", ["Vietnam"]],
      ["Dünyanın en küçük devleti", ["Vatikan"]],
      ["Et yemeyen kişi", ["Vejetaryen"]],
      ["Hareketli görüntü kaydı", ["Video"]],
      ["Ayrılırken söylenen sözler", ["Veda"]],
      ["Meyvelerde bulunan, sağlık için gerekli besin öğesi", ["Vitamin"]],
      ["Üç zamanlı klasik dans", ["Vals"]],
      ["Bankada para yatırılan yer", ["Vezne"]],
      ["İş yerinde sırayla çalışma saati", ["Vardiya"]],
      ["Saat ve gün gibi zaman dilimi", ["Vakit"]],
      ["Çölün ortasında su ve ağaç bulunan yeşil alan", ["Vaha"]],
      ["Sıcakta pervanesi dönerek serinleten cihaz", ["Vantilatör"]],
      ["Lav püskürten dağ", ["Volkan"]],
      ["Petrol dolu büyük metal fıçı", ["Varil"]],
      ["Hayvanların doktoru", ["Veteriner"]],
      ["Bir devletin vatandaşlık bağıyla bağlı kişisi", ["Vatandaş"]],
      ["İki dağ arasındaki alçak yer", ["Vadi"]],
      ["Büyük, yaylı çalgılardan, ayaklar arasına konup çalınan", ["Viyolonsel"]],
      ["Mal veya gelirini hayır işine bağışlayan kuruluş", ["Vakıf"]]
    ],
    "Y": [
      ["Bulutlardan damla damla düşen su", ["Yağmur"]],
      ["Denizde yaşayan, zeki ve sevimli memeli", ["Yunus"]],
      ["Gece gökyüzünde parlayan, Güneş'in de türü olduğu gök cismi", ["Yıldız"]],
      ["Yılın en sıcak mevsimi", ["Yaz"]],
      ["Tavuğun yumurtladığı, kahvaltıda yenen besin", ["Yumurta"]],
      ["Ayaksız sürünen, bazı türleri zehirli hayvan", ["Yılan"]],
      ["Türkiye'nin batısındaki komşu ülke", ["Yunanistan"]],
      ["Uyurken başın altına konan yumuşak eşya", ["Yastık"]],
      ["Geceleri uçan, tek uçabilen memeli", ["Yarasa"]],
      ["Çimenin ve yaprakların rengi", ["Yeşil"]],
      ["Araçların ve insanların gittiği hat", ["Yol"]],
      ["Uyumak için üzerine yatılan mobilya", ["Yatak"]],
      ["Kolsuz üst giysi", ["Yelek"]],
      ["Yan yan yürüyen, kıskaçlı deniz hayvanı", ["Yengeç"]],
      ["Parmağa takılan halka", ["Yüzük"]],
      ["Ağaç dalındaki yeşil ince yapı", ["Yaprak"]],
      ["Gözlerin, burnun ve ağzın bulunduğu bölüm", ["Yüz"]],
      ["Parmakların kapanmış hâli", ["Yumruk"]],
      ["Rüzgârla tekneyi ilerleten bez", ["Yelken"]],
      ["Yaz aylarında hayvanların otlatıldığı yüksek yer", ["Yayla"]],
      ["Sütün mayalanmasıyla yapılan beyaz besin", ["Yoğurt"]],
      ["Öğrencilerin kaldığı yer", ["Yurt"]],
      ["Dünyanın Güneş etrafındaki dönüş süresi", ["Yıl"]],
      ["Binaları saran büyük ateş", ["Yangın"]],
      ["Lav püskürten dağ", ["Yanardağ"]],
      ["Termal suları ile ünlü Marmara şehri", ["Yalova"]],
      ["İç Anadolu'daki çamlık şehri", ["Yozgat"]],
      ["Kitap yazan kişi", ["Yazar"]],
      ["Suyun içinde hareket edilen spor", ["Yüzme"]],
      ["Dört yapraklı olanı şans getirdiği sanılan bitki", ["Yonca"]],
      ["Kızartma ve salataya konan sıvı", ["Yağ"]],
      ["Sallanınca serinlik veren katlanır araç", ["Yelpaze"]],
      ["Örgü için sarılmış ip topu", ["Yumak"]],
      ["Parçaları birleştirilen resim oyunu", ["Yapboz"]],
      ["Saatte dakikayı gösteren uzun ibre", ["Yelkovan"]],
      ["Filmi yöneten kişi", ["Yönetmen"]],
      ["Suyun üstünde uçan, ince gövdeli böcek", ["Yusufçuk"]],
      ["Yatakta üstümüzü örten kalın örtü", ["Yorgan"]],
      ["Yüzde burnun iki yanındaki bölüm", ["Yanak"]],
      ["Mutfakta pişirilen ve yenen şey", ["Yemek"]]
    ],
    "Z": [
      ["Siyah beyaz çizgili, at benzeri hayvan", ["Zebra"]],
      ["En uzun boyunlu kara hayvanı", ["Zürafa"]],
      ["Yağı çıkarılan, kahvaltıda yenen yeşil veya siyah meyve", ["Zeytin"]],
      ["Okulda teneffüsü bildiren, çalan alet", ["Zil"]],
      ["Mektubun içine konduğu kâğıt kılıf", ["Zarf"]],
      ["Düşünme, anlama ve kavrama yeteneği", ["Zeka"]],
      ["Tavla veya kutu oyunlarında atılan, altı yüzlü küçük küp", ["Zar"]],
      ["Beyaz, güzel kokulu, soğanlı bir çiçek", ["Zambak"]],
      ["Taş kömürüyle ünlü Batı Karadeniz şehri", ["Zonguldak"]],
      ["Savaşçıların vücudunu korumak için giydiği metal giysi", ["Zırh"]],
      ["Saatle ölçülen akış", ["Zaman"]],
      ["Savaş veya yarışta kazanılan başarı", ["Zafer"]],
      ["Yutulunca öldürebilen madde", ["Zehir"]],
      ["Evin en alt katı", ["Zemin"]],
      ["Karşıt anlam", ["Zıt"]],
      ["Kâğıtları birbirine tutturan alet", ["Zımba"]],
      ["Çok parası olan", ["Zengin"]],
      ["Yabani kayısı", ["Zerdali"]],
      ["Zeytinden elde edilen yemeklik yağ", ["Zeytinyağı"]],
      ["Yapılması güç olan durum", ["Zorluk"]],
      ["Çok küçük parça", ["Zerre"]],
      ["Belediyede pazarı ve esnafı denetleyen görevli", ["Zabıta"]],
      ["Halkalardan oluşan bağ", ["Zincir"]],
      ["İsviçre'nin en büyük şehri", ["Zürih"]],
      ["Yüzey düzeltmede kullanılan pürüzlü kâğıt", ["Zımpara"]],
      ["Eski çağlarda mahkûmların tutulduğu yeraltı hapishane", ["Zindan"]],
      ["Birinin evine konuk olma", ["Ziyaret"]],
      ["Deprem", ["Zelzele"]],
      ["Kilosu az olan", ["Zayıf"]],
      ["Balık avlamak için fırlatılan, sivri uçlu alet", ["Zıpkın"]],
      ["Gaz dolu uçan büyük balon", ["Zeplin"]],
      ["Düşünme gücü, akıl", ["Zihin"]],
      ["El becerisiyle yapılan meslek", ["Zanaat"]],
      ["İncelik, narin güzellik", ["Zerafet"]],
      ["Varlıklı kimsenin yoksula vermek zorunda olduğu dinî bağış", ["Zekat", "Zekât"]],
      ["Ege'nin efelerinin oynadığı halk oyunu", ["Zeybek"]],
      ["Yeşil renkli değerli taş", ["Zümrüt"]],
      ["Dağın en yüksek noktası", ["Zirve"]],
      ["Toprağı işleyip ürün yetiştirme işi", ["Ziraat"]],
      ["Kâr etmemenin tersi, kayıp", ["Zarar"]]
    ]
  };

  // ---------- Stil ----------
  const css = document.createElement("style");
  css.textContent = `
  .btn.oval{border-radius:999px}
  .ppRozet{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:#1d4ed8;color:#fff;font-size:12px;font-weight:700;vertical-align:middle;margin-right:6px;letter-spacing:0}
  .ppRozet.b{width:40px;height:40px;font-size:16px}
  #pp.ppK{padding:14px 12px}
  #ppHarfler{position:relative;width:250px;height:250px;margin:0 auto 8px}
  .ppH{position:absolute;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#0d1426;border:1px solid #1d2540;font-weight:700;font-size:11px;line-height:1}
  .ppH.su{border-color:#ffe9c7;background:#3b0000;color:#ffe9c7;transform:scale(1.25);z-index:2}
  .ppH.d{background:#14532d;border-color:#22c55e}
  .ppH.y{background:#7f1d1d;border-color:#ef4444}
  .ppH.p{background:#5b4a14;border-color:#eab308}
  #ppMerkez{position:absolute;inset:36px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
  #ppBuyuk{font-size:56px;font-weight:700;color:#ffe9c7;line-height:1}
  #ppSure{font-size:20px;font-weight:700}
  #ppPuan{font-size:14px;color:#8e9bc4}
  #ppSoru{font-size:17px;line-height:1.35;margin-bottom:10px}
  #ppCevap{box-sizing:border-box;width:100%;min-height:50px;padding:12px;border-radius:16px;border:1px solid #1d2540;background:#0d1426;color:#fff;font:inherit;font-size:18px;line-height:24px;text-align:center;outline:none;caret-color:#fff;white-space:nowrap;overflow:hidden;-webkit-user-select:text;user-select:text}
  #ppCevap:focus{border-color:#8e9bc4}
  #ppGeriBildirim{min-height:22px;margin-top:6px;font-weight:700}
  .ppSatir{display:flex;gap:10px}
  .ppSatir .btn{margin-top:6px;padding:13px;font-size:17px}
  `;
  document.head.append(css);

  // ---------- Ana menü butonu ----------
  const ana = document.getElementById("ana");
  const menuBtn = document.createElement("button");
  menuBtn.className = "btn ikinci oval";
  menuBtn.id = "ppAc";
  menuBtn.textContent = "Passaparola";
  ana.append(menuBtn);

  // ---------- Passaparola ekranı ----------
  const sec = document.createElement("section");
  sec.className = "kart hidden";
  sec.id = "pp";
  sec.innerHTML = `
    <div id="ppGiris">
      <h2><svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true" style="vertical-align:middle;margin-right:8px"><use href="#i-p"/></svg>Passaparola</h2>
      <p class="alt">28 harf, ${SURE} saniye. Her harfin<br>sorusunu bil, bilemezsen pas geç;<br>pas geçilenlere sonra tekrar dönersin.</p>
      <button class="btn" id="ppBasla">▶️ Başla</button>
      <button class="btn ikinci" id="ppGeri">Ana menü</button>
    </div>
    <div id="ppOyun" class="hidden">
      <div id="ppHarfler">
        <div id="ppMerkez"><div id="ppBuyuk"></div><span id="ppSure"></span><b id="ppPuan"></b></div>
        <div id="ppChips"></div>
      </div>
      <p id="ppSoru"></p>
      <div id="ppCevap" contenteditable="true" role="textbox" aria-label="Cevap" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="done"></div>
      <p id="ppGeriBildirim"></p>
      <div class="ppSatir">
        <button class="btn ikinci" id="ppPas">Pas</button>
        <button class="btn" id="ppGonder">Cevapla</button>
      </div>
    </div>
    <div id="ppSon" class="hidden">
      <h2 id="ppSBaslik"></h2>
      <p class="alt" id="ppSMetin"></p>
      <button class="btn" id="ppTekrar">Tekrar oyna</button>
      <button class="btn ikinci" id="ppMenu">Ana menü</button>
    </div>`;
  ana.insertAdjacentElement("afterend", sec);

  const $ = id => document.getElementById(id);
  const giris = $("ppGiris"), oyun = $("ppOyun"), son = $("ppSon");
  const inp = $("ppCevap"), fb = $("ppGeriBildirim");

  // Cevap kutusu bilerek <input> değil, düzenlenebilir bir <div>:
  // Chrome bunu şifre/kart/adres alanı sanıp otomatik doldurma çubuğu göstermesin diye.
  const oku = () => inp.textContent;
  const yaz = v => { inp.textContent = v; };
  const odak = () => {
    inp.focus();
    const r = document.createRange();
    r.selectNodeContents(inp);
    r.collapse(false);
    const sl = getSelection();
    sl.removeAllRanges();
    sl.addRange(r);
  };

  // ---------- Durum ----------
  let dur, sorular, idx, sure, zaman, kilit;
  let duel = null; // düello: { api, elendi }
  const DUELLO_HEDEF = Math.round(HARFLER.length / 2); // düelloda hedef: bu kadar harfi ilk bilen kazanır
  const tohumlu = seed => { let s = (Math.abs(Math.floor(seed)) % 233280) || 1; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
  // dur: 0 bekliyor, 1 doğru, 2 yanlış, 3 pas

  const norm = s => s.toLocaleLowerCase("tr").replace(/[^a-zçğıöşü0-9]/g, "");

  const bolum = b => {
    giris.classList.toggle("hidden", b !== "giris");
    oyun.classList.toggle("hidden", b !== "oyun");
    son.classList.toggle("hidden", b !== "son");
    sec.classList.toggle("ppK", b === "oyun");
    if (b !== "oyun") sec.style.opacity = "";
  };

  function menuyeDon() {
    clearInterval(zaman);
    sec.classList.add("hidden");
    sec.classList.remove("ppK");
    ana.classList.remove("hidden");
  }

  function sureYaz() {
    const m = Math.floor(sure / 60), s = sure % 60;
    $("ppSure").textContent = "⏱️ " + m + ":" + String(s).padStart(2, "0");
  }

  function ciz() {
    $("ppChips").innerHTML = HARFLER.map((h, i) => {
      const c = ["", "d", "y", "p"][dur[i]];
      const a = -Math.PI / 2 + i * 2 * Math.PI / HARFLER.length;
      const x = 125 + 111 * Math.cos(a) - 12, y = 125 + 111 * Math.sin(a) - 12;
      return `<div class="ppH ${c} ${i === idx ? "su" : ""}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px">${h}</div>`;
    }).join("");
    $("ppBuyuk").textContent = HARFLER[idx];
    $("ppPuan").textContent = "✅ " + dur.filter(x => x === 1).length + " / " + HARFLER.length;
    $("ppSoru").textContent = sorular[idx][0];
    sureYaz();
  }

  function sonrakiBul() {
    const n = HARFLER.length;
    for (let k = 1; k <= n; k++) {
      const j = (idx + k) % n;
      if (dur[j] === 0 || dur[j] === 3) return j;
    }
    return -1;
  }

  function ileri() {
    yaz("");
    const j = sonrakiBul();
    if (j < 0) return bitir();
    idx = j;
    ciz();
    odak();
  }

  // Kart klavye tam oturana kadar gizli tutulur, düzen hesaplandıktan sonra yumuşakça gösterilir.
  // Süre de kart göründüğünde başlar.
  let acildi = false, acTimer;
  function ac() {
    if (acildi) return;
    acildi = true;
    clearTimeout(acTimer);
    sigdir();
    sec.style.transition = "opacity .15s";
    sec.style.opacity = "";
    clearInterval(zaman);
    zaman = setInterval(() => {
      sure--;
      sureYaz();
      if (sure <= 0) bitir();
    }, 1000);
  }

  // DÜZELTME: soru 1 satır mı 2 satır mı diye kart yüksekliği değişiyordu; sığdır() halkayı
  // karta göre ölçeklediği için halka her soruda küçülüp büyüyordu. Burada oyundaki en uzun
  // sorunun yüksekliği bir kez ölçülüp soru alanına sabitlenir; kart boyu hiç değişmez.
  function soruYukseklikSabitle() {
    const p = $("ppSoru");
    p.style.minHeight = "";
    let en = 0;
    sorular.forEach(q => { p.textContent = q[0]; en = Math.max(en, p.offsetHeight); });
    p.style.minHeight = en + "px";
  }

  const SERI_SAYISI = 20;
  function seriSorulari(seri) {
    return HARFLER.map((h, i) => {
      const rg = tohumlu(i + 1), o = SORU[h].map((_, j) => j);
      for (let x = o.length - 1; x > 0; x--) { const y = Math.floor(rg() * (x + 1)); [o[x], o[y]] = [o[y], o[x]]; }
      return SORU[h][o[seri % o.length]];
    });
  }
  function baslat() { duel = null; baslatCek(null); }
  function baslatCek(seed) {
    $("ppTekrar").style.display = "";
    kararYuk = 0; adayAdet = 0; baslatYuk = yukOku(); baslatT = Date.now();
    dur = HARFLER.map(() => 0);
    // 20 SERİ: her oyun bir sonraki seriden gelir, sorular hep değişir (havuz bitince başa döner).
    // Düelloda seri tohumdan çıkar, iki oyuncu aynı soruları görür.
    let seriNo;
    if (seed == null) {
      try { seriNo = parseInt(localStorage.getItem("ppSeriNo") || "0", 10) || 0; localStorage.setItem("ppSeriNo", String(seriNo + 1)); } catch (e) { seriNo = Math.floor(Math.random() * 1000); }
    } else seriNo = Math.abs(Math.floor(seed)) % SERI_SAYISI;
    sorular = seriSorulari(seriNo);
    idx = 0;
    sure = SURE;
    kilit = false;
    acildi = false;
    clearTimeout(acTimer);
    clearInterval(zaman);
    fb.textContent = "";
    yaz("");
    sec.style.transition = "none";
    sec.style.opacity = "0";
    bolum("oyun");
    soruYukseklikSabitle();
    ciz();
    odak();
    acTimer = setTimeout(ac, 2000); // klavye hiç açılmazsa (masaüstü vb.) yine de başlasın
  }

  function gonder() {
    if (kilit) return;
    const v = norm(oku());
    if (!v) return;
    const q = sorular[idx];
    if (q[1].map(norm).includes(v)) {
      dur[idx] = 1;
      if (duel) {
        const dg = dur.filter(x => x === 1).length;
        duel.api.ilerle(dg, DUELLO_HEDEF);
        if (dg >= DUELLO_HEDEF) { kilit = true; clearInterval(zaman); fb.textContent = "✅ Hedefe ulaştın!"; duel.api.bitti(); return; }
      }
      fb.textContent = "✅ Doğru!";
      fb.style.color = "#22c55e";
      ileri();
    } else {
      dur[idx] = 2;
      kilit = true;
      fb.textContent = "❌ Doğru cevap: " + q[1][0];
      fb.style.color = "#ef4444";
      ciz();
      setTimeout(() => { kilit = false; fb.textContent = ""; ileri(); }, 1300);
    }
  }

  function pas() {
    if (kilit) return;
    dur[idx] = 3;
    fb.textContent = "";
    ileri();
  }

  function bitir() {
    clearInterval(zaman);
    if (duel) {
      kilit = true;
      if (!duel.elendi) { duel.elendi = true; duel.api.elendi(); }
      $("ppSBaslik").textContent = "Hedefe ulaşamadın";
      $("ppSMetin").textContent = "Doğru: " + dur.filter(x => x === 1).length + " / " + DUELLO_HEDEF + " • Rakibin bitirmesini bekle.";
      $("ppTekrar").style.display = "none";
      bolum("son");
      return;
    }
    if (window.Puan && dur._p !== true) { // her oyunda bir kez: doğru oranı kadar tur puanı
      dur._p = true;
      const d0 = dur.filter(x => x === 1).length;
      if (d0 > 0) Puan.ekle("passaparola", d0 / HARFLER.length);
    }
    kilit = true;
    const d = dur.filter(x => x === 1).length;
    const y = dur.filter(x => x === 2).length;
    const k = HARFLER.length - d - y;
    $("ppSBaslik").textContent = d === HARFLER.length ? "🏆 Tebrikler, hepsini bildin!" : (sure <= 0 ? "⏰ Süre doldu!" : "Oyun bitti!");
    $("ppSMetin").textContent = "Doğru: " + d + " • Yanlış: " + y + " • Boş: " + k;
    bolum("son");
  }

  // ---------- Olaylar ----------
  menuBtn.onclick = () => { ana.classList.add("hidden"); sec.classList.remove("hidden"); bolum("giris"); };
  $("ppBasla").onclick = baslat;
  $("ppTekrar").onclick = baslat;
  const cikis = () => { if (duel) document.querySelector("h1").click(); else menuyeDon(); };
  $("ppGeri").onclick = cikis;
  $("ppMenu").onclick = cikis;
  $("ppGonder").onclick = gonder;
  $("ppPas").onclick = pas;
  // DÜZELTME: düğmeye basınca odak kutudan çıkıyor, klavye kapanıp yeniden açılıyordu (halka zıplıyordu).
  ["ppGonder", "ppPas"].forEach(id => $(id).addEventListener("mousedown", e => e.preventDefault()));
  const kaydir = () => $("ppGonder").scrollIntoView({ block: "end", behavior: "smooth" });
  const mv = document.querySelector('meta[name="viewport"]');
  if (mv && !/interactive-widget/.test(mv.content)) mv.content += ", interactive-widget=resizes-content";
  inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); gonder(); } });
  inp.addEventListener("paste", e => {
    e.preventDefault();
    const t = (e.clipboardData || window.clipboardData).getData("text").replace(/\s+/g, " ");
    document.execCommand("insertText", false, t);
  });

  // Başlık: oyunda üstte küçük sabit çubuk (klavye açıkken de görünür), tıklayınca ana sayfa
  const stl = document.createElement("style");
  stl.textContent = "body.ppOyunda{padding-top:calc(58px + env(safe-area-inset-top))!important;padding-bottom:0}#ppSoru{text-wrap:balance;text-align:center}";
  document.head.append(stl);
  const hGuncelle = () => {
    const a = !sec.classList.contains("hidden") && !oyun.classList.contains("hidden");
    document.body.classList.toggle("ppOyunda", a);
  };
  new MutationObserver(hGuncelle).observe(sec, { attributes: true, attributeFilter: ["class"] });
  new MutationObserver(hGuncelle).observe(oyun, { attributes: true, attributeFilter: ["class"] });
  document.querySelector("h1").addEventListener("click", () => {
    if (document.body.classList.contains("ppOyunda")) menuyeDon();
  });
  // DÜELLO (arena.js): iki oyuncu aynı sorularla oynar, ilk DUELLO_HEDEF harfi bilen kazanır
  (window.ArenaOyunlari = window.ArenaOyunlari || {}).passaparola = {
    ad: "Passaparola",
    baslat: function (d, api) {
      duel = { api: api, elendi: false };
      ana.classList.add("hidden"); sec.classList.remove("hidden");
      baslatCek(d.seed);
      api.ilerle(0, DUELLO_HEDEF);
    },
    dur: function () { duel = null; clearInterval(zaman); clearTimeout(acTimer); kilit = true; }
  };
  document.addEventListener("anasayfa", menuyeDon);

  // HALKA ÖLÇEĞİ (sabit): Chrome klavye açıkken visualViewport.height'ı bazen tam, bazen kısalmış okuyor.
  // Eskiden her okumada halka yeniden ölçekleniyordu, bu yüzden sürekli büyüyüp küçülüyordu.
  // Şimdi: yükseklik 500 ms boyunca AYNI okunursa (klavye gerçekten oturduysa) ve önceki karardan
  // 30 px'den fazla farklıysa ölçek bir kez hesaplanır. Soru değişince / resize olunca hiçbir şey ölçülmez.
  let olcek = 1, marj = 8, kararYuk = 0, adayYuk = 0, adayAdet = 0, baslatYuk = 0, baslatT = 0;
  const yukOku = () => {
    const vv = window.visualViewport;
    return Math.round(Math.min(vv ? vv.height : innerHeight, innerHeight));
  };
  const uygula = () => {
    const hr = $("ppHarfler");
    hr.style.transformOrigin = "top center";
    hr.style.transform = "scale(" + olcek + ")";
    hr.style.marginBottom = marj + "px";
  };
  const hesapla = vh => {
    const hr = $("ppHarfler");
    hr.style.transform = ""; hr.style.marginBottom = ""; sec.style.marginTop = "";
    const asan = sec.offsetHeight + 58 + 10 - vh; // 58px = üst başlık payı, 10px = kart altı boşluk
    olcek = asan > 0 ? Math.max(0.55, (250 - asan) / 250) : 1;
    marj = 8 - 250 * (1 - olcek);
    uygula();
    if (asan < 0) sec.style.marginTop = Math.min(-asan, 6) + "px";
    scrollTo(0, 0);
  };
  const sigdir = () => { // soru değişince vb.: sadece mevcut ölçeği yeniden uygula
    if (oyun.classList.contains("hidden")) return;
    if (!kararYuk) { kararYuk = yukOku(); hesapla(kararYuk); return; }
    uygula();
    scrollTo(0, 0);
  };
  setInterval(() => {
    if (oyun.classList.contains("hidden")) { kararYuk = 0; adayAdet = 0; return; }
    const h = yukOku();
    if (h === adayYuk) adayAdet++; else { adayYuk = h; adayAdet = 1; }
    if (!acildi) {
      // İlk açılış: klavye oturunca (yükseklik 150 ms sabit) ölçeği hesapla ve kartı HEMEN göster.
      // Halka büyük görünmeden doğrudan küçük haliyle açılır.
      if (adayAdet >= 3 && (h < baslatYuk - 100 || Date.now() - baslatT > 1500)) { kararYuk = h; hesapla(h); ac(); }
      return;
    }
    // Açıldıktan sonra: yükseklik 500 ms sabit kalırsa ve 30 px'ten fazla değiştiyse yeniden hesapla
    if (adayAdet >= 10 && Math.abs(h - kararYuk) > 30) { kararYuk = h; hesapla(h); }
  }, 50);
  new MutationObserver(sigdir).observe($("ppSoru"), { childList: true });
})();
