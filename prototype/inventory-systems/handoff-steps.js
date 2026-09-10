/**
 * Handoff — Inventory Systems: V2 (placeholder, non ancora iniziata)
 * Il lavoro attivo è tutto in handoff-steps-v1.js (versione V1, ancora "in
 * lavorazione" nonostante l'etichetta "Versione approvata" — è quella che
 * stiamo continuando a costruire). Questo file resta vuoto finché non parte
 * il prossimo giro di cambiamenti per V2: HANDOFF_TOURS vuoto qui disattiva
 * tour/note/inspector, ma la dev bar monta comunque ridotta al solo
 * selettore versione (vedi prototype/_shared/handoff.js), per poter tornare
 * a V1 anche da questa pagina vuota.
 * `current` in versions è SEMPRE self-referenziale (riflette il file
 * effettivamente caricato, non "su cosa stiamo lavorando" — quello lo dice
 * `note`/`approved`): qui è V2 a essere true, mai V1, altrimenti il
 * VersionBadge crede di essere già su V1 e il click su "V1" non naviga più.
 */

window.HANDOFF_META = {
  title: 'Inventory — Impianti',
  version: 'V2',
  date: 'Settembre 2026',
  author: 'Gloria Bonanno',
  versions: [
    { id: 'V1', file: 'index.html?handoff=v1', approved: true, current: false, note: 'Versione approvata' },
    { id: 'V2', file: 'index.html?handoff=v2', approved: false, current: true, note: 'In lavorazione' },
  ],
};

window.HANDOFF_TOURS = [];
