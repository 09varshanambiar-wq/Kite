import React from 'react';
import './VoiceIntelligence.css';
import { Card } from '../core/Card';
import { Button } from '../core/Button';

export function VoiceIntelligence() {
  return (
    <section className="kite-voice" id="voice">
      <div className="container kite-voice-content">
        <div className="kite-voice-left">
          <div className="type-eyebrow kite-voice-eyebrow">Voice Intelligence</div>
          <h2 className="type-h2 kite-voice-title">
            Intelligence you can <span className="italic-accent">talk to.</span>
          </h2>
          <p className="type-body kite-voice-desc">
            Understanding AI that remembers where the world looks like, and gets better with every interaction.
          </p>
          
          <div className="kite-voice-input-group">
            <textarea 
              className="kite-voice-textarea" 
              placeholder="Talk to Kite..."
              rows={3}
            ></textarea>
            <div className="kite-voice-actions">
              <Button variant="ghost" icon="Plus" size="sm" />
              <Button variant="primary" icon="Mic" iconPosition="left" className="kite-voice-submit">
                Ask anything
              </Button>
            </div>
          </div>
        </div>
        
        <div className="kite-voice-right">
          <div className="kite-voice-grid">
            <Card variant="outline" interactive className="kite-voice-chip kite-voice-chip--1">
              <span className="type-body-small">Healthcare</span>
            </Card>
            <Card variant="outline" interactive className="kite-voice-chip kite-voice-chip--2">
              <span className="type-body-small">Logistics</span>
            </Card>
            <Card variant="outline" interactive className="kite-voice-chip kite-voice-chip--3">
              <span className="type-body-small">Finance</span>
            </Card>
            <Card variant="outline" interactive className="kite-voice-chip kite-voice-chip--4">
              <span className="type-body-small">Architecture</span>
            </Card>
            <Card variant="outline" interactive className="kite-voice-chip kite-voice-chip--5">
              <span className="type-body-small">Retail</span>
            </Card>
            <Card variant="outline" interactive className="kite-voice-chip kite-voice-chip--6">
              <span className="type-body-small">Engineering</span>
            </Card>
          </div>
          <svg className="kite-voice-connector" viewBox="0 0 200 300" preserveAspectRatio="none">
            <path d="M150 50 Q 50 150 100 250" className="connector-path-dashed" />
          </svg>
        </div>
      </div>
    </section>
  );
}
