# Cómo instalar y ejecutar GridBot en Adobe Illustrator

Este documento detalla las opciones para utilizar el script `GridBot.jsx` en **macOS** y **Windows**.

---

## 🚀 Método 1: Ejecución Rápida (Sin instalación)

Si solo deseas probar el script o usarlo ocasionalmente sin necesidad de reiniciar Illustrator:

1. Abre tu documento en **Adobe Illustrator**.
2. Presiona el atajo de teclado:
   - **macOS:** `Cmd + F12`
   - **Windows:** `Ctrl + F12`
3. O ve al menú superior:
   - **Español:** `Archivo > Secuencias de comandos > Otra secuencia de comandos...`
   - **Inglés:** `File > Scripts > Other Script...`
4. Navega hasta la carpeta donde descargaste este repositorio y selecciona `GridBot.jsx`.

---

## 📌 Método 2: Instalación Permanente (En el menú de Illustrator)

Al instalarlo de forma permanente, **GridBot** aparecerá directamente en el menú de scripts de Illustrator cada vez que abras el programa.

### 🍏 En macOS

1. Cierra **Adobe Illustrator** si lo tienes abierto.
2. Copia el archivo `GridBot.jsx`.
3. Abre el **Finder** y dirígete a la siguiente ruta (sustituyendo `[Versión]` y `[Idioma]` según tu instalación):
   ```text
   /Applications/Adobe Illustrator [Versión]/Presets.localized/[Idioma]/Scripts/
   ```
   *Ejemplo habitual en español:*  
   `/Applications/Adobe Illustrator 2024/Presets.localized/es_ES/Scripts/`  
   *Ejemplo habitual en inglés:*  
   `/Applications/Adobe Illustrator 2024/Presets.localized/en_US/Scripts/`
4. Pega `GridBot.jsx` dentro de esa carpeta `Scripts`.
5. Abre Illustrator. Ahora lo encontrarás en:  
   `Archivo > Secuencias de comandos > GridBot`

---

### 🪟 En Windows

1. Cierra **Adobe Illustrator** si lo tienes abierto.
2. Copia el archivo `GridBot.jsx`.
3. Abre el **Explorador de archivos** y dirígete a la siguiente ruta (sustituyendo `[Versión]` y `[Idioma]` según tu instalación):
   ```text
   C:\Program Files\Adobe\Adobe Illustrator [Versión]\Presets\[Idioma]\Scripts\
   ```
   *Ejemplo habitual en español:*  
   `C:\Program Files\Adobe\Adobe Illustrator 2024\Presets\es_ES\Scripts\`  
   *Ejemplo habitual en inglés:*  
   `C:\Program Files\Adobe\Adobe Illustrator 2024\Presets\en_US\Scripts\`
4. Pega `GridBot.jsx` en la carpeta `Scripts` (si Windows te solicita permisos de administrador, haz clic en **Continuar**).
5. Abre Illustrator. Ahora lo encontrarás en:  
   `Archivo > Secuencias de comandos > GridBot`

---

## 💡 Consejos de Uso

- **Documento activo:** Asegúrate de tener un documento con al menos una mesa de trabajo (*artboard*) abierta antes de lanzar el script.
- **Capas:** El script generará los elementos vectoriales en la mesa de trabajo activa. Puedes organizar la retícula en una capa dedicada para manipularla con facilidad.
