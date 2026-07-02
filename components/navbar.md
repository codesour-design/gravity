# Navbar — Gravity Platform

> Fonte di verità per la navbar in tutti i prototipi HTML e nella trasposizione Figma.
> Ogni prototipo DEVE usare il componente condiviso `prototipi/navbar.js` (`window.GravityNavbar`).
> Non ricostruire una navbar per-prototipo e non inventare varianti.

---

## Figma Design System

- **File:** Ant Design System for Gravity
- **Componente:** https://www.figma.com/design/uR6CBOh0Y7dUQvH30SyD0P/Ant-Design-System-for-Gravity?node-id=48-1331
- **Component node ID:** `48:1331` (component set `*Navbar*`)
- **Voci di navigazione e ruoli:** node `3261-3147`

---

## Componente condiviso: `window.GravityNavbar`

Sorgente: `prototipi/navbar.js`. Da caricare dopo React, ReactDOM, antd, `@ant-design/icons`
e `tokens.js`:

```js
// 1. Prima dello script del prototipo:
window.GRAVITY_NAV = { section: 'Inventory', item: 'Systems' };
```
```html
<!-- 2. -->
<script src="../navbar.js"></script>
```
```js
// 3. Nel render:
React.createElement(window.GravityNavbar, null)
```

`window.GRAVITY_NAV` accetta anche: `logoSrc`, `appHref` (destinazione del logo e di "Per te")
e `links` (override dei link delle singole voci menu). **Dal 2026-07-02 gli override di path non
servono più nei casi standard**: `navbar.js` deriva la base dei link dalla propria posizione
(`document.currentScript` → `ROOT`), quindi logo, "Per te" e voci menu funzionano da qualsiasi
profondità di pagina. Usa gli override solo per destinazioni non standard.

### Registro prototipi e stato

I link delle voci menu ai prototipi **non sono hardcoded in navbar.js**: vengono dal campo `nav`
di **`prototipi/registry.js`** (`window.GRAVITY_PROTOTYPES`), che navbar.js carica da solo se la
pagina non lo ha già incluso.

Il campo `status` (`approved` / `in-progress`) resta nel registro come metadato del prototipo, ma
**non è mostrato nell'interfaccia**: il dropdown del selettore versioni (dev-bar handoff) è ridotto
alla sola lista di versioni selezionabili, senza riga di stato né titolo.

Regole: un prototipo = una cartella sotto `prototipi/` per tutto il ciclo di vita; quando viene
approvato si aggiorna `status` nel registro, **non si sposta la cartella** (gli URL non cambiano).
Nuovo prototipo → nuova voce nel registro (`label`, `status`, `entry`, `nav` se collegato a una
voce di menu).

### Specifiche visive

| Proprietà | Valore |
|-----------|--------|
| Altezza | **64px**, sticky (`top: 0; z-index: 100`) |
| Sfondo / bordo | `#ffffff` / `1px solid rgba(0,0,0,0.06)` |
| Logo | `Gravity_type.svg`, height 26px, padding orizzontale 24px |
| Voce attiva | `#3E00FB` + underline 2px |
| Voce senza link | testo disabilitato `rgba(0,0,0,0.25)`, `cursor: default` (non link rotto) |
| Campanella | `BellOutlined` 18px |
| Avatar | 32×32 circolare, iniziali colorate per hash del nome |
| Gap campanella → avatar / padding destro | 16px / 20px |

Logo: **solo il logotipo tipografico** (`Gravity_type.svg`) — mai il mark da solo né entrambi.

---

## Sezioni e voci (dal DS Figma)

"Overview" (area personale, con "Per te") è **sempre presente per ogni ruolo**, anche dove non
elencata tra le sezioni del ruolo.

| Sezione | Label IT | Voci (label IT) |
|---------|----------|------------------|
| Overview | Panoramica | Per te · Dashboard Finance · Dashboard Analytics |
| Inventory | Inventario | Systems (Impianti) · Licenses (Permessi) · Supplier (Fornitori) |
| Commercial | Commerciale | Wallet (Portafoglio) · Activities (Attività) · Negotiations (Trattative) · Orders (Ordini) |
| Delivery | Espletamento | Campaigns (Campagne) · Plannings (Pianificazioni) · Collections (Collezioni POI) |
| Settings | Impostazioni | Users (Utenti) · Tenants (Tenant) |

Le chiavi di `GRAVITY_NAV` restano in inglese; i label mostrati sono in italiano
(`SECTION_LABEL`/`ITEM_LABEL` in `navbar.js`).

---

## Ruoli e accesso

Ruolo attivo persistito in `localStorage.gravity_proto_role`, si cambia dal dropdown
sull'avatar (nessuna autenticazione reale).

| Ruolo | Sezioni |
|-------|---------|
| Tenant Admin | tutte |
| Inventory Manager | Overview, Inventory |
| Operation Manager | Overview, Inventory, Commercial, Delivery |
| Planner | Overview, Inventory, Delivery |
| Sales | Overview (implicita), Commercial, Delivery |

- Ruolo **senza accesso** alla sezione della pagina corrente: navbar visibile, contenuto
  sostituito da `Empty` "Il ruolo **{ruolo}** non ha accesso a questa sezione" — mai redirect o
  pagina bianca.
- Nel dropdown avatar i ruoli senza accesso alla sezione corrente sono disabilitati con
  `LockOutlined`; il ruolo attivo mostra `CheckOutlined`.
- Ogni ruolo ha un utente demo (nome, cognome, colore avatar): valori in `ROLE_USER` in
  `navbar.js` — non hardcodare nomi diversi altrove.

## Notifiche (solo Sales)

Il ruolo **Sales** ha badge conteggio sulla campanella e pannello notifiche mock (trattative
assegnate); gli altri ruoli vedono "Nessuna notifica". Non estendere ad altri ruoli senza
decisione di prodotto esplicita.

---

## Trasposizione Figma

1. Componente **`*Navbar*`** dalla libreria DS (node `48:1331`) — mai disegnarla da zero.
2. Variante **Role = {ruolo del flusso}** (il set ha varianti per ruolo).
3. Voce attiva dalla proprietà `Selected Item`.
4. Dark mode (futura): variante `Theme = Dark` nello stesso set.
