//@target illustrator
app.preferences.setBooleanPreference('ShowExternalJSXWarning', false);

function main() {
  var SCRIPT = {
    name: 'GridBot',
    version: 'v0.2.1'
  };

  var CFG = {
    cols: 3,
    rows: 3,
    count: 50,
    cellRange: 12,
    strokeW: 0.35,
    aiVers: parseFloat(app.version),
    isMac: /mac/i.test($.os),
    mgns: [10, 15, 10, 7]
  };

  var SETTINGS = {
    name: SCRIPT.name + '_data.json',
    folder: Folder.myDocuments + '/Adobe Scripts/'
  };

  if (!/illustrator/i.test(app.name)) {
    alert('Wrong application\nRun script from Adobe Illustrator', 'Script error');
    return;
  }

  if (!app.documents.length) {
    alert('No documents\nOpen a document and try again', 'Script error');
    return;
  }

  var doc = app.activeDocument;

  var black = new RGBColor();
  black.red = 0;
  black.green = 0;
  black.blue = 0;

  var lastLayer = null;

  var win = new Window('dialog', 'GridBot - Bluetypo');
      win.alignChildren = ['fill', 'top'];

  var settPnl = win.add('panel', undefined, 'Composición');
      settPnl.alignChildren = ['fill', 'top'];
      settPnl.margins = CFG.mgns;

  var wrapper1 = settPnl.add('group');
      wrapper1.alignChildren = ['left', 'center'];
  var colsLbl = wrapper1.add('statictext', undefined, 'Columnas:');
      colsLbl.preferredSize.width = 90;
  var colsInp = wrapper1.add('edittext', undefined, CFG.cols);
      colsInp.preferredSize.width = 60;
      colsInp.helpTip = 'Número de columnas de la grilla (igual a "cols" en el sketch original)';
  if (CFG.isMac || CFG.aiVers >= 26.4 || CFG.aiVers <= 17) {
    colsInp.active = true;
  }

  var wrapperRows = settPnl.add('group');
      wrapperRows.alignChildren = ['left', 'center'];
  var rowsLbl = wrapperRows.add('statictext', undefined, 'Filas:');
      rowsLbl.preferredSize.width = 90;
  var rowsInp = wrapperRows.add('edittext', undefined, CFG.rows);
      rowsInp.preferredSize.width = 60;
      rowsInp.helpTip = 'Número de filas de la grilla (junto con Columnas define la retícula)';

  var wrapper2 = settPnl.add('group');
      wrapper2.alignChildren = ['left', 'center'];
  var countLbl = wrapper2.add('statictext', undefined, 'Rectángulos:');
      countLbl.preferredSize.width = 90;
  var countInp = wrapper2.add('edittext', undefined, CFG.count);
      countInp.preferredSize.width = 60;
      countInp.helpTip = 'Cantidad de rectángulos por generación';

  var wrapper3 = settPnl.add('group');
      wrapper3.alignChildren = ['left', 'center'];
  var swLbl = wrapper3.add('statictext', undefined, 'Grosor trazo:');
      swLbl.preferredSize.width = 90;
  var swInp = wrapper3.add('edittext', undefined, CFG.strokeW + ' pt');
      swInp.preferredSize.width = 60;
      swInp.helpTip = 'Grosor del trazo en puntos (sin relleno, estilo boceto)';

  var info = win.add('statictext', undefined,
    '"Generar nueva" crea una capa; "Randomize" varía la composición en esa misma capa.',
    { multiline: true });
  info.preferredSize.width = 300;

  var randomizeBtn = win.add('button', undefined, 'Randomize');
      randomizeBtn.helpTip = 'Genera una nueva variación con los mismos valores del panel';

  var applyAllChk = win.add('checkbox', undefined, 'Aplicar a todas las mesas de trabajo');
      applyAllChk.helpTip = 'Genera una composición independiente en cada mesa de trabajo del documento';

  var btns = win.add('group');
      btns.alignChildren = ['fill', 'center'];
      btns.spacing = 10;

  var close, gen;
  if (CFG.isMac) {
    close = btns.add('button', undefined, 'Cerrar', { name: 'cancel' });
    gen = btns.add('button', undefined, 'Generar nueva', { name: 'ok' });
  } else {
    gen = btns.add('button', undefined, 'Generar nueva', { name: 'ok' });
    close = btns.add('button', undefined, 'Cerrar', { name: 'cancel' });
  }

  close.helpTip = 'Press Esc to Close';
  gen.helpTip = 'Crea una capa nueva con una composición nueva';

  loadSettings(SETTINGS);

  close.onClick = win.close;
  gen.onClick = function () { runGeneration(false); };
  randomizeBtn.onClick = function () { runGeneration(true); };

  win.onClose = function () {
    saveSettings(SETTINGS);
  };

  function getTargetArtboards() {
    if (applyAllChk.value) {
      var all = [];
      for (var i = 0; i < doc.artboards.length; i++) {
        all.push(doc.artboards[i]);
      }
      return all;
    }
    return [doc.artboards[doc.artboards.getActiveArtboardIndex()]];
  }

  function clearLayer(layer) {
    for (var i = layer.pageItems.length - 1; i >= 0; i--) {
      layer.pageItems[i].remove();
    }
  }

  function newLayerForGeneration() {
    var layer = doc.layers.add();
    layer.name = getNextLayerName(doc, SCRIPT.name);
    lastLayer = layer;
    return layer;
  }

  function ensureWorkingLayer() {
    if (lastLayer) {
      try {
        lastLayer.name;
        clearLayer(lastLayer);
        return lastLayer;
      } catch (err) {
        lastLayer = null;
      }
    }
    return newLayerForGeneration();
  }

  function generateForArtboard(layer, ab, cols, rows, count, strokeW) {
    var abRect = ab.artboardRect;

    var abLeft = abRect[0];
    var abTop = abRect[1];
    var abRight = abRect[2];
    var abBottom = abRect[3];

    var canvasW = Math.abs(abRight - abLeft);
    var canvasH = Math.abs(abTop - abBottom);

    var gridX = canvasW / cols;
    var gridY = canvasH / rows;

    for (var i = 0; i < count; i++) {

      var startCol = randInt(cols);
      var startRow = randInt(rows);

      var maxWCells = cols - startCol;
      var maxHCells = rows - startRow;

      var wCells = randInt(maxWCells) + 1;
      var hCells = randInt(maxHCells) + 1;

      var rectW = wCells * gridX;
      var rectH = hCells * gridY;

      var left = abLeft + (startCol * gridX);
      var top = abTop - (startRow * gridY);

      if (left < abLeft) left = abLeft;
      if (left + rectW > abRight) rectW = abRight - left;

      var bottom = top - rectH;
      if (bottom < abBottom) {
        rectH = top - abBottom;
      }

      rectW = Math.max(rectW, 0.01);
      rectH = Math.max(rectH, 0.01);

      var rect = layer.pathItems.rectangle(
        top,
        left,
        rectW,
        rectH
      );

      rect.filled = false;
      rect.stroked = true;
      rect.strokeColor = black;
      rect.strokeWidth = strokeW;
    }
  }

  function runGeneration(isRandomize) {
    var cols = strToInt(colsInp.text, CFG.cols, 1);
    var rows = strToInt(rowsInp.text, CFG.rows, 1);
    var count = strToInt(countInp.text, CFG.count, 1);
    var strokeW = strToFloat(swInp.text, CFG.strokeW, 0.01);

    colsInp.text = cols;
    rowsInp.text = rows;
    countInp.text = count;
    swInp.text = strokeW + ' pt';

    saveSettings(SETTINGS);

    var targets = getTargetArtboards();
    var layer = isRandomize ? ensureWorkingLayer() : newLayerForGeneration();

    for (var t = 0; t < targets.length; t++) {
      generateForArtboard(layer, targets[t], cols, rows, count, strokeW);
    }

    doc.activeLayer = layer;
    app.redraw();
  }

  function saveSettings(prefs) {
    try {
      if (!Folder(prefs.folder).exists) {
        Folder(prefs.folder).create();
      }

      var f = new File(prefs.folder + prefs.name);
      f.encoding = 'UTF-8';
      f.open('w');

      var data = {};
      data.win_x = win.location.x;
      data.win_y = win.location.y;
      data.cols = colsInp.text;
      data.rows = rowsInp.text;
      data.count = countInp.text;
      data.strokeW = swInp.text;
      data.applyAll = applyAllChk.value;

      f.write(stringify(data));
      f.close();
    } catch (err) {
      return;
    }
  }

  function loadSettings(prefs) {
    var f = File(prefs.folder + prefs.name);
    if (!f.exists) return;

    try {
      f.encoding = 'UTF-8';
      f.open('r');
      var json = f.readln();
      try { var data = new Function('return (' + json + ')')(); }
      catch (err) { return; }
      f.close();

      if (typeof data != 'undefined') {
        win.location = [
          data.win_x ? parseInt(data.win_x) : win.location.x,
          data.win_y ? parseInt(data.win_y) : win.location.y
        ];
        if (data.cols) colsInp.text = data.cols;
        if (data.rows) rowsInp.text = data.rows;
        if (data.count) countInp.text = data.count;
        if (data.strokeW) swInp.text = data.strokeW;
        if (typeof data.applyAll !== 'undefined') {
          applyAllChk.value = (data.applyAll === 'true');
        }
      }
    } catch (err) {
      return;
    }
  }

  win.show();
}

