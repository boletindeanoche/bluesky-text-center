# Centrador de Texto para Bluesky (Vertical y Horizontal)

Herramientas para centrar texto verticalmente (con saltos de línea arriba y abajo) y horizontalmente en publicaciones de Bluesky, optimizando el límite estricto de 300 caracteres mediante caracteres Braille invisibles (`U+2800`).

---

## 📂 Contenido del proyecto

1. **`extension/`**: Extensión completa para Google Chrome / Chromium (Brave, Edge, etc.).
2. **`pwa/`**: Aplicación web progresiva lista para instalar como App nativa en móviles Android y escritorio (funciona 100% offline).

---

## 🚀 Guía de Instalación Rápida

### 1. Extensión de Chrome (PC / Mac)
1. Abre Google Chrome y ve a `chrome://extensions/`.
2. Activa el interruptor **"Modo de desarrollador"** (Developer mode) en la esquina superior derecha.
3. Haz clic en el botón **"Cargar descomprimida"** (Load unpacked).
4. Selecciona la carpeta:
   `C:\Users\ana-g\.gemini\antigravity\scratch\bluesky-text-center\extension`
5. ¡Listo! Ya verás el icono azul en tu barra de extensiones de Chrome. Haz clic en él para abrir el panel de centrado, escribe tu texto y pulsa "Copiar para Bluesky".

---

### 2. Móvil Android (App / APK)
Tienes dos formas muy sencillas de tenerla en el móvil:

#### Método A: PWA (Instalación instantánea sin compilar, recomendada)
1. Puedes alojar la carpeta `pwa/` en cualquier hosting gratuito (como GitHub Pages, Cloudflare Pages o Vercel), o compartirla en tu red local.
2. Abre la URL en Google Chrome desde tu teléfono Android.
3. Pulsa el botón **"📱 Instalar como App en tu Móvil"** (o en el menú de 3 puntos de Chrome: *"Instalar aplicación"* / *"Añadir a la pantalla de inicio"*).
4. Se instalará con su icono propio, pantalla completa (sin barra de direcciones de navegador) y funcionará incluso sin internet.

#### Método B: Generar un archivo `.apk` independiente
Si quieres un instalador `.apk` clásico para compartirlo o instalarlo manualmente:
1. Sube la carpeta a un repositorio o URL pública.
2. Ve a [PWABuilder.com](https://www.pwabuilder.com/) (herramienta oficial y gratuita de Microsoft).
3. Introduce la URL y pulsa **"Package for Android"**.
4. Te descargará un archivo `.apk` firmado y listo para instalar en cualquier móvil Android.

---

## 🧠 ¿Por qué el carácter `U+2800` y cómo optimizarlo?

### 1. ¿Por qué se borran los espacios normales?
Tanto la app de Bluesky como su backend aplican filtros automáticos de limpieza:
- Eliminan espacios en blanco al inicio y al final de cada línea (`trim()`).
- Colapsan múltiples saltos de línea consecutivos (`\n\n\n` pasa a un único salto).

### 2. ¿Por qué funciona el espacio Braille?
El carácter `⠀` (`U+2800`, *Braille Pattern Blank*) está catalogado en el estándar Unicode como un **símbolo gráfico** (categoría `So`), **no como espacio en blanco**. 
Por tanto, ningún algoritmo de limpieza ni filtro de Bluesky lo reconoce como "vacío" y **nunca lo elimina**.

### 3. La gran optimización: 1 carácter en vez de 7
Hasta ahora solías poner `⠀⠀⠀` (7 espacios Braille) para cada salto de línea.
- **Antes:** 2 líneas arriba y 2 líneas abajo = `7 * 4 = 28` caracteres desperdiciados.
- **Optimizado:** Con **un único `⠀`** por línea vacía (`⠀\n⠀\n`), Bluesky ya no colapsa el salto de línea y solo gastas **2 o 4 caracteres**, ahorrándote más de 20 caracteres para el límite de 300.
