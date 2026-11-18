/* Drumul meu spre Betleem: lucrul fără internet după prima deschidere. © Candela Parohiei
   Pagina: întâi rețeaua (ca să vină versiunile noi), apoi copia. Restul fișierelor: copia, reîmprospătată în fundal.
   Contorul anonim (alt domeniu) și PDF-urile nu trec prin aici. */
var CACHE = 'drum-betleem-v1';
var BAZA = ['/drum/', '/drum/drum.css', '/drum/drum.js', '/drum/zile-ro.js', '/drum/manifest.webmanifest',
  '/drum/icon-192.png', '/jucaus.css', '/fonts/fonts.css', '/favicon.png'];
var EXTRA = ['/img/joc/fulgi.svg', '/img/joc/candela.svg', '/img/joc/feston.svg',
  '/fonts/Nunito-Bold.woff2', '/fonts/Nunito-ExtraBold.woff2',
  '/fonts/EBGaramond-400-latin.woff2', '/fonts/EBGaramond-400-latin-ext.woff2',
  '/fonts/EBGaramond-700-latin.woff2', '/fonts/EBGaramond-700-latin-ext.woff2'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(BAZA).then(function () {
      return Promise.all(EXTRA.map(function (u) { return c.add(u)['catch'](function () { }); }));
    });
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (n) { return n.indexOf('drum-betleem-') === 0 && n !== CACHE; })
      .map(function (n) { return caches['delete'](n); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== self.location.origin || /\.pdf$/i.test(u.pathname)) { return; }
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(function (res) {
      var copie = res.clone();
      caches.open(CACHE).then(function (c) { c.put('/drum/', copie); });
      return res;
    })['catch'](function () { return caches.match('/drum/'); }));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(function (din) {
    var retea = fetch(r).then(function (res) {
      if (res && res.ok) { var copie = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copie); }); }
      return res;
    })['catch'](function () { return din; });
    return din || retea;
  }));
});
