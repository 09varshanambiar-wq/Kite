import './HeroPlate.css';

/*
 * The hero illustration, generated with Gemini's Nano Banana Pro
 * (gemini-3-pro-image) from the style contract in
 * scripts/generate-hero-art.mjs — see that file to regenerate or to
 * produce the other scenes.
 *
 * The prompt reserved the top half of the frame as quiet sky, which is
 * what lets the headline sit over it. The page's own background is set
 * to the plate's exact sky colour (#F4EDDB) and the top of the image is
 * faded out, so there is no seam where the two meet.
 */
export function HeroPlate() {
  return (
    <div className="kite-plate" aria-hidden="true">
      <img src="/hero-festival.png" alt="" decoding="async" fetchPriority="high" />
    </div>
  );
}
