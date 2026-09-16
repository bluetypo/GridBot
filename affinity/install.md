# Cómo instalar y ejecutar GridBot en Canva Affinity (v3.3+)

Este documento detalla las opciones para utilizar el script `GridBot.js` en **Affinity Designer**, **Affinity Photo** y **Affinity Publisher** (versiones 3.2, 3.3 y superiores) en **macOS** y **Windows**.

---

## Requisitos previos y Configuración

1. **Versión de la aplicación:** Canva Affinity Suite (Designer, Photo o Publisher) versión **3.2 o superior**.
2. **Iniciar sesión:** Debes haber iniciado sesión con tu cuenta de Affinity / Canva (icono de perfil en la esquina superior derecha o en el menú de la aplicación).
3. **Activar Scripting en Preferencias:**
   - Ve a **Settings / Preferencias** (`Cmd + ,` en macOS o `Ctrl + ,` en Windows).
   - Ve a la sección **Scripting**.
   - Activa la casilla **"Enable Affinity Scripting"**.
4. **Documento:** Tener un documento abierto (con o sin mesa de trabajo / *artboard*).

---

## Método 1: Ejecución desde el Script Editor nativo

1. Abre tu documento en **Affinity Designer** (o Photo/Publisher).
2. Ve al menú superior:
   - **Inglés:** `Window > Scripting > Script Editor`
   - **Español:** `Ventana > Scripting > Script Editor`
3. Abre el archivo [`affinity/GridBot.js`](GridBot.js) en tu editor de texto o visor, **copia todo su contenido** y **pégalo** directamente en el área de texto del **Script Editor**.
4. Haz clic en el botón **Run / Ejecutar** (o presiona el atajo `Cmd + Enter` en macOS / `Ctrl + Enter` en Windows).
5. La retícula se generará instantáneamente en tu mesa de trabajo o capa activa.

---

## Método 2: Uso con Affinity Script Manager (Recomendado)

Si utilizas la herramienta comunitaria **Affinity Script Manager**:

1. Abre **Affinity Script Manager**.
2. Haz clic en **Import / Add Script**.
3. Selecciona `affinity/GridBot.js`.
4. Ejecuta el script con un solo clic o asígnale un atajo de teclado personalizado dentro del gestor.

---

## Parámetros de Personalización

Puedes editar los valores iniciales directamente en el encabezado de `affinity/GridBot.js`:

```javascript
const DEFAULT_CONFIG = {
    cols: 3,             // Número de columnas iniciales
    rows: 3,             // Número de filas iniciales
    count: 50,           // Cantidad de rectángulos a generar
    strokeWidth: 0.35,   // Grosor del trazo en puntos (pt)
    strokeColor: { r: 0, g: 0, b: 0, a: 255 }, // Color del trazo (Negro RGBA)
    applyAll: false      // Aplicar a todas las páginas / mesas por defecto (true / false)
};
```

---

## Consejos de Uso

- **Mesas de trabajo (Artboards):** GridBot detecta automáticamente las dimensiones de tu mesa de trabajo o del lienzo global para ajustar las proporciones del reticulado.
- **Variaciones infinitas:** Cada ejecución genera una disposición matemática única. Puedes ejecutarlo varias veces para superponer capas o explorar nuevas composiciones.
