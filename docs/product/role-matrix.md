# Role Matrix — Permessi per ruolo

> Fonte di verità unica per la matrice ruoli/permessi Gravity — sostituisce i CSV che erano in
> `docs/product/role-matrix/`. **Doc vivente**: aggiornare qui via via che la progettazione dei
> permessi avanza, non ricreare CSV separati per modulo.

## Legenda

### Livello di coinvolgimento (righe di categoria, in grassetto)

| Sigla | Significato |
|-------|-------------|
| **D** | Decisore |
| **C** | Consultato |
| **A** | Autorizza |
| **I** | Informato |

### Simboli sui singoli permessi

| Simbolo | Significato |
|---------|-------------|
| 🤖 | La funzionalità avvia un automatismo |
| 🦾 | La funzionalità ha un automatismo |
| ℹ️ | Il ruolo viene informato quando la funzionalità viene avviata da un altro ruolo |
| 🔑 | Il ruolo ha un controllo/filtro su questo permesso |
| 🥸 | Eccezioni |

---

## Modulo Inventory — Concessioni, Autorizzazioni, Spazi, Fornitori

| Permesso | Inventory Manager | Commerciale | Pianificatore | Operation Manager | Admin Tenant | Super Admin |
|---|---|---|---|---|---|---|
| **Gestione Permessi** | **D** | – | – | – | – | – |
| Visualizza lista permessi | `view_licenses_list` | – | – | – | `view_licenses_list` | `view_licenses_list` |
| Crea concessione | `create_grant` | – | – | – | `create_grant` | `create_grant` |
| Elimina concessione | `delete_grant` | – | – | – | `delete_grant` | `delete_grant` |
| Modifica concessione | `edit_grant` | – | – | – | `edit_grant` | `edit_grant` |
| Visualizza concessione | `view_grant` | – | – | – | `view_grant` | `view_grant` |
| Crea autorizzazione | `create_authorization` | – | – | – | `create_authorization` | `create_authorization` |
| Elimina autorizzazione | `delete_authorization` | – | – | – | `delete_authorization` | `delete_authorization` |
| Modifica autorizzazione | `edit_authorization` | – | – | – | `edit_authorization` | `edit_authorization` |
| Visualizza autorizzazione | `view_authorization` | – | – | – | `view_authorization` | `view_authorization` |
| **Gestione Spazi Pubblicitari** | **D** | **I** | **I** | **I** | – | – |
| Crea spazio | `create_item` | – | – | – | `create_item` | `create_item` |
| Elimina spazio | `delete_item` | – | – | – | `delete_item` | `delete_item` |
| Modifica spazio | `edit_item` | – | – | – | `edit_item` | `edit_item` |
| Visualizza lista spazi | `view_items_list` 🔑 | `view_items_list` 🔑🥸 | `view_items_list` 🔑🥸 | `view_items_list` 🔑🥸 | `view_items_list` | `view_items_list` |
| Visualizza spazio | `view_item` 🥸 | `view_item` 🔑🥸 | `view_item` 🔑🥸 | `view_item` 🔑🥸 | `view_item` | `view_item` |
| Cambia status spazio | `update_status_item` | – | – | – | `update_status_item` | `update_status_item` |
| **Gestione Fornitori (e forniture?)** | **D** | – | – | – | – | – |
| Crea fornitore | `create_supplier` | – | – | – | `create_supplier` | `create_supplier` |
| Elimina fornitore | `delete_supplier` | – | – | – | `delete_supplier` | `delete_supplier` |
| Modifica fornitore | `edit_supplier` | – | – | – | `edit_supplier` | `edit_supplier` |
| Visualizza lista fornitori | `view_suppliers_list` | – | – | – | `view_suppliers_list` | `view_suppliers_list` |
| Visualizza fornitore | `view_supplier` | – | – | – | `view_supplier` | `view_supplier` |

---

## Modulo Commercial / Campaign / Planning

