import React from 'react';
import './AchievementsSection.css';

export type Achievement = {
  year: string;
  title: string;
  subtitle?: string;
  description: string;
};

type AchievementsSectionProps = {
  achievements: Achievement[];
  id?: string;
  className?: string;
};

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
  id = 'achievements',
  className = '',
}) => {
  return (
    <section id={id} className={`achievements ${className}`.trim()} aria-labelledby="achievements-title">
      <div className="achievements__bg" aria-hidden="true">
        <span className="achievements__shape achievements__shape--one" />
        <span className="achievements__shape achievements__shape--two" />
        <span className="achievements__shape achievements__shape--three" />
      </div>

      <div className="achievements__container">
        <header className="achievements__header">
          <p className="achievements__eyebrow">Milestones</p>
          <h2 id="achievements-title" className="achievements__title">
            Achievements
          </h2>
        </header>

        <ol className="achievements__timeline" role="list">
          {achievements.map((item) => (
            <li className="achievements__item" key={`${item.year}-${item.title}`}>
              <div className="achievements__marker" aria-hidden="true">
                <span className="achievements__dot" />
                <span className="achievements__line" />
              </div>

              <article className="achievements__card">
                <p className="achievements__year">{item.year}</p>
                <h3 className="achievements__item-title">{item.title}</h3>
                {item.subtitle && <p className="achievements__subtitle">{item.subtitle}</p>}
                <p className="achievements__description">{item.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default AchievementsSection;
