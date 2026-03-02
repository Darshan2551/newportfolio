import React, { useEffect, useRef, useState } from "react";
import "./AchievementsSection.css";

const achievements = [
  {
    id: 1,
    title: "Hackathon Winner",
    organization: "InnovateX Global Challenge",
    period: "2024",
    description:
      "Led a 4-member team to build an AI-powered accessibility assistant and secured 1st place among 200+ teams.",
    badge: "Winner"
  },
  {
    id: 2,
    title: "AWS Certified Developer",
    organization: "Amazon Web Services",
    period: "2023",
    description:
      "Earned professional certification by demonstrating cloud-native design, deployment, and monitoring expertise.",
    badge: "Certified"
  },
  {
    id: 3,
    title: "Open Source Contributor",
    organization: "Community Projects",
    period: "2022 - Present",
    description:
      "Contributed performance and accessibility improvements across multiple frontend repositories and design systems.",
    badge: "Contributor"
  }
];

const AchievementsSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const current = sectionRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // trigger only once
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="achievements" id="achievements" ref={sectionRef}>
      <div className="achievements__header">
        <p className="achievements__eyebrow">Milestones</p>
        <h2 className="achievements__title">Achievements</h2>
        <p className="achievements__subtitle">
          Professional highlights that reflect consistent growth, impact, and
          technical excellence.
        </p>
      </div>

      <div className={`timeline ${isVisible ? "timeline--visible" : ""}`}>
        <div className="timeline__line" aria-hidden="true" />

        {achievements.map((achievement, index) => (
          <article
            className={`timeline__item ${isVisible ? "timeline__item--visible" : ""}`}
            style={{ "--stagger": `${index * 160}ms` }}
            key={achievement.id}
          >
            <span className="timeline__dot" aria-hidden="true" />

            <div className="timeline__content">
              <header className="timeline__content-header">
                <h3 className="timeline__item-title">{achievement.title}</h3>
                <span className="timeline__badge">{achievement.badge}</span>
              </header>

              <p className="timeline__meta">
                {achievement.organization} · {achievement.period}
              </p>

              <p className="timeline__description">{achievement.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AchievementsSection;
