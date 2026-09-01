import './Hero.css';
import { Button } from '../core/Button';

const CAPABILITIES = [
  {
    src: '/scene1-magnet_3.gif',
    alt: 'A magnet drawing scattered data points together',
    label: 'Real-time intelligence',
    blurb: 'Signals gathered and understood the moment they happen.',
  },
  {
    src: '/scene2-voice.gif',
    alt: 'Data points converging into a spoken waveform',
    label: 'Voice intelligence',
    blurb: 'Natural conversation that adapts as it listens.',
  },
  {
    src: '/scene3-funnel_2.gif',
    alt: 'Data falling through a funnel into ordered results',
    label: 'Long form reasoning',
    blurb: 'Sprawling context distilled into a clear answer.',
  },
];

export function Hero() {
  return (
    <section className="kite-hero">
      <div className="kite-hero-wash"></div>

      <div className="container kite-hero-content">
        <div className="kite-hero-statement">
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

        <ul className="kite-hero-capabilities">
          {CAPABILITIES.map((capability) => (
            <li className="kite-capability" key={capability.label}>
              <div className="kite-capability-media">
                <img src={capability.src} alt={capability.alt} />
              </div>
              <h2 className="kite-capability-label">{capability.label}</h2>
              <p className="kite-capability-blurb">{capability.blurb}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
