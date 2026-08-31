import React from 'react';
import './Ticker.css';
import { Icon } from '../core/Icon';

export function Ticker() {
  return (
    <div className="kite-ticker full-bleed">
      <div className="container kite-ticker-content">
        <div className="kite-ticker-text">
          KITE ANNOUNCES NEW SIMULATION ENVIRONMENTS FOR AGENT TRAINING
        </div>
        <a href="#pulse" className="kite-ticker-link">
          Learn more <Icon name="ArrowRight" size={16} />
        </a>
      </div>
    </div>
  );
}
