import React, { useEffect, useRef, useState } from 'react';
import './ProjectsSection.css';

const projects = [
  {
    title: 'Code Nexus — AI Chatbot Project Repository',
    description:
      'An AI-powered repository platform featuring secure ZIP validation, streamlined project uploads, and an integrated LangChain chatbot for intelligent project discovery.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'LangChain'],
    githubUrl: '#',
    detailsUrl: '#',
  },
  {
    title: 'Facial Recognition Student System',
    description:
      'A real-time student recognition platform with live face detection and instant student information retrieval for faster, smarter attendance workflows.',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'MySQL'],
    githubUrl: '#',
    detailsUrl: '#',
  },
  {
    title: 'Gesture-Controlled Virtual Automation',
    description:
      'Touch-free virtual automation system enabling intuitive mouse and keyboard control through real-time hand-tracking gestures.',
    tech: ['Python', 'OpenCV', 'MediaPipe'],
    githubUrl: '#',
    detailsUrl: '#',
  },
  {
    title: 'Spell Bound Speculum — IoT Smart Mirror',
    description:
      'A smart mirror ecosystem delivering weather, news, and IoT controls with seamless Google Assistant integration for ambient intelligence at home.',
    tech: ['Raspberry Pi 5', 'Ubuntu', 'MagicMirror'],
    githubUrl: '#',
    detailsUrl: '#',
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`projects-section ${isVisible ? 'is-visible' : ''}`}
      aria-labelledby="projects-heading"
    >
      <div className="projects-inner">
        <header className="projects-header">
          <h2 id="projects-heading">Featured Projects</h2>
          <p>
            Premium, production-focused builds by Darshan T across AI systems,
            computer vision, backend architecture, and IoT automation.
          </p>
        </header>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>

              <ul className="tech-stack" aria-label={`${project.title} tech stack`}>
                {project.tech.map((item) => (
                  <li key={`${project.title}-${item}`}>{item}</li>
                ))}
              </ul>

              <div className="project-actions">
                <a
                  className="btn btn-secondary"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a className="btn btn-primary" href={project.detailsUrl}>
                  View Details
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
