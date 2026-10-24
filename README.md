# Centrador de Texto para Bluesky (Vertical y Horizontal)

Herramienta creada por **Anna Lightwood** para centrar texto verticalmente (con saltos de línea arriba y abajo) y horizontalmente en publicaciones de Bluesky, optimizando el límite estricto de 300 caracteres mediante caracteres Braille invisibles (`U+2800`).

---

## 👤 Creadora
Desarrollado y diseñado por **Anna Lightwood**.

---

## 📥 Descargas Directas (Versión v1.0.5)

- 📱 **[Descargar CentradorBluesky.apk](https://github.com/boletindeanoche/bluesky-text-center/releases/download/v1.0.5/CentradorBluesky.apk)** (App directa para instalar en Android)
- 🧩 **[Descargar extension-chrome.zip](https://github.com/boletindeanoche/bluesky-text-center/releases/download/v1.0.5/extension-chrome.zip)** (Extensión empaquetada para Google Chrome)

---

## 📂 Contenido del proyecto

1. **`extension/`**: Extensión completa para Google Chrome / Chromium (Brave, Edge, etc.) con autoría de Anna Lightwood.
2. **`pwa/`**: Aplicación web progresiva lista para instalar como App en móviles Android y escritorio (funciona 100% offline).
3. **`android-project/`**: Proyecto nativo de Android listo para compilar en APK mediante GitHub Actions.

---

## 🚀 Guía de Instalación Rápida

### 1. Extensión de Chrome (PC / Mac)
1. Abre Google Chrome y ve a `chrome://extensions/`.
2. Activa el interruptor **"Modo de desarrollador"** (Developer mode) en la esquina superior derecha.
3. Haz clic en el botón **"Cargar descomprimida"** (Load unpacked).
4. Selecciona la carpeta:
   `extension`
5. ¡Listo! Ya verás el icono azul en tu barra de extensiones de Chrome. Haz clic en él para abrir el panel de centrado, escribe tu texto y pulsa "Copiar para Bluesky".

---

### 2. Móvil Android (App / APK)
Tienes dos formas muy sencillas de tenerla en el móvil:

#### Método A: PWA (Instalación instantánea sin compilar, recomendada)
1. Abre la web del proyecto en Google Chrome desde tu teléfono Android.
2. Pulsa el botón **"📱 Instalar como App en tu Móvil"** (o en el menú de 3 puntos de Chrome: *"Instalar aplicación"* / *"Añadir a la pantalla de inicio"*).
3. Se instalará con su icono propio, pantalla completa (sin barra de direcciones de navegador) y funcionará incluso sin internet.

#### Método B: Descargar el archivo `.apk` compilado
1. En la pestaña **Actions** del repositorio de GitHub, entra en la última ejecución completada.
2. Descarga el archivo **`CentradorBluesky.apk`** e instálalo directamente en tu teléfono.
