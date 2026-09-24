/**
 * Handoff — Inventory Systems: V2 (in lavorazione)
 * Prima modifica: box "Cimasa" nella tab Struttura (ex "Cespiti e dispositivi") del
 * form Nuovo Impianto — vedi window.__SYSTEMS_UI_VERSION e la prop isV2 passata a
 * NewImpiantoFullDrawer (eccezione documentata in components/handoff-engine.md).
 * `current` in versions è SEMPRE self-referenziale (riflette il file effettivamente
 * caricato, non "su cosa stiamo lavorando" — quello lo dice `note`/`approved`): qui
 * è V2 a essere true, mai V1, altrimenti il VersionBadge crede di essere già su V1 e
 * il click su "V1" non naviga più.
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

window.HANDOFF_NOTES = [
  {
    id: 'cimasa-v3-template-brand',
    title: 'Cimasa: personalizzazione libera, in attesa di template',
    body: 'Oggi il layout della cimasa è **libero**: logo, sfondo colonna logo, ente/codici/testo si compongono campo per campo, senza un modello predefinito.\n==Sviluppo futuro (v3)==: si potrebbe introdurre un set di **template selezionabili** dall\'utente, per una personalizzazione più coerente e conforme del layout invece di una composizione libera. La logica di costruzione andrebbe inoltre **legata alle informazioni di brand fornite in fase di acquisto**, nella configurazione del tenant (logo, palette) — così il template erediterebbe l\'identità visiva del cliente invece di richiedere una configurazione manuale ripetuta impianto per impianto.',
  },
  {
    id: 'iter-contratto-privato-suolo-esclusivo',
    title: 'Concessioni e autorizzazioni: aggiunto il Contratto Privato',
    body: 'Il collegamento permessi recepisce qui il nuovo modello dati di **inventory-licenses v2** (Autorizzazione/Concessione/Contratto Privato): il **Contratto Privato** è ora un tipo collegabile a sé, sibling della Concessione e non un suo sottotipo.\n==Concessione e Contratto Privato sono mutuamente esclusivi==: un impianto ha o l\'una o l\'altro, mai entrambi, in base al **Tipo suolo** compilato sopra (Pubblico → solo Concessione, Privato → solo Contratto Privato) — stesso vincolo già implementato lato "Collega Spazi" in inventory-licenses (nota \'impianto-suolo-esclusivo-concessione-contratto\').\n- L\'opzione non disponibile nel menu "Collega permesso" resta visibile ma **disabilitata, col motivo in tooltip** (LAYOUT.md §6.2), non nascosta\n- **Autorizzazione non ha questo vincolo** (resta N:N, invariata)\n- Dati mock: stesso `GRANTS_DATA` di prima, filtrato per `grantType` (Pubblico → Concessione, Privato → Contratto Privato) — nessun nuovo dataset',
  },
];
