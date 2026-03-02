import React, { useEffect, useMemo, useRef, useState } from 'react';
import './AboutSection.css';

const stats = [
  { label: 'Projects Completed', value: 48, suffix: '+' },
  { label: 'Years Experience', value: 6, suffix: '+' },
  { label: 'Happy Clients', value: 32, suffix: '+' },
];

const cards = [
  {
    title: 'Craft & Quality',
    description:
      'I design and build polished digital experiences with attention to performance, accessibility, and detail.',
  },
  {
    title: 'Product Thinking',
    description:
      'I balance technical execution with user and business goals to deliver outcomes that matter.',
  },
  {
    title: 'Collaboration',
    description:
      'I work closely with teams, communicate clearly, and iterate quickly from feedback to ship faster.',
  },
];

const Counter = ({ end, duration = 1200, start = false, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    let startTime = null;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const update = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = easeOutCubic(progress);
      setCount(Math.floor(end * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(update);
      } else {
        setCount(end);
      }
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, end, duration]);

  return (
    <span className="about-section__counter">
      {count}
      {suffix}
    </span>
  );
};

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const statItems = useMemo(
    () =>
      stats.map((stat) => (
        <div key={stat.label} className="about-section__stat card-hover">
          <Counter end={stat.value} suffix={stat.suffix} start={isVisible} />
          <p>{stat.label}</p>
        </div>
      )),
    [isVisible]
  );

  return (
    <section ref={sectionRef} className={`about-section ${isVisible ? 'is-visible' : ''}`}>
      <div className="about-section__header">
        <h2 className="about-section__title">About Me</h2>
        <p className="about-section__intro">
          I build clean, performant web applications with a strong focus on usability and delightful
          interactions.
        </p>
      </div>

      <div className="about-section__stats">{statItems}</div>

      <div className="about-section__cards">
        {cards.map((card, index) => (
          <article
            key={card.title}
            className="about-section__card card-hover"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
