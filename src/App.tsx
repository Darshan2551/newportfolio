import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { GitHubCalendar } from "react-github-calendar";
import {
  ArrowRight,
  Clock3,
  Download,
  ExternalLink,
  Filter,
  Github,
  Mail,
  MapPin,
  Moon,
  Search,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";
import {
  calculateRepoScore,
  detectCategories,
  EMAIL,
  eventTypeMap,
  fallbackRepos,
  featuredNarratives,
  FILTERS,
  GITHUB_USERNAME,
  humanDate,
  inferTechStack,
  PROJECT_OVERRIDES,
  RESUME_URL,
  skillGroups,
  timelineItems,
} from "./lib/portfolioData";
import type {
  FilterCategory,
  GitHubEvent,
  GitHubRepo,
  PortfolioRepo,
  Theme,
} from "./lib/portfolioData";

const HeroScene = lazy(async () => {
  const module = await import("./components/HeroScene");
  return { default: module.HeroScene };
});

const heroHighlights = [
  "Realtime systems with WebSockets",
  "AI + automation-first product mindset",
  "Full-stack execution from UI to deployment",
];

const quickStats = [
  { label: "Public Repositories", value: "30+" },
  { label: "Core Domains", value: "Web • AI • Games" },
  { label: "Location", value: "Karnataka, India" },
];

function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      {kicker ? (
        <p className="section-kicker">
          <Sparkles size={14} />
          {kicker}
        </p>
      ) : null}
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-tile">
      <p className="metric-value">{value}</p>
      <p className="metric-label">{label}</p>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("darshan-theme");
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [repos, setRepos] = useState<PortfolioRepo[]>([]);
  const [activities, setActivities] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("darshan-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.title = "Darshan Aradhya | Full Stack + AI Portfolio";
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadGitHub = async () => {
      try {
        setLoading(true);

        const [reposRes, eventsRes] = await Promise.all([
          fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
            {
              headers: { Accept: "application/vnd.github+json" },
            }
          ),
          fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=12`,
            {
              headers: { Accept: "application/vnd.github+json" },
            }
          ),
        ]);

        if (!reposRes.ok) {
          throw new Error(
            reposRes.status === 403
              ? "GitHub API rate limit reached. Showing curated project fallback."
              : `GitHub API request failed (${reposRes.status})`
          );
        }

        const rawRepos = (await reposRes.json()) as GitHubRepo[];
        const normalizedRepos = rawRepos
          .filter((repo) => !repo.archived && !repo.fork)
          .map((repo) => {
            const override = PROJECT_OVERRIDES[repo.name.toLowerCase()];
            const categories = override?.categories ?? detectCategories(repo);
            const techStack = override?.techStack ?? inferTechStack(repo, categories);
            const score =
              calculateRepoScore(repo, categories) + (override?.scoreBoost ?? 0);
            const normalizedDescription =
              override?.description ??
              repo.description ??
              "Repository maintained as part of practical development and experimentation.";

            return {
              ...repo,
              categories,
              techStack,
              score,
              normalizedDescription,
              demoLink: override?.demoLink,
            } satisfies PortfolioRepo;
          })
          .sort((a, b) => b.score - a.score);

        const eventData = eventsRes.ok
          ? ((await eventsRes.json()) as GitHubEvent[])
          : [];

        if (!cancelled) {
          setRepos(normalizedRepos);
          setActivities(eventData.slice(0, 8));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setRepos(fallbackRepos());
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load GitHub data currently."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGitHub();

    return () => {
      cancelled = true;
    };
  }, []);

  const topRepos = useMemo(() => repos.slice(0, 6), [repos]);

  const filteredRepos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return repos.filter((repo) => {
      const matchesFilter =
        activeFilter === "All" || repo.categories.includes(activeFilter);
      const matchesQuery =
        !query ||
        repo.name.toLowerCase().includes(query) ||
        repo.normalizedDescription.toLowerCase().includes(query) ||
        repo.techStack.join(" ").toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [repos, activeFilter, searchQuery]);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setFormData({ name: "", email: "", message: "" });
    setSubmitted(true);
  };

  return (
    <div className="app-shell">
      <div className="noise-overlay" />

      <header className="app-header">
        <div className="container-wrap nav-row">
          <a href="#home" className="brandmark">
            Darshan Aradhya
          </a>
          <nav className="nav-links">
            <a href="#about">About</a>
            <a href="#featured">Featured</a>
            <a href="#github-projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="section-block hero-block">
          <div className="container-wrap hero-grid">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="hero-copy panel"
            >
              <p className="section-kicker">
                <Sparkles size={14} />
                Open to internships and engineering opportunities
              </p>
              <h1 className="hero-title">
                Full Stack Developer with a builder mindset for AI, automation,
                and realtime systems.
              </h1>
              <p className="hero-subtitle">
                Darshan Aradhya • Full Stack Developer • Python Developer • AI &
                Automation Enthusiast
              </p>
              <p className="hero-location">
                <MapPin size={16} />
                Karnataka, India
              </p>

              <div className="hero-actions">
                <a href="#github-projects" className="btn-primary">
                  View Projects <ArrowRight size={16} />
                </a>
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  GitHub Profile <Github size={16} />
                </a>
                <a href="#contact" className="btn-secondary">
                  Contact Me <Mail size={16} />
                </a>
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  Resume <Download size={16} />
                </a>
              </div>

              <ul className="hero-highlights">
                {heroHighlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="hero-visual panel"
            >
              <Suspense
                fallback={
                  <div className="hero-scene-fallback">
                    Preparing interactive 3D scene...
                  </div>
                }
              >
                <HeroScene />
              </Suspense>
            </motion.div>
          </div>

          <div className="container-wrap metrics-grid">
            {quickStats.map((item) => (
              <MetricTile key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </section>

        <section id="about" className="section-block">
          <div className="container-wrap bento-grid">
            <article className="panel bento-main">
              <SectionHeading
                kicker="About Me"
                title="I build practical software with strong product and engineering intent."
                subtitle="Focused on web development, AI tools, automation systems, realtime applications, and experimental technology projects."
              />
              <p className="body-copy">
                I enjoy taking ideas from prototype to production, combining
                frontend quality, backend reliability, and automation to solve
                real-world problems. My work emphasizes usable interfaces,
                performant systems, and iterative experimentation with modern
                technologies.
              </p>
            </article>

            <article className="panel bento-side">
              <h3>Core Focus Areas</h3>
              <ul className="pill-list">
                <li>Full-stack product development</li>
                <li>Python automation workflows</li>
                <li>AI-assisted application features</li>
                <li>Realtime gameplay and sync systems</li>
              </ul>
            </article>

            <article className="panel bento-side">
              <h3>Current Direction</h3>
              <p className="muted">
                Sharpening architecture for scalable web products and building
                reusable automation patterns for faster delivery.
              </p>
            </article>
          </div>
        </section>

        <section id="featured" className="section-block">
          <div className="container-wrap">
            <SectionHeading
              kicker="Featured Work"
              title="Signature projects that define my engineering profile."
              subtitle="Curated highlights spanning hardware-integrated systems, computer vision, and realtime web experiences."
            />
            <div className="featured-grid">
              {featuredNarratives.map((item) => (
                <motion.article
                  key={item.title}
                  whileHover={{ y: -6 }}
                  className="panel featured-card"
                >
                  <h3>{item.title}</h3>
                  <p className="muted">{item.description}</p>
                  <div className="chip-row">
                    {item.stack.map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ul className="bullet-list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="section-block">
          <div className="container-wrap">
            <SectionHeading
              kicker="Skill Map"
              title="Languages, tools, and technologies I actively use."
            />
            <div className="skills-grid">
              {skillGroups.map((group) => (
                <article key={group.title} className="panel skills-card">
                  <div className="skills-head">
                    <group.icon size={18} />
                    <h3>{group.title}</h3>
                  </div>
                  <div className="skills-list">
                    {group.items.map((skill) => (
                      <div key={skill.name}>
                        <div className="skills-row">
                          <span>{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="progress-track">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.85 }}
                            className="progress-fill"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="timeline" className="section-block">
          <div className="container-wrap">
            <SectionHeading
              kicker="Timeline"
              title="Major projects and growth milestones."
            />
            <div className="timeline-list">
              {timelineItems.map((item, index) => (
                <article key={item.title} className="panel timeline-item">
                  <div className="timeline-index">{index + 1}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p className="muted">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="github-projects" className="section-block">
          <div className="container-wrap">
            <div className="projects-topbar">
              <SectionHeading
                kicker="GitHub Projects"
                title="Auto-ranked repository explorer"
                subtitle="Scored by completeness, usefulness, and technical depth."
              />
              <a
                href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                All Repositories <ExternalLink size={16} />
              </a>
            </div>

            {error ? <p className="status-banner">{error}</p> : null}

            <div className="top-projects-grid">
              {topRepos.map((repo) => (
                <article key={repo.id} className="panel top-project">
                  <div className="repo-row">
                    <h3>{repo.name}</h3>
                    <span className="stars">
                      <Star size={13} /> {repo.stargazers_count}
                    </span>
                  </div>
                  <p className="muted">{repo.normalizedDescription}</p>
                  <div className="chip-row">
                    {repo.techStack.slice(0, 4).map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="project-controls">
              <label className="panel search-box">
                <Search size={17} />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search repository, stack, or description"
                />
              </label>
              <div className="panel filter-pill">
                <Filter size={16} />
                <span>Filter</span>
              </div>
            </div>

            <div className="filter-row">
              {FILTERS.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`filter-btn ${
                    activeFilter === filter ? "active" : ""
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="repo-grid">
              {loading ? (
                <article className="panel loading-card">
                  Loading repositories from GitHub...
                </article>
              ) : (
                filteredRepos.map((repo) => (
                  <motion.article
                    key={repo.id}
                    whileHover={{ y: -6 }}
                    className="panel repo-card"
                  >
                    <div className="repo-row">
                      <h3>{repo.name}</h3>
                      <span className="stars">
                        <Star size={13} /> {repo.stargazers_count}
                      </span>
                    </div>
                    <p className="muted">{repo.normalizedDescription}</p>
                    <div className="chip-row">
                      {repo.categories.map((category) => (
                        <span key={category} className="chip">
                          {category}
                        </span>
                      ))}
                    </div>
                    <div className="chip-row">
                      {repo.techStack.map((tech) => (
                        <span key={tech} className="chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="repo-meta">
                      <span>
                        <Clock3 size={13} /> Updated {humanDate(repo.pushed_at)}
                      </span>
                      <span>{repo.language ?? "Mixed Stack"}</span>
                    </div>
                    <div className="repo-actions">
                      <a href={repo.html_url} target="_blank" rel="noreferrer">
                        GitHub <ExternalLink size={14} />
                      </a>
                      {repo.demoLink ? (
                        <a href={repo.demoLink} target="_blank" rel="noreferrer">
                          Demo <ExternalLink size={14} />
                        </a>
                      ) : null}
                    </div>
                  </motion.article>
                ))
              )}
            </div>
          </div>
        </section>

        <section id="github-activity" className="section-block">
          <div className="container-wrap activity-grid">
            <article className="panel">
              <SectionHeading
                kicker="GitHub Activity"
                title="Contribution Graph"
                subtitle={`Live public contribution graph for ${GITHUB_USERNAME}.`}
              />
              <div className="calendar-wrap">
                <GitHubCalendar
                  username={GITHUB_USERNAME}
                  colorScheme={theme}
                  blockSize={13}
                  blockMargin={4}
                  fontSize={12}
                />
              </div>
            </article>

            <article className="panel">
              <h3 className="sub-title">Recent Events</h3>
              <div className="activity-list">
                {activities.length ? (
                  activities.map((activity) => {
                    const repoName = activity.repo.name.replace(
                      `${GITHUB_USERNAME}/`,
                      ""
                    );
                    return (
                      <a
                        key={activity.id}
                        href={`https://github.com/${activity.repo.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="activity-item"
                      >
                        <p>{eventTypeMap[activity.type] ?? activity.type}</p>
                        <span>{repoName}</span>
                        <small>{humanDate(activity.created_at)}</small>
                      </a>
                    );
                  })
                ) : (
                  <p className="muted">No recent public events available.</p>
                )}
              </div>
            </article>
          </div>
        </section>

        <section id="contact" className="section-block">
          <div className="container-wrap contact-grid">
            <article className="panel">
              <SectionHeading
                kicker="Contact"
                title="Let’s build something meaningful."
                subtitle="Open for internships, collaborations, and product engineering opportunities."
              />
              <div className="contact-links">
                <a href={`mailto:${EMAIL}`} className="btn-secondary">
                  <Mail size={16} /> {EMAIL}
                </a>
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  <Github size={16} /> github.com/{GITHUB_USERNAME}
                </a>
              </div>
            </article>

            <article className="panel">
              <h3 className="sub-title">Send a Message</h3>
              <form onSubmit={handleContactSubmit} className="contact-form">
                <input
                  required
                  className="input-base"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
                <input
                  required
                  type="email"
                  className="input-base"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
                <textarea
                  required
                  rows={5}
                  className="input-base"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, message: event.target.value }))
                  }
                />
                <button type="submit" className="btn-primary">
                  Send Message <ArrowRight size={16} />
                </button>
                {submitted ? (
                  <p className="status-note">
                    Message prepared in your email client.
                  </p>
                ) : null}
              </form>
            </article>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="container-wrap footer-row">
          <p>
            Darshan Aradhya • Full Stack Developer • Python Developer • AI &
            Automation Enthusiast
          </p>
          <div className="footer-links">
            <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
              <Github size={14} /> GitHub
            </a>
            <a href={`mailto:${EMAIL}`}>
              <Mail size={14} /> Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
