# Sinom ARA product content redesign

## Objective

Redesign only the content below the existing bottle animation on the Sinom ARA landing page. The result should balance premium heritage storytelling with a clear path to ordering through the verified Instagram account.

The bottle animation and its implementation remain unchanged.

## Audience and outcome

The primary audience is residents of Malang looking for an authentic traditional Javanese drink. The page should help visitors quickly understand what Sinom ARA is, why its ingredients and local preparation matter, and how to order a fresh weekly batch.

Success means the content feels credible and premium while making the Instagram ordering action obvious and easy to use.

## Creative direction

Use an editorial tasting journey that combines heritage typography with modern product presentation. Preserve the confirmed dark charcoal background, amber `#c9a96e` accent, and Outfit typeface. Add hierarchy through scale, spacing, fine rules, warm tinted surfaces, subtle texture, and asymmetric composition.

The redesign must avoid generic equal-height card rows, repeated centered sections, excessive effects, and motion that competes with the bottle sequence.

## Scope

### Included

- Redesign `LandingContent` and page-specific supporting styles used below the animation.
- Improve the heritage, ingredient, craft, product-order, and footer content.
- Use the project's installed Motion Components package for restrained interaction and viewport motion.
- Improve responsive behavior, accessibility, focus states, and semantic structure.
- Remove unverified or unsupported content.

### Excluded

- Any visual or behavioral change to `DrinkAnimation`.
- Changes to the bottle image sequence or its loading behavior.
- New ordering forms, checkout, backend services, analytics, or account features.
- Invented prices, testimonials, stockists, certifications, phone numbers, or health claims.
- Framework or styling-library migration.

## Information architecture

The below-animation content consists of five sections.

### 1. Origin

Open with an asymmetric editorial introduction that identifies Sinom ARA as a traditional Javanese drink brewed in Malang. Pair a strong headline with short factual copy about the product's local roots, small-batch preparation, and lack of artificial preservatives.

The transition from the cinematic animation should feel deliberate: the black hero settles into a warmer charcoal surface with generous whitespace and a small amber location marker.

### 2. Ingredients

Present the three verified ingredients in one composed visual field rather than three disconnected cards:

1. Young tamarind leaves
2. Fresh turmeric
3. Palm sugar

Use oversized numbering, fine dividers, and restrained CSS or inline SVG botanical forms as decorative support. Ingredient copy should describe flavor and role in the drink without unsupported medical or nutritional claims.

### 3. Taste and craft

Combine concise tasting notes with the weekly small-batch process. The taste vocabulary is sweet, sour, earthy, and refreshing. The process copy should remain limited to known facts: fresh ingredients, small batches, and weekly brewing in Malang.

Use a split editorial composition on larger screens and a logical single-column reading order on mobile.

### 4. Product and ordering

Create the strongest conversion moment on the page. State that fresh batches are brewed weekly in Malang and direct visitors to the verified Instagram account at `https://www.instagram.com/sinomaramalang/`.

The Instagram action is the only primary CTA. Do not display unavailable pricing or an unverified WhatsApp contact. The CTA must remain understandable and usable without animation.

### 5. Footer

Keep the footer minimal: Sinom ARA, Malang in East Java, the verified Instagram link, and the current copyright year. Do not include unverified contact channels or a large link directory.

## Visual system

- Continue using the confirmed Outfit font; vary weight, size, line height, and tracking to create an editorial hierarchy.
- Retain the charcoal and amber brand palette while introducing a slightly warmer secondary charcoal surface for depth.
- Use one accent color only.
- Constrain body copy to readable line lengths of roughly 50–65 characters.
- Use asymmetric CSS Grid layouts at tablet and desktop widths.
- Collapse to one column on narrow screens without changing the semantic reading order.
- Vary border radius intentionally; prefer fine rules and surface shifts over generic bordered cards and shadows.
- Add a subtle non-interactive grain or micro-pattern without reducing text contrast.
- Ensure all meaningful text meets WCAG AA contrast expectations.

## Motion design

Use Motion Components as progressive enhancement:

- `motion-reveal` introduces section labels, headlines, and supporting copy with short travel distances.
- `motion-stagger` sequences ingredient and process items.
- `motion-hover` adds restrained lift or emphasis to interactive product elements.
- `motion-press` supplies tactile feedback on the primary CTA.
- `motion-magnetic` is reserved for the Instagram CTA on devices where pointer interaction makes sense.

Motion must not control layout or content visibility permanently. If custom elements fail to register, all content and links remain visible and functional. The implementation must respect `prefers-reduced-motion`, including Motion Components' built-in behavior, and avoid additional continuous or scroll-scrubbed animation below the hero.

## Component boundaries

`LandingContent` remains the entry point for everything below the animation. Extract focused subcomponents only where doing so makes the content structure easier to understand or keeps a file within the project's size guidance. Suggested boundaries are origin, ingredients, taste-and-craft, order panel, and footer.

Static product facts should live in immutable arrays or objects and be rendered predictably. Decorative components must be isolated from content so they can fail or be removed without affecting meaning.

No new runtime dependency is required because Motion Components is already installed.

## Accessibility and resilience

- Use semantic `section`, heading, list, link, and footer elements.
- Preserve a single logical heading hierarchy below the page's existing `h1`.
- Provide visible keyboard focus states for every link.
- Give external links clear accessible names and use `target="_blank"` with `rel="noopener noreferrer"` where appropriate.
- Mark decorative SVG and texture layers as hidden from assistive technology.
- Do not rely on hover, color, animation, or imagery alone to communicate information.
- Keep content visible when JavaScript is delayed or Motion Components cannot load.

## Content rules

Permitted factual claims are:

- Sinom is a traditional Javanese drink.
- Sinom ARA is brewed in Malang.
- It uses young tamarind leaves, fresh turmeric, and palm sugar.
- It is prepared in small batches without artificial preservatives.
- Fresh batches are brewed weekly.

Remove the current antioxidant, anti-inflammatory, digestive-support, vitamin, and glycemic-index statements because supporting evidence has not been provided. Do not introduce replacement health claims.

## Verification

The implementation is complete only after:

1. Lint and production build pass.
2. The below-animation layout is visually checked at representative mobile, tablet, and desktop widths.
3. The existing bottle animation is confirmed unchanged and still transitions correctly into the redesigned content.
4. Keyboard navigation reaches the Instagram links with visible focus.
5. The verified Instagram destination is correct and external-link security attributes are present.
6. Reduced-motion behavior is checked.
7. Content remains readable if Motion Components does not animate or register.
8. No unverified WhatsApp number, price, testimonial, or health claim remains.

