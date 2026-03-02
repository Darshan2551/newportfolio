import { MouseEvent, useCallback, useMemo, useRef, useState } from 'react';
import styles from './ProjectsSection.module.css';

type Project = {
  title: string;
  description: string;
  tags: string[];
  href: string;
};

type ProjectsSectionProps = {
  projects: Project[];
};

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseMove = useCallback((event: MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || !sectionRef.current) return;

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      sectionRef.current.style.setProperty('--pointer-x', `${x.toFixed(2)}%`);
      sectionRef.current.style.setProperty('--pointer-y', `${y.toFixed(2)}%`);
    });
  }, []);

  const cards = useMemo(
    () =>
      projects.map((project, index) => {
        const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

        return (
          <article
            key={project.title}
            className={`${styles.card} ${isDimmed ? styles.dimmed : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className={styles.cardInner}>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDescription}>{project.description}</p>
              <ul className={styles.tags}>
                {project.tags.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
              <a className={styles.link} href={project.href}>
                View project
              </a>
            </div>
          </article>
        );
      }),
    [hoveredIndex, projects]
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      onMouseMove={handleMouseMove}
      aria-label="Projects"
    >
      <div className={styles.backgroundAccent} aria-hidden="true" />
      <header className={styles.header}>
        <h2 className={styles.title}>Projects</h2>
      </header>
      <div className={styles.grid}>{cards}</div>
    </section>
  );
}
