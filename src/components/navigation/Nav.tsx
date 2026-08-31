import React from 'react';
import './Nav.css';
import { Button } from '../core/Button';

export function Nav() {
  return (
    <nav className="kite-nav">
      <div className="kite-nav-pill container">
        <div className="kite-nav-brand">
          <span className="wordmark">Kite.</span>
        </div>
        <div className="kite-nav-links">
          <a href="#products">Products</a>
          <a href="#labs">Labs</a>
          <a href="#thinking">Thinking</a>
          <a href="#team">Team</a>
        </div>
        <div className="kite-nav-actions">
          <Button variant="primary" size="sm" icon="ArrowUpRight" iconPosition="right">ENGAGE</Button>
        </div>
      </div>
    </nav>
  );
}
