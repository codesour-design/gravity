/**
 * portafoglio-data.js — Dati (mock) e logica di revisione del Portafoglio commerciale.
 *
 * Fonte unica condivisa tra `prototype/portafoglio` (lista Inserzionisti / tab "Da revisionare")
 * e `prototype/user-profile` (card/attività "Anagrafiche da verificare" dell'Operation Manager):
 * il numero in home è lo stesso del Portafoglio.
 *
 * Espone window.GravityPortafoglio:
 *   MOCK_INSERZIONISTI  dati seed (con contatti multipli, stati v2, richiedente, data)
 *   STATI_V2            { in_attesa | da_completare | completato → { label, badge } }
 *   getRevisioni(r)     revisioni richieste su un inserzionista (inserzionista + contatti/lead non completati)
 *   formatData(iso)     'YYYY-MM-DD' → 'DD/MM/YYYY'
 *   load(version)       dati correnti: in v2 quelli salvati dal Portafoglio (localStorage), altrimenti il seed
 *   save(data)          (v2) salva lo stato corrente, così la home resta allineata
 *   allRevisioni(data)  tutte le revisioni [{ ...revisione, inserzionista }]
 */
;(function (global) {
  'use strict';
// ── Mock data inserzionisti ───────────────────────────────────────────────────
const MOCK_INSERZIONISTI = [
  {
    key: 'ins-001', ragioneSociale: 'Enel SpA',
    indirizzo: 'Viale Regina Margherita, 137', civico: '137',
    regione: 'Lazio', provincia: 'RM', comune: 'Roma', cap: '00198',
    businessArea: 'Energia', legaleRappresentante: 'Flavio Cattaneo',
    prefisso: '+39', telefono: '06 8305 1', email: 'comunicazioni@enel.com',
    partitaIva: '00811720580', codiceFiscale: '00811720580',
    pec: 'enel.spa@pec.it', codiceSdi: 'T04ZHR3', sito: 'https://www.enel.com',
    contatto: { nome: 'Marco', cognome: 'Ferretti', ruolo: 'Media & Brand Director',
      telefono: '+39 06 8305 5512', email: 'marco.ferretti@enel.com', emailSecondaria: 'm.ferretti@gmail.com',
      note: 'Preferisce comunicazioni via email. Disponibile il mattino.' },
    trattativaCollegata: 'Piano annuale brand awareness 2026 — OOH + DOOH + Web',
    commerciale: 'Lorenzo Bianchi',
  },
  {
    key: 'ins-002', ragioneSociale: 'Stellantis Italia',
    indirizzo: 'Corso Giovanni Agnelli, 200', civico: '200',
    regione: 'Piemonte', provincia: 'TO', comune: 'Torino', cap: '10100',
    businessArea: 'Automotive', legaleRappresentante: 'Carlos Tavares',
    prefisso: '+39', telefono: '011 9936111', email: 'info@stellantis.com',
    partitaIva: '12278470017', codiceFiscale: '12278470017',
    pec: 'stellantis.italia@legalmail.it', codiceSdi: 'M5UXCR1', sito: 'https://www.stellantis.com',
    contatto: { nome: 'Lucia', cognome: 'Bianchi', ruolo: 'Campaign Manager',
      telefono: '+39 02 6824 7700', email: 'lucia.bianchi@stellantis.com', emailSecondaria: '',
      note: '' },
    trattativaCollegata: 'Lancio nuova gamma veicoli elettrici — Q1/Q2 2026',
    commerciale: 'Giulia Romano',
  },
  {
    key: 'ins-003', ragioneSociale: 'ENIT – Agenzia Nazionale del Turismo',
    indirizzo: 'Via Marghera, 2', civico: '2',
    regione: 'Lazio', provincia: 'RM', comune: 'Roma', cap: '00185',
    businessArea: 'Turismo & PA', legaleRappresentante: 'Giovanni Bastianelli',
    prefisso: '+39', telefono: '06 49711', email: 'info@enit.it',
    partitaIva: '07606571003', codiceFiscale: '07606571003',
    pec: 'enit@pec.it', codiceSdi: '', sito: 'https://www.enit.it',
    contatto: null,
    trattativaCollegata: null,
    commerciale: null,
  },
  {
    key: 'ins-004', ragioneSociale: 'Mediaset Premium',
    indirizzo: 'Viale Europa, 44', civico: '44',
    regione: 'Lombardia', provincia: 'MI', comune: 'Milano', cap: '20121',
    businessArea: 'Media & Entertainment', legaleRappresentante: 'Pier Silvio Berlusconi',
    prefisso: '+39', telefono: '02 25141', email: 'comunicazione@mediaset.it',
    partitaIva: '09032310154', codiceFiscale: '09032310154',
    pec: 'mediaset@pec.it', codiceSdi: 'XXXXXXX', sito: 'https://www.mediaset.it',
    contatto: { nome: 'Sara', cognome: 'Colombo', ruolo: 'Media Buyer',
      telefono: '+39 02 2100 5533', email: 'sara.colombo@mediaset.it', emailSecondaria: '',
      note: '' },
    trattativaCollegata: null,
    commerciale: null,
  },
  {
    key: 'ins-005', ragioneSociale: 'Esselunga SpA',
    indirizzo: 'Via Giambologna, 1', civico: '1',
    regione: 'Lombardia', provincia: 'MI', comune: 'Sesto San Giovanni', cap: '20099',
    businessArea: 'Grande Distribuzione', legaleRappresentante: 'Sami Kahale',
    prefisso: '+39', telefono: '02 26228228', email: 'stampa@esselunga.it',
    partitaIva: '05907380966', codiceFiscale: '05907380966',
    pec: 'esselunga.spa@pecgruppo.esselunga.it', codiceSdi: 'XXXXXXX', sito: 'https://www.esselunga.it',
    contatto: { nome: 'Filippo', cognome: 'Martini', ruolo: 'Media Planner',
      telefono: '+39 02 7539 0022', email: 'filippo.martini@esselunga.it', emailSecondaria: '',
      note: 'Referente su tutto il nord Italia. Contattare prima di ottobre per le campagne natalizie.' },
    trattativaCollegata: 'Piano stagionale GDO: Primavera + Estate + Autunno',
    commerciale: 'Alessandro Costa',
  },
  {
    key: 'ins-006', ragioneSociale: 'Rinascente Group',
    indirizzo: 'Piazza del Duomo', civico: '1',
    regione: 'Lombardia', provincia: 'MI', comune: 'Milano', cap: '20121',
    businessArea: 'Retail Lusso', legaleRappresentante: 'Pierluigi Cocchini',
    prefisso: '+39', telefono: '02 88521', email: 'press@rinascente.it',
    partitaIva: '00709360153', codiceFiscale: '00709360153',
    pec: 'rinascente@pec.it', codiceSdi: 'XXXXXXX', sito: 'https://www.rinascente.it',
    contatto: { nome: 'Valentina', cognome: 'Greco', ruolo: 'Senior Brand Manager',
      telefono: '+39 02 8852 6619', email: 'v.greco@rinascente.it', emailSecondaria: '',
      note: '' },
    trattativaCollegata: null,
    commerciale: null,
  },
  {
    key: 'ins-007', ragioneSociale: 'Zara Italia Srl',
    indirizzo: 'Via Tortona, 37', civico: '37',
    regione: 'Lombardia', provincia: 'MI', comune: 'Milano', cap: '20135',
    businessArea: '', legaleRappresentante: 'Óscar García Maceiras',
    prefisso: '+39', telefono: '02 8724900', email: 'comunicazione@zara.it',
    partitaIva: '03433810969', codiceFiscale: '03433810969',
    pec: 'zara.italia@pec.it', codiceSdi: '', sito: 'https://www.zara.com',
    contatto: { nome: 'Gianni', cognome: 'Esposito', ruolo: 'Marketing Director',
      telefono: '+39 02 6671 4487', email: 'g.esposito@zara.it', emailSecondaria: '',
      note: '' },
    trattativaCollegata: null,
    commerciale: null,
  },
  {
    key: 'ins-008', ragioneSociale: 'Eni SpA',
    indirizzo: 'Piazzale Enrico Mattei, 1', civico: '1',
    regione: 'Lazio', provincia: 'RM', comune: 'Roma', cap: '00144',
    businessArea: 'Energia & Petrolio', legaleRappresentante: 'Claudio Descalzi',
    prefisso: '+39', telefono: '06 59821', email: 'info@eni.com',
    partitaIva: '00905811006', codiceFiscale: '00905811006',
    pec: 'eni.spa@pec.eni.com', codiceSdi: 'X2OHTE5', sito: 'https://www.eni.com',
    contatto: { nome: 'Chiara', cognome: 'Moretti', ruolo: 'Head of Communications',
      telefono: '+39 06 5982 1140', email: 'c.moretti@eni.com', emailSecondaria: 'chiara.moretti@gmail.com',
      note: '' },
    trattativaCollegata: 'Campagna corporate sostenibilità — annuale 4 flight',
    commerciale: 'Alessandro Costa',
  },
  {
    key: 'ins-009', ragioneSociale: 'TIM S.p.A.',
    indirizzo: 'Via Gaetano Negri, 1', civico: '1',
    regione: 'Lombardia', provincia: 'MI', comune: 'Milano', cap: '20123',
    businessArea: 'Telecomunicazioni', legaleRappresentante: 'Pietro Labriola',
    prefisso: '+39', telefono: '06 36881', email: 'media.relations@tim.it',
    partitaIva: '00488410010', codiceFiscale: '00488410010',
    pec: 'tim.spa@pec.tim.it', codiceSdi: 'XXXXXXX', sito: 'https://www.tim.it',
    contatto: { nome: 'Roberto', cognome: 'Fontana', ruolo: 'Advertising Manager',
      telefono: '+39 06 3688 0044', email: 'r.fontana@tim.it', emailSecondaria: '',
      note: '' },
    trattativaCollegata: 'Promozione offerta fibra — campagna nazionale Q2',
    commerciale: 'Federica Mancini',
  },
  {
    key: 'ins-010', ragioneSociale: 'Satispay SpA',
    indirizzo: 'Via Soperga, 9', civico: '9',
    regione: 'Lombardia', provincia: 'MI', comune: 'Milano', cap: '20127',
    businessArea: 'Fintech', legaleRappresentante: 'Alberto Dalmasso',
    prefisso: '+39', telefono: '02 8081 5550', email: 'press@satispay.com',
    partitaIva: '07516650967', codiceFiscale: '07516650967',
    pec: 'satispay@pec.it', codiceSdi: 'XXXXXXX', sito: 'https://www.satispay.com',
    contatto: { nome: 'Elena', cognome: 'Caruso', ruolo: 'Marketing Lead',
      telefono: '+39 02 8724 6633', email: 'elena.caruso@satispay.com', emailSecondaria: '',
      note: 'Disponibile principalmente via Slack. Per invii urgenti usare email.' },
    trattativaCollegata: 'Lancio app mobile — digital OOH aeroporti + metropolitane',
    commerciale: 'Federica Mancini',
  },
  {
    key: 'ins-011', ragioneSociale: 'Fondazione Telethon',
    indirizzo: 'Via Poerio, 14', civico: '14',
    regione: 'Campania', provincia: 'NA', comune: 'Napoli', cap: '80121',
    businessArea: 'Non Profit', legaleRappresentante: 'Francesca Pasinelli',
    prefisso: '+39', telefono: '081 5640111', email: 'info@telethon.it',
    partitaIva: '03470380482', codiceFiscale: '03470380482',
    pec: 'telethon@pec.it', codiceSdi: '', sito: 'https://www.telethon.it',
    contatto: null,
    trattativaCollegata: null,
    commerciale: null,
  },
  {
    key: 'ins-012', ragioneSociale: 'Teatro alla Scala',
    indirizzo: 'Via Filodrammatici, 2', civico: '2',
    regione: 'Lombardia', provincia: 'MI', comune: 'Milano', cap: '20121',
    businessArea: 'Cultura & Spettacolo', legaleRappresentante: 'Dominique Meyer',
    prefisso: '+39', telefono: '02 88791', email: 'press@teatroallascala.org',
    partitaIva: '01668090150', codiceFiscale: '01668090150',
    pec: 'teatroallascala@pec.it', codiceSdi: '', sito: 'https://www.teatroallascala.org',
    contatto: { nome: 'Marta', cognome: 'Conti', ruolo: 'Responsabile Marketing',
      telefono: '+39 02 8879 1100', email: 'marta.conti@teatroallascala.org', emailSecondaria: '',
      note: '' },
    trattativaCollegata: null,
    commerciale: null,
  },
];

// businessArea → array (supporto multi-settore)
MOCK_INSERZIONISTI.forEach(function(r) {
  r.businessArea = r.businessArea ? [r.businessArea] : [];
});
// Aziende multi-settore
var multiSector = {
  'ins-004': ['Media & Entertainment', 'Telecomunicazioni'],
  'ins-006': ['Retail Lusso', 'Grande Distribuzione'],
  'ins-009': ['Telecomunicazioni', 'Media & Entertainment'],
};
Object.keys(multiSector).forEach(function(k) {
  var r = MOCK_INSERZIONISTI.find(function(r) { return r.key === k; });
  if (r) r.businessArea = multiSector[k];
});

// Stato approvazione — assegnato dopo la definizione per mantenere i mock leggibili
;['ins-001','ins-002','ins-005','ins-008','ins-009','ins-010'].forEach(function(k) {
  var r = MOCK_INSERZIONISTI.find(function(r) { return r.key === k; });
  if (r) r.stato = 'approvato';
});
MOCK_INSERZIONISTI.forEach(function(r) { if (!r.stato) r.stato = 'in_attesa'; });

// Stati v2 (inserzionisti e contatti), gestiti dall'Operation Manager:
//  in_attesa     → inserito da un sales: l'OM verifica se esiste già / è assegnato ad altro commerciale
//  da_completare → approvato dall'OM: restano da verificare i campi e aggiungere le info mancanti
//  completato    → tutto a posto
const STATI_V2 = {
  in_attesa:     { label: 'In attesa',     badge: 'warning' },
  da_completare: { label: 'Da completare', badge: 'processing' },
  completato:    { label: 'Completato',    badge: 'success' },
};
function formatData(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return d + '/' + m + '/' + y;
}

// Contatti multipli + stato/richiedente/data per ogni entità (v2 — vista Operation Manager).
// Il primo contatto deriva da `contatto`; gli extra simulano lead e contatti aggiuntivi.
(function () {
  var STATO_INS = {
    'ins-003': 'in_attesa', 'ins-004': 'in_attesa', 'ins-007': 'in_attesa', 'ins-012': 'in_attesa',
    'ins-006': 'da_completare', 'ins-011': 'da_completare',
  };
  var RICHIEDENTE = {
    'ins-001': 'Lorenzo Bianchi', 'ins-002': 'Giulia Romano', 'ins-003': 'Federica Mancini', 'ins-004': 'Giulia Romano',
    'ins-005': 'Alessandro Costa', 'ins-006': 'Lorenzo Bianchi', 'ins-007': 'Alessandro Costa', 'ins-008': 'Alessandro Costa',
    'ins-009': 'Federica Mancini', 'ins-010': 'Federica Mancini', 'ins-011': 'Lorenzo Bianchi', 'ins-012': 'Giulia Romano',
  };
  var DATA_INS = {
    'ins-003': '2026-09-29', 'ins-004': '2026-09-30', 'ins-007': '2026-09-26', 'ins-012': '2026-09-30',
    'ins-006': '2026-09-22', 'ins-011': '2026-09-18',
  };
  var EXTRA = {
    'ins-001': [{ nome: 'Paola',  cognome: 'Ferri',   ruolo: 'Brand Manager',     telefono: '+39 06 8305 1122', email: 'paola.ferri@enel.com',      tipo: 'Lead',     stato: 'in_attesa',     data: '2026-09-30', richiestoDa: 'Lorenzo Bianchi' }],
    'ins-003': [{ nome: 'Chiara', cognome: 'Neri',    ruolo: 'Resp. Promozione',  telefono: '+39 06 4975 1',    email: 'c.neri@enit.it',            tipo: 'Lead',     stato: 'in_attesa',     data: '2026-09-29', richiestoDa: 'Federica Mancini' }],
    'ins-005': [{ nome: 'Luca',   cognome: 'Pini',    ruolo: 'Media Planner',     telefono: '+39 02 9267 5500', email: 'luca.pini@esselunga.it',    tipo: 'Contatto', stato: 'completato' }],
    'ins-009': [{ nome: 'Sara',   cognome: 'Villa',   ruolo: 'Digital Marketing', telefono: '+39 06 3688 0101', email: 'sara.villa@tim.it',         tipo: 'Contatto', stato: 'da_completare', data: '2026-09-25', richiestoDa: 'Federica Mancini' }],
    'ins-010': [{ nome: 'Marco',  cognome: 'Greco',   ruolo: 'Growth Manager',    telefono: '+39 02 8081 5560', email: 'marco.greco@satispay.com',  tipo: 'Lead',     stato: 'completato' }],
  };
  var FIRST_STATO = { 'ins-004': ['in_attesa', '2026-09-30'], 'ins-006': ['da_completare', '2026-09-22'], 'ins-012': ['in_attesa', '2026-09-30'] };
  MOCK_INSERZIONISTI.forEach(function (r) {
    r.statoV2 = STATO_INS[r.key] || 'completato';
    r.richiestoDa = RICHIEDENTE[r.key];
    r.dataRichiesta = DATA_INS[r.key] || '2026-08-15';
    var list = [];
    if (r.contatto) {
      var f = FIRST_STATO[r.key];
      list.push(Object.assign({}, r.contatto, {
        tipo: 'Contatto',
        stato: f ? f[0] : 'completato',
        data: f ? f[1] : r.dataRichiesta,
        richiestoDa: r.richiestoDa,
      }));
    }
    (EXTRA[r.key] || []).forEach(function (c) { list.push(c); });
    r.contatti = list.map(function (c, i) {
      return Object.assign({ id: r.key + '-c' + (i + 1), richiestoDa: r.richiestoDa, data: r.dataRichiesta }, c);
    });
  });
})();

// Revisioni richieste: una per ogni inserzionista/contatto/lead non ancora "Completato".
// La tab "Da revisionare" è una proiezione (flat) degli stessi dati della tab "Inserzionisti".
function getRevisioni(r) {
  var items = [];
  if (r.statoV2 && r.statoV2 !== 'completato') {
    items.push({
      id: r.key, kind: 'Inserzionista', soggetto: null, stato: r.statoV2,
      richiestoDa: r.richiestoDa, data: r.dataRichiesta,
      label: (r.statoV2 === 'in_attesa' ? 'Verifica' : 'Completa') + ' inserzionista',
    });
  }
  (r.contatti || []).forEach(function (c) {
    if (c.stato && c.stato !== 'completato') {
      var what = c.tipo === 'Lead' ? 'lead' : 'contatto';
      items.push({
        id: c.id, kind: c.tipo, soggetto: c.nome + ' ' + c.cognome, stato: c.stato,
        richiestoDa: c.richiestoDa, data: c.data,
        label: (c.stato === 'in_attesa' ? 'Verifica ' : 'Completa ') + what,
      });
    }
  });
  return items;
}


var STORAGE_KEY = 'gravity_portafoglio_v2_data';

function load(version) {
  if (version === 'v2') {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { var parsed = JSON.parse(raw); if (Array.isArray(parsed) && parsed.length) return parsed; }
    } catch (e) { /* localStorage non disponibile: seed */ }
  }
  return MOCK_INSERZIONISTI;
}
function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* ignora */ }
}
function allRevisioni(data) {
  var out = [];
  (data || []).forEach(function (r) {
    getRevisioni(r).forEach(function (it) { out.push(Object.assign({}, it, { inserzionista: r })); });
  });
  return out;
}

global.GravityPortafoglio = {
  MOCK_INSERZIONISTI: MOCK_INSERZIONISTI, STATI_V2: STATI_V2, getRevisioni: getRevisioni,
  formatData: formatData, load: load, save: save, allRevisioni: allRevisioni,
};
})(window);
