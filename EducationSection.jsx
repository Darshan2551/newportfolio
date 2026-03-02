import React, { useEffect, useRef, useState } from 'react';
import './EducationSection.css';

const educationData = [
  {
    id: 1,
    degree: 'Master of Computer Applications (MCA)',
    institution: 'The National Institute of Engineering, Mysore',
    yearLabel: 'Expected Graduation',
    year: '2026',
    highlight: 'MCA'
  },
  {
    id: 2,
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Seshadripuram College, Tumkur',
    yearLabel: 'Graduated',
    year: '2024',
    highlight: '89%'
  }
];

/**
 * EducationSection renders a premium, responsive education timeline-like grid.
 * - Uses IntersectionObserver to trigger fade-in animation on scroll.
 * - Maps from a data array for cleaner, scalable content management.
 */
const EducationSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;

    // Observe section visibility to trigger animation once when it enters viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  return (
    <section className="education-section" id="education" ref={sectionRef} aria-labelledby="education-heading">
      <div className="education-container">
        <header className="education-header">
          <h2 id="education-heading" className="education-title">
            Education
          </h2>
          <span className="education-title-accent" aria-hidden="true" />
        </header>

        <div className={`education-grid ${isVisible ? 'is-visible' : ''}`}>
          {educationData.map((item, index) => (
            <article
              className="education-card"
              key={item.id}
              style={{ '--delay': `${index * 120}ms` }}
            >
              <div className="education-card-top">
                <span className="education-badge">{item.highlight}</span>
              </div>

              <h3 className="education-degree">{item.degree}</h3>
              <p className="education-institution">{item.institution}</p>
              <p className="education-year">
                <strong>{item.yearLabel}:</strong> {item.year}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
