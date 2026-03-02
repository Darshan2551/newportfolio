import React, { memo, useEffect, useRef, useState } from 'react';
import './SkillsSection.css';

const SKILL_CATEGORIES = [
  {
    id: 'ai-cv',
    title: 'AI & Computer Vision',
    skills: [
      'Python',
      'OpenCV',
      'MediaPipe',
      'TensorFlow',
      'LangChain',
      'Multi-Agent LLM Systems',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    skills: ['React', 'Responsive UI Development', 'JavaScript (ES6+)'],
  },
  {
    id: 'backend',
    title: 'Backend',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'PHP'],
  },
  {
    id: 'iot-systems',
    title: 'IoT & Systems',
    skills: ['Raspberry Pi 5', 'Ubuntu IoT', 'MagicMirror', 'Secure Automation Systems'],
  },
].map((category, index) => ({
  ...category,
  delay: `${index * 0.16}s`,
}));

const SkillsCard = memo(({ title, skills, delay }) => (
  <article
    className="skills-card"
    style={{ '--card-delay': delay }}
    role="listitem"
    aria-label={`${title} category`}
  >
    <h3 className="skills-card-title">{title}</h3>

    <ul className="skills-badges" aria-label={`${title} skills`}>
      {skills.map((skill) => (
        <li key={skill} className="skill-badge">
          {skill}
        </li>
      ))}
    </ul>
  </article>
));

SkillsCard.displayName = 'SkillsCard';

const SkillsSection = () => {
  const sectionRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const parallaxRafRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger reveal animations only once for performance and stability.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    const node = sectionRef.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, []);

  // Lightweight parallax for decorative shapes, throttled via requestAnimationFrame.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const handlePointerMove = (event) => {
      if (parallaxRafRef.current) return;

      parallaxRafRef.current = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
        const yRatio = (event.clientY - rect.top) / rect.height - 0.5;

        node.style.setProperty('--parallax-x', `${xRatio * 14}px`);
        node.style.setProperty('--parallax-y', `${yRatio * 14}px`);
        parallaxRafRef.current = 0;
      });
    };

    const handlePointerLeave = () => {
      node.style.setProperty('--parallax-x', '0px');
      node.style.setProperty('--parallax-y', '0px');
    };

    node.addEventListener('pointermove', handlePointerMove, { passive: true });
    node.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerleave', handlePointerLeave);
      cancelAnimationFrame(parallaxRafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`skills-section ${isVisible ? 'fade-in is-visible' : ''}`}
      aria-labelledby="skills-title"
    >
      <div className="skills-bg-shape shape-one" aria-hidden="true" />
      <div className="skills-bg-shape shape-two" aria-hidden="true" />
      <div className="skills-bg-shape shape-three" aria-hidden="true" />

      <div className="skills-container">
        <header className="skills-header">
          <h2 id="skills-title" className="skills-title">
            Technical Expertise
          </h2>
        </header>

        <div className="skills-grid" role="list" aria-label="Technical skill categories">
          {SKILL_CATEGORIES.map((category) => (
            <SkillsCard
              key={category.id}
              title={category.title}
              skills={category.skills}
              delay={category.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(SkillsSection);