| Permesso | Commerciale | Pianificatore | Operation Manager | Guest (Inserzionista) | Admin Tenant | Super Admin |
|---|---|---|---|---|---|---|
| **Gestione Attività** | **D** | – | **I** | – | – | – |
| Crea attività | `create_activity` | – | – | – | `create_activity` | `create_activity` |
| Elimina attività | – | – | `delete_activity` | – | `delete_activity` | `delete_activity` |
| Modifica attività | `edit_activity` 🔑 | – | `edit_activity` | – | `edit_activity` | `edit_activity` |
| Visualizza lista attività | `view_activities_list` 🔑 | – | `view_activities_list` | – | `view_activities_list` | `view_activities_list` |
| Visualizza attività | `view_activity` 🔑 | – | `view_activity` | – | `view_activity` | `view_activity` |
| Assegna attività | – | – | `assign_activity` | – | `assign_activity` | `assign_activity` |
| **Gestione Portafoglio Commerciale** | **D** | – | **A** | – | – | – |
| Visualizza portafoglio commerciale | `view_commercial_wallet` 🔑 | – | `view_commercial_wallet` | – | `view_commercial_wallet` | `view_commercial_wallet` |
| Crea inserzionista | `create_advertiser` | – | `create_advertiser` | – | `create_advertiser` | `create_advertiser` |
| Elimina inserzionista | – | – | `delete_advertiser` | – | `delete_advertiser` | `delete_advertiser` |
| Modifica inserzionista | – | – | `edit_advertiser` | – | `edit_advertiser` | `edit_advertiser` |
| Visualizza inserzionista | `view_advertiser` 🔑 | – | `view_advertiser` | – | `view_advertiser` | `view_advertiser` |
| Crea contatto | `create_contact` | – | `create_contact` | – | `create_contact` | `create_contact` |
| Elimina contatto | – | – | `delete_contact` | – | `delete_contact` | `delete_contact` |
| Modifica contatto | `edit_contact` 🔑 | – | `edit_contact` | – | `edit_contact` | `edit_contact` |
| Visualizza contatto | `view_contact` 🔑 | – | `view_contact` | – | `view_contact` | `view_contact` |
| Approva contatto | – | – | `approve_contact` | – | `approve_contact` | `approve_contact` |
| Assegna contatto | – | – | `assign_contact` | – | `assign_contact` | `assign_contact` |
| **Gestione Trattative** | **D** | **C** | **A** | – | – | – |
| Crea trattativa | `create_negotiation` | – | – | – | `create_negotiation` | `create_negotiation` |
| Elimina trattativa | – | – | `delete_negotiation` | – | `delete_negotiation` | `delete_negotiation` |
| Modifica trattativa | `edit_negotiation` 🔑 | – | `edit_negotiation` | – | `edit_negotiation` | `edit_negotiation` |
| Visualizza lista trattative | `view_negotiations_list` 🔑 | – | `view_negotiations_list` | – | `view_negotiations_list` | `view_negotiations_list` |
| Visualizza trattativa | `view_negotiation` 🔑 | `view_negotiation` | `view_negotiation` | – | `view_negotiation` | `view_negotiation` |
| **Gestione Strategie Pubblicitarie** | **D** | **C** | **A** | – | – | – |
| Crea strategia | `create_strategy` 🔑 | – | `create_strategy` | – | `create_strategy` | `create_strategy` |
| Elimina strategia | `delete_strategy` 🔑 | – | `delete_strategy` | – | `delete_strategy` | `delete_strategy` |
| Modifica strategia | `edit_strategy` 🔑 | – | `edit_strategy` | – | `edit_strategy` | `edit_strategy` |
| Visualizza strategia | `view_strategy` 🔑 | `view_strategy` | `view_strategy` | – | `view_strategy` | `view_strategy` |
| Crea campagna (bozza) | `create_campaig_brief` 🔑 | – | `create_campaig_brief` | – | `create_campaig_brief` | `create_campaig_brief` |
| Richiedi pianificazione 🤖 | `request_planning` 🔑 | – | – | – | `request_planning` | `request_planning` |
| **Gestione Preventivi** | **D** | **C** | **A** | – | – | – |
| Genera preventivo | `create_quote` 🔑 | – | `create_quote` | – | `create_quote` | `create_quote` |
| Elimina preventivo | – | – | `delete_quote` | – | `delete_quote` | `delete_quote` |
| Modifica preventivo | `edit_quote` 🔑 | – | `edit_quote` | – | `edit_quote` | `edit_quote` |
| Visualizza lista preventivi | `view_quotes_list` 🔑 | – | `view_quotes_list` | – | `view_quotes_list` | `view_quotes_list` |
| Visualizza preventivo | `view_quote` 🔑 | `view_quote` | `view_quote` | – | `view_quote` | `view_quote` |
| Condividi preventivo | `share_quote` | – | `share_quote` | – | `share_quote` | `share_quote` |
| Stabilisci prezzi e sconti | `set_prices_discounts` 🔑 | – | `set_prices_discounts` | – | `set_prices_discounts` | `set_prices_discounts` |
| Approva preventivo | `approve_quote` 🔑 | – | `approve_quote` | `approve_quote` 🔑 | `approve_quote` | `approve_quote` |
| **Gestione Contratti** | **C** | – | – | – | – | – |
| Genera contratto 🦾 | – | – | – | – | `create_contract` | `create_contract` |
| Elimina contratto | – | – | – | – | `delete_contract` | `delete_contract` |
| Modifica contratto | – | – | – | – | `edit_contract` | `edit_contract` |
| Visualizza contratto | `view_contract` 🔑 | – | `view_contract` | `view_contract` | `view_contract` | `view_contract` |
| Firma contratto 🤖 | – | – | – | `sign_contract` | – | – |
| **Gestione Ordini** | **I** | – | – | – | – | – |
| Crea ordine 🦾 | – | – | `create_order` | – | `create_order` | `create_order` |
| Elimina ordine | – | – | `delete_order` | – | `delete_order` | `delete_order` |
| Modifica ordine | – | – | `edit_order` | – | `edit_order` | `edit_order` |
| Visualizza lista ordini | – | – | `view_orders_list` | – | `view_orders_list` | `view_orders_list` |
| Visualizza ordine | – | – | `view_order` | – | `view_order` | `view_order` |
| **Gestione Campagne** | **C** | – | – | – | – | – |
| Crea campagna 🦾 | – | – | `create_campaign` | – | `create_campaign` | `create_campaign` |
| Elimina campagna | – | – | `delete_campaign` 🔑 *(solo senza ordine)* | – | `delete_campaign` | `delete_campaign` |
| Modifica campagna | – | – | `edit_campaign` 🔑 *(solo senza ordine)* | – | `edit_campaign` | `edit_campaign` |
| Visualizza lista campagne | `view_campaigns_list` 🔑 | `view_campaigns_list` 🔑 | `view_campaigns_list` | – | `view_campaigns_list` | `view_campaigns_list` |
| Visualizza campagna | `view_campaign` 🔑 | `view_campaign` 🔑 | `view_campaign` | – | `view_campaign` | `view_campaign` |
| **Gestione Pianificazioni** | **C** | **D** | – | – | – | – |
| Crea pianificazione 🦾 | – | `create_planning` | – | – | `create_planning` | `create_planning` |
| Elimina pianificazione | – | `delete_planning` | – | – | `delete_planning` | `delete_planning` |
| Modifica pianificazione | – | `edit_planning` | – | – | `edit_planning` | `edit_planning` |
| Visualizza lista pianificazioni | `view_plannings_list` 🔑 | `view_plannings_list` | `view_plannings_list` | – | `view_plannings_list` | `view_plannings_list` |
| Visualizza pianificazione | `view_planning` 🔑 | `view_planning` | `view_planning` | – | `view_planning` | `view_planning` |

