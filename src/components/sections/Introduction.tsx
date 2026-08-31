import React from 'react';
import './Introduction.css';

export function Introduction() {
  return (
    <section className="kite-intro">
      <div className="kite-intro-wash"></div>
      <div className="container kite-intro-content">
        <div className="kite-intro-left">
          <h2 className="type-h2">Let Kite be your<br />flying partner!</h2>
          <p className="type-body kite-intro-desc">
            Train your AI models with simulated environments so they learn faster.
          </p>
        </div>
        <div className="kite-intro-right">
          <div id="simulation-dock" style={{ height: '220px', width: '100%', marginBottom: '2rem' }}></div>
          <div className="type-eyebrow kite-intro-eyebrow">Simulated Environments</div>
          <p className="type-body">
            Train real-world models in simulated worlds where systems can encounter different variations, randomizations, respond to change and learn from the outcome.
          </p>
        </div>
      </div>
    </section>
  );
}
