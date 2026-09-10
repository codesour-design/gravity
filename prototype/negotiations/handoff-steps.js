/**
 * Handoff — Trattative: V1
 * Solo infrastruttura (nessun tour/nota di design curata): la dev bar monta
 * comunque ridotta al solo selettore versione, perché HANDOFF_META.versions
 * è valorizzato (vedi components/handoff-engine.md).
 */

window.HANDOFF_META = {
  title: 'Trattative',
  version: 'V1',
  date: 'Settembre 2026',
  author: 'Gloria Bonanno',
  versions: [
    { id: 'V1', file: 'index.html?handoff=v1', approved: true, current: true, note: 'Versione approvata' },
  ],
};

window.HANDOFF_TOURS = [];
