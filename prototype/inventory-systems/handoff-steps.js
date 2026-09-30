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
  {
    id: 'impianto-foto-copertina-non-pseudo-casuale',
    title: 'Foto di copertina — campo reale, scelta qui invece di calcolata per id',
    body: '**Correzione**: la foto mostrata per un impianto (qui, nel popover mappa, e in `planning`/`inventory-licenses`) era calcolata a tempo di rendering da `FOTO_IMPIANTO[parseInt(id)... % length]` — mai realmente scelta da nessuno, quindi scorrelata dall\'impianto vero.\n- Nuovo campo **`fotoCopertina`** sul record, impostabile qui in "Anagrafica e ubicazione" con un semplice picker a miniature sul pool `FOTO_IMPIANTO` condiviso — non un vero upload (nessun backend in questo prototipo)\n- Facoltativo: senza una scelta l\'impianto resta senza foto, non ne mostra una a caso\n- Backfill deterministico sui record mock esistenti (stessa distribuzione visiva di prima, ora però un valore reale e modificabile)\n- `window.GravityEntityCard` (`_shared/entity-card.js`) supporta ora `image.src` per una foto reale — usato dal drawer "Seleziona impianto" di `inventory-licenses`\n- ==Non ancora esteso==: `prototype/planning` ed `entity-v3.html` restano sul vecchio calcolo per id, fuori scope per questa sessione',
  },
  {
    id: 'oneri-canone-patrimoniale-fonte',
    title: 'Canone patrimoniale: da approfondire dove vive il dato',
    body: 'Il canone patrimoniale non è più nel drawer di collegamento di Concessione e Contratto Privato (che mostra solo il **Numero Utenza**): è un onere dell\'impianto e si compila qui.\n==Da approfondire==: il canone viene definito da un **atto a sé stante** oppure è un\'**informazione contenuta nella concessione/nel contratto**? Nel primo caso servirebbe un\'entità propria collegabile; nel secondo il valore andrebbe ereditato dall\'atto collegato invece di essere inserito a mano.',
  },
  {
    id: 'oneri-ente-crud-fornitori',
    title: 'Ente / fornitore / locatore: da attingere al CRUD Fornitori',
    body: 'I campi **Ente**, **Ente concedente**, **Fornitore**, **Compagnia** e **Locatore** dei vari oneri devono attingere all\'anagrafica del **CRUD Fornitori**, filtrata per tipo di onere.\n==Da progettare==: il CRUD Fornitori non esiste ancora. Vanno definiti le categorie (ente, concedente, energia, telco, assicurazione, manutenzione, locatore), la creazione di un nuovo soggetto direttamente dalla select e se un locatore coincide con il proprietario già presente nei contratti privati.\n- ==Mock==: qui la lista è statica (`FORNITORI_ONERI`)',
  },
  {
    id: 'oneri-fornitori-crud',
    title: 'Oneri economici: enti e fornitori dal CRUD Fornitori',
    body: 'Ogni impianto ha **sette aree fisse** (canone unico patrimoniale, canone concessorio, canone locazione, utenza elettrica, connettività, polizza RC, contratto manutenzione), una per tipo di onere.\nIl campo **Ente / Ente concedente / Fornitore / Compagnia / Locatore** è una **select con ricerca** che attinge all\'anagrafica del **CRUD Fornitori** della platform — non è più testo libero.\n- La lista è **filtrata per tipo di onere** (es. solo gestori di energia per l\'utenza elettrica, solo compagnie per la polizza, solo locatori per il canone di locazione) tramite la categoria del fornitore\n- ==Mock==: qui la lista è un elenco statico (`FORNITORI_ONERI`); il CRUD Fornitori non è ancora prototipato\n- **Importo** è l\'ultimo campo dell\'area, a fine lettura: è il dato più rilevante; le due date stanno sulla stessa riga',
  },
];
