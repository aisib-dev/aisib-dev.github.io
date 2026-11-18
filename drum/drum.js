/* Drumul meu spre Betleem: harta celor 40 de seri (varianta online a caietului). © Candela Parohiei
   Fără biblioteci externe. Progresul se păstrează doar în localStorage, pe dispozitiv.
   Limba: după <html lang>; textele interfeței sunt în STR, iar serile în /drum/zile-<limba>.js. */
(function () {
  'use strict';

  var STR = {
    ro: {
      luni: ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
      zile: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
      ziua: 'Ziua {n} din 40',
      saptamana: 'Săptămâna {k}: {t}',
      calendar: 'Azi, în calendarul Bisericii',
      gand: 'Gândul zilei',
      scriptura: 'Din Scriptură',
      rugaciune: 'Rugăciune',
      fapta: 'Fapta bună',
      amFacut: 'Am făcut-o',
      facuta: 'Am făcut-o! Steaua strălucește',
      renunta: 'Încă nu am făcut-o',
      maiMult: 'Mai mult pentru seara aceasta',
      mici: 'Pentru cei mici (4-6 ani)',
      intrebare: 'Întrebarea serii',
      evanghelia: 'Evanghelia zilei',
      peScurt: 'Pe scurt',
      ceInseamna: 'Ce înseamnă',
      duminica: 'Ne vedem la Sfânta Liturghie!',
      duminicaMic: 'Astăzi este duminică, ziua Domnului.',
      ajun: 'Ne vedem mâine la Sfânta Liturghie a Nașterii Domnului!',
      hristos: 'Hristos Se naște, slăviți-L!',
      incuiata: 'Steaua aceasta se deschide {data}. Mai ai {k} {seri} de mers până la ea.',
      seara1: 'seară', seriN: 'seri',
      aprinsa: 'Steaua {n} s-a aprins!',
      toate: 'Toate cele 40 de stele strălucesc. Ai ajuns la Betleem!',
      stare: 'Ai aprins <span class="num">{k}</span> din 40 de stele.',
      inainte: 'Drumul începe duminică, 15 noiembrie. Prima stea se aprinde atunci.',
      dupa: 'Am ajuns la Betleem! Hristos Se naște, slăviți-L!',
      aziBtn: 'Deschide steaua de azi',
      aziBtnFacut: 'Steaua de azi strălucește',
      azi: 'azi',
      start: 'Pornim la drum',
      betleem: 'Betleem',
      ariaStea: 'Ziua {n}, {data}',
      ariaIncuiata: ', se deschide mai târziu',
      ariaFacuta: ', fapta bună făcută',
      inchide: 'Închide'
    }
  };

  var LANG = (document.documentElement.getAttribute('lang') || 'ro').slice(0, 2);
  var S = STR[LANG] || STR.ro;
  var ZILE = (window.DRUM && window.DRUM.zile && (window.DRUM.zile[LANG] || window.DRUM.zile.ro)) || [];
  var CHEIE = 'candela-drum-betleem-2026';
  var harta = document.getElementById('harta');
  if (!harta || ZILE.length !== 40) { return; }

  function t(s, v) { return s.replace(/\{(\w+)\}/g, function (m, k) { return v && v[k] !== undefined ? v[k] : m; }); }
  function doi(x) { return (x < 10 ? '0' : '') + x; }

  /* ---------- data de azi (a dispozitivului; pentru probă: ?zi=AAAA-LL-ZZ) ---------- */
  var AZI = (function () {
    var m = /[?&]zi=(\d{4}-\d{2}-\d{2})(?:&|$)/.exec(location.search);
    if (m) { return m[1]; }
    var d = new Date();
    return d.getFullYear() + '-' + doi(d.getMonth() + 1) + '-' + doi(d.getDate());
  })();
  function zi(z) { return z.data < AZI ? 'trecuta' : (z.data === AZI ? 'azi' : 'viitoare'); }
  function dataLunga(iso) {
    var p = iso.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]);
    return S.zile[d.getDay()] + ', ' + (+p[2]) + ' ' + S.luni[+p[1] - 1];
  }
  function eDuminica(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]).getDay() === 0; }
  function seriPanaLa(iso) {
    var a = AZI.split('-'), b = iso.split('-');
    return Math.round((Date.UTC(+b[0], +b[1] - 1, +b[2]) - Date.UTC(+a[0], +a[1] - 1, +a[2])) / 864e5);
  }

  /* ---------- progresul (doar pe dispozitiv; pagina merge și fără) ---------- */
  var facute = {};
  try {
    var brut = window.localStorage && localStorage.getItem(CHEIE);
    var lista = brut ? JSON.parse(brut) : [];
    for (var i = 0; i < lista.length; i++) { if (lista[i] >= 1 && lista[i] <= 40) { facute[lista[i]] = true; } }
  } catch (e) { facute = {}; }
  function salveaza() {
    try {
      var l = [];
      for (var k in facute) { if (facute[k]) { l.push(+k); } }
      localStorage.setItem(CHEIE, JSON.stringify(l));
    } catch (e) { /* fără stocare: progresul rămâne doar până la închiderea paginii */ }
  }
  function numarFacute() { var k = 0; for (var x in facute) { if (facute[x]) { k++; } } return k; }

  /* ---------- desene (din cod, fără chipuri) ---------- */
  var STARP = 'M50 2L58.4 29.7 84 16 70.3 41.6 98 50 70.3 58.4 84 84 58.4 70.3 50 98 41.6 70.3 16 84 29.7 58.4 2 50 29.7 41.6 16 16 41.6 29.7Z';
  function biserica(cul, fond) {          /* bisericuță în jurul originii, cam 22 x 24 */
    return '<g fill="' + cul + '"><path d="M0 -14 V-10 M-2.6 -12.4 H2.6" stroke="' + cul + '" stroke-width="1.6" fill="none"/>' +
      '<path d="M-5.5 -3 C-5.5 -9.5 5.5 -9.5 5.5 -3 Z"/><rect x="-4.2" y="-3" width="8.4" height="3.4"/>' +
      '<path d="M-10 1 L0 -2.5 L10 1 Z"/><rect x="-8.5" y="1" width="17" height="10"/>' +
      '<path d="M-2.6 11 V6.6 C-2.6 4.4 2.6 4.4 2.6 6.6 V11 Z" fill="' + fond + '"/></g>';
  }
  function ieslea(w) {                   /* ieslea cu Pruncul înfășat (fără chip), centrată în 0,0; lățime ~ 100*w */
    return '<g transform="scale(' + w + ')">' +
      '<path d="M-34 22 L-22 54 M34 22 L22 54 M-22 22 L-34 54 M22 22 L34 54" stroke="#8A6524" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M-46 -2 H46 L36 26 H-36 Z" fill="#B07E3C" stroke="#6E4C1E" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M-40 -2 L-30 -10 M-26 -2 L-20 -12 M-10 -2 L-8 -12 M8 -2 L10 -13 M24 -2 L28 -11 M38 -2 L44 -9" stroke="#E3C77E" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="0" cy="-10" rx="30" ry="12" fill="#FFFBF2" stroke="#8A6420" stroke-width="2.5"/>' +
      '<path d="M-20 -19 L-6 -1 M-6 -21 L10 0 M8 -21 L22 -3" stroke="#B8892E" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="-22" cy="-12" r="8" fill="#FFFBF2" stroke="#8A6420" stroke-width="2.5"/></g>';
  }
  function steaB(cx, cy, s, fill, stroke, sw) {
    return '<path d="' + STARP + '" transform="translate(' + (cx - 50 * s) + ',' + (cy - 50 * s) + ') scale(' + s + ')" fill="' + fill +
      '" stroke="' + stroke + '" stroke-width="' + (sw / s) + '" stroke-linejoin="round" class="corp"/>';
  }

  /* ---------- harta ---------- */
  var colsCurente = 0, deAprins = 0, ultimaStea = null;
  function coloane() {
    var w = harta.clientWidth || 360;
    return w < 480 ? 4 : (w < 760 ? 5 : 8);
  }
  function deseneaza() {
    var cols = coloane(); colsCurente = cols;
    var CW = 80, RH = 96, PADX = 52, TOP = 128, BOTTOM = 300;
    var nGrid = 39, rows = Math.ceil(nGrid / cols);
    var W = cols * CW + 2 * PADX, H = TOP + (rows - 1) * RH + BOTTOM;
    var pos = [];
    for (var i = 0; i < nGrid; i++) {
      var r = Math.floor(i / cols), c = i % cols;
      if (r % 2) { c = cols - 1 - c; }
      pos.push([PADX + CW / 2 + c * CW, TOP + r * RH]);
    }
    var yL = pos[nGrid - 1][1], bx = W / 2, by = yL + 112, gy = H - 18;
    var o = [];
    o.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="' + S.start + ' · ' + S.betleem + '">');
    o.push('<defs><radialGradient id="aur" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#FFF1BF"/><stop offset=".55" stop-color="#F2D88E"/><stop offset="1" stop-color="#C99A3E"/></radialGradient>' +
      '<radialGradient id="halo"><stop offset="0" stop-color="#FFE7A0" stop-opacity=".6"/><stop offset="1" stop-color="#FFE7A0" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="raza" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2D88E" stop-opacity=".9"/><stop offset="1" stop-color="#F2D88E" stop-opacity=".1"/></linearGradient></defs>');
    /* cerul: puncte mici, mereu aceleași */
    var seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var cer = '';
    for (var k = 0; k < Math.round(W * H / 9000); k++) {
      cer += '<circle cx="' + (rnd() * W).toFixed(1) + '" cy="' + (rnd() * (H - 120)).toFixed(1) + '" r="' + (0.7 + rnd() * 1.1).toFixed(1) + '"/>';
    }
    o.push('<g fill="#DCE5F2" opacity=".35">' + cer + '</g>');
    /* începutul drumului: căsuța cu fereastra luminată */
    var sx = pos[0][0] - 12, sy = TOP - 70;
    o.push('<g transform="translate(' + sx + ',' + sy + ')"><path d="M-16 0 L0 -14 L16 0 Z" fill="#5B2840"/><rect x="-13" y="0" width="26" height="20" fill="#24305A" stroke="#9DB0D6" stroke-width="1.2"/>' +
      '<rect x="-4" y="5" width="8" height="8" fill="#F2D88E"/>' +
      '<text x="24" y="14" fill="#E3C77E" font-family="Nunito,Trebuchet MS,Arial,sans-serif" font-weight="800" font-size="17">' + S.start + '</text></g>');
    /* drumul */
    var d = 'M' + (sx + 4) + ' ' + (sy + 24) + ' Q' + (pos[0][0] - 20) + ' ' + (TOP - 20) + ' ' + pos[0][0] + ' ' + pos[0][1];
    for (i = 1; i < nGrid; i++) {
      var a = pos[i - 1], b = pos[i];
      if (a[1] === b[1]) { d += ' L' + b[0] + ' ' + b[1]; }
      else {
        var dir = a[0] > W / 2 ? 1 : -1, cxp = a[0] + dir * CW * 0.78;
        d += ' C' + cxp + ' ' + a[1] + ' ' + cxp + ' ' + b[1] + ' ' + b[0] + ' ' + b[1];
      }
    }
    var L = pos[nGrid - 1];
    d += ' C' + L[0] + ' ' + (L[1] + 70) + ' ' + bx + ' ' + (by - 80) + ' ' + bx + ' ' + (by - 34);
    o.push('<path d="' + d + '" fill="none" stroke="#C9A063" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 11" opacity=".9"/>');
    /* Betleemul: dealuri, căsuțe, peștera, raza stelei */
    o.push('<path d="M0 ' + (gy - 62) + ' Q' + (W * 0.2) + ' ' + (gy - 104) + ' ' + (W * 0.42) + ' ' + (gy - 70) + ' T' + W + ' ' + (gy - 76) + ' V' + H + ' H0 Z" fill="#2A2350"/>');
    var casute = '';
    for (k = 0; k < 4; k++) {
      var hx = (k < 2 ? W * 0.08 + k * 34 : W * 0.72 + (k - 2) * 36), hy = gy - 92 + (k % 2) * 8;
      casute += '<rect x="' + hx + '" y="' + hy + '" width="28" height="22" fill="#1B2550"/><rect x="' + (hx + 4) + '" y="' + (hy - 6) + '" width="20" height="6" fill="#1B2550"/>' +
        '<rect x="' + (hx + 10) + '" y="' + (hy + 7) + '" width="7" height="7" fill="#E3C77E" opacity=".85"/>';
    }
    o.push(casute);
    o.push('<path d="M' + (bx - 120) + ' ' + gy + ' C' + (bx - 112) + ' ' + (gy - 70) + ' ' + (bx - 60) + ' ' + (gy - 112) + ' ' + bx + ' ' + (gy - 114) +
      ' C' + (bx + 64) + ' ' + (gy - 112) + ' ' + (bx + 112) + ' ' + (gy - 70) + ' ' + (bx + 120) + ' ' + gy + ' Z" fill="#8F6F45" stroke="#C9A063" stroke-width="2"/>');
    o.push('<path d="M' + (bx - 48) + ' ' + gy + ' C' + (bx - 48) + ' ' + (gy - 50) + ' ' + (bx - 26) + ' ' + (gy - 76) + ' ' + bx + ' ' + (gy - 76) +
      ' C' + (bx + 26) + ' ' + (gy - 76) + ' ' + (bx + 48) + ' ' + (gy - 50) + ' ' + (bx + 48) + ' ' + gy + ' Z" fill="#0E1A3A"/>');
    o.push('<path d="M' + bx + ' ' + (by + 30) + ' L' + (bx - 7) + ' ' + (gy - 40) + ' L' + (bx + 7) + ' ' + (gy - 40) + ' Z" fill="url(#raza)"/>');
    o.push('<g transform="translate(' + bx + ',' + (gy - 26) + ')">' + ieslea(0.42) + '</g>');
    o.push('<text x="' + bx + '" y="' + (gy - 2) + '" text-anchor="middle" fill="#E3C77E" font-family="Nunito,Trebuchet MS,Arial,sans-serif" font-weight="800" font-size="12" letter-spacing="2">' + S.betleem.toUpperCase() + '</text>');
    /* stelele 1-39 */
    for (i = 0; i < nGrid; i++) { o.push(stea(ZILE[i], pos[i][0], pos[i][1], false)); }
    /* steaua 40: steaua Betleemului deasupra peșterii */
    o.push(stea(ZILE[39], bx, by, true));
    o.push('</svg>');
    harta.innerHTML = o.join('');
    if (deAprins) { aprinde(deAprins); deAprins = 0; }
  }

  function stea(z, x, y, mare) {
    var st = zi(z), fac = !!facute[z.n], dum = eDuminica(z.data), deschisa = st !== 'viitoare';
    var s = mare ? 0.9 : 0.58, R = 50 * s;
    var g = '<g class="stea ' + (deschisa ? 'deschisa' : 'incuiata') + (fac ? ' facuta' : '') + '" data-n="' + z.n + '" role="button" tabindex="0" aria-label="' +
      t(S.ariaStea, { n: z.n, data: dataLunga(z.data) }) + (deschisa ? '' : S.ariaIncuiata) + (fac ? S.ariaFacuta : '') + '">';
    g += '<circle cx="' + x + '" cy="' + y + '" r="' + (R + 12) + '" fill="#000" fill-opacity="0"/>';
    if (fac) { g += '<circle cx="' + x + '" cy="' + y + '" r="' + (R * 1.22) + '" fill="url(#halo)"/>'; }
    if (st === 'azi') {
      g += '<circle class="puls" cx="' + x + '" cy="' + y + '" r="' + (R * 0.95) + '" fill="none" stroke="#F2D88E" stroke-width="3"/>';
    }
    if (!deschisa) { g += steaB(x, y, s, '#1E3566', '#9DB0D6', 1.4).replace('class="corp"', 'class="corp" opacity=".55"'); }
    else if (fac) { g += steaB(x, y, s, 'url(#aur)', '#8A6524', 1.6); }
    else { g += steaB(x, y, s, '#F7F0E1', '#E3C77E', 2); }
    var culTxt = deschisa ? '#14234A' : '#9DB0D6';
    if (dum && !mare) {
      g += '<g transform="translate(' + x + ',' + (y + 1) + ') scale(.95)">' + biserica(culTxt, deschisa ? (fac ? '#F2D88E' : '#F7F0E1') : '#1E3566') + '</g>';
      g += '<text x="' + x + '" y="' + (y + R + 14) + '" text-anchor="middle" fill="' + (deschisa ? '#E3C77E' : '#9DB0D6') + '" font-family="Nunito,Trebuchet MS,Arial,sans-serif" font-weight="800" font-size="13">' + z.n + '</text>';
    } else {
      g += '<text x="' + x + '" y="' + (y + (mare ? 7 : 5.5)) + '" text-anchor="middle" fill="' + culTxt + '" font-family="Nunito,Trebuchet MS,Arial,sans-serif" font-weight="800" font-size="' + (mare ? 21 : 15.5) + '">' + z.n + '</text>';
    }
    if (st === 'azi') {
      var ty = y - R - 10;
      g += '<rect x="' + (x - 19) + '" y="' + (ty - 13) + '" width="38" height="18" rx="9" fill="#9E2B25"/><text x="' + x + '" y="' + (ty + 0.5) +
        '" text-anchor="middle" fill="#fff" font-family="Nunito,Trebuchet MS,Arial,sans-serif" font-weight="800" font-size="12">' + S.azi + '</text>';
    }
    return g + '</g>';
  }

  function aprinde(n) {
    var g = harta.querySelector('.stea[data-n="' + n + '"]');
    if (!g) { return; }
    var c = g.querySelector('circle');
    var ns = 'http://www.w3.org/2000/svg', e = document.createElementNS(ns, 'circle');
    e.setAttribute('cx', c.getAttribute('cx')); e.setAttribute('cy', c.getAttribute('cy'));
    e.setAttribute('r', n === 40 ? 34 : 24); e.setAttribute('fill', '#FFE7A0'); e.setAttribute('class', 'aprinde');
    g.appendChild(e);
    setTimeout(function () { if (e.parentNode) { e.parentNode.removeChild(e); } }, 1300);
  }

  /* ---------- starea de sus ---------- */
  var stare = document.getElementById('stare'), btnAzi = document.getElementById('azi');
  function aziZ() { for (var i = 0; i < ZILE.length; i++) { if (ZILE[i].data === AZI) { return ZILE[i]; } } return null; }
  function actualizeazaStarea() {
    var k = numarFacute(), z = aziZ();
    var txt;
    if (AZI < ZILE[0].data) { txt = S.inainte; }
    else if (AZI > ZILE[39].data) { txt = S.dupa + '<br>' + t(S.stare, { k: k }); }
    else { txt = t(S.stare, { k: k }); }
    stare.innerHTML = txt;
    if (z) {
      btnAzi.hidden = false;
      btnAzi.textContent = facute[z.n] ? S.aziBtnFacut : S.aziBtn;
      btnAzi.className = 'mare' + (facute[z.n] ? ' facut' : ' aur');
    } else { btnAzi.hidden = true; }
  }

  /* ---------- fereastra serii ---------- */
  var fer = document.getElementById('fereastra'), fundal = document.getElementById('fundal'),
    cont = document.getElementById('f-continut'), btnInchide = document.getElementById('inchide'), toastEl = document.getElementById('toast');
  btnInchide.setAttribute('aria-label', S.inchide);

  function bloc(et, html, cls, loc) {
    return '<div class="bloc' + (cls ? ' ' + cls : '') + '"><span class="et">' + et + (loc ? ' <span class="loc">(' + loc + ')</span>' : '') + '</span><p>' + html + '</p></div>';
  }
  function continut(z) {
    var h = '<p class="f-data">' + dataLunga(z.data).replace(/^./, function (c) { return c.toUpperCase(); }) + '<span class="f-nr">' + t(S.ziua, { n: z.n }) + '</span></p>';
    if (z.saptamana) { h += '<p class="f-sapt">' + t(S.saptamana, { k: Math.ceil(z.n / 7), t: z.saptamana }) + '</p>'; }
    h += '<h3 id="f-titlu">' + z.titlu + '</h3>';
    if (z.n === 40) {
      h += '<div class="f-desen"><svg viewBox="-60 -70 120 130" aria-hidden="true">' +
        '<path d="' + STARP + '" transform="translate(-14,-70) scale(.28)" fill="#F2D88E" stroke="#8A6524" stroke-width="5"/>' +
        '<path d="M0 -44 L-5 -20 L5 -20 Z" fill="#E3C77E"/>' + ieslea(1) + '</svg></div>';
      h += '<p class="sosire">' + S.hristos + '</p>';
    }
    if (eDuminica(z.data)) {
      h += '<div class="duminica"><svg viewBox="-14 -16 28 29" aria-hidden="true">' + biserica('#F2D88E', '#14234A') + '</svg><div>' + S.duminica + '<small>' + S.duminicaMic + '</small></div></div>';
    } else if (z.n === 40) {
      h += '<div class="duminica"><svg viewBox="-14 -16 28 29" aria-hidden="true">' + biserica('#F2D88E', '#14234A') + '</svg><div>' + S.ajun + '</div></div>';
    }
    h += bloc(S.calendar, z.sfant);
    h += bloc(S.gand, z.gand);
    for (var i = 0; i < z.cuvant.length; i++) {
      var c = z.cuvant[i];
      h += bloc(c.tip === 'scriptura' ? S.scriptura : S.rugaciune, c.text, 'cuvant', c.loc);
    }
    if (z.alte) { for (i = 0; i < z.alte.length; i++) { h += bloc(z.alte[i].eticheta, z.alte[i].text); } }
    h += '<div class="fapta"><span class="et">' + S.fapta + '</span><p>' + z.fapta + '</p><div class="fapta-btn" id="fapta-btn"></div></div>';
    h += '<details class="maimult"><summary>' + S.maiMult + '</summary>';
    if (z.mici) { h += bloc(S.mici, z.mici); }
    h += bloc(S.intrebare, z.intrebare);
    h += bloc(S.evanghelia, z.peScurt ? '<b>' + S.peScurt + ':</b> ' + z.peScurt.text + ' <span class="loc">(' + z.peScurt.loc + ')</span>' : '', '', z.evanghelia);
    if (z.ceInseamna) { h += bloc(S.ceInseamna, z.ceInseamna); }
    h += '</details>';
    return h;
  }
  function butonFapta(z) {
    var b = document.getElementById('fapta-btn');
    if (!b) { return; }
    if (facute[z.n]) {
      b.innerHTML = '<button type="button" class="mare facut" disabled>&#9733; ' + S.facuta + '</button><br><button type="button" class="renunta" id="renunta">' + S.renunta + '</button>';
      document.getElementById('renunta').onclick = function () {
        facute[z.n] = false; salveaza(); butonFapta(z); actualizeazaStarea(); redeseneazaStea(z);
      };
    } else {
      b.innerHTML = '<button type="button" class="mare aur" id="am-facut">' + S.amFacut + '</button>';
      document.getElementById('am-facut').onclick = function () {
        facute[z.n] = true; salveaza(); butonFapta(z); actualizeazaStarea(); redeseneazaStea(z);
        deAprins = z.n;
        arata(numarFacute() === 40 ? S.toate : t(S.aprinsa, { n: z.n }));
        var nb = document.querySelector('#fapta-btn .renunta'); if (nb) { nb.focus(); }
      };
    }
  }
  function redeseneazaStea(z) {
    var g = harta.querySelector('.stea[data-n="' + z.n + '"]');
    if (!g) { return; }
    var c = g.querySelector('circle'), x = +c.getAttribute('cx'), y = +c.getAttribute('cy');
    var tmp = document.createElement('div');
    tmp.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><defs></defs>' + stea(z, x, y, z.n === 40) + '</svg>';
    var nou = tmp.querySelector('.stea');
    g.parentNode.replaceChild(nou, g);
  }

  var deschisaN = 0;
  function deschide(n) {
    var z = ZILE[n - 1];
    cont.innerHTML = continut(z);
    butonFapta(z);
    fundal.hidden = false; fer.hidden = false; fer.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    deschisaN = n;
    btnInchide.focus();
    try { if (window.goatcounter && window.goatcounter.count) { window.goatcounter.count({ path: 'drum/stea-' + n, title: 'Steaua ' + n, event: true }); } } catch (e) { }
  }
  function inchide() {
    if (fer.hidden) { return; }
    fer.hidden = true; fundal.hidden = true; document.body.style.overflow = '';
    if (deAprins) { aprinde(deAprins); deAprins = 0; }
    var g = harta.querySelector('.stea[data-n="' + deschisaN + '"]');
    if (g && g.focus) { try { g.focus(); } catch (e) { } }
  }
  btnInchide.onclick = inchide;
  fundal.onclick = inchide;
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.keyCode === 27) && !fer.hidden) { inchide(); }
    if (e.key === 'Tab' && !fer.hidden) {        /* focusul rămâne în fereastră */
      var f = fer.querySelectorAll('button:not([disabled]),summary,a[href]');
      if (!f.length) { return; }
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  var toastT = 0;
  function arata(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.hidden = true; }, 3800);
  }

  function apasa(n) {
    var z = ZILE[n - 1];
    if (zi(z) === 'viitoare') {
      var k = seriPanaLa(z.data);
      arata(t(S.incuiata, { data: dataLunga(z.data), k: k, seri: k === 1 ? S.seara1 : S.seriN }));
      return;
    }
    deschide(n);
  }
  function steaDin(el) {
    while (el && el !== harta) {
      if (el.getAttribute && el.getAttribute('data-n')) { return +el.getAttribute('data-n'); }
      el = el.parentNode;
    }
    return 0;
  }
  harta.addEventListener('click', function (e) { var n = steaDin(e.target); if (n) { apasa(n); } });
  harta.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
      var n = steaDin(e.target); if (n) { e.preventDefault(); apasa(n); }
    }
  });
  btnAzi.onclick = function () { var z = aziZ(); if (z) { deschide(z.n); } };

  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (coloane() !== colsCurente) { deseneaza(); } }, 150);
  });

  /* contor anonim al descărcărilor, ca pe celelalte pagini (fără cookie) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || !window.goatcounter || !window.goatcounter.count) { return; }
    var h = a.getAttribute('href') || '';
    if (/\.pdf$/i.test(h)) { window.goatcounter.count({ path: 'descarcare/' + h.split('/').pop(), title: a.textContent.replace(/\s+/g, ' ').trim().slice(0, 60), event: true }); }
  });

  deseneaza();
  actualizeazaStarea();

  /* lucrul fără internet după prima deschidere */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/drum/sw.js', { scope: '/drum/' })['catch'](function () { }); });
  }
})();