---

## Modulo Users / Tenant (white-label)

| Permesso | Super Admin | Admin Tenant | Profilo Utente |
|---|---|---|---|
| **Gestione Utenti e Ruoli** | **I** | **D** | **I** |
| Crea profilo utente | `create_user` | `create_user` | – |
| Elimina profilo utente | `delete_user` | `delete_user` | – |
| Modifica profilo utente | `edit_user` | `edit_user` | `edit_user` 🔑 |
| Visualizza profilo utente | `view_user` | `view_user` | `view_user` 🔑 |
| Visualizza lista utenti | `view_user_list` | `view_user_list` | – |
| Assegna ruolo a profilo utente | `assign_role` | `assign_role` | – |
| Cambia ruolo a profilo utente | `update_role` | `update_role` | – |
| Assegna permessi extra a profilo utente | `assign_extra_permit` | `assign_extra_permit` | – |
| Crea ruolo custom e assegna permessi (?) | `create_role` | `create_role` | – |
| **Gestione Tenant/Acquirenti** | – | – | – |
| Crea Tenant | `create_tenant` | – | – |
| Elimina Tenant | `delete_tenant` | – | – |
| Modifica Tenant | `edit_tenant` | `edit_tenant` 🔑 | – |
| Visualizza Tenant | `view_tenant` | `view_tenant` 🔑 | – |
| Visualizza Lista Tenant | `view_tenant_list` | – | – |
