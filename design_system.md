# Antigravity Design System: "Mindful UI"

This document defines the UI/UX standards for the Antigravity psychological focus app. The design language prioritizes calmness, clarity, and mental spaciousness.

## 1. Tech Stack & Dependencies

- **Framework:** Tailwind CSS
- **Icons:** FontAwesome 6 (Solid style `fa-solid`)
- **CSS Approach:** Utility-first + Inline styles for Brand Colors ONLY.

## 2. Color Psychology & Palette (Strict Tokens)

Do not use standard Bootstrap colors. Use these specific HEX codes to evoke the desired emotional state.

| Token Name                   | Hex Code  | Usage                                                     | Psychology                      |
| :--------------------------- | :-------- | :-------------------------------------------------------- | :------------------------------ |
| **Brand Serenity** (Primary) | `#457B9D` | Icons, Progress Bars, Main Buttons, Active Links.         | _Calm, stability, deep water._  |
| **Brand Happiness** (Accent) | `#E9C46A` | Highlights, "New" Badges, Call to Action accents.         | _Optimism, sun, energy._        |
| **Surface Peace** (Bg)       | `#F1FAEE` | Card Backgrounds, Badge Backgrounds, Section Backgrounds. | _Mental clarity, clean slate._  |
| **Text Focus** (Primary)     | `#1D3557` | Headings, Titles. (Never use pure black #000000).         | _Strong but softer than black._ |
| **Text Calm** (Secondary)    | `#6B7785` | Body text, Descriptions.                                  | _Low contrast reading comfort._ |

## 3. Typography & Hierarchy

- **Card Titles:** `h5`, `fw-bold` (700), `color: #1D3557`.
- **Body Text:** `small` tag, `color: #6B7785`. Line-height `1.6` (Airy).
- **Radius:** Use `rounded-4` or `rounded-3` (Softer curves = Friendlier feel).

## 4. Grid Rules (Symmetry & Breath)

- **Mobile:** `col-12`
- **Tablet:** `col-md-6`
- **Desktop:** `col-xl-3` (4 cards per row)
- **Gap:** `g-4` (Row) and `mb-4` (Column) are mandatory to create "white space" (visual breathing room).

## 5. Canonical Component: "Mindful Card"

Use this template for all module cards. Note the softer colors and rounded corners.

### Source Code Template

```html
<div class="col-12 col-md-6 col-xl-3 mb-4">
  <div
    class="card border-0 h-100 shadow-sm rounded-4"
    style="background-color: #ffffff;"
  >
    <div class="card-body p-4 d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div
          class="rounded-circle d-flex align-items-center justify-content-center"
          style="background-color: #F1FAEE; width: 60px; height: 60px;"
        >
          <i class="fa fa-spa fa-2x" style="color: #457B9D;"></i>
        </div>

        <span
          class="badge rounded-pill"
          style="background-color: #FFF3CD; color: #B78408; padding: 6px 12px; font-weight: 600;"
        >
          65%
        </span>
      </div>

      <h5
        class="card-title mt-2 mb-2"
        style="font-weight: 700; color: #1D3557;"
      >
        Control de Ansiedad
      </h5>

      <p
        class="card-text small mb-4 flex-grow-1"
        style="color: #6B7785; line-height: 1.6;"
      >
        Técnicas de respiración y mindfulness para recuperar el control en
        momentos de crisis.
      </p>

      <a
        href="#"
        class="text-decoration-none fw-bold d-flex align-items-center mt-auto"
        style="color: #457B9D; font-size: 0.75rem; letter-spacing: 0.5px;"
      >
        <i class="fa-solid fa-circle-play me-2 fs-6"></i>
        12 SESIONES
      </a>
    </div>
  </div>
</div>

## 6. Implementation Checklist for AI When generating UI code, verify: - [ ] Is
the primary color `#0d5c63`? - [ ] Is the grid responsive (`col-12 col-md-6
col-xl-3`)? - [ ] Does the card use `h-100` and `flex-column`? - [ ] Is the gap
uniform (row `g-4` and col `mb-4`)? - [ ] Are font sizes using rems/classes and
not arbitrary pixels?
```

---

### ¿Cómo usar esto con Antigravity AI?

1.  Guarda este archivo como `design_system.md`.
2.  Cuando le pidas algo a la IA, haz referencia a este archivo. Por ejemplo:
    > _"Genera una nueva sección de 'Usuarios' usando el componente de Card definido en `design_system.md`."_
    > _"Crea una tabla de datos pero usa los colores definidos en los Tokens de `design_system.md`."_

Esto garantiza que la IA no "invente" estilos nuevos y se mantenga fiel al diseño que hemos pulido. ¿Quieres que agregue reglas para botones o inputs también?

```

```
