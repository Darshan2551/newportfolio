import { useEffect, useRef, useState } from 'react';
import './EducationSection.css';

const defaultEducation = [
  {
    degree: 'B.S. in Computer Science',
    institution: 'University Name',
    period: '2018 – 2022',
    description:
      'Focused on software engineering, distributed systems, and user-centered product development.',
  },
  {
    degree: 'Full-Stack Web Development Bootcamp',
    institution: 'Program Name',
    period: '2023',
    description:
      'Built production-ready projects using modern JavaScript, React, and backend APIs.',
  },
];

export default function EducationSection({
  title = 'Education',
  education = defaultEducation,
}) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const current = sectionRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    observer.observe(current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="education-section" id="education" ref={sectionRef}>
      <div className="education-bg-accent education-bg-accent--one" aria-hidden="true" />
      <div className="education-bg-accent education-bg-accent--two" aria-hidden="true" />

      <div className="education-section__header">
        <h2>{title}</h2>
        <span
          className={`education-section__divider ${
            isVisible ? 'education-section__divider--visible' : ''
          }`}
          aria-hidden="true"
        />
      </div>

      <div className="education-grid">
        {education.map((item, index) => (
          <article
            className={`education-card ${isVisible ? 'education-card--visible' : ''}`}
            style={{ '--stagger-delay': `${index * 120}ms` }}
            key={`${item.degree}-${item.institution}-${index}`}
          >
            <span className="education-card__accent" aria-hidden="true" />
            <h3 className="education-card__degree">{item.degree}</h3>
            <p className="education-card__institution">{item.institution}</p>
            {item.period && <p className="education-card__period">{item.period}</p>}
            {item.description && (
              <p className="education-card__description">{item.description}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
