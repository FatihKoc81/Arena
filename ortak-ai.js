/* ARENA -> Ortak AI Merkezi köprüsü.
 * Gizli GATEWAY_TOKEN istemciye hiçbir zaman gönderilmez.
 * Uygulama, Firebase oturumunun kısa ömürlü ID token'ını kullanır.
 * İstekler yalnızca açıkça çağrıldığında gönderilir; oyun/hesap verileri otomatik aktarılmaz.
 */
(function () {
  "use strict";

  var BASE = "https://ortak-ai-merkezi.fatihkoc7.workers.dev";

  function authToken() {
    if (!window.firebase || !firebase.apps || !firebase.apps.length) {
      return Promise.reject(new Error("Firebase henüz başlatılmadı."));
    }

    var auth = firebase.auth();
    if (auth.currentUser) return auth.currentUser.getIdToken();

    return new Promise(function (resolve, reject) {
      var done = false;
      var unsubscribe = auth.onAuthStateChanged(function (user) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        unsubscribe();
        if (!user) {
          reject(new Error("ARENA oturumu henüz hazır değil."));
          return;
        }
        user.getIdToken().then(resolve, reject);
      }, function (error) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        unsubscribe();
        reject(error);
      });

      var timer = setTimeout(function () {
        if (done) return;
        done = true;
        unsubscribe();
        reject(new Error("Firebase oturumu zaman aşımına uğradı."));
      }, 10000);
    });
  }

  function request(path, options) {
    return authToken().then(function (token) {
      var headers = Object.assign({}, options && options.headers, {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      });

      return fetch(BASE + path, Object.assign({}, options, {
        headers: headers,
        cache: "no-store"
      }));
    }).then(function (response) {
      return response.json().catch(function () {
        return { error: "Sunucudan geçerli JSON yanıtı alınamadı." };
      }).then(function (data) {
        if (!response.ok) {
          throw new Error(data.error || ("Ortak merkez HTTP " + response.status));
        }
        return data;
      });
    });
  }

  window.OrtakAIMerkezi = Object.freeze({
    url: BASE,

    durum: function () {
      return fetch(BASE + "/health", { cache: "no-store" }).then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) throw new Error(data.error || ("HTTP " + r.status));
          return data;
        });
      });
    },

    sohbet: function (message) {
      message = String(message || "").trim();
      if (!message) return Promise.reject(new Error("Mesaj boş olamaz."));
      if (message.length > 12000) {
        return Promise.reject(new Error("Mesaj en fazla 12.000 karakter olabilir."));
      }
      return request("/app/chat", {
        method: "POST",
        body: JSON.stringify({ message: message })
      });
    },

    mesajGonder: function (to, content) {
      content = String(content || "").trim();
      if (!content) return Promise.reject(new Error("Mesaj boş olamaz."));
      return request("/app/messages", {
        method: "POST",
        body: JSON.stringify({
          from: "ARENA",
          to: String(to),
          content: content
        })
      });
    },

    mesajlariGetir: function () {
      return request("/app/messages?project=ARENA", { method: "GET" });
    },

    seslendir: function (metin, dil) {
      metin = String(metin || "").trim();
      if (!metin) return Promise.reject(new Error("Seslendirilecek metin boş."));
      if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== "function") {
        return Promise.reject(new Error("Bu cihazın tarayıcısında sesli okuma desteklenmiyor."));
      }
      window.speechSynthesis.cancel();
      return new Promise(function (resolve, reject) {
        var utterance = new SpeechSynthesisUtterance(metin);
        utterance.lang = dil || "tr-TR";
        utterance.onend = function () { resolve(true); };
        utterance.onerror = function (event) { reject(new Error(event.error || "Sesli okuma başarısız.")); };
        window.speechSynthesis.speak(utterance);
      });
    },

    sesDurdur: function () {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    },

    konusmayiBaslat: function (aralikMs) {
      var self = this;
      var aktif = true;
      var bilinen = Object.create(null);
      var bekleme = Math.max(5000, Number(aralikMs) || 12000);
      function mesajListesi(data) {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.messages)) return data.messages;
        if (data && Array.isArray(data.items)) return data.items;
        if (data && Array.isArray(data.data)) return data.data;
        return [];
      }
      function tur() {
        if (!aktif) return;
        self.mesajlariGetir().then(function (data) {
          var messages = mesajListesi(data);
          messages.forEach(function (m, index) {
            var from = String(m.from || m.sender || m.project || "");
            var to = String(m.to || "");
            var rawContent = String(m.content || m.message || m.text || "").trim();
            var depthMatch = rawContent.match(/^\\[\\[ORTAK_AI_TUR:(\\d+)\\]\\]\\s*/);
            var depth = depthMatch ? Number(depthMatch[1]) : 0;
            var content = rawContent.replace(/^\\[\\[ORTAK_AI_TUR:\\d+\\]\\]\\s*/, "").trim();
            var id = String(m.id || m.messageId || (from + "|" + content + "|" + index));
            if (!content || depth >= 3 || from === "ARENA" || (to && to !== "ARENA") || bilinen[id]) return;
            bilinen[id] = true;
            self.seslendir(from + " diyor ki: " + content).catch(function () {});
            self.sohbet("Sen ARENA uygulamasının yapay zekâ asistanısın. " +
              from + " uygulamasından şu mesaj geldi: " + content +
              " Kısa, doğal ve Türkçe bir cevap ver. Yalnızca cevabı yaz.").then(function (answer) {
                var reply = String(answer.response || answer.reply || answer.text || "").trim();
                if (reply) {
                  self.mesajGonder(from, "[[ORTAK_AI_TUR:" + (depth + 1) + "]] " + reply).then(function () {
                    self.seslendir("Yanıtım: " + reply).catch(function () {});
                  }).catch(function () {});
                }
              }).catch(function () {});
          });
        }).catch(function () {}).then(function () {
          if (aktif) setTimeout(tur, bekleme);
        });
      }
      tur();
      return function () { aktif = false; };
    }
  });
})();
