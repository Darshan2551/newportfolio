import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import './AboutSection.css';

const STATS = [
  { id: 'projects', label: 'Major AI Projects', value: 4, suffix: '+' },
  { id: 'hackathon', label: 'Hackathon Finalist', value: 10, prefix: 'Top ' },
  { id: 'bca', label: 'BCA Score', value: 89, suffix: '%' },
];

const AboutSection = () => {
  const sectionRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const frameRef = useRef(0);

  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(() => STATS.map(() => 0));

  const headingId = 'about-title';

  // Observe section once to avoid repeated scroll-triggered work.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    const node = sectionRef.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, []);

  // Perform count-up with rAF and skip state updates when values are unchanged.
  useEffect(() => {
    if (!isVisible) return;

    const durationMs = 1700;
    const startedAt = performance.now();

    const easeOutCubic = (t) => 1 - (1 - t) ** 3;

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      const eased = easeOutCubic(progress);
      const nextCounts = STATS.map((stat) => Math.round(stat.value * eased));

      setCounts((prev) => {
        for (let i = 0; i < prev.length; i += 1) {
          if (prev[i] !== nextCounts[i]) return nextCounts;
        }
        return prev;
      });

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
  }, [isVisible]);

  const statCards = useMemo(
    () =>
      STATS.map((stat, index) => (
        <article
          key={stat.id}
          className={`stat-card ${isVisible ? 'stat-card-visible' : ''}`}
          style={{ '--delay': `${index * 0.2}s` }}
          role="listitem"
          aria-label={`${stat.prefix || ''}${counts[index]}${stat.suffix || ''} ${stat.label}`}
        >
          <h3 className="stat-value" aria-hidden="true">
            {stat.prefix || ''}
            {counts[index]}
            {stat.suffix || ''}
          </h3>
          <p className="stat-label">{stat.label}</p>
        </article>
      )),
    [counts, isVisible]
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`about-section ${isVisible ? 'fade-in' : ''}`}
      aria-labelledby={headingId}
    >
      <div className="about-gradient-overlay" aria-hidden="true" />
      <div className="about-accent-orb" aria-hidden="true" />

      <div className="about-container">
        <h2 id={headingId} className="about-title">
          About Me
        </h2>

        <p className="about-summary">
          Hybrid Full-Stack and AI developer building intelligent, scalable systems focused on
          computer vision, automation, and AI-driven products.
        </p>

        <div className="about-stats-grid" role="list" aria-label="Professional highlights">
          {statCards}
        </div>
      </div>
    </section>
  );
};

export default memo(AboutSection);
