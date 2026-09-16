# Cómo ejecutar GridBot en Canva Affinity (v3.3+)

Este documento explica cómo utilizar `GridBot.js` en **Affinity Designer**, **Affinity Photo** y **Affinity Publisher** (v3.3+) en macOS y Windows.

---

## Requisitos previos

1. **Versión:** Canva Affinity Suite (Designer, Photo o Publisher) **v3.3 o superior**.
2. **Iniciar sesión:** Debes estar autenticado con tu cuenta de Affinity / Canva.  
   *(Sin sesión activa, el menú Scripting no está disponible.)*
3. **Documento abierto:** Tener un documento activo en Affinity antes de ejecutar el script.

---

## Cómo ejecutar el script

1. Abre tu documento en **Affinity Designer**, **Photo** o **Publisher**.
2. Ve al menú:
   - **Inglés:** `Window > Scripting > Script Editor`
   - **Español:** `Ventana > Scripting > Script Editor`
3. En el panel **Script Editor**, haz clic en **New Script**.
4. **Pega el contenido completo** de [`affinity/GridBot.js`](GridBot.js) en el área de texto.
5. Haz clic en **Run** (o `Cmd + Enter` en macOS / `Ctrl + Enter` en Windows).
6. Aparecerá el diálogo de GridBot con los parámetros configurables.

---

## Guardar en la Scripts Library (para reutilizar)

Para no tener que pegar el código cada vez, guarda GridBot en la librería:

1. Con el código pegado en el Script Editor, haz clic en **Save As...** e ingresa el nombre `GridBot`.
2. El script aparecerá en la sección **Default** de `Window > Scripting > Scripts Library`.
3. A partir de ese momento puedes ejecutarlo con un solo clic desde la librería.

> **Alternativa:** En la Scripts Library, haz clic en **≡** junto a **Default** → **Import Script...** y selecciona el archivo `affinity/GridBot.js` directamente.

---

## Configuración de Scripting (`Settings > Scripting`)

Abre las Preferencias (`Cmd + ,` en macOS / `Ctrl + ,` en Windows) y ve a la sección **Scripting**.

Desde aquí puedes controlar qué permisos tienen los scripts:

| Opción | Descripción |
|---|---|
| **Access networks** | Permite que los scripts accedan a internet |
| **Use Canva AI Studio features** | Acceso a herramientas de IA de Canva desde scripts |
| **Allow code generation from strings** | Permite `eval()` y generación dinámica de código |
| **File System access** | Carpetas a las que los scripts pueden leer/escribir. Usa **Add** para agregar una carpeta |

> GridBot **no requiere** ninguno de estos permisos — funciona sin conexión a red ni acceso al sistema de archivos.

---

## Opciones del diálogo

| Campo | Descripción |
|---|---|
| **Columnas / Filas** | Define la retícula base de subdivisión |
| **Rectángulos** | Número de formas a generar |
| **Grosor trazo** | Ancho del borde en puntos (pt) |
| **Aplicar a todas las páginas** | Genera la retícula en cada página/spread del documento |
| **Facing pages** | Activar si el documento tiene todos los spreads de 2 páginas sin cubierta individual |
| **Randomize** | Genera una nueva variación aleatoria manteniendo los mismos parámetros |

---

## Valores por defecto

Puedes cambiar los valores iniciales editando `DEFAULT_CONFIG` al inicio de `GridBot.js`:

```javascript
const DEFAULT_CONFIG = {
  cols:        5,      // Columnas iniciales
  rows:        7,      // Filas iniciales
  count:       10,     // Rectángulos a generar
  strokeWidth: 0.35,   // Grosor del trazo en pt
  applyAll:    false,  // Aplicar a todas las páginas
  facingPages: false   // Override para spreads todos-facing
};
```

---

## Notas

- **Multi-página / Facing pages:** GridBot detecta automáticamente el ancho de una página individual usando el spread más estrecho del documento como referencia.
- **Sin relleno:** Los rectángulos se generan solo con trazo, listos para usar como retícula editorial o de composición.
- **Deshacer:** Cada ejecución es un comando independiente; puedes deshacerla con `Cmd + Z`.