function randInt(maxExclusive) {
  return Math.floor(Math.random() * maxExclusive);
}

function clamp(val, lo, hi) {
  if (val < lo) return lo;
  if (val > hi) return hi;
  return val;
}

function strToInt(str, def, min) {
  var n = parseInt(str, 10);
  if (isNaN(n)) n = def;
  if (min !== undefined && n < min) n = min;
  return n;
}

function strToFloat(str, def, min) {
  var n = parseFloat(str);
  if (isNaN(n)) n = def;
  if (min !== undefined && n < min) n = min;
  return n;
}

function getNextLayerName(doc, base) {
  var maxN = 0;
  var re = new RegExp('^' + base + ' (\\d+)$');
  for (var i = 0; i < doc.layers.length; i++) {
    var m = doc.layers[i].name.match(re);
    if (m) {
      var n = parseInt(m[1], 10);
      if (n > maxN) maxN = n;
    }
  }
  var next = (maxN + 1).toString();
  while (next.length < 2) next = '0' + next;
  return base + ' ' + next;
}

function stringify(obj) {
  var json = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key].toString();
      value = value
        .replace(/\t/g, "\t")
        .replace(/\r/g, "\r")
        .replace(/\n/g, "\n")
        .replace(/"/g, '\"');
      json.push('"' + key + '":"' + value + '"');
    }
  }
  return "{" + json.join(",") + "}";
}

try {
  main();
} catch (err) {}
