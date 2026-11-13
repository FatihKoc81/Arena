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
    }
  });
})();
