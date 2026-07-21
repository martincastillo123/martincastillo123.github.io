---
name: Cylgem
description: Fabricación electrónica automotriz con estándares globales
colors:
  navy: "#0052B3"
  rust: "#E63946"
  ink: "#0a0a0a"
  ink-2: "#222222"
  muted: "#6e6a63"
  white: "#ffffff"
  paper: "#f4f0e8"
  paper-2: "#ebe5d9"
  line: "#d9d2c4"
  line-strong: "#1a1a1a"
typography:
  display:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(32px, 4.2vw, 58px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(26px, 3.2vw, 44px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.18em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "48px"
  xl: "80px"
  section: "clamp(48px, 6vw, 72px)"
components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "16px 26px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "16px 26px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "16px 26px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px clamp(14px, 1.6vw, 22px)"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px 26px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "10px 0"
---

# Design System: Cylgem

## 1. Overview

**Creative North Star: "El Laboratorio Blindado"**

Rigurosidad científica, sala limpia, calidad inquebrantable. La electrónica se fabrica como se diseña un instrumento de precisión — y el sitio web refleja esa misma filosofía. Cada elemento visual existe porque cumple una función: informar, demostrar capacidad, generar confianza en un gerente de compra OEM que necesita evaluar rápido si Cylgem es el socio correcto.

El sistema rechaza la estética de startup tech (gradientes neón, fondos oscuros gamers, tipografía friendly) y los templates genéricos de PyME. No se disculpa por ser una fábrica — presenta la planta, las líneas SMT, las certificaciones y los datos con la confianza de quien lleva 39 años en el mercado.

Componentes refinados y contenidos: elegantes pero sobrios, con transiciones sutiles. Profesionalismo sin ostentar, como una pieza industrial bien terminada.

**Key Characteristics:**
- Fondo blanco limpio como superficie de trabajo de laboratorio
- Navy corporativo (#0052B3) como color de autoridad y confianza
- JetBrains Mono para labels y datos técnicos — voz de instrumento de precisión
- Bordes pill (999px) en botones y CTAs — único toque de suavidad en un sistema contenido
- Imágenes reales de planta, productos y líneas de producción — nunca stock genérico

## 2. Colors

Paleta restringida y profesional. Dos acentos — navy para autoridad, rust para urgencia puntual — sobre una base neutra blanca con apoyos paper/ink.

### Primary
- **Navy Corporativo** (#0052B3): Color de identidad. Botones CTA, nav CTA, fondo de sección contacto, cards flip del carrusel. Transmite confianza institucional. Usado en ≤15% de la superficie.

### Secondary
- **Rust Señal** (#E63946): Acento de énfasis y alerta. Usado en el timeline horizontal (año actual) y como pulso visual. No es decorativo — señala lo que necesita atención.

### Neutral
- **Ink** (#0a0a0a): Texto principal, headings, iconografía. Negro profundo, no puro — sRGB 10/10/10.
- **Ink-2** (#222222): Texto secundario y cuerpo descriptivo. Ligeramente más suave que ink.
- **Muted** (#6e6a63): Labels, metadatos, texto terciario. Neutro cálido que no compite con el contenido.
- **White** (#ffffff): Fondo de trabajo principal. Superficie limpia de laboratorio.
- **Paper** (#f4f0e8): Fondo de selección (::selection), textos sobre fondos oscuros. Calidez controlada.
- **Paper-2** (#ebe5d9): Hover en logo grid, fondo de apoyo. Neutro cálido más profundo.
- **Line** (#d9d2c4): Bordes, separadores, divisiones entre secciones.
- **Line-Strong** (#1a1a1a): Bordes de énfasis sobre fondos claros.

### Named Rules
**The Lab Coat Rule.** El fondo de trabajo es blanco puro (#ffffff). No paper, no cream, no tinted neutrals como fondo body. El blanco es la superficie limpia del laboratorio — la calidez viene de las imágenes reales y la tipografía, no del fondo.

## 3. Typography

**Display Font:** Manrope (with system-ui, sans-serif fallback)
**Body Font:** Manrope (with system-ui, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (monospace)

**Character:** Una sola familia en múltiples pesos crea uniformidad corporativa. Manrope es geométrica con bordes suavizados — técnica sin ser fría. JetBrains Mono en labels y metadatos aporta la voz del instrumento de medición: datos, códigos, especificaciones técnicas.

### Hierarchy
- **Display** (600, clamp(32px, 4.2vw, 58px), 1.05): Hero headings. Letter-spacing -0.025em. Max-width 24ch. text-wrap: balance.
- **Headline** (600, clamp(26px, 3.2vw, 44px), 1.15): Section headings (h2). Letter-spacing -0.025em.
- **Title** (500, 22px, 1.15): Card titles, form headings. Letter-spacing -0.015em.
- **Body** (400, 16px, 1.65): Párrafos descriptivos. Max line length ~48-52ch. Color ink-2.
- **Label** (500, 11px, 1): Metadatos, badges, section labels, technical data. JetBrains Mono. Letter-spacing 0.18em. Uppercase. Color muted.

### Named Rules
**The Instrument Rule.** Todo dato técnico, código, especificación o label de sección usa JetBrains Mono. Es la voz del instrumento — no de la marca. Manrope habla; JetBrains Mono mide.

## 4. Elevation

Sistema predominantemente plano. Las sombras son respuesta a estado (hover, scroll), no decoración estática. La profundidad se comunica con bordes sutiles (1px solid var(--line)) y cambios de fondo, no con sombras omnipresentes.

### Shadow Vocabulary
- **Nav blur** (`0 10px 30px -10px rgba(0,0,0,0.08)` + `backdrop-filter: blur(14px) saturate(140%)`): Nav fijo al hacer scroll. Flotación sutil con glass effect.
- **Card hover** (`0 30px 60px -20px rgba(0,0,0,0.18)` + `translateY(-4px)`): Solo en hover de product cards. La elevación es respuesta, no estado base.
- **Hero text** (`0 2px 16px rgba(0,0,0,0.9)`): Text-shadow sobre imagen de fondo. Legibilidad, no efecto.

### Named Rules
**The Flat-By-Default Rule.** Superficies planas en reposo. Border 1px solid var(--line) establece los límites. Las sombras aparecen solo como respuesta a interacción (hover) o contexto (nav scroll, texto sobre imagen).

## 5. Components

### Buttons
- **Shape:** Pill (999px radius) — único toque de suavidad en el sistema.
- **Primary:** Navy background, paper text (16px 26px padding). Font-weight 600, 15px. Arrow (→) con gap 12px.
- **Hover / Focus:** Background transitions a ink, translateY(-1px). Arrow se desplaza +3px. Transición 0.2s.
- **Ghost Light:** Border rgba(255,255,255,0.4), transparent bg. Hover: bg rgba(255,255,255,0.1), border solid paper.

### Cards
- **Corner Style:** Suavemente redondeadas (6px radius).
- **Background:** White (#ffffff).
- **Shadow Strategy:** Sin sombra en reposo. Hover: translateY(-4px) + box-shadow profundo + border-color ink.
- **Border:** 1px solid var(--line) en reposo.
- **Internal Padding:** 24-28px vertical, 26px horizontal.

### Inputs / Fields
- **Style:** Sin fondo, sin bordes laterales. Solo border-bottom 1px solid var(--line).
- **Focus:** Border-color transitions a ink.
- **Labels:** 12px, muted, font-weight 500.

### Navigation
- **Fixed top**, z-index 50. Background blanco con backdrop-filter blur (glass effect).
- **Links:** 14px, font-weight 600, pill radius, hover bg rgba(0,0,0,0.05) + color navy.
- **CTA:** Pill button navy con arrow. Hover transitions a ink + translateY(-1px).
- **Mobile:** Full-screen overlay blanco con backdrop-filter. Links 20-26px, column layout.
- **Scroll behavior:** Padding se reduce ligeramente, logo se achica. Transición suave 0.3s.

### Client Carousel (Signature Component)
Carrusel infinito con flip cards 3D. Front: logo en grayscale con opacidad 0.75. Hover: flip 180° revelando navy card con nombre de marca y lista de productos. Animación CSS pura, 55s loop lineal. Pause on hover. Mask gradient en los bordes para fade in/out.

## 6. Do's and Don'ts

### Do:
- **Do** usar blanco puro (#ffffff) como fondo body. Es la superficie de laboratorio.
- **Do** usar JetBrains Mono para todo label, badge, metadata y dato técnico. Sin excepciones.
- **Do** mantener las imágenes reales de planta, productos y líneas SMT. Son la prueba.
- **Do** respetar `prefers-reduced-motion: reduce` en toda animación. El carrusel se detiene, los reveals se omiten.
- **Do** usar pill (999px) exclusivamente en botones y CTAs. No en cards, no en inputs.
- **Do** limitar navy a ≤15% de la superficie por pantalla. Su rareza es autoridad.

### Don't:
- **Don't** usar gradientes neón, fondos oscuros tipo gamer, o estética SaaS Silicon Valley. (Anti-referencia directa de PRODUCT.md.)
- **Don't** usar fotos de stock genéricas o ilustraciones AI. Si no hay foto real, usar un placeholder con degradado sutil — nunca una imagen falsa.
- **Don't** aplicar border-left o border-right mayor a 1px como stripe decorativo en cards o alertas.
- **Don't** usar gradient text (background-clip: text).
- **Don't** crear card grids idénticos (mismo tamaño, misma estructura icon+heading+text repetida sin variación).
- **Don't** usar glassmorphism como decoración. El blur del nav es funcional (legibilidad), no estético.
- **Don't** añadir eyebrows uppercase con tracking ancho sobre cada sección. Uno o dos en el hero es voz; en cada sección es scaffold de AI.
