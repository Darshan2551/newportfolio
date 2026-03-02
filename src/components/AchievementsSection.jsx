import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './AchievementsSection.css';

const ACHIEVEMENTS = [
  {
    id: 'launch',
    year: '2021',
    title: 'Product Launch',
    description: 'Released the first production-ready version to early enterprise customers.',
  },
  {
    id: 'growth',
    year: '2022',
    title: '100K Active Users',
    description: 'Scaled infrastructure and onboarding to support major adoption milestones.',
  },
  {
    id: 'security',
    year: '2023',
    title: 'Security Certification',
    description: 'Completed external audits and shipped compliance-focused hardening updates.',
  },
  {
    id: 'global',
    year: '2024',
    title: 'Global Expansion',
    description: 'Expanded operations across regions with localized support and delivery.',
  },
];

const AchievementItem = memo(function AchievementItem({
  achievement,
  index,
  isVisible,
  isActive,
  registerItem,
  onFocus,
  onKeyDown,
}) {
  return (
    <li
      ref={registerItem(achievement.id)}
      className={`achievement-item ${isVisible ? 'is-visible' : ''} ${isActive ? 'is-active' : ''}`}
      data-id={achievement.id}
      data-index={index}
    >
      <article className="achievement-card" aria-labelledby={`achievement-title-${achievement.id}`}>
        <span className="achievement-dot" aria-hidden="true" />
        <span className="achievement-year">{achievement.year}</span>
        <h3 id={`achievement-title-${achievement.id}`} className="achievement-title">
          {achievement.title}
        </h3>
        <p className="achievement-description">{achievement.description}</p>
        <button
          type="button"
          className="achievement-focus-anchor"
          aria-label={`Focus ${achievement.title} (${achievement.year})`}
          onFocus={() => onFocus(index)}
          onKeyDown={onKeyDown}
        />
      </article>
    </li>
  );
});

function AchievementsSection({ achievements = ACHIEVEMENTS }) {
  const [visibleIds, setVisibleIds] = useState(() => new Set());
  const [activeIndex, setActiveIndex] = useState(0);

  const itemRefs = useRef(new Map());
  const observerRef = useRef(null);

  const listId = useMemo(() => 'achievements-timeline-list', []);

  const registerItem = useCallback(
    (id) => (node) => {
      if (!node) {
        itemRefs.current.delete(id);
        return;
      }

      itemRefs.current.set(id, node);
      if (observerRef.current) observerRef.current.observe(node);
    },
    []
  );

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setVisibleIds(new Set(achievements.map(({ id }) => id)));
      return undefined;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newlyVisible = [];

        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              newlyVisible.push(id);
              observerRef.current?.unobserve(entry.target);
            }
          }
        }

        if (!newlyVisible.length) return;

        setVisibleIds((prev) => {
          const next = new Set(prev);
          let changed = false;

          for (const id of newlyVisible) {
            if (!next.has(id)) {
              next.add(id);
              changed = true;
            }
          }

          return changed ? next : prev;
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.15,
      }
    );

    for (const node of itemRefs.current.values()) {
      observerRef.current.observe(node);
    }

    return () => observerRef.current?.disconnect();
  }, [achievements]);

  const focusItem = useCallback(
    (index) => {
      const boundedIndex = (index + achievements.length) % achievements.length;
      setActiveIndex(boundedIndex);
      const item = itemRefs.current.get(achievements[boundedIndex].id);
      item?.querySelector('.achievement-focus-anchor')?.focus();
    },
    [achievements]
  );

  const handleItemKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        focusItem(activeIndex + 1);
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        focusItem(activeIndex - 1);
      }

      if (event.key === 'Home') {
        event.preventDefault();
        focusItem(0);
      }

      if (event.key === 'End') {
        event.preventDefault();
        focusItem(achievements.length - 1);
      }
    },
    [activeIndex, achievements.length, focusItem]
  );

  return (
    <section className="achievements" aria-labelledby="achievements-heading">
      <header className="achievements-header">
        <h2 id="achievements-heading">Achievements</h2>
        <p className="achievements-subtitle">A timeline of key milestones.</p>
      </header>

      <ol id={listId} className="achievements-timeline" role="list" aria-label="Achievements timeline">
        {achievements.map((achievement, index) => (
          <AchievementItem
            key={achievement.id}
            achievement={achievement}
            index={index}
            isVisible={visibleIds.has(achievement.id)}
            isActive={activeIndex === index}
            registerItem={registerItem}
            onFocus={setActiveIndex}
            onKeyDown={handleItemKeyDown}
          />
        ))}
      </ol>
    </section>
  );
}

export default memo(AchievementsSection);
