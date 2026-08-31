# Kite Design System

The design system for **Kite** — an AI infrastructure company. Kite's voice is *technical yet playful*: the content is dense and precise (models, runs, latencies, tokens), the delivery is warm, confident and a little wry. The visual system carries the same split: a hard, engineered display face and a strict grid, softened by a friendly text face, cream highlights and coral signals.

## Sources given to us

| Source | What it gave us |
| --- | --- |
| `uploads/Palette 02.jpg` | The five-colour palette, the type hierarchy (title / body / italic / eyebrow), the glass panel with diagonal light sweep, and the 45° cut-corner accent shapes. |
| Client confirmation (chat) | Typefaces: **Geist** for titles and eyebrows (all caps), **IBM Plex Serif** for body. Logo not yet approved — out of scope. |
| Brand brief (chat) | "AI driven company… professional outlook with a playful outlook, although the content will be technical." |

**No codebase, Figma file, deck, logo, or font binaries were provided.** Everything in this system is derived from the palette sheet plus the brand brief. Two consequences the reader must know:

- **There is no logo yet** — the mark is unapproved on the client side, so none exists here and none may be invented. Wherever a logo would go, the wordmark `KITE` is set in Geist, uppercase, `letter-spacing:.12em`, beside a small periwinkle 45°-cut square — see `assets/README.md`.
- **Fonts are confirmed:** Geist for titles/eyebrows/UI, IBM Plex Serif for body, Geist Mono for code.

## Index

| Path | What's there |
| --- | --- |
| `styles.css` | Global entry point. `@import`s only. Consumers link this one file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `base.css` |
| `components/core/` | **Button**, **IconButton**, **Icon**, **Card**, **Badge**, **Tag** |
| `components/forms/` | **Field**, **Input**, **Textarea**, **Select**, **Checkbox**, **Radio**, **Switch** |
| `components/navigation/` | **Tabs** |
| `components/feedback/` | **Dialog**, **Toast**, **Tooltip** |
| `ui_kits/console/` | **Kite Console** — product-app recreation (runs list, run inspector, playground, settings). Interactive `index.html`. Reference for in-page app mockups only. |
| `site/` | `SECTIONS.md` — the website's section vocabulary, taken from the approved homepage design. Read this before building any page. |
| `guidelines/` | 25 foundation specimen cards (Type, Colors, Spacing, Brand) + `voice.md` |
| `assets/` | Wordmark treatment + iconography notes. |
| `thumbnail.html` | Homepage tile for this system. |
| `SKILL.md` | Agent-skill front door. |

### Intentional additions

- **`Icon`** — a thin wrapper over Lucide (CDN) so every glyph in the system comes from one set at one stroke weight. The palette sheet defined no icons; without a wrapper each consumer would pick a different set.
- **`Textarea`** — the Console's prompt composer needs a multi-line control; it shares Input's entire visual contract.

---

## CONTENT FUNDAMENTALS

**The rule of the voice: be exact about the machine, human about the person.** Numbers are never rounded for comfort; instructions are never dressed up as magic.

**Casing.** Sentence case everywhere — headings, buttons, table headers, menu items, toasts. The *only* uppercase is the eyebrow label (`--type-eyebrow`, letter-spaced `.22em`) and the `KITE` wordmark. Never Title Case A Heading Like This. Product nouns keep their real casing: `kite run`, `KiteGraph`, `p95`, `gpt-4o-mini`.

**Person.** Second person for anything the user does ("Deploy your first agent", "You have 3 runs queued"). First-person plural only for Kite's own commitments ("We keep your traces for 30 days"). Never first-person singular — the product does not have a personality, the brand does.

**Sentence shape.** Short declarative first, detail second. The playfulness lives in the *second* clause, never in the headline of an error.

> Ship agents you can actually debug.
> Every run, every token, every retry — recorded and replayable.

**Numbers and units.** Always concrete, always with unit, never adverbial. `142 ms p95`, not "blazing fast". `98.6% success over 12k runs`, not "highly reliable". Set numerals in the display or mono face so they hold column alignment.

