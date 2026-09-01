import './Hero.css';

export function Hero() {
  return (
    <section className="kite-hero">
      <div className="kite-hero-wash"></div>

      <div className="container kite-hero-content">
        <div className="kite-hero-motions">
          <div className="kite-hero-motion">
            <img src="/scene1-magnet_2.gif" alt="Magnet attracting scattered data" />
          </div>
          <div className="kite-hero-motion">
            <img src="/scene2-voice_1.gif" alt="Voice signal forming a pattern" />
          </div>
          <div className="kite-hero-motion">
            <img src="/scene3-funnel_1.gif" alt="Data funnelling into a single stream" />
          </div>
        </div>

        <div className="kite-hero-copy-row">
          <h1 className="kite-hero-title">
            <span style={{ fontWeight: 'var(--weight-regular)' }}>Build worlds.</span><br />
            Train intelligence within.
          </h1>
          <p className="kite-hero-subtitle type-body">
            From custom simulated worlds to real-time intelligence that can learn, adapt and evolve within them.
          </p>
        </div>
      </div>
    </section>
  );
}
