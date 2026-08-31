import React from 'react';
import './Experiments.css';
import { Card } from '../core/Card';
import { Icon } from '../core/Icon';

export function Experiments() {
  return (
    <section className="kite-experiments" id="labs">
      <div className="kite-experiments-wash"></div>
      <div className="container">
        <h2 className="type-h2 kite-experiments-title">Our pool of experiments</h2>
        
        <div className="kite-experiments-grid">
          <Card variant="solid" className="kite-experiment-card kite-cut-tr">
            <div className="kite-experiment-header">
              <Icon name="Sun" size={16} className="kite-experiment-icon" />
              <h4 className="type-h3">Atlas</h4>
            </div>
            <p className="type-body-small text-muted kite-experiment-desc">
              World generation parameters and physics simulations.
            </p>
            <div className="kite-experiment-visual">
              <div className="kite-experiment-graphic kite-experiment-graphic--1"></div>
            </div>
          </Card>

          <Card variant="solid" className="kite-experiment-card kite-cut-tr">
            <div className="kite-experiment-header">
              <Icon name="Droplet" size={16} className="kite-experiment-icon" />
              <h4 className="type-h3">Fluid</h4>
            </div>
            <p className="type-body-small text-muted kite-experiment-desc">
              Adaptive data flow for real-time model ingestion.
            </p>
            <div className="kite-experiment-visual">
              <div className="kite-experiment-graphic kite-experiment-graphic--2"></div>
            </div>
          </Card>

          <Card variant="solid" className="kite-experiment-card kite-cut-tr">
            <div className="kite-experiment-header">
              <Icon name="Share2" size={16} className="kite-experiment-icon" />
              <h4 className="type-h3">Superconnectors</h4>
            </div>
            <p className="type-body-small text-muted kite-experiment-desc">
              Cross-model communication channels.
            </p>
            <div className="kite-experiment-visual">
              <div className="kite-experiment-graphic kite-experiment-graphic--3"></div>
            </div>
          </Card>
          
          <Card variant="solid" className="kite-experiment-card kite-cut-tr">
            <div className="kite-experiment-header">
              <Icon name="Box" size={16} className="kite-experiment-icon" />
              <h4 className="type-h3">Void</h4>
            </div>
            <p className="type-body-small text-muted kite-experiment-desc">
              Handling edge cases in absence of data.
            </p>
            <div className="kite-experiment-visual">
              <div className="kite-experiment-graphic kite-experiment-graphic--4"></div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
