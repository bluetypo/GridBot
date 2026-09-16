/**
 * GridBot for Canva Affinity (v3.3+)
 * Developed by Manuel Guerrero (Bluetypo)
 *
 * Genera retículas dinámicas en Affinity Publisher / Designer / Photo.
 * Soporta documentos de una página, multi-página y facing pages.
 */

'use strict';

// =============================================================================
// VALORES POR DEFECTO
// =============================================================================
const DEFAULT_CONFIG = {
  cols:        5,
  rows:        7,
  count:       10,
  strokeWidth: 0.35,
  strokeColor: { r: 0, g: 0, b: 0, a: 255 },
  applyAll:    false,
  facingPages: false  // Override: forzar 2 páginas por spread cuando todos son facing
};

const { Document }                           = require('/document.js');
const { Dialog, DialogResult }               = require('/dialog.js');
const { AddChildNodesCommandBuilder,
        CompoundCommandBuilder }             = require('/commands.js');
const { Rectangle }                          = require('/geometry.js');
const { ShapeNodeDefinition, NodeChildType } = require('/nodes.js');
const { ShapeRectangle }                     = require('/shapes.js');
const { LineStyleDescriptor }                = require('/linestyle.js');
const { FillDescriptor }                     = require('/fills.js');
const { RGBA8 }                              = require('/colours.js');
const { UnitType }                           = require('/units.js');

// =============================================================================
// Utilidades
// =============================================================================

function isOk(result) {
  return (result?.value ?? result) === DialogResult.Ok.value;
}

function splitmix32(a) {
  return function () {
    a |= 0; a = a + 0x9e3779b9 | 0;
    let t = a ^ a >>> 16; t = Math.imul(t, 0x21f0aaad);
    t = t ^ t >>> 15;     t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
  };
}

// =============================================================================
// getAllTargets
// =============================================================================

/**
 * Devuelve una lista de targets, uno por PÁGINA individual.
 *
 * CORRECCIÓN CRÍTICA: doc.spreads.count === undefined en Affinity 3.3.
 * Se usa spreadsArr.length en su lugar (toArray() sí funciona).
 *
 * pageWidth = min(spread widths)
 *   - Spreads de cubierta/contraportada:  w = 1×pageW  → numPages = 1
 *   - Spreads facing interior:            w = 2×pageW  → numPages = 2
 *   → El mínimo siempre es 1×pageW en cualquier layout estándar.
 *
 * Override facingPages = true: cuando TODOS los spreads son facing (sin cubierta),
 *   el mínimo sería 2×pageW. El usuario activa el switch para forzar pageW = spreadW/2.
 *
 * insertionTarget: siempre el Spread (la API rechaza Page como target).
 * xOffset: posición X de la página dentro del spread.
 *   Pág. izq. → xOffset = 0
 *   Pág. der. → xOffset = pageW
 */
function getAllTargets(doc, forceFacing) {
  const targets = [];

  // ── Publisher / multi-página ─────────────────────────────────────────────
  // IMPORTANTE: doc.spreads.count === undefined en v3.3 → usar .toArray().length
  let spreadsArr = [];
  try { spreadsArr = doc.spreads ? doc.spreads.toArray() : []; } catch (_) { }

  if (spreadsArr.length > 0) {
    // Paso 1: obtener dimensiones de cada spread
    const spreadData = [];
    for (const sp of spreadsArr) {
      try {
        const b = sp.getSpreadBaseBox(false);
        if (b && b.width > 0 && b.height > 0) {
          spreadData.push({ sp, w: b.width, h: b.height });
        }
      } catch (_) { }
    }

    if (spreadData.length > 0) {
      // Paso 2: determinar el ancho de una sola página
      let pageW;
      if (forceFacing) {
        // Override manual: todos los spreads tienen 2 páginas
        pageW = spreadData[0].w / 2;
      } else {
        // Heurístico: el spread más estrecho = 1 página
        pageW = Math.min(...spreadData.map(s => s.w));
      }

      // Paso 3: crear targets (una entrada por página)
      for (const { sp, w, h } of spreadData) {
        const numPages = Math.max(1, Math.round(w / pageW));
        for (let i = 0; i < numPages; i++) {
          targets.push({
            insertionTarget: sp,
            xOffset: i * pageW,
            width:   pageW,
            height:  h,
            name:    'Página ' + (targets.length + 1)
          });
        }
      }
    }
  }

  // ── Designer con artboards ───────────────────────────────────────────────
  if (targets.length === 0 && doc.hasArtboards) {
    try {
      for (const ab of doc.artboards.toArray()) {
        try {
          const b = ab.artboardInterface?.baseBox || ab.baseBox;
          if (b && b.width > 0) {
            targets.push({
              insertionTarget: ab,
              xOffset: 0,
              width:   b.width,
              height:  b.height,
              name:    ab.name || ('Mesa ' + (targets.length + 1))
            });
          }
        } catch (_) { }
      }
    } catch (_) { }
  }

  // ── Lienzo único (fallback) ──────────────────────────────────────────────
  if (targets.length === 0) {
    let w = 600, h = 900;
    try {
      if (doc.sizePixels?.width > 0) { w = doc.sizePixels.width; h = doc.sizePixels.height; }
      else if (doc.widthPixels > 0)  { w = doc.widthPixels;      h = doc.heightPixels; }
    } catch (_) { }
    targets.push({ insertionTarget: null, xOffset: 0, width: w, height: h, name: 'Lienzo' });
  }

  return targets;
}

// =============================================================================
// Generación de la retícula
// =============================================================================