**Empty states** get the driest joke in the product, and always a next action:

> **No runs yet.** Your agents have been suspiciously well-behaved.
> `Start a run →`

**Errors** are never funny, never blame the user, always name the cause and the fix:

> **Run stopped at step 4.** The tool `fetch_invoice` returned 502. Retry the step, or edit the tool's timeout.

Not: "Oops! Something went wrong 😅"

**Buttons and labels** are verb + object, 1–3 words: `Start run`, `Add tool`, `Copy trace ID`, `Invite teammate`. Never `Submit`, `OK`, `Click here`. Destructive buttons name the destruction: `Delete project`, not `Confirm`.

**Microcopy tone examples**

| Situation | Kite says | Kite never says |
| --- | --- | --- |
| Loading | `Replaying trace…` | `Please wait while we work our magic ✨` |
| Success toast | `Deployed to production. 1.4 s.` | `Woohoo! You did it!` |
| Feature intro | `Traces are on by default. Turn them off per project if you'd rather not store payloads.` | `Unlock the power of observability` |
| Pricing | `Free while you're building. $0 until 50k runs / month.` | `Affordable plans for every team` |
| Docs aside | `Note: retries share the parent run's budget.` | `Pro tip! 🚀` |

**Emoji: no.** Not in UI, not in headings, not in toasts, not in docs. Playfulness comes from word choice and from the coral/cream accents, not from glyphs. The one tolerated non-alphabetic character is the arrow `→` in link and CTA labels.

**Banned vocabulary:** *revolutionary, seamless, effortless, magic, unlock, supercharge, game-changing, AI-powered* (say what the model does instead), *simply* / *just* (they blame the reader), *robust*, *leverage*.

**Docs & technical copy.** Imperative headings (`Install the SDK`, `Trace a run`). One idea per paragraph, ≤3 sentences. Code before prose whenever a code block can carry the point. Inline code for every identifier, path, flag and value — `--concurrency`, `kite.run()`, `4096`.

---

## VISUAL FOUNDATIONS

### The idea

**Soft sky, hard type.** The page is atmosphere — huge, blurred fields of sky, coral, cream, peach and lime that bleed into each other with no visible edge. Everything solid floats on top of it: glass pills, glass cards, thin outlined chips, and headlines set in heavy Geist. The tension between the diffuse background and the precise foreground *is* the brand.

### The atmosphere (read this first)

- **Every band of the page is a wash**, not a flat colour. Four are tokenised: `--wash-dawn` (hero: sky top-left, coral bloom mid-left, cream-to-peach bottom), `--wash-warm` (editorial bands), `--wash-cool` (quiet bands), `--wash-green` (the live-products band, lime bleeding into pale blue). They are built from large `radial-gradient` blooms over a soft vertical base — soft-focus, 60–120% of the band, never a two-stop linear ramp.
- **Bands butt straight together with no seams, dividers or rounded joins.** One wash resolves into the next; the transition is the design.
- **The wash is always full-bleed**; content sits on a 1200px column inside it.
- **Nothing sits directly on the wash except type and glass.** No white content panels, no flat cards on a wash — the card must be glass or a thin outline.
- **One dark inversion per page**: the indigo ticker strip (`--surface-brand`, ~34px, uppercase caption text, one link right-aligned). It is the only hard-edged full-width block in the layout.
- **The page closes on coral.** The footer is a full-bleed `--surface-footer` field with `Kite.` set huge in ink, link columns in ink at 72%, and the contact line as a link with a trailing `→`.

### Glass

Glassmorphism is a first-class surface here, not an accent. Three tiers:

| Token | Opacity | Used for |
| --- | --- | --- |
| `--surface-glass-thin` | .46 | The floating nav pill, chips, small badges |
| `--surface-glass-frost` | .58 | Product cards, feature cards, overlapping stacks |
| `--surface-glass` | .72 | Toasts and anything that must stay readable over busy colour |

