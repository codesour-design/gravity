/**
 * Gravity Page Header — header condiviso per le viste Dettaglio
 * ================================================================
 * Header a card unica (back link + titolo/entità/tag + metadati inline +
 * azioni) per qualsiasi schermata Detail View (LAYOUT.md §3.4). Nato in
 * prototype/negotiations (TrattativaDetailView, ConfiguratoreView) e
 * duplicato identico in prototype/campaign-delivery (CampagnaDettaglioView)
 * prima di essere centralizzato qui — non ricreare, non duplicare di nuovo.
 *
 * Utilizzo:
 *   <script src="../_shared/page-header.js"></script>
 *
 *   React.createElement(window.GravityPageHeader, {
 *     backLabel: 'Lista Trattative',   // testo del link indietro (default 'Indietro')
 *     onBack:    () => ...,            // se assente, il link indietro non compare
 *     title:     'Trattativa Nike',    // titolo principale
 *     entityName: 'Nike Italia',       // opzionale — nome secondario dopo un separatore "|"
 *     tag:        React.createElement(Tag, ...), // opzionale — badge/tag accanto al titolo
 *     meta: [                          // opzionale — riga "label: valore · label: valore"
 *       { label: 'Inserzionista', value: 'Nike Italia' },
 *       { label: 'Stato', value: <node o string> },
 *     ],
 *     actions: [ <Button/>, <Button/> ], // opzionale — pulsanti allineati a destra
 *   })
 *
 * Richiede React, antd, @ant-design/icons (globals) e tokens.js (CSS variables
 * --gravity-*). Non richiede alcun wrapper esterno: include già il proprio
 * contenitore a card (stessa ricetta della header-card di lista, vedi
 * components/list-table.md §2).
 *
 * Spec completa (props, layout, differenze da altri pattern header) →
 * components/page-header.md.
 */
(function () {
  'use strict';

  if (window.GravityPageHeader) return;

  var h = React.createElement;
  var Fragment = React.Fragment;

  function GravityPageHeader(props) {
    var backLabel = props.backLabel;
    var onBack = props.onBack;
    var title = props.title;
    var entityName = props.entityName;
    var tag = props.tag;
    var meta = props.meta || [];
    var actions = props.actions || [];
    var Button = window.antd.Button;
    var Title = window.antd.Typography.Title;
    var ArrowLeftOutlined = window.icons.ArrowLeftOutlined;

    var metaItems = meta.reduce(function (acc, item, i) {
      if (i > 0) {
        acc.push(h('span', { key: 'sep' + i, style: { color: 'var(--gravity-text-disabled)', margin: '0 2px' } }, '·'));
      }
      acc.push(h('div', { key: 'm' + i, style: { display: 'inline-flex', alignItems: 'center', gap: 5 } },
        h('span', { style: { fontSize: 13, color: 'var(--gravity-text-tertiary)' } }, item.label + ':'),
        typeof item.value === 'string'
          ? h('span', { style: { fontSize: 13, color: 'var(--gravity-text)' } }, item.value)
          : item.value
      ));
      return acc;
    }, []);

    return h('div', {
      style: {
        background: 'var(--gravity-bg-container)',
        borderRadius: 'var(--gravity-radius-lg)',
        padding: '16px 20px',
        border: '1px solid var(--gravity-split)',
        marginBottom: 20,
      },
    },
      onBack && h(Button, {
        type: 'link',
        icon: h(ArrowLeftOutlined),
        onClick: onBack,
        style: { padding: 0, marginBottom: 8, fontSize: 13, color: 'var(--gravity-primary)', height: 'auto', display: 'block' },
      }, backLabel || 'Indietro'),

      h('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 } },
        h('div', { style: { minWidth: 0, flex: 1 } },
          h('div', { style: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: metaItems.length ? 6 : 0 } },
            h(Title, { level: 4, style: { margin: 0 } }, title),
            entityName && h(Fragment, null,
              h('span', { style: { color: 'var(--gravity-text-disabled)', fontWeight: 200, fontSize: 22, lineHeight: 1 } }, '|'),
              h('span', { style: { fontSize: 15, color: 'var(--gravity-text-secondary)', fontWeight: 400 } }, entityName)
            ),
            tag
          ),
          metaItems.length > 0 && h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px 8px' } }, metaItems)
        ),
        actions.length > 0 && h('div', { style: { display: 'flex', gap: 8, flexShrink: 0, alignItems: 'flex-start', paddingTop: 2 } }, actions)
      )
    );
  }

  window.GravityPageHeader = GravityPageHeader;
}());
