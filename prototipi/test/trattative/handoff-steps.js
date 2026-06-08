/**
 * Handoff steps — Trattative
 * Caricato da index--handoff.html prima di handoff.js.
 */

window.HANDOFF_META = {
  title:   'Trattative — Handoff Guide',
  version: '1.0',
  date:    'Giugno 2026',
  author:  'Gloria Bonanno',
};

window.HANDOFF_STEPS = [

  // ── Navbar ────────────────────────────────────────────────────────────────

  {
    id:          'navbar',
    selector:    '#gravity-navbar',
    title:       'Navbar',
    description: 'Barra di navigazione principale. Contiene logo, sezioni, switcher di ruolo e avatar utente.',
  },
  {
    id:          'ruolo-switcher',
    selector:    '#gravity-role-switcher',
    title:       'Switcher di ruolo',
    description: 'Permette di simulare diversi ruoli utente. Le voci di menu, le azioni e i dati visibili cambiano in base al ruolo selezionato.',
    novita:      true,
  },
  {
    id:          'notifiche',
    selector:    '#gravity-bell-btn',
    title:       'Pannello notifiche',
    description: 'Visibile solo al ruolo Sales. Il badge indica le notifiche non lette. Il pannello mostra le trattative assegnate da altri utenti.',
    novita:      true,
  },

  // ── Lista trattative ──────────────────────────────────────────────────────

  {
    id:          'page-header',
    selector:    '.page-content',
    title:       'Lista trattative',
    description: 'Vista principale del modulo. Mostra tutte le trattative accessibili in base al ruolo: Operations Manager e Tenant Admin vedono tutto, Sales vede solo le proprie.',
  },
  {
    id:          'tabs-stato',
    selector:    '.ant-tabs',
    title:       'Tab di stato',
    description: 'Le trattative sono suddivise in tre stati: Attive, Vinte e Perse. Il conteggio in ogni tab si aggiorna in base al filtro ruolo.',
  },
  {
    id:          'tabella',
    selector:    '.ant-table-wrapper',
    title:       'Tabella trattative',
    description: 'Ogni riga mostra trattativa, inserzionista, agente assegnato, budget stimato, stato e data ultima modifica. Le colonne sono ordinabili.',
  },
  {
    id:          'assegna',
    selector:    '.ant-table-tbody tr:first-child td:nth-child(4)',
    title:       'Assegna agente',
    description: 'Dropdown per assegnare un agente Sales alla trattativa. Mostra un avatar con iniziali colorate per l\'agente assegnato, oppure "—" se non ancora assegnato.',
    novita:      true,
  },
  {
    id:          'crea-trattativa',
    selector:    '.ant-btn-primary',
    title:       'Nuova trattativa',
    description: 'Apre un drawer laterale per creare una nuova trattativa. Richiede nome, contatto, budget stimato e note opzionali.',
  },

  // ── Dettaglio trattativa ──────────────────────────────────────────────────

  {
    id:          'dettaglio',
    selector:    '.ant-table-tbody tr:first-child',
    title:       'Dettaglio trattativa',
    description: 'Cliccando sul nome di una trattativa si apre la vista Dettaglio. Mostra KPI (budget, margine, flight previsti, schermi), referente e riepilogo strategia.',
    novita:      true,
  },

];
