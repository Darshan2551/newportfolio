import React, { useEffect, useRef, useState } from 'react';
import './AboutSection.css';

const statsConfig = [
  { label: 'Major AI Projects', value: 4, suffix: '+' },
  { label: 'Hackathon Finalist', value: 10, prefix: 'Top ' },
  { label: 'BCA Score', value: 89, suffix: '%' },
];

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(statsConfig.map(() => 0));
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Animate numbers smoothly once the section enters the viewport.
    const animationDuration = 1600;
    const startTime = performance.now();

    const animateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      setCounts(
        statsConfig.map((stat) => {
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          return Math.floor(stat.value * easedProgress);
        })
      );

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    const frameId = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(frameId);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`about-section ${isVisible ? 'visible' : ''}`}
      aria-labelledby="about-section-title"
    >
      <div className="about-content">
        <h2 id="about-section-title">About Me</h2>
        <p>
          Hybrid Full-Stack and AI developer building intelligent, scalable systems focused on
          computer vision, automation, and AI-driven products.
        </p>
      </div>

      <div className="stats-grid">
        {statsConfig.map((stat, index) => (
          <article className="stat-card" key={stat.label}>
            <h3>
              {stat.prefix || ''}
              <span>{counts[index]}</span>
              {stat.suffix || ''}
            </h3>
            <p>{stat.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
