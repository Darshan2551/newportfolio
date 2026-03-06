import React, { useEffect, useRef, useState } from "react";
import "./AchievementsSection.css";

const achievements = [
  {
    title: "Hydra Hacks Hackathon",
    year: "2025",
    badge: "Top 10",
    description:
      "Built a multi-agent AI system using Gemini LLM with algebraic and logical validation agents, finishing as a Top 10 finalist among 45+ teams.",
  },
  {
    title: "Tek-Nothon",
    year: "2025",
    badge: "Certified Demo",
    description:
      "Built a gesture-controlled automation system enabling real-time mouse and keyboard control, and received project demonstration certification.",
  },
  {
    title: "National Level FDP Competition",
    year: "2023",
    badge: "2nd Place",
    description:
      "Developed logic-based Scratch games and secured 2nd place at the national level.",
  },
];

function AchievementsSection() {
  const sectionRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll(".timeline-item") || [];

    // Observe each timeline card and reveal it when it enters viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="achievements-section"
      id="achievements"
      aria-labelledby="achievements-heading"
      ref={sectionRef}
    >
      <div className="section-inner">
        <h2 id="achievements-heading" className="section-title">
          Hackathons &amp; Achievements
        </h2>

        <div className="timeline" role="list">
          {/* Vertical timeline track with animated gradient pulse. */}
          <span className="timeline-line" aria-hidden="true" />

          {achievements.map((item, index) => {
            const isVisible = visibleItems.includes(index);

            return (
              <article
                key={`${item.title}-${item.year}`}
                className={`timeline-item ${isVisible ? "is-visible" : ""}`}
                data-index={index}
                role="listitem"
              >
                <div className="timeline-dot" aria-hidden="true" />

                <div className="achievement-card">
                  <header className="card-header">
                    <p className="achievement-year">{item.year}</p>
                    <span className="achievement-badge">{item.badge}</span>
                  </header>

                  <h3 className="achievement-title">{item.title}</h3>
                  <p className="achievement-description">{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AchievementsSection;
