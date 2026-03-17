import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './ProjectsSection.css';

const projects = [
  {
    id: 'p1',
    title: 'Nova Commerce',
    description: 'Headless commerce platform with high-performance storefront delivery.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tech: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    details:
      'Implemented reusable UI primitives, optimized server-rendering, and reduced checkout drop-off through accessibility-focused UX improvements.',
    href: '#',
  },
  {
    id: 'p2',
    title: 'Atlas Analytics',
    description: 'Real-time observability dashboard for distributed data pipelines.',
    image:
      'https://images.unsplash.com/photo-1551281044-8b54a7f3f5fb?auto=format&fit=crop&w=1200&q=80',
    tech: ['React', 'D3', 'WebSocket', 'PostgreSQL'],
    details:
      'Designed chart rendering strategies for large datasets and introduced progressive hydration patterns for first-load speed gains.',
    href: '#',
  },
  {
    id: 'p3',
    title: 'Verde Mobility',
    description: 'Smart logistics coordination suite for sustainable fleet routing.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    tech: ['React', 'Maps API', 'Redis', 'Python'],
    details:
      'Shipped route simulation workflows with resilient retry orchestration and built accessible forms for mission-critical dispatch actions.',
    href: '#',
  },
];

const ProjectCard = memo(function ProjectCard({ project, onOpen, visible }) {
  const cardClassName = useMemo(
    () => `project-card${visible ? ' visible' : ''}`,
    [visible]
  );

  return (
    <article className={cardClassName}>
      <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
      <div className="project-card-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul className="project-tech" aria-label={`${project.title} technologies`}>
          {project.tech.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button type="button" onClick={() => onOpen(project.id)} className="project-open-btn">
          View Details
        </button>
      </div>
    </article>
  );
});

export default function ProjectsSection() {
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);
  const modalRef = useRef(null);
  const triggerButtonRef = useRef(null);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [activeProjectId]
  );

  const closeModal = useCallback(() => {
    setActiveProjectId(null);
    if (triggerButtonRef.current) {
      triggerButtonRef.current.focus();
    }
  }, []);

  const openModal = useCallback((projectId) => {
    const focused = document.activeElement;
    if (focused instanceof HTMLButtonElement) {
      triggerButtonRef.current = focused;
    }
    setActiveProjectId(projectId);
  }, []);

  useEffect(() => {
    if (!activeProject) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeProject, closeModal]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || hasAnimated) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      <div className="projects-header">
        <h2>Featured Projects</h2>
        <p>Selected products focused on performance, accessibility, and polished user experience.</p>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={openModal} visible={hasAnimated} />
        ))}
      </div>

      {activeProject && (
        <div className="project-modal-overlay" onClick={closeModal} role="presentation">
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            aria-describedby="project-modal-description"
            ref={modalRef}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="project-modal-close"
              aria-label="Close project details"
              onClick={closeModal}
            >
              ×
            </button>
            <h3 id="project-modal-title">{activeProject.title}</h3>
            <p id="project-modal-description">{activeProject.details}</p>
            <a href={activeProject.href} className="project-modal-link">
              Open Project
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