All three take `backdrop-filter: blur(var(--glass-blur))` (14px) and `--shadow-glass` — an outer cool shadow plus a 1px inner white top-light and a white inset hairline. Radius: pill for the nav, `--radius-panel` (28px) for cards. Glass cards may **overlap** each other by 24–48px; the front card gets the higher opacity. Glass is only ever used **on a wash or on imagery** — never on `--surface-page`.

### The wordmark

`Kite.` — sentence case, **full stop always**, Geist semibold, `letter-spacing:-.045em`, ink (`--ink-950`) on light and on coral, white on indigo. 15px inside the nav pill; 56–120px as a footer/hero statement. The logo mark is still unapproved: **do not draw one.**

### Colour

- **Indigo `#1C2FB0`** is the brand and the only colour large fields are painted in. Full-bleed indigo panels are the system's signature move (see the palette sheet's left third). Text on indigo is always pure white.
- **Periwinkle `#80AFFF`** is the secondary: diagonal accent slashes, light-sweep gradients, focus rings, data-viz primary, selected states. Never a text colour on white (fails contrast) — it is a *shape* colour.
- **Coral `#F37A65`** is the signal: exactly one coral element per view. Errors, deltas, the single emphasised CTA on a dark panel, a highlighted table row. If two things are coral, one of them is wrong.
- **Cream `#FFEBC0`** is the soft highlight: annotation blocks, marker-pen emphasis behind a word, the warm dot on a glass panel, cheap "aha" energy without a gradient.
- **Ink neutrals** are cool-tinted (`#0B0D17 → #F9F9F9`), never warm grey. `--surface-page` is `#F9F9F9`; cards are pure white so they lift off the page without a heavy shadow.
- Ratio to aim for in any one screen: **~70% neutral, ~20% indigo, ~7% periwinkle, ~3% coral/cream.**
- No bluish-purple hero gradients. Gradients exist for exactly two jobs: the **glass light sweep** (`--gradient-sweep`, a periwinkle diagonal through white) and the **protection gradient** over imagery (`--gradient-protect`).

### Type

The pairing is a **sans display over a serif body** — that inversion of the usual tech-company default is the single most recognisable thing about Kite's type.

- **Display — Geist.** The primary face for every title, plus eyebrows, buttons, labels, captions, table headers and metrics — i.e. all UI chrome. Semibold (600) for h1/h2 and metrics, medium (500) for h3/h4 and labels. Tracked slightly negative at scale: `-0.03em`, `-0.04em` above 48px. Never below 11px.
- **Body — IBM Plex Serif.** All prose: paragraphs, descriptions, hints, table cells, docs. Regular 400. Body 16px/1.55, small 14px/1.55. The serif is what keeps dense technical copy readable and gives the brand its warmth — do not substitute the display sans into running text.
- **Italic** is IBM Plex Serif italic and has one job: an aside, caption or attribution — never emphasis inside a sentence (use weight 500–600 of the serif for that).
- **Mono — Geist Mono** for code, IDs, trace hashes and values in tables; it shares Geist's skeleton, so mono values sit cleanly inside Geist UI.
- **Serif italic accent.** Exactly one phrase per headline may drop into IBM Plex Serif italic in `--brand` indigo — `Intelligence you can *talk to*.` It is the brand's only decorative move in type. Never two accents in one headline, never in body copy, never in UI.
- **Eyebrow** is the brand's most recognisable text object: 11px **Geist semibold, uppercase**, `letter-spacing:.18em`, `--text-muted`, sitting 8–12px above a title.
- Loaded from Google Fonts in `tokens/fonts.css` (Geist, Geist Mono, IBM Plex Serif). Swap the `@import` for local `@font-face` rules to self-host — nothing else changes.

### Spacing & layout

4px grid; the scale is `2 4 8 12 16 20 24 32 40 48 64 80 96 128`. Content max width 1200px, prose 68ch, gutters 24px (40px ≥1200px). Section rhythm is 64px on app screens, 96–128px between marketing bands. Controls come in three heights only: 32 / 40 / 48px. App chrome: 264px sidebar, 56px top bar, both fixed; the sidebar is the *only* fixed element besides modals and toasts.

