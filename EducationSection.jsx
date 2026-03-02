import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import './EducationSection.css';

const DEFAULT_EDUCATION_ITEMS = [
  {
    id: 'bs-cs',
    degree: 'B.S. in Computer Science',
    institution: 'University Name',
    period: '2018 - 2022',
    description:
      'Focused on software engineering, distributed systems, and human-computer interaction.',
    highlights: ['Graduated with Honors', 'Capstone in scalable web architecture'],
  },
  {
    id: 'cert-web',
    degree: 'Advanced Web Development Certification',
    institution: 'Institute Name',
    period: '2023',
    description:
      'Specialized training in modern frontend architecture, accessibility, and performance optimization.',
    highlights: ['A11y-first UI patterns', 'Production-grade React best practices'],
  },
];

const EducationCard = memo(function EducationCard({ item }) {
  const { degree, institution, period, description, highlights } = item;

  return (
    <article className="education-card" aria-label={`${degree} at ${institution}`}>
      <header className="education-card__header">
        <h3 className="education-card__degree">{degree}</h3>
        <p className="education-card__institution">{institution}</p>
      </header>

      <p className="education-card__period" aria-label={`Study period: ${period}`}>
        {period}
      </p>

      <p className="education-card__description">{description}</p>

      {Array.isArray(highlights) && highlights.length > 0 ? (
        <ul className="education-card__highlights" aria-label="Program highlights">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
});

const EducationSection = memo(function EducationSection({
  items = DEFAULT_EDUCATION_ITEMS,
  title = 'Education',
  subtitle = 'Academic foundation and continuous learning journey',
  id = 'education',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const normalizedItems = useMemo(
    () =>
      (Array.isArray(items) ? items : []).map((item, index) => ({
        ...item,
        id: item?.id || `${item?.degree || 'education'}-${index}`,
      })),
    [items],
  );

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    let didReveal = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !didReveal) {
          didReveal = true;
          setIsVisible(true);
          observer.unobserve(entry.target);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.2,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`education-section ${isVisible ? 'is-visible' : ''}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="education-section__container">
        <header className="education-section__header">
          <h2 id={`${id}-title`} className="education-section__title">
            {title}
          </h2>
          {subtitle ? <p className="education-section__subtitle">{subtitle}</p> : null}
        </header>

        <div className="education-section__grid" role="list" aria-label="Education timeline entries">
          {normalizedItems.map((item) => (
            <div key={item.id} role="listitem" className="education-section__item">
              <EducationCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default EducationSection;
