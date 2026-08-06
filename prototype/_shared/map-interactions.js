/*
 * map-interactions.js — Logica condivisa della mappa Gravity
 * ===========================================================
 * Modulo unico usato da inventory-systems e planning per marker, cluster e zoom.
 * Vedi components/map-interactions.md per il catalogo stati.
 *
 * Espone window.GravityMap. Caricare DOPO la Google Maps API.
 *
 * Separazione delle responsabilita:
 *  - LIVELLO DATO (resta in ogni app): quale icona/stato mostrare (tipo, stato
 *    amministrativo o commerciale, path asset). L'app risolve `src` e lo passa qui.
 *  - LIVELLO INTERAZIONE (questo modulo): hover/focus/selected/dim, cluster, zoom.
 */
;(function (global) {
  'use strict';

  var ACCENT = '#3E00FB';                 // Gravity primary
  var ASSET_BASE = '../_shared/assets/marker'; // path corretto degli SVG marker

  // ── Mappe tipo→cartella e stato→file (fonte di verità unica) ──────────────
  // Le chiavi tipo coprono sia le label del planning sia quelle di inventory
  // (alcune differiscono solo per maiuscole/spazi → normalizzate via lookup).
  var TIPO_TO_FOLDER = {
    'Palina': 'OOH/palina',
    'Palina Butterfly': 'OOH/palina_butterfly',
    'Cartello': 'OOH/cartello',
    'Cassonetto': 'OOH/cassonetto',
    'Fermata Bus': 'OOH/fermata_bus',
    'Fioriera': 'OOH/fioriera',
    'Insegna': 'OOH/insegna',
    'Palo Luce': 'OOH/palo_luce',
    'Parapedonale': 'OOH/parapedonale',
    'Pensilina': 'OOH/pensilina',
    'Plancia': 'OOH/plancia',
    'Rotor': 'OOH/rotor',
    'Speciale': 'OOH/speciale',
    'Stendardo': 'OOH/stendardo',
    'Telo': 'OOH/telo',
    'Billboard': 'DOOH/billboard',
    'Alux': 'DOOH/alux',
    'Totem': 'DOOH/totem',
  };

  // Risolve la cartella tollerando differenze di case/spazi tra le due app.
  // "Speciale" è canale-dipendente: lo Speciale DOOH è un marker diverso
  // dall'OOH (cartelle OOH/speciale e DOOH/speciale).
  function folderForType(type, channel) {
    var norm = String(type || '').trim().toLowerCase();
    if (norm === 'speciale') {
      return (String(channel || '').toUpperCase() === 'DOOH') ? 'DOOH/speciale' : 'OOH/speciale';
    }
    if (!type) return 'OOH/palina';
    if (TIPO_TO_FOLDER[type]) return TIPO_TO_FOLDER[type];
    for (var k in TIPO_TO_FOLDER) {
      if (k.toLowerCase() === norm) return TIPO_TO_FOLDER[k];
    }
    return 'OOH/palina';
  }

  // Stati: l'app passa già il nome del file ('available'|'inOption'|'reserved'|
  // 'active'|'maintenance'|'removed'|'initialized'). Questa funzione costruisce
  // solo il path; il mapping label→file resta nell'app (è dominio).
  function markerSrc(type, stateFile, channel) {
    return ASSET_BASE + '/' + folderForType(type, channel) + '/' + (stateFile || 'available') + '.svg';
  }

  // ── Icone glifo per tipo impianto (UI: tabella, chip filtri, card) ────────
  // Asset custom 16×16 in assets/systemstype-icons/{OOH,DOOH}/<File>.svg.
  // Indipendenti dai marker mappa: qui è il glifo neutro del tipo.
  var SYSTYPE_BASE = '../_shared/assets/systemstype-icons';
  // tipo normalizzato (lowercase, spazi singoli) → { ch: cartella, file: nome }
  var SYSTYPE_ICON = {
    'palina':           { ch: 'OOH',  file: 'Palina' },
    'palina butterfly': { ch: 'OOH',  file: 'Butterfly' },
    'cassonetto':       { ch: 'OOH',  file: 'Cassonetto' },
    'fermata bus':      { ch: 'OOH',  file: 'Autobus' },
    'fioriera':         { ch: 'OOH',  file: 'Fioriera' },
    'insegna':          { ch: 'OOH',  file: 'Insegna' },
    'palo luce':        { ch: 'OOH',  file: 'Paloluce' },
    'parapedonale':     { ch: 'OOH',  file: 'Parapedonale' },
    'pensilina':        { ch: 'OOH',  file: 'Pensilina' },
    'plancia':          { ch: 'OOH',  file: 'Plancia' },
    'cartello':         { ch: 'OOH',  file: 'Cartello' },
    'rotor':            { ch: 'OOH',  file: 'Rotor' },
    'stendardo':        { ch: 'OOH',  file: 'Stendardo' },
    'telo':             { ch: 'OOH',  file: 'Telo' },
    'billboard':        { ch: 'DOOH', file: 'Billboard' },
    'alux':             { ch: 'DOOH', file: 'Alux' },
    'totem':            { ch: 'DOOH', file: 'Totem' },
    'speciale ooh':     { ch: 'OOH',  file: 'Special' },
    'speciale dooh':    { ch: 'DOOH', file: 'SpecialDOOH' },
    // 'cartello' / 'insegna' → asset non ancora forniti dal design → null
  };
  function _normType(t) { return String(t || '').trim().toLowerCase().replace(/\s+/g, ' '); }

  // Ritorna il path dell'icona glifo per il tipo, o null se l'asset non esiste
  // (Cartello/Insegna → il chiamante usa il proprio fallback). `channel` serve
  // solo a "Speciale" (OOH→SpecialOOH, DOOH→SpecialDOOH); default OOH.
  function systypeIconSrc(type, channel) {
    var t = _normType(type);
    var e = SYSTYPE_ICON[t];
    return e ? (SYSTYPE_BASE + '/' + e.ch + '/' + e.file + '.svg') : null;
  }

  // ── Zoom → dimensione marker (scala con lo zoom in entrambe le app) ───────
  function getMarkerSize(zoom) {
    if (zoom <= 11) return [10, 15];
    if (zoom <= 12) return [12, 18];
    if (zoom <= 13) return [16, 24];
    if (zoom <= 14) return [20, 30];
    if (zoom <= 15) return [26, 38];
    return [32, 48];
  }

  // ── Scala cromatica cluster derivata dal primary Gravity ──────────────────
  // Contrasto testo/sfondo verificato WCAG (>= 4.2). halo = stessa tinta a 40%.
  function clusterColor(n) {
    if (n <= 2)  return { bg: '#A47CFF', fg: '#ffffff', halo: 'rgba(164,124,255,0.40)' };
    if (n <= 5)  return { bg: '#976AFF', fg: '#ffffff', halo: 'rgba(151,106,255,0.40)' };
    if (n <= 10) return { bg: '#8A52FF', fg: '#ffffff', halo: 'rgba(138,82,255,0.40)' };
    if (n <= 20) return { bg: '#7838FB', fg: '#ffffff', halo: 'rgba(120,56,251,0.40)' };
    if (n <= 50) return { bg: '#3E00FB', fg: '#ffffff', halo: 'rgba(62,0,251,0.40)' };
    return               { bg: '#2900A0', fg: '#ffffff', halo: 'rgba(41,0,160,0.40)' };
  }

  // ── SVG cluster. opts: { hovered, selectedCount } (selectedCount → planning) ──
  function makeClusterSvg(count, opts) {
    opts = opts || {};
    var col = clusterColor(count);
    var core = count <= 5 ? 32 : count <= 20 ? 36 : 40;   // diametro bolla
    if (opts.hovered) core = Math.round(core * 1.1);        // feedback hover
    var ring = 6;                                           // alone trasparente
    var s = core + ring * 2 + 2;
    var c = s / 2;
    var rCore = core / 2;

    // Quando il cluster contiene marker selezionati (planning): anello viola +
    // testo centrale in formato "selezionati/totale" (es. 2/5).
    var hasSel  = opts.selectedCount > 0;
    var label   = hasSel ? (opts.selectedCount + '/' + count) : String(count);
    var fontSize = label.length >= 5 ? 9 : label.length === 4 ? 10 : 12;
    var selRing = hasSel
      ? '<circle cx="' + c + '" cy="' + c + '" r="' + (rCore + ring / 2) +
        '" fill="none" stroke="' + ACCENT + '" stroke-width="3"/>'
      : '';

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '">' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + (rCore + ring) + '" fill="' + col.halo + '"/>' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + rCore + '" fill="' + col.bg + '"/>' +
      selRing +
      '<text x="' + c + '" y="' + (c + fontSize * 0.36) + '" text-anchor="middle" fill="' + col.fg +
        '" font-size="' + fontSize + '" font-weight="700" font-family="sans-serif">' + label + '</text>' +
      '</svg>';

    return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), size: s };
  }

  // ── Cache contenuto SVG (condivisa, keyed per URL) ────────────────────────
  var _svgCache = {};
  function preloadSvg(src) {
    if (_svgCache[src] !== undefined) return Promise.resolve(_svgCache[src]);
    return fetch(src)
      .then(function (r) { return r.ok ? r.text() : null; })
      .then(function (t) { _svgCache[src] = t; return t; })
      .catch(function () { _svgCache[src] = null; return null; });
  }
  function preloadAll(srcList) {
    return Promise.all((srcList || []).map(preloadSvg));
  }
  function getCachedSvg(src) { return _svgCache[src]; }

  function _extractViewBox(svgContent) {
    var m = /viewBox="([^"]*)"/i.exec(svgContent);
    if (m) return m[1];
    var w = /<svg[^>]*\bwidth="([0-9.]+)/i.exec(svgContent);
    var h = /<svg[^>]*\bheight="([0-9.]+)/i.exec(svgContent);
    return '0 0 ' + (w ? w[1] : 78) + ' ' + (h ? h[1] : 120);
  }

  // ── Icona marker con stati di interazione ─────────────────────────────────
  // opts: { src, zoom, flags:{ isHovered, isFocused, isSelected, hasFocus } }
  // Richiede google.maps caricato. Se l'SVG non è ancora in cache → fallback url.
  function makeMarkerIcon(opts) {
    var google = global.google;
    var f = opts.flags || {};
    var size = getMarkerSize(opts.zoom);
    var w = size[0], h = size[1];
    if (f.isFocused)      { w = Math.round(w * 1.4);  h = Math.round(h * 1.4); }
    else if (f.isHovered) { w = Math.round(w * 1.12); h = Math.round(h * 1.12); }

    var dimOpacity = (f.hasFocus && !f.isFocused && !f.isSelected) ? 0.2 : 1;
    var svgContent = _svgCache[opts.src];

    if (svgContent) {
      var viewBox = _extractViewBox(svgContent);
      var inner = svgContent
        .replace(/<\?xml[^>]*\?>\s*/i, '')
        .replace(/<svg[^>]*>/i, '')
        .replace(/<\/svg>\s*$/i, '');

      var focusDefs = f.isFocused
        ? '<defs><filter id="fs" x="-50%" y="-50%" width="200%" height="200%">' +
          '<feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="' + ACCENT + '" flood-opacity="0.5"/>' +
          '</filter></defs>'
        : '';
      var focusFilter = f.isFocused ? 'filter="url(#fs)"' : '';

      // Badge di selezione (CheckCircleFilled) in basso a destra (viewBox ~78×120)
      var selRing = f.isSelected
        ? '<circle cx="58" cy="85" r="13" fill="#ffffff"/>' +
          '<circle cx="58" cy="85" r="11.5" fill="' + ACCENT + '"/>' +
          '<path d="M52.8 85.2 L56.6 89 L63.4 80.6" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
        : '';

      var wrapped = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h +
        '" viewBox="' + viewBox + '" opacity="' + dimOpacity + '">' +
        focusDefs + '<g ' + focusFilter + '>' + inner + '</g>' + selRing + '</svg>';

      return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(wrapped),
        scaledSize: new google.maps.Size(w, h),
        anchor: new google.maps.Point(w / 2, Math.round(h * 0.92)),
      };
    }

    // Fallback prima che l'SVG sia caricato (mostra l'asset grezzo)
    return {
      url: opts.src,
      scaledSize: new google.maps.Size(w, h),
      anchor: new google.maps.Point(w / 2, Math.round(h * 0.92)),
    };
  }

  // ── Clustering a griglia (motore unico per entrambe le app) ───────────────
  var CLUSTER_GRID = 60;     // lato cella in px
  var DECLUSTER_ZOOM = 15;   // zoom > soglia → tutti i marker individuali

  // items: [{ id, position:{lat,lng}, ...payload }]
  // ritorna { mode, clusters:[{ center, members:[] }], members:[] (singoli) }
  function computeGridClusters(map, items, opts) {
    opts = opts || {};
    var grid = opts.grid || CLUSTER_GRID;
    var declusterZoom = (opts.declusterZoom != null) ? opts.declusterZoom : DECLUSTER_ZOOM;
    var google = global.google;
    var zoom = map.getZoom() || 10;

    if (zoom > declusterZoom) {
      return { mode: 'individual', clusters: [], members: items.slice() };
    }
    var proj = map.getProjection && map.getProjection();
    if (!proj) {
      return { mode: 'individual', clusters: [], members: items.slice() };
    }

    var scale = Math.pow(2, zoom);
    var groups = {};
    items.forEach(function (it) {
      var wp = proj.fromLatLngToPoint(new google.maps.LatLng(it.position.lat, it.position.lng));
      var key = Math.floor(wp.x * scale / grid) + '_' + Math.floor(wp.y * scale / grid);
      (groups[key] = groups[key] || []).push(it);
    });

    var clusters = [], singles = [];
    Object.keys(groups).forEach(function (k) {
      var g = groups[k];
      if (g.length === 1) { singles.push(g[0]); return; }
      var lat = 0, lng = 0;
      g.forEach(function (it) { lat += it.position.lat; lng += it.position.lng; });
      clusters.push({ center: { lat: lat / g.length, lng: lng / g.length }, members: g });
    });
    return { mode: 'clustered', clusters: clusters, members: singles };
  }

  // Zoom-to-bounds preciso sui marker (click su cluster). Sostituisce il +3 fisso.
  function fitBoundsToMembers(map, members, opts) {
    opts = opts || {};
    var google = global.google;
    if (!members || !members.length) return;
    if (members.length === 1) {
      map.panTo(members[0].position);
      map.setZoom(Math.min((map.getZoom() || 10) + 3, opts.maxZoom || 20));
      return;
    }
    var b = new google.maps.LatLngBounds();
    members.forEach(function (m) { b.extend(m.position); });
    map.fitBounds(b, opts.padding != null ? opts.padding : 80);
  }

  global.GravityMap = {
    ACCENT: ACCENT,
    ASSET_BASE: ASSET_BASE,
    TIPO_TO_FOLDER: TIPO_TO_FOLDER,
    folderForType: folderForType,
    markerSrc: markerSrc,
    SYSTYPE_ICON: SYSTYPE_ICON,
    systypeIconSrc: systypeIconSrc,
    getMarkerSize: getMarkerSize,
    clusterColor: clusterColor,
    makeClusterSvg: makeClusterSvg,
    makeMarkerIcon: makeMarkerIcon,
    preloadSvg: preloadSvg,
    preloadAll: preloadAll,
    getCachedSvg: getCachedSvg,
    CLUSTER_GRID: CLUSTER_GRID,
    DECLUSTER_ZOOM: DECLUSTER_ZOOM,
    computeGridClusters: computeGridClusters,
    fitBoundsToMembers: fitBoundsToMembers,
  };
})(window);
