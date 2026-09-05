import './Hero.css';
import { Button } from '../core/Button';
import { HeroScene } from '../illustrations/HeroScene';

export function Hero() {
  return (
    <section className="kite-hero">
      <div className="container kite-hero-statement">
        <h1 className="kite-hero-title">
          <span style={{ fontWeight: 'var(--weight-regular)' }}>Build worlds.</span><br />
          Train intelligence within.
        </h1>
        <p className="kite-hero-subtitle type-body">
          From custom simulated worlds to real-time intelligence that can learn, adapt and evolve within them.
        </p>
        <div className="kite-hero-action">
          <Button variant="primary" size="lg" icon="ArrowUpRight" iconPosition="right">
            ENGAGE
          </Button>
        </div>
      </div>

      <HeroScene />
    </section>
  );
}
