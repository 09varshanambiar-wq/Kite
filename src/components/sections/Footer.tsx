import React from 'react';
import './Footer.css';
import { Icon } from '../core/Icon';

export function Footer() {
  return (
    <footer className="kite-footer full-bleed" id="contact">
      <div className="container kite-footer-content">
        <div className="kite-footer-top">
          <h2 className="kite-footer-logo wordmark">Kite.</h2>
          
          <div className="kite-footer-links">
            <div className="kite-footer-column">
              <a href="#">Company</a>
              <a href="#">Pulse</a>
              <a href="#">Products</a>
              <a href="#">Customers</a>
            </div>
            <div className="kite-footer-column">
              <a href="#">Locations</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">API</a>
            </div>
            
            <div className="kite-footer-contact">
              <a href="#" className="kite-footer-contact-link">
                Build with Kite <Icon name="ArrowRight" size={16} />
              </a>
              <p className="type-body-small">
                For building simulated worlds<br />
                hello@kite.ai / 1 800 555 0199
              </p>
            </div>
          </div>
        </div>
        
        <div className="kite-footer-bottom">
          <div className="kite-footer-socials">
            <a aria-label="Twitter"><Icon name={"Twitter" as any} size={16} /></a>
            <a aria-label="GitHub"><Icon name={"Github" as any} size={16} /></a>
            <a aria-label="LinkedIn"><Icon name={"Linkedin" as any} size={16} /></a>
            <a aria-label="YouTube"><Icon name={"Youtube" as any} size={16} /></a>
            <a aria-label="Instagram"><Icon name={"Instagram" as any} size={16} /></a>
          </div>
          <p className="type-body-small kite-footer-legal">© Kite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