function createGridCommand(doc, opts) {
  const allTargets = getAllTargets(doc, opts.facingPages);
  const targets    = opts.applyAll ? allTargets : [allTargets[0]];

  const compoundBuilder = CompoundCommandBuilder.create();
  const lineStyle = LineStyleDescriptor.createDefault(opts.strokeWidth);
  const sc        = DEFAULT_CONFIG.strokeColor;
  const lineFill  = FillDescriptor.createSolid(RGBA8(sc.r, sc.g, sc.b, sc.a));

  targets.forEach((target, ti) => {
    const { insertionTarget, xOffset, width, height } = target;
    if (width <= 0 || height <= 0) return;

    const cellW = width  / opts.cols;
    const cellH = height / opts.rows;
    const prng  = splitmix32(opts.seed + ti * 997);
    const rInt  = (max) => Math.floor(prng() * max);

    const builder = AddChildNodesCommandBuilder.create();
    if (insertionTarget) {
      try { builder.setInsertionTarget(insertionTarget); } catch (_) { }
    }

    for (let i = 0; i < opts.count; i++) {
      const sc2 = rInt(opts.cols);
      const sr  = rInt(opts.rows);
      const wc  = rInt(opts.cols - sc2) + 1;
      const hc  = rInt(opts.rows - sr)  + 1;

      // Coordenadas locales (confinadas al borde de la página)
      const lx = sc2 * cellW;
      const ly = sr  * cellH;
      const lw = Math.min(wc * cellW, width  - lx);
      const lh = Math.min(hc * cellH, height - ly);

      if (lw <= 0.001 || lh <= 0.001) continue;

      // Coordenadas absolutas en el spread (xOffset = posición de esta página)
      const def = ShapeNodeDefinition.createDefault();
      def.shape = ShapeRectangle.create();
      def.setBoundingRectangle(new Rectangle(xOffset + lx, ly, lw, lh));

      try { def.removeBrushFillDescriptor(0); } catch (_) { }
      try {
        def.setLineDescriptors(0, lineFill, lineStyle);
      } catch (_) {
        try { def.addLineDescriptors(lineFill, lineStyle); } catch (_) { }
      }

      builder.addNode(def);
    }

    compoundBuilder.addCommand(builder.createCommand(false, NodeChildType.Main));
  });

  return compoundBuilder.createCommand();
}

// =============================================================================
// Interfaz de usuario
// =============================================================================

function buildDialog(allTargets) {
  const dlg = Dialog.create('GridBot — Bluetypo');
  const col  = dlg.addColumn();

  const infoGroup = col.addGroup('Documento');
  const first  = allTargets[0];
  const pgCount = allTargets.length;
  const label  = Math.round(first.width) + ' × ' + Math.round(first.height) + ' px' +
                 (pgCount > 1 ? '  (' + pgCount + ' páginas)' : '');
  infoGroup.addStaticText('Página detectada', label);

  const compGroup = col.addGroup('Composición');
  dlg.cols    = compGroup.addUnitValueEditor('Columnas',          UnitType.Number, UnitType.Number, DEFAULT_CONFIG.cols,        1,    100).setPrecision(0);
  dlg.rows    = compGroup.addUnitValueEditor('Filas',             UnitType.Number, UnitType.Number, DEFAULT_CONFIG.rows,        1,    100).setPrecision(0);
  dlg.count   = compGroup.addUnitValueEditor('Rectángulos',       UnitType.Number, UnitType.Number, DEFAULT_CONFIG.count,       1,    500).setPrecision(0);
  dlg.strokeW = compGroup.addUnitValueEditor('Grosor trazo (pt)', UnitType.Number, UnitType.Number, DEFAULT_CONFIG.strokeWidth, 0.01,  50).setPrecision(2);

  const optsGroup  = col.addGroup('Opciones');
  dlg.applyAll    = optsGroup.addSwitch('Aplicar a todas las páginas', DEFAULT_CONFIG.applyAll);
  dlg.facingPages = optsGroup.addSwitch('Facing pages (todos los spreads tienen 2 páginas)', DEFAULT_CONFIG.facingPages);

  dlg.seed         = Math.floor(Math.random() * 1000000) + 1;
  dlg.randomizeBtn = col.addGroup('').addButton('Randomize').setIsFullWidth();

  return dlg;
}

// =============================================================================
// Punto de entrada
// =============================================================================

function main() {
  const doc = Document.current;
  if (!doc) { alert('GridBot requiere un documento abierto en Affinity.'); return; }

  const allTargets = getAllTargets(doc, DEFAULT_CONFIG.facingPages);
  const dlg        = buildDialog(allTargets);

  const getOpts = () => ({
    seed:        dlg.seed,
    cols:        Math.max(1, Math.round(dlg.cols.value)),
    rows:        Math.max(1, Math.round(dlg.rows.value)),
    count:       Math.max(1, Math.round(dlg.count.value)),
    strokeWidth: Math.max(0.01, dlg.strokeW.value),
    applyAll:    dlg.applyAll.value,
    facingPages: dlg.facingPages.value
  });

  const update = (preview) => {
    const cmd = createGridCommand(doc, getOpts());
    if (cmd) { doc.executeCommand(cmd, preview); return true; }
    doc.clearPreviews();
    return false;
  };

  dlg.randomizeBtn.onClickHandler  = () => { dlg.seed = Math.floor(Math.random() * 1000000) + 1; update(true); };
  dlg.onControlValueChangedHandler = () => update(true);
  update(true);

  while (isOk(dlg.runModal())) {
    if (update(false)) break;
  }
  doc.clearPreviews();
}

module.exports.main = main;
main();
