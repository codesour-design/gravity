/**
 * inventory-data.js — Dati (mock) degli impianti del Parco Impianti.
 *
 * Fonte unica condivisa tra `prototype/inventory-systems` (Parco Impianti) e `prototype/user-profile`
 * (card "Spazi disponibili" della home Operation Manager): il numero in home è lo stesso del Parco.
 * Contenuto spostato da inventory-systems/index.html senza modifiche (static + popolamento sintetico
 * con RNG a seed + campi canale/suolo/media owner).
 *
 * Espone window.GravityInventory:
 *   IMPIANTI              array degli impianti (la pagina che lo usa può arricchirli, es. codici e nomi)
 *   isDisponibile(imp)    impianto vendibile (stato amministrativo Attivo) in stato commerciale Disponibile
 */
;(function (global) {
  'use strict';

// ─────────────────────────────────────────────────────────
// DATABASE — impianti Palermo con coordinate precise
// ─────────────────────────────────────────────────────────
const IMPIANTI = [
  // ── CENTRO STORICO ──────────────────────────────────
  // Via Maqueda corre N-S: #32 ~ 38.1100, #78 ~ 38.1140, #148 ~ 38.1180
  { id:'I001', tipo:'Pensilina',        indirizzo:'Via Maqueda, 148',               zona:'Centro Storico', lat:38.11820, lng:13.36080, faces:2, formato:'120×180cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I002', tipo:'Cartello',           indirizzo:'Corso Vittorio Emanuele, 102',   zona:'Centro Storico', lat:38.11480, lng:13.36620, faces:1, formato:'200×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I003', tipo:'Palina',           indirizzo:'Via Roma, 310',                  zona:'Centro Storico', lat:38.11650, lng:13.36700, faces:1, formato:'100×140cm', stato:'In Opzione',   illuminato:false, stato_amm:'In Manutenzione' },
  { id:'I004', tipo:'Fermata bus',      indirizzo:'Via Roma, 228',                  zona:'Centro Storico', lat:38.11480, lng:13.36720, faces:2, formato:'140×200cm', stato:'Riservato',    illuminato:true,  stato_amm:'Attivo' },
  { id:'I005', tipo:'Cassonetto',       indirizzo:'Via Maqueda, 32',                zona:'Centro Storico', lat:38.10980, lng:13.36200, faces:2, formato:'300×200cm', stato:'Disponibile',  illuminato:false, stato_amm:'Inizializzato' },
  { id:'I006', tipo:'Palo luce',        indirizzo:'Corso Vittorio Emanuele, 55',    zona:'Centro Storico', lat:38.11490, lng:13.36540, faces:1, formato:'70×100cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I007', tipo:'Speciale OOH', canale:'OOH', indirizzo:'Piazza Pretoria',                zona:'Centro Storico', lat:38.11560, lng:13.36180, faces:4, formato:'400×300cm',     stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I008', tipo:'Palina butterfly', indirizzo:'Via Roma, 390',                  zona:'Centro Storico', lat:38.11870, lng:13.36650, faces:2, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Inizializzato' },
  { id:'I009', tipo:'Fermata bus',      indirizzo:'Via Lincoln, 45',                zona:'Centro Storico', lat:38.10980, lng:13.36550, faces:2, formato:'140×200cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I010', tipo:'Fioriera',         indirizzo:'Piazza San Domenico',            zona:'Centro Storico', lat:38.11870, lng:13.36480, faces:2, formato:'70×100cm',  stato:'Disponibile',  illuminato:false, stato_amm:'In Manutenzione' },
  { id:'I011', tipo:'Telo',             indirizzo:'Via Bandiera, 20',               zona:'Centro Storico', lat:38.11420, lng:13.35810, faces:1, formato:'600×300cm', stato:'In Opzione',   illuminato:false, stato_amm:'Inizializzato' },
  { id:'I012', tipo:'Stendardo',        indirizzo:"Via Bara all'Olivella, 5",       zona:'Centro Storico', lat:38.11880, lng:13.36090, faces:2, formato:'100×200cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I013', tipo:'Parapedonale',     indirizzo:'Via Divisi, 15',                 zona:'Centro Storico', lat:38.11430, lng:13.36050, faces:2, formato:'100×70cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Inizializzato' },
  { id:'I014', tipo:'Rotor',            indirizzo:'Via Alloro, 30',                 zona:'Centro Storico', lat:38.11350, lng:13.36920, faces:3, formato:'300×200cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I015', tipo:'Plancia',           indirizzo:'Via Butera, 10',                 zona:'Centro Storico', lat:38.11290, lng:13.36930, faces:2, formato:'300×70cm',  stato:'In Opzione',   illuminato:false, stato_amm:'Inizializzato' },
  { id:'I016', tipo:'Insegna',          indirizzo:'Via V. E. Orlando, 3',           zona:'Centro Storico', lat:38.11570, lng:13.36980, faces:1, formato:'400×80cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I017', tipo:'Palina',           indirizzo:'Corso Vittorio Emanuele, 170',   zona:'Centro Storico', lat:38.11430, lng:13.36760, faces:1, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I018', tipo:'Cartello',           indirizzo:'Via Maqueda, 78',                zona:'Centro Storico', lat:38.11380, lng:13.36130, faces:1, formato:'200×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'In Manutenzione' },
  { id:'I019', tipo:'Fermata bus',      indirizzo:'Piazza Giulio Cesare',           zona:'Centro Storico', lat:38.10880, lng:13.37020, faces:2, formato:'140×200cm', stato:'Riservato',    illuminato:true,  stato_amm:'In Manutenzione' },
  { id:'I020', tipo:'Cassonetto',       indirizzo:'Via Roma, 130',                  zona:'Centro Storico', lat:38.11200, lng:13.36720, faces:2, formato:'300×200cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  // ── POLITEAMA / RUGGERO SETTIMO ──────────────────────
  { id:'I021', tipo:'Pensilina',        indirizzo:'Piazza Politeama',               zona:'Politeama',      lat:38.12228, lng:13.35158, faces:2, formato:'120×180cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I022', tipo:'Speciale OOH', canale:'OOH', indirizzo:'Piazza Verdi (Teatro Massimo)',  zona:'Politeama',      lat:38.11975, lng:13.35908, faces:4, formato:'600×300cm',     stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I023', tipo:'Telo',             indirizzo:'Via Ruggero Settimo, 15',        zona:'Politeama',      lat:38.12068, lng:13.35240, faces:1, formato:'600×300cm', stato:'In Opzione',   illuminato:false, stato_amm:'Attivo' },
  { id:'I024', tipo:'Fioriera',         indirizzo:'Via XX Settembre, 8',            zona:'Politeama',      lat:38.11960, lng:13.35280, faces:2, formato:'70×100cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Rimosso' },
  { id:'I025', tipo:'Parapedonale',     indirizzo:'Via Principe di Belmonte, 12',   zona:'Politeama',      lat:38.11920, lng:13.35480, faces:2, formato:'100×70cm',  stato:'Disponibile',  illuminato:false, stato_amm:'In Manutenzione' },
  { id:'I026', tipo:'Palina',           indirizzo:'Via Emerico Amari, 12',          zona:'Politeama',      lat:38.11810, lng:13.35200, faces:1, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I027', tipo:'Plancia',           indirizzo:'Via Emerico Amari, 56',          zona:'Politeama',      lat:38.11750, lng:13.34980, faces:2, formato:'300×70cm',  stato:'In Opzione',   illuminato:false, stato_amm:'In Manutenzione' },
  { id:'I028', tipo:'Rotor',            indirizzo:'Via Isidoro La Lumia, 3',        zona:'Politeama',      lat:38.12180, lng:13.35050, faces:3, formato:'300×200cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I029', tipo:'Insegna',          indirizzo:'Via Dante, 8',                   zona:'Politeama',      lat:38.11880, lng:13.35720, faces:1, formato:'400×80cm', stato:'Disponibile',  illuminato:true,  stato_amm:'In Manutenzione' },
  { id:'I030', tipo:'Cartello',           indirizzo:'Via Mariano Stabile, 50',        zona:'Politeama',      lat:38.12110, lng:13.35520, faces:1, formato:'200×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  // ── VIA LIBERTÀ ──────────────────────────────────────
  // Coord interpolate lungo Via della Libertà: inizio a Piazza Politeama (38.1222, 13.3516),
  // fine a Piazza Croci (38.1400, 13.3465). ~300 numeri civici, 0.0000593° lat / 0.0000170° lng per unità.
  { id:'I031', tipo:'Cartello',           indirizzo:'Via della Libertà, 5',           zona:'Via Libertà',    lat:38.12250, lng:13.35151, faces:1, formato:'200×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I032', tipo:'Palina butterfly', indirizzo:'Via della Libertà, 35',          zona:'Via Libertà',    lat:38.12428, lng:13.35100, faces:2, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I033', tipo:'Palo luce',        indirizzo:'Via della Libertà, 68',          zona:'Via Libertà',    lat:38.12624, lng:13.35043, faces:1, formato:'70×100cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I034', tipo:'Fermata bus',      indirizzo:'Via della Libertà, 90',          zona:'Via Libertà',    lat:38.12754, lng:13.35005, faces:2, formato:'140×200cm', stato:'Riservato',    illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I035', tipo:'Pensilina',        indirizzo:'Via della Libertà, 120',         zona:'Via Libertà',    lat:38.12932, lng:13.34954, faces:2, formato:'120×180cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I036', tipo:'Cartello',           indirizzo:'Via della Libertà, 145',         zona:'Via Libertà',    lat:38.13080, lng:13.34910, faces:1, formato:'200×140cm', stato:'In Opzione',   illuminato:false, stato_amm:'Attivo' },
  { id:'I037', tipo:'Cassonetto',       indirizzo:'Via della Libertà, 175',         zona:'Via Libertà',    lat:38.13258, lng:13.34858, faces:2, formato:'300×200cm', stato:'Disponibile',  illuminato:false, stato_amm:'Rimosso' },
  { id:'I038', tipo:'Stendardo',        indirizzo:'Via della Libertà, 200',         zona:'Via Libertà',    lat:38.13406, lng:13.34813, faces:2, formato:'100×200cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I039', tipo:'Pensilina',        indirizzo:'Piazza Croci',                   zona:'Via Libertà',    lat:38.14008, lng:13.34650, faces:2, formato:'120×180cm', stato:'Disponibile',  illuminato:true,  stato_amm:'In Manutenzione' },
  { id:'I040', tipo:'Palina',           indirizzo:'Via della Libertà, 240',         zona:'Via Libertà',    lat:38.13643, lng:13.34723, faces:1, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I041', tipo:'Palo luce',        indirizzo:'Via della Libertà, 280',         zona:'Via Libertà',    lat:38.13880, lng:13.34660, faces:1, formato:'70×100cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I042', tipo:'Fioriera',         indirizzo:'Via Marchese Ugo, 15',           zona:'Via Libertà',    lat:38.12750, lng:13.34870, faces:2, formato:'70×100cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I043', tipo:'Stendardo',        indirizzo:'Via Marchese Ugo, 65',           zona:'Via Libertà',    lat:38.13080, lng:13.34920, faces:2, formato:'100×200cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I044', tipo:'Palina butterfly', indirizzo:'Via Filippo Turati, 5',          zona:'Via Libertà',    lat:38.12410, lng:13.34880, faces:2, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I045', tipo:'Rotor',            indirizzo:'Via Mariano Stabile, 90',        zona:'Via Libertà',    lat:38.12260, lng:13.35600, faces:3, formato:'300×200cm', stato:'In Opzione',   illuminato:true,  stato_amm:'Attivo' },
  // ── NOTARBARTOLO / RESUTTANA ─────────────────────────
  // Via Notarbartolo corre N dal Policlinico verso Resuttana, parallela a Via della Libertà
  { id:'I046', tipo:'Pensilina',        indirizzo:'Via Notarbartolo, 10',           zona:'Notarbartolo',   lat:38.12540, lng:13.34620, faces:2, formato:'120×180cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I047', tipo:'Cartello',           indirizzo:'Via Notarbartolo, 55',           zona:'Notarbartolo',   lat:38.12880, lng:13.34560, faces:1, formato:'200×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Inizializzato' },
  { id:'I048', tipo:'Fermata bus',      indirizzo:'Via Notarbartolo, 100',          zona:'Notarbartolo',   lat:38.13180, lng:13.34500, faces:2, formato:'140×200cm', stato:'Riservato',    illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I049', tipo:'Fioriera',         indirizzo:'Piazza Ungheria',                zona:'Notarbartolo',   lat:38.12620, lng:13.35720, faces:2, formato:'70×100cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I050', tipo:'Cassonetto',       indirizzo:'Via Marchese Ugo, 100',          zona:'Notarbartolo',   lat:38.13280, lng:13.34960, faces:2, formato:'300×200cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I051', tipo:'Palo luce',        indirizzo:'Via Autonomia Siciliana, 5',     zona:'Notarbartolo',   lat:38.13800, lng:13.34250, faces:1, formato:'70×100cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'Rimosso' },
  { id:'I052', tipo:'Fermata bus',      indirizzo:'Viale Strasburgo, 10',           zona:'Notarbartolo',   lat:38.14080, lng:13.33400, faces:2, formato:'140×200cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I053', tipo:'Plancia',           indirizzo:'Via Ammiraglio Rizzo, 12',       zona:'Notarbartolo',   lat:38.13520, lng:13.35380, faces:2, formato:'300×70cm',  stato:'In Opzione',   illuminato:false, stato_amm:'Attivo' },
  { id:'I054', tipo:'Parapedonale',     indirizzo:'Via Serradifalco, 15',           zona:'Notarbartolo',   lat:38.14450, lng:13.34500, faces:2, formato:'100×70cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I055', tipo:'Telo',             indirizzo:'Via Giuseppe Giusti, 8',         zona:'Notarbartolo',   lat:38.13430, lng:13.35080, faces:1, formato:'600×300cm', stato:'In Opzione',   illuminato:false, stato_amm:'Attivo' },
  { id:'I056', tipo:'Insegna',          indirizzo:'Via Imperatore Federico, 5',     zona:'Notarbartolo',   lat:38.12230, lng:13.33720, faces:1, formato:'400×80cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I057', tipo:'Palina',           indirizzo:'Via Imperatore Federico, 80',    zona:'Notarbartolo',   lat:38.12360, lng:13.33260, faces:1, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Inizializzato' },
  // ── FORO ITALICO / PORTO ─────────────────────────────
  // Foro Italico = lungomare a E del centro storico
  { id:'I058', tipo:'Telo',             indirizzo:'Foro Italico, 10',               zona:'Foro Italico',   lat:38.10820, lng:13.37240, faces:1, formato:'600×300cm', stato:'In Opzione',   illuminato:false, stato_amm:'Inizializzato' },
  { id:'I059', tipo:'Stendardo',        indirizzo:'Foro Italico, 50',               zona:'Foro Italico',   lat:38.10900, lng:13.37420, faces:2, formato:'100×200cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I060', tipo:'Fermata bus',      indirizzo:'Via Francesco Crispi, 10',       zona:'Foro Italico',   lat:38.11140, lng:13.37180, faces:2, formato:'140×200cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I061', tipo:'Palo luce',        indirizzo:'Via Francesco Crispi, 80',       zona:'Foro Italico',   lat:38.11300, lng:13.37060, faces:1, formato:'70×100cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I062', tipo:'Fioriera',         indirizzo:'Piazza Marina',                  zona:'Foro Italico',   lat:38.11440, lng:13.36940, faces:2, formato:'70×100cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I063', tipo:'Palina',           indirizzo:'Via Cala, 5',                    zona:'Foro Italico',   lat:38.11310, lng:13.37080, faces:1, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I064', tipo:'Cartello',           indirizzo:'Via della Zecca, 8',             zona:'Foro Italico',   lat:38.11520, lng:13.37440, faces:1, formato:'200×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Inizializzato' },
  { id:'I065', tipo:'Rotor',            indirizzo:'Piazza Giachery',                zona:'Foro Italico',   lat:38.11420, lng:13.37560, faces:3, formato:'300×200cm', stato:'Disponibile',  illuminato:true,  stato_amm:'In Manutenzione' },
  // ── CALATAFIMI / ZISA ────────────────────────────────
  // Corso Calatafimi corre W dal centro: #100~38.1048, #250~38.1030, #400~38.1015
  { id:'I066', tipo:'Pensilina',        indirizzo:'Corso Calatafimi, 100',          zona:'Calatafimi',     lat:38.10500, lng:13.34910, faces:2, formato:'120×180cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I067', tipo:'Cartello',           indirizzo:'Corso Calatafimi, 250',          zona:'Calatafimi',     lat:38.10280, lng:13.33810, faces:1, formato:'200×140cm', stato:'In Opzione',   illuminato:false, stato_amm:'In Manutenzione' },
  { id:'I068', tipo:'Fermata bus',      indirizzo:'Corso Calatafimi, 400',          zona:'Calatafimi',     lat:38.10120, lng:13.32680, faces:2, formato:'140×200cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I069', tipo:'Speciale OOH', canale:'OOH', indirizzo:'Piazza Indipendenza',            zona:'Calatafimi',     lat:38.11130, lng:13.34830, faces:4, formato:'1200×400cm',     stato:'In Opzione',   illuminato:true,  stato_amm:'In Manutenzione' },
  { id:'I070', tipo:'Palina',           indirizzo:'Via Cappuccini, 8',              zona:'Calatafimi',     lat:38.11980, lng:13.34300, faces:1, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I071', tipo:'Cassonetto',       indirizzo:'Via Papireto, 5',                zona:'Calatafimi',     lat:38.11770, lng:13.34600, faces:2, formato:'300×200cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I072', tipo:'Palo luce',        indirizzo:'Via Dante, 65',                  zona:'Calatafimi',     lat:38.11820, lng:13.34320, faces:1, formato:'70×100cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'Rimosso' },
  { id:'I073', tipo:'Pensilina',        indirizzo:'Piazza Zisa',                    zona:'Calatafimi',     lat:38.11010, lng:13.33020, faces:2, formato:'120×180cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I074', tipo:'Telo',             indirizzo:'Via Boccadifalco, 10',           zona:'Calatafimi',     lat:38.12810, lng:13.32780, faces:1, formato:'600×300cm', stato:'In Opzione',   illuminato:false, stato_amm:'Rimosso' },
  { id:'I075', tipo:'Insegna',          indirizzo:'Via Ugo La Malfa, 8',            zona:'Calatafimi',     lat:38.10840, lng:13.31500, faces:1, formato:'400×80cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  // ── VIALE REGIONE SICILIANA ──────────────────────────
  // Tangenziale: corre E-O a S di Palermo, circa lat 38.102–38.108
  { id:'I076', tipo:'Cassonetto',       indirizzo:'Viale Regione Siciliana, 500',   zona:'Viale Regione',  lat:38.10400, lng:13.31520, faces:2, formato:'300×200cm', stato:'Disponibile',  illuminato:false, stato_amm:'In Manutenzione' },
  { id:'I077', tipo:'Fermata bus',      indirizzo:'Viale Regione Siciliana, 1000',  zona:'Viale Regione',  lat:38.10350, lng:13.33520, faces:2, formato:'140×200cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I078', tipo:'Cartello',           indirizzo:'Viale Regione Siciliana, 1500',  zona:'Viale Regione',  lat:38.10440, lng:13.35530, faces:1, formato:'200×140cm', stato:'In Opzione',   illuminato:false, stato_amm:'Inizializzato' },
  { id:'I079', tipo:'Pensilina',        indirizzo:'Viale Regione Siciliana, 2000',  zona:'Viale Regione',  lat:38.10520, lng:13.37520, faces:2, formato:'120×180cm', stato:'Disponibile',  illuminato:true,  stato_amm:'In Manutenzione' },
  { id:'I080', tipo:'Palina',           indirizzo:'Via Oreto, 10',                  zona:'Viale Regione',  lat:38.09880, lng:13.34600, faces:1, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'In Manutenzione' },
  { id:'I081', tipo:'Stendardo',        indirizzo:'Via Oreto, 80',                  zona:'Viale Regione',  lat:38.09620, lng:13.33960, faces:2, formato:'100×200cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Inizializzato' },
  { id:'I082', tipo:'Parapedonale',     indirizzo:'Via Ernesto Basile, 5',          zona:'Viale Regione',  lat:38.10520, lng:13.32800, faces:2, formato:'100×70cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I083', tipo:'Palina butterfly', indirizzo:'Via delle Magnolie, 3',          zona:'Viale Regione',  lat:38.09340, lng:13.33560, faces:2, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I084', tipo:'Cartello',           indirizzo:'Via Villagrazia, 25',            zona:'Viale Regione',  lat:38.09000, lng:13.35000, faces:1, formato:'200×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'In Manutenzione' },
  { id:'I085', tipo:'Plancia',           indirizzo:'Piazza Scaffa',                  zona:'Viale Regione',  lat:38.10000, lng:13.35960, faces:2, formato:'300×70cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Rimosso' },
  // ── MONDELLO / ADDAURA ───────────────────────────────
  { id:'I086', tipo:'Speciale OOH', canale:'OOH', indirizzo:'Piazza di Mondello',             zona:'Mondello',       lat:38.21958, lng:13.33108, faces:4, formato:'400×300cm',     stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I087', tipo:'Fioriera',         indirizzo:'Viale Regina Elena, 15',         zona:'Mondello',       lat:38.21800, lng:13.32940, faces:2, formato:'70×100cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I088', tipo:'Stendardo',        indirizzo:'Via Piano di Gallo, 5',          zona:'Mondello',       lat:38.20860, lng:13.32800, faces:2, formato:'100×200cm',  stato:'In Opzione',   illuminato:false, stato_amm:'In Manutenzione' },
  { id:'I089', tipo:'Cartello',           indirizzo:'Via Mondello, 45',               zona:'Mondello',       lat:38.20420, lng:13.32860, faces:1, formato:'200×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I090', tipo:'Palina',           indirizzo:'Via Vergine Maria, 3',           zona:'Mondello',       lat:38.15580, lng:13.36120, faces:1, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Inizializzato' },
  { id:'I091', tipo:'Telo',             indirizzo:'Lungomare Vergine Maria, 10',    zona:'Mondello',       lat:38.15730, lng:13.36360, faces:1, formato:'600×300cm', stato:'Disponibile',  illuminato:false, stato_amm:'In Manutenzione' },
  { id:'I092', tipo:'Fermata bus',      indirizzo:'Via Pallavicino, 8',             zona:'Mondello',       lat:38.16820, lng:13.34880, faces:2, formato:'140×200cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I093', tipo:'Cassonetto',       indirizzo:'Via Partanna Mondello, 10',      zona:'Mondello',       lat:38.21180, lng:13.33200, faces:2, formato:'300×200cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  // ── BRANCACCIO / SUD-EST ─────────────────────────────
  { id:'I094', tipo:'Palina',           indirizzo:'Via Brancaccio, 5',              zona:'Brancaccio',     lat:38.08820, lng:13.38480, faces:1, formato:'100×140cm', stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I095', tipo:'Fermata bus',      indirizzo:'Via Messina Marine, 120',        zona:'Brancaccio',     lat:38.09220, lng:13.38960, faces:2, formato:'140×200cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I096', tipo:'Cartello',           indirizzo:'Via Messina Marine, 5',          zona:'Brancaccio',     lat:38.09540, lng:13.37960, faces:1, formato:'200×140cm', stato:'In Opzione',   illuminato:false, stato_amm:'Attivo' },
  { id:'I097', tipo:'Rotor',            indirizzo:'Via Vincenzo Di Marco, 5',       zona:'Brancaccio',     lat:38.09510, lng:13.36480, faces:3, formato:'300×200cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Rimosso' },
  { id:'I098', tipo:'Insegna',          indirizzo:'Via Ciaculli, 8',                zona:'Brancaccio',     lat:38.08660, lng:13.40160, faces:1, formato:'400×80cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I099', tipo:'Parapedonale',     indirizzo:'Via Ughetti, 3',                 zona:'Brancaccio',     lat:38.09720, lng:13.37220, faces:2, formato:'100×70cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I100', tipo:'Palina butterfly', indirizzo:'Via Messina Marine, 250',        zona:'Brancaccio',     lat:38.09120, lng:13.39740, faces:2, formato:'100×140cm', stato:'In Opzione',   illuminato:false, stato_amm:'In Manutenzione' },
  // ── OOH — completamento tipologie con meno di 5 impianti ────
  { id:'I101', tipo:'Speciale OOH', canale:'OOH', indirizzo:'Viale Regione Siciliana, 2200', zona:'Viale Regione',  lat:38.10480, lng:13.37900, faces:4, formato:'600×300cm',     stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  { id:'I102', tipo:'Plancia',     indirizzo:'Via Brancaccio, 80',            zona:'Brancaccio',     lat:38.08950, lng:13.38720, faces:2, formato:'300×70cm',  stato:'Disponibile',  illuminato:false, stato_amm:'Attivo' },
  // ── DOOH ─────────────────────────────────────────────────────
  // Alux (×5)
  { id:'I103', tipo:'Alux', canale:'DOOH', indirizzo:'Via Roma, 200',                 zona:'Centro Storico', lat:38.11600, lng:13.36600, faces:2, formato:'120×176cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I104', tipo:'Alux', canale:'DOOH', indirizzo:'Via Ruggero Settimo, 28',       zona:'Politeama',      lat:38.12100, lng:13.35320, faces:2, formato:'80×120cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I105', tipo:'Alux', canale:'DOOH', indirizzo:'Via della Libertà, 52',         zona:'Via Libertà',    lat:38.12470, lng:13.35090, faces:2, formato:'120×176cm', stato:'In Opzione',   illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I106', tipo:'Alux', canale:'DOOH', indirizzo:'Via Notarbartolo, 28',          zona:'Notarbartolo',   lat:38.12660, lng:13.34580, faces:2, formato:'80×120cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I107', tipo:'Alux', canale:'DOOH', indirizzo:'Via Francesco Crispi, 45',      zona:'Foro Italico',   lat:38.11200, lng:13.37130, faces:2, formato:'120×176cm', stato:'Disponibile',  illuminato:true,  stato_amm:'In Manutenzione' },
  // Billboard (×5)
  { id:'I108', tipo:'Billboard', canale:'DOOH', indirizzo:'Viale Regione Siciliana, 750',  zona:'Viale Regione',  lat:38.10380, lng:13.31900, faces:1, formato:'600×300cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I109', tipo:'Billboard', canale:'DOOH', indirizzo:'Corso Calatafimi, 180',          zona:'Calatafimi',     lat:38.10380, lng:13.33430, faces:1, formato:'400×300cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I110', tipo:'Billboard', canale:'DOOH', indirizzo:'Via Messina Marine, 80',         zona:'Brancaccio',     lat:38.09390, lng:13.38600, faces:2, formato:'300×200cm', stato:'Riservato',    illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I111', tipo:'Billboard', canale:'DOOH', indirizzo:'Via della Libertà, 310',         zona:'Via Libertà',    lat:38.14040, lng:13.34670, faces:1, formato:'600×300cm', stato:'In Opzione',   illuminato:true,  stato_amm:'Attivo' },
  { id:'I112', tipo:'Billboard', canale:'DOOH', indirizzo:'Via Emerico Amari, 35',          zona:'Politeama',      lat:38.11850, lng:13.35100, faces:2, formato:'400×300cm', stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  // Totem (×5)
  { id:'I113', tipo:'Totem', canale:'DOOH', indirizzo:'Via Maqueda, 55',              zona:'Centro Storico', lat:38.11020, lng:13.36150, faces:4, formato:'70×180cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I114', tipo:'Totem', canale:'DOOH', indirizzo:'Piazza Castelnuovo',           zona:'Politeama',      lat:38.12380, lng:13.34920, faces:4, formato:'55×120cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I115', tipo:'Totem', canale:'DOOH', indirizzo:'Via Marchese Ugo, 40',         zona:'Via Libertà',    lat:38.12880, lng:13.34850, faces:4, formato:'70×180cm',  stato:'In Opzione',   illuminato:true,  stato_amm:'Attivo' },
  { id:'I116', tipo:'Totem', canale:'DOOH', indirizzo:'Viale Strasburgo, 55',         zona:'Notarbartolo',   lat:38.13980, lng:13.33600, faces:4, formato:'40×100cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I117', tipo:'Totem', canale:'DOOH', indirizzo:'Viale Regione Siciliana, 1800',zona:'Viale Regione',  lat:38.10470, lng:13.37120, faces:4, formato:'55×120cm',  stato:'Disponibile',  illuminato:true,  stato_amm:'In Manutenzione' },
  // Speciale DOOH (×5)
  { id:'I118', tipo:'Speciale DOOH', canale:'DOOH', indirizzo:'Piazza Giulio Cesare',      zona:'Centro Storico', lat:38.10860, lng:13.37060, faces:4, formato:'600×400cm',     stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },
  { id:'I119', tipo:'Speciale DOOH', canale:'DOOH', indirizzo:'Via Ruggero Settimo, 50',   zona:'Politeama',      lat:38.12020, lng:13.35260, faces:4, formato:'800×600cm',     stato:'In Opzione',   illuminato:true,  stato_amm:'Attivo' },
  { id:'I120', tipo:'Speciale DOOH', canale:'DOOH', indirizzo:'Piazza Croci',              zona:'Via Libertà',    lat:38.13980, lng:13.34600, faces:4, formato:'600×400cm',     stato:'Disponibile',  illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I121', tipo:'Speciale DOOH', canale:'DOOH', indirizzo:'Foro Italico, 80',          zona:'Foro Italico',   lat:38.11020, lng:13.37380, faces:2, formato:'400×300cm',     stato:'Riservato',    illuminato:true,  stato_amm:'Attivo' },
  { id:'I122', tipo:'Speciale DOOH', canale:'DOOH', indirizzo:'Via di Mondello, 5',        zona:'Mondello',       lat:38.21820, lng:13.33050, faces:2, formato:'400×300cm',     stato:'Disponibile',  illuminato:true,  stato_amm:'Attivo' },

  // ── Sibling di modulo — stessa struttura fisica, stesso canale/tipo/formato/indirizzo ──
  // OOH
  { id:'I123', tipo:'Pensilina',    canale:'OOH',  indirizzo:'Via Maqueda, 148',              zona:'Centro Storico', lat:38.11820, lng:13.36080, faces:2, formato:'120×180cm', stato:'Disponibile', illuminato:true,  stato_amm:'Attivo' },
  { id:'I124', tipo:'Cartello',     canale:'OOH',  indirizzo:'Corso Vittorio Emanuele, 102',  zona:'Centro Storico', lat:38.11480, lng:13.36620, faces:1, formato:'200×140cm', stato:'Disponibile', illuminato:false, stato_amm:'Attivo' },
  { id:'I125', tipo:'Pensilina',    canale:'OOH',  indirizzo:'Via della Libertà, 120',        zona:'Via Libertà',    lat:38.12932, lng:13.34954, faces:2, formato:'120×180cm', stato:'Disponibile', illuminato:true,  stato_amm:'Inizializzato' },
  { id:'I126', tipo:'Cassonetto',   canale:'OOH',  indirizzo:'Via Maqueda, 32',               zona:'Centro Storico', lat:38.10980, lng:13.36200, faces:2, formato:'300×200cm', stato:'Disponibile', illuminato:false, stato_amm:'Inizializzato' },
  { id:'I127', tipo:'Speciale OOH', canale:'OOH',  indirizzo:'Piazza Pretoria',               zona:'Centro Storico', lat:38.11560, lng:13.36180, faces:4, formato:'400×300cm',     stato:'Disponibile', illuminato:true,  stato_amm:'Attivo' },
  // DOOH
  { id:'I128', tipo:'Alux',         canale:'DOOH', indirizzo:'Via Roma, 200',                 zona:'Centro Storico', lat:38.11600, lng:13.36600, faces:2, formato:'120×176cm', stato:'Disponibile', illuminato:true,  stato_amm:'Attivo' },
  { id:'I129', tipo:'Billboard',    canale:'DOOH', indirizzo:'Viale Regione Siciliana, 750',  zona:'Viale Regione',  lat:38.10380, lng:13.31900, faces:1, formato:'600×300cm', stato:'Disponibile', illuminato:true,  stato_amm:'Attivo' },
  { id:'I130', tipo:'Totem',        canale:'DOOH', indirizzo:'Via Maqueda, 55',               zona:'Centro Storico', lat:38.11020, lng:13.36150, faces:4, formato:'70×180cm',  stato:'Disponibile', illuminato:true,  stato_amm:'Attivo' },
];

// ── Popolamento sintetico per demo mappa/cluster ─────────────
// Genera impianti aggiuntivi in "blob" di densità crescente, così sulla mappa
// si vedono tutti gli scaglioni di cluster (da 1-2 fino a >50). RNG con seed:
// le posizioni restano stabili tra un refresh e l'altro.
(function generateImpianti() {
  let _seed = 20260616;
  const rnd = () => {
    _seed = (_seed + 0x6D2B79F5) | 0;
    let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const pick = arr => arr[Math.floor(rnd() * arr.length)];

  const TIPI_GEN = ['Pensilina','Cartello','Palina','Fermata bus','Cassonetto','Palo luce','Speciale OOH','Palina butterfly','Telo','Stendardo','Parapedonale','Rotor','Plancia','Insegna','Fioriera'];  // distribuzione pesata: prevale Disponibile / Attivo, ma compaiono tutti i casi
  const STATI_GEN     = ['Disponibile','Disponibile','Disponibile','In Opzione','Riservato'];
  const STATI_AMM_GEN = ['Attivo','Attivo','Attivo','In Manutenzione','Inizializzato','Rimosso'];
  const VIE_GEN = ['Via della Libertà','Via Roma','Via Maqueda','Corso Calatafimi','Viale Strasburgo','Via Notarbartolo','Via Marchese di Villabianca','Via Sciuti','Via Empedocle Restivo','Via Dante','Via Ernesto Basile','Viale Regione Siciliana','Via Messina Marine','Via Oreto','Via Ausonia'];

  // ogni blob = un addensamento locale con un numero target di impianti
  const BLOBS = [
    { zona:'Sferracavallo',   lat:38.2030, lng:13.2780, n:1,   spread:0.003 },
    { zona:'Mondello',        lat:38.2000, lng:13.3250, n:2,   spread:0.004 },
    { zona:'Capaci',          lat:38.1700, lng:13.2400, n:4,   spread:0.005 },
    { zona:'Tommaso Natale',  lat:38.1950, lng:13.2900, n:5,   spread:0.005 },
    { zona:'Monreale',        lat:38.0820, lng:13.2920, n:6,   spread:0.006 },
    { zona:'Pallavicino',     lat:38.1800, lng:13.3200, n:8,   spread:0.006 },
    { zona:'Resuttana',       lat:38.1620, lng:13.3380, n:9,   spread:0.006 },
    { zona:'San Lorenzo',     lat:38.1550, lng:13.3300, n:14,  spread:0.008 },
    { zona:'Resuttana Nord',  lat:38.1480, lng:13.3460, n:18,  spread:0.008 },
    { zona:'Libertà Nord',    lat:38.1420, lng:13.3520, n:24,  spread:0.009 },
    { zona:'Bonagia',         lat:38.1000, lng:13.3560, n:30,  spread:0.010 },
    { zona:'Politeama',       lat:38.1230, lng:13.3500, n:38,  spread:0.010 },
    { zona:'Centro Storico',  lat:38.1150, lng:13.3640, n:48,  spread:0.011 },
    { zona:'Stazione',        lat:38.1080, lng:13.3700, n:70,  spread:0.012 },
    { zona:'Oreto',           lat:38.0980, lng:13.3850, n:110, spread:0.015 },
  ];

  let n = IMPIANTI.length;
  BLOBS.forEach(b => {
    for (let k = 0; k < b.n; k++) {
      n += 1;
      IMPIANTI.push({
        id:        'I' + String(n).padStart(3, '0'),
        tipo:      pick(TIPI_GEN),
        indirizzo: pick(VIE_GEN) + ', ' + (1 + Math.floor(rnd() * 250)),
        zona:      b.zona,
        lat:       b.lat + (rnd() - 0.5) * b.spread * 2,
        lng:       b.lng + (rnd() - 0.5) * b.spread * 2,
        faces:     1 + Math.floor(rnd() * 4),
        formato:   '120×180cm',
        stato:     pick(STATI_GEN),
        illuminato: rnd() < 0.5,
        stato_amm: pick(STATI_AMM_GEN),
      });
    }
  });
})();

// Campi sintetici per prototipo: canale, suolo, media_owner
(function enrichImpianti() {
  const MEDIA_OWNERS = ['Proprietario', 'IGPDecaux', 'Clear Channel', 'Verticals', 'Geonext', 'Pubbliemme', 'Cemusa', 'Neopolis', 'Mediacom', 'Urbanspot'];
  IMPIANTI.forEach((imp, i) => {
    const TIPO_CANALE = { 'alux': 'DOOH', 'billboard': 'DOOH', 'totem': 'DOOH', 'speciale dooh': 'DOOH' };
    imp.canale = TIPO_CANALE[(imp.tipo || '').toLowerCase()] || 'OOH';
    imp.suolo       = i % 3 === 0 ? 'Privato' : 'Pubblico';
    imp.media_owner = MEDIA_OWNERS[i % MEDIA_OWNERS.length];
  });
})();


function isDisponibile(imp) { return imp.stato_amm === 'Attivo' && imp.stato === 'Disponibile'; }

global.GravityInventory = { IMPIANTI: IMPIANTI, isDisponibile: isDisponibile };
})(window);
