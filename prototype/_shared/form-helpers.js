// ─────────────────────────────────────────────────────────────
// GravityFormHelpers — helper di campo condivisi per i drawer di form
//
// Piccoli renderer stateless per i campi dei drawer (Nuovo Impianto,
// Facce, Cespiti/Dispositivi, Squadre): un'unica implementazione invece
// di una copia locale identica in ogni drawer.
//
// Uso:
//   <script src="../_shared/form-helpers.js"></script>
//   const { cs, num, sel, inp, dp, tagsInput, gapRow } = window.GravityFormHelpers;
//
// cs(label, required, children)      — wrapper campo con etichetta (+ * se obbligatorio)
// num(val, set, props)                — InputNumber collegato a value/onChange
// sel(val, set, opts, ph, props)      — Select collegato a value/onChange
// inp(val, set, ph, extra)            — Input collegato a value/onChange
// dp(val, set)                        — DatePicker (formato DD/MM/YYYY)
// tagsInput(val, set, ph)             — Select mode="tags" per input multi-valore
// gapRow(...campi)                    — riga flex con gap 16px tra i campi
// ─────────────────────────────────────────────────────────────
(function () {
  'use strict';

  function cs(label, required, children) {
    return React.createElement('div', { className: 'ni-field' },
      React.createElement('div', { className: 'ni-label' },
        label, required && React.createElement('span', { className: 'req' }, ' *'),
      ),
      children);
  }
  function num(val, set, props = {}) {
    return React.createElement(antd.InputNumber, { value: val, onChange: set, style: { width: '100%' }, placeholder: '—', ...props });
  }
  function sel(val, set, opts, ph = 'Seleziona', props = {}) {
    return React.createElement(antd.Select, { value: val, onChange: set, options: opts, style: { width: '100%' }, placeholder: ph, allowClear: true, ...props });
  }
  function inp(val, set, ph = '—', extra = {}) {
    return React.createElement(antd.Input, { value: val, onChange: e => set(e.target.value), style: { width: '100%' }, placeholder: ph, ...extra });
  }
  function dp(val, set) {
    return React.createElement(antd.DatePicker, { value: val, onChange: set, style: { width: '100%' }, placeholder: 'Seleziona data', format: 'DD/MM/YYYY' });
  }
  function tagsInput(val, set, ph = 'Aggiungi e premi Invio') {
    return React.createElement(antd.Select, { mode: 'tags', value: val || [], onChange: set, style: { width: '100%' }, placeholder: ph, open: false, suffixIcon: null, tokenSeparators: [','] });
  }
  function gapRow(...f) {
    return React.createElement('div', { style: { display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 16 } }, ...f);
  }

  window.GravityFormHelpers = { cs, num, sel, inp, dp, tagsInput, gapRow };
})();
