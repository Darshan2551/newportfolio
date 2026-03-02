import React, { useEffect, useState } from 'react';
import './ProjectsSection.css';

const projects = [
  {
    id: 1,
    title: 'Portfolio Website',
    shortDescription: 'A responsive personal portfolio built with React.',
    extendedDescription:
      'This project includes reusable UI components, smooth scrolling navigation, dynamic project cards, and accessibility-focused interactions. It uses modern React patterns, responsive CSS, and optimized assets for performance.',
  },
  {
    id: 2,
    title: 'Task Manager App',
    shortDescription: 'A productivity app for organizing tasks and priorities.',
    extendedDescription:
      'The task manager supports filtering, sorting, drag-and-drop task organization, and persistent state management. It was designed with a clean UX, transition effects, and component-based architecture.',
  },
  {
    id: 3,
    title: 'E-commerce UI Concept',
    shortDescription: 'A polished front-end concept for an online store.',
    extendedDescription:
      'This UI concept features product listing grids, category filtering, a cart preview interaction, and motion-based micro-interactions. The design focuses on conversion, readability, and fluid navigation across screen sizes.',
  },
];

function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    return undefined;
  }, [selectedProject]);

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const onOverlayMouseDown = () => {
    closeModal();
  };

  const onModalMouseDown = (event) => {
    event.stopPropagation();
  };

  return (
    <section className="projects-section" id="projects">
      <div className="projects-container">
        <h2 className="projects-title">Projects</h2>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.shortDescription}</p>
              <button
                type="button"
                className="details-button"
                onClick={() => openModal(project)}
              >
                View Details
              </button>
            </article>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div
          className="project-modal-overlay"
          onMouseDown={onOverlayMouseDown}
          role="presentation"
        >
          <div
            className="project-modal open"
            onMouseDown={onModalMouseDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <button
              type="button"
              className="modal-close-button"
              onClick={closeModal}
              aria-label="Close project details"
            >
              ×
            </button>
            <h3 id="project-modal-title">{selectedProject.title}</h3>
            <p>{selectedProject.extendedDescription}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProjectsSection;