Marketing layout uses **hard vertical splits** (the palette sheet's 4-block composition): full-bleed colour panel butted directly against a content panel, no gap, no rounding at the seam. Panels meet edge to edge; whitespace happens *inside* them.

### Backgrounds & imagery

Flat colour fields are the default background — no textures, no noise, no repeating patterns. Photography is used sparingly and only full-bleed inside a panel, always cool-toned and desaturated (blue shadows, no warm skin-tone grade, no grain), always with `--gradient-protect` under any text. There are no hand-drawn illustrations in this brand; diagrams are geometric, built from the same rectangles, 45° cuts and 1.5px strokes as the UI. Illustration placeholder convention: an indigo field with a periwinkle diagonal slash.

### The Kite cut

The signature shape: a **45° clipped corner** (`--cut-sm/md/lg`, `--clip-cut-tr`, `--clip-kite`) and free-floating **periwinkle parallelogram slashes** bleeding off a panel edge, exactly as on the palette sheet. Use the cut on at most one element per view — a hero panel, a feature card, a badge — and always at the top-right or bottom-left, never both on the same corner pair as the radius.

### Corners, borders, cards

Radii: controls 10px, cards 20px, panels/modals 28px, chips pill, media 14px. Nothing is sharp except full-bleed panels and table cells; nothing is rounder than 36px.

Borders are `1px` hairline `--border-subtle` for structure and `1.5px` for emphasis; `2px` only on the focused/selected state of a card. Dark panels use `rgba(255,255,255,.24)`.

**On the website a card is glass or an outline, never a flat white box.** *Glass card*: `--surface-glass-frost`, 28px radius, blur 14px, `--shadow-glass`, 24–32px padding, optional `Live` / `Coming soon` badge top-right. *Outline chip-card*: transparent, 1px `--border-default`, 12–14px radius, 12–16px padding, label only — used in scattered clusters (the sector grid) where the wash reads through. **In the app (Console) a card** = white surface, 20px radius, 1px `#E2E4E9` border, `--shadow-sm`, 24px padding. Cards do *not* stack shadows and borders heavily — the border does the structural work, the shadow only lifts. On hover an interactive card goes `--shadow-md` + `translateY(-1px)` + border `--border-default`. No coloured left-border accent cards. Ever.

**Glass** (`--surface-glass`, `backdrop-filter: blur(14px)`, `--shadow-inner-soft`) is reserved for elements floating over colour or imagery: the marketing hero panel, a toast over content, the run-inspector overlay. Never glass on `--surface-page` — there is nothing to see through.

### Elevation

Five steps, all cool-tinted (`rgba(11,13,23,…)` / `rgba(8,14,56,…)`), never neutral black. `xs` inputs, `sm` cards, `md` hover/dropdowns, `lg` popovers & toasts, `xl` modals. `--shadow-brand` (indigo glow) is for the primary button on light surfaces only.

### Motion

Purposeful, quick, never bouncy on anything the user waits for. Durations: 80 / 140 / 220 / 360 / 600ms. `--ease-standard` `cubic-bezier(.2,.7,.25,1)` for state changes; `--ease-out` for entrances; `--ease-spring` *only* for a toast landing or a badge count ticking. Entrances: 8px rise + fade over 220ms. Exits: fade only, 140ms. Modals: scrim fades 140ms, panel scales 0.98→1 over 220ms. Loading is a 1.2s periwinkle sweep across the skeleton, not a spinner, wherever layout is known. Everything collapses to 0ms under `prefers-reduced-motion`.

### States

- **Hover** — surfaces darken by one neutral step (`#FFF → #F9F9F9`), brand fills go one step deeper (`indigo-500 → indigo-600`), ghost controls gain `--surface-sunken`. Opacity is never used for hover.
- **Press** — `scale(0.975)` plus one further colour step down. 80ms, no shadow change.
- **Focus** — always visible: `3px` periwinkle ring (`--shadow-focus`), offset 2px. On indigo/dark surfaces the ring turns cream (`--shadow-focus-inverse`).
- **Selected** — indigo text + `--surface-brand-soft` fill + 2px indigo border/indicator. Never coral.
- **Disabled** — `opacity:.45`, `cursor:not-allowed`, no colour change. The only place opacity is a state.
- **Loading** — control keeps its width, label swaps for a 14px spinner in `currentColor`.
- **On dark surfaces** — every control placed on `--surface-inverse` or `--surface-brand` needs an explicit on-dark contract; `--text-muted` (#565A66) fails contrast there. Idle text goes `rgba(255,255,255,.72)`, tracks/chips go white at 10–16%, indicators go periwinkle, focus rings go cream. Components carry this as a `tone="inverse"` (Tabs) or `variant="inverse"` (Button) prop — never hand-patch colours at the call site.

### Transparency & blur — when

Only three cases: (1) glass over colour/imagery, (2) scrims (`--overlay-scrim`, indigo-black at 44%), (3) borders and inner highlights on coloured surfaces. Body text is never transparent — use `--text-muted` instead of white-at-60%.

---

## ICONOGRAPHY

**No icon set was supplied** — the palette sheet contains no glyphs, and no codebase was attached.

**Substitution (flagged):** the system standardises on **[Lucide](https://lucide.dev)**, loaded from CDN (`https://unpkg.com/lucide@latest`), because its 24×24 / 2px-stroke geometry matches the brand's 1.5–2px stroke drawing and square-ish corners. All UI glyphs go through the `Icon` component, which normalises size and stroke. **If Kite has its own icon set, send it and we will replace Lucide wholesale — the `Icon` API will not change.**

Rules:

- **One set only.** Outline/stroke, never filled, never duotone, never a second library mixed in.
- **Sizes:** 16px (inline with text and in 32px controls), 20px (default, in 40px controls), 24px (nav, 48px controls). Stroke stays `1.75` at 16–20px, `2` at 24px — never scale a 16px icon up.
- **Colour** is always `currentColor`. Icons inherit the text colour of their context; a coral icon means an error, an indigo icon means a selected nav item.
- **Never decorative.** An icon either replaces a label in a square control (with an accessible name) or sits 8px before a label. No icon-only feature cards, no icon grids as ornament.
- **Emoji: never** (see Content Fundamentals). **Unicode as icons:** only `→` in CTAs and `·` as a metadata separator. No `✓`, `★`, `⚡`, box-drawing or arrows in tables — those are Lucide glyphs.
- **Logos and marks** live in `assets/`; they are the only non-Lucide vector art in the system.

---

## Primary use

This system exists to build **the Kite website**. The build order that works:

1. Link `styles.css` — that one file carries fonts, colours, washes, type roles, spacing, radii, shadows and motion.
2. Read **VISUAL FOUNDATIONS → The atmosphere** below, then `site/SECTIONS.md` for the section-by-section spec of the approved homepage.
3. Compose pages from those sections. Use the components in `components/` for every control — never restyle a button inline.
4. Keep copy inside CONTENT FUNDAMENTALS / `guidelines/voice.md`.

`ui_kits/console/` is a product-app recreation, kept so in-page app mockups and product screenshots stay consistent with the site. There is deliberately **no marketing UI kit** — the site is being built directly against this system.

## Using this system

Consumers link `styles.css` and pull components off the compiled window namespace. Adherence rule of thumb: **no raw hex, no raw px for type, no fourth font.** If a value you need isn't a token, that's a gap in the system — add the token rather than hard-coding.


## Components

17 components, grouped by concern. Each has a `.jsx`, a `.d.ts` props contract and a `.prompt.md` usage note.

- **core** — Button, IconButton, Icon, Card, Badge, Tag
- **forms** — Field, Input, Textarea, Select, Checkbox, Radio, Switch
- **navigation** — Tabs
- **feedback** — Dialog, Toast, Tooltip

Starting points: Button, Card (Core) · Input (Forms) · Tabs (Navigation) · Dialog (Feedback) · the Console app shell.
