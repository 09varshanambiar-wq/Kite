import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';
import { Button } from '../core/Button';
import { VoiceIntelligenceIsland } from '../illustrations/VoiceIntelligenceIsland';

export function Hero() {
  const [animStage, setAnimStage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [targetOffset, setTargetOffset] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    // Fast staggered appearance in a tight cluster
    for (let i = 1; i <= 5; i++) {
      timers.push(setTimeout(() => setAnimStage(i), i * 150));
    }
    
    // Smooth, seamless scatter blossoms outwards shortly after
    timers.push(setTimeout(() => setAnimStage(6), 5 * 150 + 300));
    
    // Setup scroll and resize listeners for the parallax dock effect
    const calculateTarget = () => {
      if (!nodeRef.current) return;
      const dock = document.getElementById('simulation-dock');
      if (dock) {
        // Temporarily reset transform to measure true origin
        const currentTransform = nodeRef.current.style.transform;
        nodeRef.current.style.transform = 'translate(-50%, -50%)';
        
        const nodeRect = nodeRef.current.getBoundingClientRect();
        const dockRect = dock.getBoundingClientRect();
        
        setTargetOffset({
          x: dockRect.left + dockRect.width / 2 - (nodeRect.left + nodeRect.width / 2),
          y: dockRect.top + dockRect.height / 2 - (nodeRect.top + nodeRect.height / 2)
        });

        // Restore transform
        nodeRef.current.style.transform = currentTransform;
      }
    };
    
    timers.push(setTimeout(calculateTarget, 2000));
    window.addEventListener('resize', calculateTarget);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', calculateTarget);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const progress = targetOffset.y > 0 ? Math.min(scrollY / targetOffset.y, 1) : 0;
  const currentY = targetOffset.y > 0 ? Math.min(scrollY, targetOffset.y) : scrollY;
  const currentX = targetOffset.x * progress;

  const parallaxStyle = animStage === 6 ? {
    transform: `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`,
    zIndex: progress > 0 ? 100 : 2, // Boost z-index when scrolling to stay above other sections
    transition: scrollY > 0 ? 'none' : ''
  } : {};

  const visualClass = `kite-hero-visual show-${Math.min(animStage, 5)} ${animStage === 6 ? 'is-scattered' : ''}`;

  return (
    <section className="kite-hero">
      <div className="kite-hero-wash"></div>
      
      <div className="container kite-hero-content">
        <div className="kite-hero-text">
          <h1 className="kite-hero-title">
            <span style={{ fontWeight: 'var(--weight-regular)' }}>Build worlds.</span><br />
            Train intelligence within.
          </h1>
          <p className="kite-hero-subtitle type-body">
            From custom simulated worlds to real-time intelligence that can learn, adapt and evolve within them.
          </p>
        </div>

        <div className={visualClass}>
          <div className="kite-hero-node kite-hero-node--random">
            <img src="/random.png" alt="Real-time Intelligence" />
            <span className="kite-hero-label">Real-time<br />Intelligence</span>
          </div>
          
          <div className="kite-hero-node kite-hero-node--superconnectors">
            <img src="/superconnectors.png" alt="Superconnectors" />
            <span className="kite-hero-label">Superconnectors</span>
          </div>

          <div className="kite-hero-node kite-hero-node--specialagents">
            <img src="/Specialagents.png" alt="Specialised Agents" />
            <span className="kite-hero-label">Specialised Agents</span>
          </div>
          
          <div className="kite-hero-node kite-hero-node--simulation" ref={nodeRef} style={parallaxStyle}>
            <img src="/simulation.png" alt="Simulated environments" />
            <span className="kite-hero-label">Simulated<br />environments</span>
          </div>
          
          <div className="kite-hero-node kite-hero-node--voice">
            <VoiceIntelligenceIsland />
            <span className="kite-hero-label">Voice Intelligence</span>
          </div>
        </div>
      </div>
    </section>
  );
}
