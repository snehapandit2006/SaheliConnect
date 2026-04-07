# Design System Specification: The Guided Sanctuary

This document defines the visual and structural language for a digital ecosystem dedicated to social impact. Our objective is to move beyond the cold, utilitarian "app" aesthetic, creating instead a "Guided Sanctuary"—a digital space that feels as safe and supportive as a physical community center.

As designers, your role is to balance high-end editorial sophistication with radical accessibility. We do not use "standard" UI patterns; we use intentional, tonal layering to build trust with users who may have low digital literacy but deserve a premium, dignified experience.

---

## 1. Creative North Star: The Guided Sanctuary
The "Guided Sanctuary" aesthetic is defined by **Soft Minimalism**. It rejects the rigid, boxy constraints of traditional grids in favor of breathing room, organic overlaps, and a hierarchy driven by light and color rather than lines. 

To break the "template" look:
- **Intentional Asymmetry:** Align text to generous margins while allowing illustrations to bleed slightly off-center.
- **Layered Composition:** Treat the screen as a series of physical sheets of paper or frosted glass stacked atop one another.
- **Human-Centricity:** Typography should feel like a conversation—authoritative yet warm.

---

## 2. Color & Surface Philosophy
The palette is built on a foundation of **Soft Teal (`#016464`)** for trust and **Gentle Purple (`#7348ab`)** for empowerment.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections or containers. 
- Boundaries must be created through background shifts. For example, a `surface_container_low` (`#f5f3f3`) section should sit directly on a `surface` (`#fbf9f8`) background. 
- This creates a sophisticated, "borderless" look that feels less technical and more organic.

### Surface Hierarchy & Nesting
Use the `surface_container` tiers to create depth. Instead of a flat grid, nest importance:
1.  **Base Layer:** `surface` (`#fbf9f8`)
2.  **Sectional Layer:** `surface_container_low` (`#f5f3f3`)
3.  **Actionable Cards:** `surface_container_lowest` (`#ffffff`)

### The "Glass & Gradient" Rule
To add "soul" to the UI:
- **CTAs:** Use subtle linear gradients from `primary` (`#016464`) to `primary_container` (`#2d7d7d`) at a 135-degree angle.
- **Floating Elements:** For navigation bars or top headers, use Glassmorphism. Apply a semi-transparent `surface` color with a 20px backdrop-blur.

---

## 3. Typography Scale
We utilize two distinct typefaces to balance modern editorial style with high-legibility function.

*   **Plus Jakarta Sans (Display & Headlines):** Used for all `display-` and `headline-` tokens. This font provides a modern, friendly, and authoritative voice.
*   **Be Vietnam Pro (Body & Labels):** Used for `title-`, `body-`, and `label-` tokens. This ensures maximum readability, particularly for Hindi scripts (Devanagari), where vertical clearance is essential.

**Editorial Tip:** Use `display-md` for landing moments to create an "Editorial Cover" feel. Ensure `body-lg` (1rem) is your default for information-heavy sections to assist users with low digital literacy.

---

## 4. Elevation & Depth
Depth in this design system is achieved through **Tonal Layering**, not structural shadows.

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. This creates a "soft lift" that feels natural and non-intimidating.
*   **Ambient Shadows:** If an element must float (e.g., a bottom sheet), use an extra-diffused shadow:
    *   *Blur:* 40px | *Opacity:* 6% | *Color:* Derived from `on_surface` (`#1b1c1c`).
*   **The "Ghost Border" Fallback:** If accessibility requires a container definition (e.g., in high-glare environments), use a "Ghost Border." Apply `outline_variant` (`#bec9c8`) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Component Guidelines

### Buttons: The "Touch-First" Approach
All buttons must be substantial and inviting.
- **Primary:** Gradient from `primary` to `primary_container`. Radius: `xl` (1.5rem). High contrast text (`on_primary`).
- **Secondary:** Tonal fill using `secondary_container` (`#c496ff`).
- **Interaction:** On hover/tap, the element should slightly scale (1.02x) rather than just changing color.

### Cards & Information Units
- **Forbid Dividers:** Do not use horizontal lines to separate list items. Use 24px of vertical white space (Spacing Scale) or alternating background tones (`surface` vs `surface_container_low`).
- **Content Padding:** Minimum 24px internal padding for all cards to ensure content "breathes."

### Input Fields & Forms
- **Visual Style:** Use the "Ghost Border" on a `surface_container_highest` background.
- **Accessibility:** Labels must always be visible (never use placeholder-only labels). Ensure supporting text in Hindi is 10% larger than English text to maintain visual weight.

### Chips & Filters
- Use `secondary_fixed` (`#eedcff`) for unselected states and `secondary` (`#7348ab`) for active states. This provides a clear, empathetic color cues without being harsh.

---

## 6. Do's and Don'ts

### Do:
- **Do** use large, friendly human-centered illustrations that overlap container edges to break the grid.
- **Do** prioritize Hindi legibility by increasing line-height to 1.6x for all `body-` styles.
- **Do** use white space as a functional tool to reduce cognitive load for vulnerable users.

### Don't:
- **Don't** use pure black (`#000000`). Use `on_surface` (`#1b1c1c`) for all "black" text to reduce eye strain.
- **Don't** use sharp corners. Every element must utilize the Roundedness Scale, favoring `md` (0.75rem) or `xl` (1.5rem).
- **Don't** use corporate stock photography. If an illustration isn't available, use high-quality, authentic photography with a soft-focus background.

---

## 7. Accessibility & Multilingual Context
This design system is built for English and Hindi. 
- **Contrast:** Every color combination (e.g., `on_primary` on `primary`) must pass WCAG AA standards.
- **Bilingual Layouts:** When displaying English and Hindi together, ensure the Hindi text is given primary visual weight, as it often requires more horizontal and vertical space.