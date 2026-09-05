# GridBot

**GridBot** es un sencillo pero potente script desarrollado por **Manuel Guerrero** para **Processing**.  
Su objetivo principal es generar **retículas dinámicas** mediante la **descomposición geométrica** de un rectángulo.  
Esta herramienta resulta especialmente útil en proyectos de:

- **Diseño de carteles**
- **Diseño editorial**
- **Creación de interfaces gráficas**

Facilita la **organización visual** y la **disposición estructurada** de elementos, optimizando la composición gráfica en diversos contextos de diseño.

Este script surge como material y recurso didáctico del curso de Domestika:  
👉 [**Diseño de carteles tipográficos experimentales**](https://www.domestika.org/es/courses/464-diseno-de-carteles-tipograficos-experimentales)

[![Diseño de carteles tipográficos experimentales en Domestika](assets/domestika-curso.jpg)](https://www.domestika.org/es/courses/464-diseno-de-carteles-tipograficos-experimentales)

---

## Características principales

- **Generación aleatoria** de retículas a partir de divisiones geométricas.
- **Exportación automática** en formato **.pdf** para su posterior edición o impresión.
- **Interacción sencilla** mediante **clicks** del mouse.
- Código ligero, fácil de entender y personalizar.

---

## Estructura del repositorio

```text
GridBot/
├── processing/
│   └── GridBot/
│       └── GridBot.pde         # Versión para Processing
├── illustrator/
│   ├── GridBot.jsx             # Script para Adobe Illustrator (ExtendScript)
│   └── install.md              # Guía de instalación (macOS y Windows)
├── assets/                     # Muestras y capturas de ejemplo
├── README.md                   # Documentación
└── LICENSE                     # Licencia CC0 1.0
```

---

## Uso

### 🎨 Opción 1: Processing
1. Abre el archivo `processing/GridBot/GridBot.pde` en **Processing**.
2. Ejecuta el sketch (`▶️ Run`).
3. Haz **click** en el lienzo para generar una nueva retícula y exportar el `.pdf`.

### ✒️ Opción 2: Adobe Illustrator
1. Abre tu documento en **Adobe Illustrator**.
2. Ve al menú **Archivo > Secuencias de comandos > Otra secuencia de comandos...** (`Cmd + F12` en macOS / `Ctrl + F12` en Windows) y selecciona `illustrator/GridBot.jsx`.
3. *(Opcional)* Para integrarlo en el menú de Illustrator de forma permanente, consulta la [Guía de Instalación para macOS y Windows](illustrator/install.md).

---

## Requisitos

- **Processing**: Versión 3.0 o superior (para el sketch `.pde`).
- **Adobe Illustrator**: Compatible con cualquier versión con soporte ExtendScript/JSX.

---

## Licencia

Este proyecto está publicado bajo la licencia [CC0 1.0 Universal (CC0-1.0) Public Domain Dedication](LICENSE).  
Esto significa que puedes copiar, modificar, distribuir y ejecutar el proyecto, incluso para fines comerciales, sin necesidad de pedir permiso.

---

## Créditos

Desarrollado por [**Manuel Guerrero**](https://github.com/bluetypo)  
Para cualquier comentario, sugerencia o mejora, se aceptan *pull requests* y *issues*.

---

## ¿Cómo contribuir?

Si deseas colaborar:

1. Haz un **fork** de este repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz un commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Haz push a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un **pull request** para revisión.
