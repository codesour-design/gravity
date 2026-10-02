/**
 * Handoff — Portafoglio (Inserzionisti): V1
 * Infrastruttura handoff — nessuna nota di design curata in questa versione.
 * La dev bar monta ridotta al solo selettore versione.
 */

window.HANDOFF_META = {
  title: 'Portafoglio — Inserzionisti',
  version: 'V1',
  date: 'Settembre 2026',
  author: 'Elena Faraci',
  versions: [
    { id: 'V1', file: 'index.html?handoff=v1', approved: false, current: true,  note: 'Prima versione — in lavorazione' },
    { id: 'V2', file: 'index.html?handoff=v2', approved: false, current: false, note: 'Tag settore commerciale grigio' },
  ],
};

window.HANDOFF_TOURS = [
  {
    id: 'advertiser-detail-react',
    title: 'AdvertiserDetail — React + Tailwind CSS',
    description: 'Pagina React + Tailwind CSS che replica la schermata dettaglio Inserzionista in un gestionale B2B. Tutti i campi sono opzionali — fallback **"Non specificato/a"** quando assenti. Dati passati come props/mock object.',
    type: 'task',
    steps: [
      {
        title: 'Topbar',
        description: '**Barra di navigazione orizzontale bianca, full width.**\n- Logo a sinistra: icona fulmine viola + testo "GRAVITY" in maiuscolo, lettering spaziato\n- Menu orizzontale: "GESTIONE" · "VENDITE" (attivo, viola/indaco) · "DISTRIBUZIONE" · "MEDIA MONITOR"\n- A destra: avatar circolare viola con iniziali bianche (es. "AT")',
        selector: '.ant-layout-header',
        placement: 'bottom',
      },
      {
        title: 'Header pagina',
        description: '**Card bianca con leggero bordo/ombra, su sfondo grigio chiaro.**\n- Link "← Torna alla lista" in viola, sopra al titolo\n- Riga titolo: "Inserzionista" in grassetto grande · separatore "|" · nome azienda (es. "ACME SRL")\n- Riga metadati: **Indirizzo:** valore · **Business Area:** valore (label grassetto, valore grigio)\n- A destra, in fila: pulsante "✎ Modifica Inserzionista" (bordo grigio, sfondo bianco) · pulsante "＋ Nuovo Preventivo" (disabilitato/grigio se mancano dati obbligatori)',
        selector: '.page-content',
        placement: 'bottom',
      },
      {
        title: 'Tab Overview — struttura',
        description: '**Due tab sotto l\'header:** "Overview" (attivo: testo viola + bordo inferiore viola) e "Attività" (inattivo, grigio).\n\nIl contenuto del tab è una **card bianca con angoli arrotondati** e layout a tre zone affiancate:\n- **Colonna sinistra stretta:** riquadro tratteggiato quadrato con icona placeholder e testo "Logo"\n- **Colonna centrale (Colonna A):** Informazioni Generali + Dati Fiscali\n- **Colonna destra (Colonna B):** Contatto',
        selector: '.ant-tabs',
        placement: 'top',
      },
      {
        title: 'Tab Overview — Colonna A',
        description: '**Titolo azienda in grassetto grande** in cima (es. "ACME SRL").\n\n**Sezione "Informazioni Generali"** — righe label/valore separate da sottili divisori:\n- Legale Rappresentante\n- Business Area\n- Indirizzo (icona copia azzurra → copia negli appunti)\n- Telefono (icona telefono azzurra → apre `tel:`)\n- Email (icona busta azzurra → apre `mailto:`)\n\n**Sezione "Dati Fiscali"** — stessa struttura:\n- Partita IVA (icona copia azzurra)\n- Codice Fiscale\n- PEC\n- Codice SDI\n\nLabel su colonna fissa stretta in grassetto · valore a destra in grigio normale.',
        selector: '.info-box',
        placement: 'right',
      },
      {
        title: 'Tab Overview — Colonna B (Contatto)',
        description: '**Sezione "Contatto"** — stessa struttura righe label/valore:\n- Nome\n- Cognome\n- Ruolo\n- Telefono (icona telefono azzurra → `tel:`)\n- Email (icona busta azzurra → `mailto:`)\n- Email Secondaria\n- Note\n\nSe il contatto è assente → **empty state** con astronauta + "Nessun contatto" + pulsante "Aggiungi contatto".',
        selector: '.info-box',
        placement: 'left',
      },
      {
        title: 'Tab Attività',
        description: '**In cima:** due select affiancati — "Filtra per tipo" e "Filtra per utente" (bordo grigio arrotondato).\n\n**Empty state (default, lista vuota):**\n- Illustrazione astronauta centrata\n- Testo grassetto: "Al momento non ci sono eventi."\n- Testo secondario grigio: "Saranno visibili quando verranno registrati preventivi, opportunità, ordini o fatture per questo inserzionista."\n\nI filtri devono filtrare gli eventi mock — con lista vuota di default l\'empty state è sempre visibile.',
        selector: '.ant-tabs',
        placement: 'top',
      },
      {
        title: 'Stile generale',
        description: '**Palette:** viola/indaco come primario (bottoni attivi, link, tab attivo, icone) · grigio scuro per testo principale · grigio chiaro per testo secondario e sfondo pagina · bianco per le card.\n\n**Tipografia:** font sans-serif moderno (Inter o Poppins).\n\n**Card:** `rounded-lg` o `rounded-xl` + ombra leggera (`shadow-sm`).\n\n**Divisori:** sottili, grigio chiaro, tra ogni riga di dati.\n\n**Spaziatura:** generosa, aspetto pulito da SaaS gestionale. Componenti responsive.',
        selector: '.app-shell',
        placement: 'bottom',
      },
      {
        title: 'Funzionalità da implementare',
        description: '**Tutte implementabili a livello di stato/mock:**\n- Switch tab "Overview" ↔ "Attività" con stato attivo\n- Pulsante "Modifica Inserzionista" → apre form/modale (anche placeholder)\n- Pulsante "Nuovo Preventivo" → disabilitato se mancano dati obbligatori (es. `businessArea` assente)\n- Icone **copia** → `navigator.clipboard.writeText(valore)` sul valore corrispondente\n- Icone **telefono** → `window.open("tel:...")` \n- Icone **email** → `window.open("mailto:...")`\n- Filtri Attività → filtrano `mockEventi` (array vuoto di default → empty state)\n- Tutti i campi opzionali → fallback `"Non specificato"` / `"Non specificata"` quando `null` o `undefined`\n\n==Dati di esempio fittizi: "ACME SRL", indirizzo generico, numeri e email fittizi.==',
        selector: '.app-shell',
        placement: 'bottom',
      },
    ],
  },
];

window.HANDOFF_NOTES = [];
