import React from 'react';
import './LiveProducts.css';
import { Card } from '../core/Card';
import { Button } from '../core/Button';

export function LiveProducts() {
  return (
    <section className="kite-products" id="pulse">
      <div className="kite-products-wash"></div>
      
      <div className="container kite-products-content">
        <h2 className="type-h2 kite-products-title">Our live products</h2>
        
        <div className="kite-products-carousel">
          <Card variant="glass" className="kite-product-card kite-product-card--left">
            <div className="kite-product-header">
              <h3 className="type-h3">Kite VI</h3>
              <span className="kite-product-badge">Live</span>
            </div>
            <p className="type-body-small text-muted">
              Visual intelligence for simulated environments.
            </p>
          </Card>
          
          <Card variant="glass" className="kite-product-card kite-product-card--center">
            <div className="kite-product-header">
              <h3 className="type-h3">Kite Pulse</h3>
              <span className="kite-product-badge">Live</span>
            </div>
            <p className="type-body text-muted">
              Discovering the patterns that models learn from.
            </p>
          </Card>
          
          <Card variant="glass" className="kite-product-card kite-product-card--right">
            <div className="kite-product-header">
              <h3 className="type-h3">Kite Superconnectors</h3>
              <span className="kite-product-badge">Coming soon</span>
            </div>
            <p className="type-body-small text-muted">
              Connecting disparate AI systems seamlessly.
            </p>
          </Card>
        </div>
        
        <div className="kite-products-action">
          <Button variant="primary">See all live</Button>
        </div>
      </div>
    </section>
  );
}
