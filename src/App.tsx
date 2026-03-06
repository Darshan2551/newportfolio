import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { GitHubCalendar } from "react-github-calendar";
import {
  ArrowRight,
  Clock3,
  Code2,
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
  Wrench,
} from "lucide-react";

type Theme = "dark" | "light";
type RepoCategory =
  | "Web Development"
  | "Python"
  | "AI / Automation"
  | "Games"
  | "Experimental Projects";
type FilterCategory = RepoCategory | "All";

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  size: number;
  pushed_at: string;
  homepage: string | null;
  topics?: string[];
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
}

interface ProjectOverride {
  description?: string;
  techStack?: string[];
  categories?: RepoCategory[];
  scoreBoost?: number;
  demoLink?: string;
}

interface PortfolioRepo extends GitHubRepo {
  normalizedDescription: string;
  categories: RepoCategory[];
  techStack: string[];
  score: number;
  demoLink?: string;
}

const GITHUB_USERNAME = "Darshan2551";
const EMAIL = "darshanaradhya20@gmail.com";
const RESUME_URL =
  "https://github.com/Darshan2551/My_resume/blob/main/Darshan_Resume%5B2025%5D1.pdf";

const FILTERS: FilterCategory[] = [
  "All",
  "Web Development",
  "Python",
  "AI / Automation",
  "Games",
  "Experimental Projects",
];

const PROJECT_OVERRIDES: Record<string, ProjectOverride> = {
  bouncegame: {
    description:
      "Real-time multiplayer browser game with room matchmaking, powerups, leaderboard flow, and mobile-friendly controls.",
    techStack: [
      "React",
      "TailwindCSS",
      "Node.js",
      "Express",
      "Socket.io",
      "HTML5 Canvas",
    ],
    categories: ["Games", "Web Development"],
    scoreBoost: 40,
  },
  tictactoe: {
    description:
      "Neon multiplayer Tic-Tac-Toe with online rooms, AI modes, leaderboard, reconnect support, and deployment-ready configs.",
    techStack: [
      "JavaScript",
      "Node.js",
      "Express",
      "Socket.io",
      "SQLite",
      "WebSockets",
    ],
    categories: ["Games", "Web Development"],
    scoreBoost: 38,
  },
  "zerone-frontend": {
    description:
      "Animated event platform frontend with sectioned navigation, modern UI transitions, and production-ready React architecture.",
    techStack: ["React", "TypeScript", "Vite", "Framer Motion", "CSS"],
    categories: ["Web Development"],
    scoreBoost: 30,
    demoLink:
      "https://ai.studio/apps/drive/1LJj-gNw8APrZQ5E-tHn6tQ8oDC8ZZ7Lj",
  },
  "zerone-backend": {
    description:
      "Event registration backend handling uploads, schema validation, CSV pipelines, and email confirmation workflows.",
    techStack: ["Node.js", "Express", "Multer", "Nodemailer", "CSV"],
    categories: ["Web Development"],
    scoreBoost: 26,
  },
  job_alert: {
    description:
      "Python automation bot that scans RSS feeds for matching roles and sends alerts to Telegram.",
    techStack: ["Python", "Flask", "feedparser", "requests", "Automation"],
    categories: ["Python", "AI / Automation"],
    scoreBoost: 22,
  },
  jobhunter: {
    description:
      "Job monitoring automation with SQLite deduplication, RSS parsing, and notification delivery for remote developer opportunities.",
    techStack: ["Python", "SQLite", "feedparser", "requests", "GitHub Actions"],
    categories: ["Python", "AI / Automation"],
    scoreBoost: 20,
  },
  multiagenticsystem: {
    description:
      "Multi-agent LLM workflow for generating and solving quant problems with robust JSON output validation.",
    techStack: ["Python", "Jupyter", "LLM Agents", "JSON"],
    categories: ["Python", "AI / Automation", "Experimental Projects"],
    scoreBoost: 30,
  },
  code_nexus: {
    description:
      "Developer and student project hub with multiple modules spanning web pages, utilities, and practical mini systems.",
    techStack: ["HTML", "CSS", "JavaScript", "PHP", "Bootstrap"],
    categories: ["Web Development", "Experimental Projects"],
    scoreBoost: 16,
  },
  adventour: {
    description:
      "Travel management web platform with admin workflows, database setup, and multi-page user interfaces.",
    techStack: ["PHP", "JavaScript", "CSS", "SQL"],
    categories: ["Web Development"],
    scoreBoost: 14,
  },
  profolio: {
    description:
      "Personal portfolio website showcasing developer profile, projects, and contact details in a clean web layout.",
    techStack: ["HTML", "CSS", "JavaScript"],
    categories: ["Web Development"],
    scoreBoost: 10,
  },
  my_resume: {
    description:
      "Resume repository for recruiter sharing and direct downloadable profile access.",
    techStack: ["PDF", "Documentation"],
    categories: ["Experimental Projects"],
    scoreBoost: 8,
  },
  rockpaperscissorwithhomepage: {
    description:
      "Classic browser game implementation with landing page and custom assets.",
    techStack: ["HTML", "CSS", "JavaScript"],
    categories: ["Games", "Experimental Projects"],
    scoreBoost: 10,
  },
};

const featuredNarratives = [
  {
    title: "SpellBound Speculum - Smart Magic Mirror",
    description:
      "A smart mirror system that shows time, date, calendar, live news, events, and festivals, with voice-based interaction for practical on-site assistance.",
    stack: ["JavaScript", "Google Assistant", "Pi-hole", "IoT"],
    points: [
      "Voice interaction with Google Assistant integration",
      "Live information widgets for daily utility",
      "Privacy protection via Pi-hole blocking ads and trackers",
    ],
  },
  {
    title: "Gesture Controlled Virtual Mouse & Keyboard",
    description:
      "Computer automation system where hand gestures captured via webcam control cursor actions and system utilities without physical input devices.",
    stack: ["Python", "OpenCV", "Mediapipe", "PyAutoGUI", "CVZone"],
    points: [
      "Touchless interaction model for accessibility and productivity",
      "Realtime gesture-based mouse and action controls",
      "Supports practical system commands and brightness controls",
    ],
  },
  {
    title: "Multiplayer Online Game Projects",
    description:
      "Realtime browser-based games with online room creation/joining, mobile responsiveness, and latency-aware gameplay architecture.",
    stack: ["React", "Node.js", "Socket.io", "WebSockets", "SQLite"],
    points: [
      "Online matchmaking and realtime synchronization",
      "Leaderboard systems and game-state persistence",
      "Mobile-friendly controls with smooth, optimized interactions",
    ],
  },
];

const skillGroups = [
  {
    title: "Languages",
    icon: Code2,
    items: [
      { name: "Python", level: 90 },
      { name: "JavaScript", level: 88 },
      { name: "HTML", level: 94 },
      { name: "CSS", level: 90 },
      { name: "SQL", level: 80 },
    ],
  },
  {
    title: "Technologies",
    icon: Sparkles,
    items: [
      { name: "OpenCV", level: 82 },
      { name: "Mediapipe", level: 80 },
      { name: "Git", level: 85 },
      { name: "MySQL", level: 78 },
      { name: "Bootstrap", level: 84 },
      { name: "WebSockets", level: 82 },
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    items: [
      { name: "GitHub", level: 90 },
      { name: "VS Code", level: 92 },
      { name: "Linux", level: 74 },
      { name: "AI Tools", level: 86 },
      { name: "Automation Frameworks", level: 80 },
    ],
  },
];

const timelineItems = [
  {
    title: "SpellBound Speculum",
    detail:
      "Designed and delivered a smart mirror platform with real-time information modules and voice interaction.",
  },
  {
    title: "Gesture Automation Project",
    detail:
      "Built webcam-based gesture control for mouse and system interactions using computer vision tooling.",
  },
  {
    title: "Realtime Multiplayer Game Development",
    detail:
      "Implemented online room systems, synchronization, leaderboards, and responsive controls in browser games.",
  },
  {
    title: "Continuous GitHub Product Building",
    detail:
      "Maintaining and shipping web, Python automation, AI/agentic, and experimental repositories with practical focus.",
  },
];

const eventTypeMap: Record<string, string> = {
  PushEvent: "Pushed commits",
  CreateEvent: "Created branch/repository",
  WatchEvent: "Starred a repository",
  PullRequestEvent: "Opened/updated pull request",
  IssuesEvent: "Updated issues",
};

function detectCategories(repo: GitHubRepo): RepoCategory[] {
  const text = `${repo.name} ${repo.description ?? ""} ${repo.language ?? ""} ${
    repo.topics?.join(" ") ?? ""
  }`.toLowerCase();

  const categories: RepoCategory[] = [];

  if (
    /(react|html|css|javascript|typescript|php|frontend|backend|full-stack|web)/.test(
      text
    )
  ) {
    categories.push("Web Development");
  }
  if (
    /(python|flask|jupyter|automation script)/.test(text) ||
    repo.language === "Python"
  ) {
    categories.push("Python");
  }
  if (/(ai|agent|automation|opencv|mediapipe|llm|ml|vision)/.test(text)) {
    categories.push("AI / Automation");
  }
  if (/(game|tictactoe|bounce|rockpaper|multiplayer|arena)/.test(text)) {
    categories.push("Games");
  }
  if (!categories.length) {
    categories.push("Experimental Projects");
  }

  if (repo.size < 40 && !categories.includes("Experimental Projects")) {
    categories.push("Experimental Projects");
  }

  return [...new Set(categories)];
}

function inferTechStack(repo: GitHubRepo, categories: RepoCategory[]): string[] {
  const stack = new Set<string>();
  const text = `${repo.name} ${repo.description ?? ""} ${repo.language ?? ""}`.toLowerCase();

  if (repo.language) {
    stack.add(repo.language);
  }
  if (/react/.test(text)) stack.add("React");
  if (/typescript/.test(text)) stack.add("TypeScript");
  if (/javascript/.test(text)) stack.add("JavaScript");
  if (/node|express/.test(text)) stack.add("Node.js");
  if (/socket/.test(text)) stack.add("Socket.io");
  if (/flask/.test(text)) stack.add("Flask");
  if (/opencv/.test(text)) stack.add("OpenCV");
  if (/mediapipe/.test(text)) stack.add("Mediapipe");
  if (/sql|sqlite|mysql/.test(text)) stack.add("SQL");
  if (categories.includes("AI / Automation")) stack.add("Automation");
  if (categories.includes("Games")) stack.add("Game Logic");

  return [...stack].slice(0, 6);
}

function calculateRepoScore(repo: GitHubRepo, categories: RepoCategory[]): number {
  const pushedDaysAgo = Math.max(
    1,
    Math.floor(
      (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  let score = 0;
  score += Math.min(repo.stargazers_count * 8, 48);
  score += Math.min(repo.forks_count * 5, 30);
  score += repo.description ? 10 : 0;
  score += repo.homepage ? 8 : 0;
  score += repo.fork ? -12 : 8;

  if (repo.size > 4000) score += 26;
  else if (repo.size > 1000) score += 20;
  else if (repo.size > 200) score += 14;
  else if (repo.size > 60) score += 8;
  else score += 3;

  if (pushedDaysAgo < 30) score += 14;
  else if (pushedDaysAgo < 120) score += 10;
  else if (pushedDaysAgo < 365) score += 6;
  else score += 2;

  if (categories.includes("Web Development")) score += 4;
  if (categories.includes("AI / Automation")) score += 4;
  if (categories.includes("Games")) score += 4;

  return score;
}

function humanDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function fallbackRepos(): PortfolioRepo[] {
  return [
    {
      id: 1,
      name: "bouncegame",
      html_url: "https://github.com/Darshan2551/bouncegame",
      description:
        PROJECT_OVERRIDES.bouncegame.description ?? "Realtime multiplayer game.",
      language: "JavaScript",
      stargazers_count: 0,
      forks_count: 0,
      fork: false,
      archived: false,
      size: 0,
      pushed_at: new Date().toISOString(),
      homepage: null,
      normalizedDescription:
        PROJECT_OVERRIDES.bouncegame.description ?? "Realtime multiplayer game.",
      categories: PROJECT_OVERRIDES.bouncegame.categories ?? ["Games"],
      techStack: PROJECT_OVERRIDES.bouncegame.techStack ?? ["JavaScript"],
      score: 100,
    },
    {
      id: 2,
      name: "TicTacToe",
      html_url: "https://github.com/Darshan2551/TicTacToe",
      description: PROJECT_OVERRIDES.tictactoe.description ?? "Multiplayer game.",
      language: "JavaScript",
      stargazers_count: 0,
      forks_count: 0,
      fork: false,
      archived: false,
      size: 0,
      pushed_at: new Date().toISOString(),
      homepage: null,
      normalizedDescription:
        PROJECT_OVERRIDES.tictactoe.description ?? "Multiplayer game.",
      categories: PROJECT_OVERRIDES.tictactoe.categories ?? ["Games"],
      techStack: PROJECT_OVERRIDES.tictactoe.techStack ?? ["JavaScript"],
      score: 96,
    },
    {
      id: 3,
      name: "zerone-frontend",
      html_url: "https://github.com/Darshan2551/zerone-frontend",
      description:
        PROJECT_OVERRIDES["zerone-frontend"].description ??
        "Event platform frontend.",
      language: "TypeScript",
      stargazers_count: 0,
      forks_count: 0,
      fork: false,
      archived: false,
      size: 0,
      pushed_at: new Date().toISOString(),
      homepage: null,
      normalizedDescription:
        PROJECT_OVERRIDES["zerone-frontend"].description ??
        "Event platform frontend.",
      categories: PROJECT_OVERRIDES["zerone-frontend"].categories ?? [
        "Web Development",
      ],
      techStack: PROJECT_OVERRIDES["zerone-frontend"].techStack ?? [
        "TypeScript",
      ],
      score: 90,
    },
  ];
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
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("darshan-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.title = "Darshan Aradhya | Developer Portfolio";
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
              ? "GitHub API rate limit reached. Showing curated fallback projects."
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
              : "Unable to load live GitHub data right now."
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
      const filterMatch =
        activeFilter === "All" || repo.categories.includes(activeFilter);
      const searchMatch =
        !query ||
        repo.name.toLowerCase().includes(query) ||
        repo.normalizedDescription.toLowerCase().includes(query) ||
        repo.techStack.join(" ").toLowerCase().includes(query);
      return filterMatch && searchMatch;
    });
  }, [repos, activeFilter, searchQuery]);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div>
      <header className="sticky top-0 z-50 border-b border-slate-500/20 bg-slate-900/35 backdrop-blur-xl">
        <div className="container-wrap flex items-center justify-between py-4">
          <a href="#home" className="text-lg font-semibold tracking-tight">
            Darshan Aradhya
          </a>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#about" className="muted hover:text-current">
              About
            </a>
            <a href="#featured" className="muted hover:text-current">
              Featured
            </a>
            <a href="#github-projects" className="muted hover:text-current">
              GitHub Projects
            </a>
            <a href="#contact" className="muted hover:text-current">
              Contact
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            className="btn-secondary px-3 py-2"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="section-block">
          <div className="container-wrap">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass overflow-hidden rounded-3xl p-8 shadow-glass sm:p-12"
            >
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/35 bg-cyan-500/10 px-3 py-1 text-xs">
                <Sparkles size={14} /> Full Stack + Python + AI Builder
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
                Darshan Aradhya
              </h1>
              <p className="mt-3 text-lg muted">
                Full Stack Developer | Python Developer | AI & Automation
                Enthusiast
              </p>
              <div className="mt-2 flex items-center gap-2 muted">
                <MapPin size={16} />
                <span>Karnataka, India</span>
              </div>
              <p className="mt-6 max-w-3xl text-sm sm:text-base muted">
                Building practical systems across web development, AI tools,
                automation pipelines, real-time multiplayer apps, and experimental
                technology projects.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
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
                  Download Resume <Download size={16} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="section-block pt-2">
          <div className="container-wrap">
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="section-title">About Me</h2>
              <p className="mt-4 leading-relaxed muted">
                I am a developer focused on building useful, production-minded
                systems. My core interests are web development, AI tools,
                automation workflows, real-time applications, and experimental
                technology projects. I enjoy combining practical engineering with
                modern frameworks to deliver products that are reliable, scalable,
                and meaningful.
              </p>
            </div>
          </div>
        </section>

        <section id="featured" className="section-block">
          <div className="container-wrap">
            <h2 className="section-title">Featured Projects</h2>
            <p className="mt-2 muted">
              Signature projects highlighted for technical depth, real-world
              utility, and innovation.
            </p>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {featuredNarratives.map((item) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm muted">{item.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.stack.map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ul className="mt-4 space-y-2 text-sm muted">
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="section-block pt-2">
          <div className="container-wrap">
            <h2 className="section-title">Skills</h2>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {skillGroups.map((group) => (
                <div key={group.title} className="glass rounded-2xl p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <group.icon size={18} />
                    <h3 className="text-lg font-semibold">{group.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((skill) => (
                      <div key={skill.name}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span>{skill.name}</span>
                          <span className="muted">{skill.level}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-500/20">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="timeline" className="section-block">
          <div className="container-wrap">
            <h2 className="section-title">Experience / Project Timeline</h2>
            <div className="mt-6 space-y-4">
              {timelineItems.map((item, index) => (
                <div key={item.title} className="glass rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm muted">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="github-projects" className="section-block pt-2">
          <div className="container-wrap">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="section-title">GitHub Projects</h2>
                <p className="mt-2 muted">
                  Auto-fetched from GitHub, ranked by completeness, usefulness, and
                  technical depth.
                </p>
              </div>
              <a
                href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                View All Repositories <ExternalLink size={16} />
              </a>
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-amber-500/35 bg-amber-500/10 p-3 text-sm text-amber-200">
                {error}
              </p>
            )}

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {topRepos.map((repo) => (
                <div key={repo.id} className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold">{repo.name}</h3>
                    <div className="inline-flex items-center gap-1 text-sm">
                      <Star size={14} />
                      {repo.stargazers_count}
                    </div>
                  </div>
                  <p className="mt-2 text-sm muted">{repo.normalizedDescription}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {repo.techStack.slice(0, 4).map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-300"
                  >
                    Open Repository <ExternalLink size={15} />
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="glass flex items-center gap-3 rounded-2xl p-4">
                <Search size={18} />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search projects by name, stack, or description..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="glass flex items-center gap-2 rounded-2xl p-3">
                <Filter size={16} />
                <span className="text-sm">Filter:</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    activeFilter === filter
                      ? "border-cyan-400 bg-cyan-500/20"
                      : "border-slate-500/50 hover:border-slate-300/60"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                <div className="glass col-span-full rounded-2xl p-5 text-sm muted">
                  Loading GitHub repositories...
                </div>
              ) : (
                filteredRepos.map((repo) => (
                  <motion.article
                    key={repo.id}
                    whileHover={{ y: -4 }}
                    className="glass rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold">{repo.name}</h3>
                      <div className="inline-flex items-center gap-1 text-xs">
                        <Star size={13} />
                        {repo.stargazers_count}
                      </div>
                    </div>
                    <p className="mt-2 text-sm muted">{repo.normalizedDescription}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {repo.categories.map((category) => (
                        <span key={category} className="chip">
                          {category}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {repo.techStack.map((tech) => (
                        <span key={tech} className="chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={13} /> Updated {humanDate(repo.pushed_at)}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-300"
                      >
                        GitHub <ExternalLink size={14} />
                      </a>
                      {repo.demoLink && (
                        <a
                          href={repo.demoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-violet-300"
                        >
                          Demo <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </motion.article>
                ))
              )}
            </div>
          </div>
        </section>

        <section id="github-activity" className="section-block">
          <div className="container-wrap grid gap-5 lg:grid-cols-[1.25fr_1fr]">
            <div className="glass rounded-2xl p-6">
              <h2 className="section-title">GitHub Contribution Graph</h2>
              <p className="mt-2 text-sm muted">
                Public activity graph for {GITHUB_USERNAME}.
              </p>
              <div className="mt-5 overflow-x-auto">
                <GitHubCalendar
                  username={GITHUB_USERNAME}
                  colorScheme={theme}
                  blockSize={13}
                  blockMargin={4}
                  fontSize={12}
                />
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="section-title">Recent GitHub Activity</h2>
              <div className="mt-4 space-y-3">
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
                        className="block rounded-xl border border-slate-500/35 p-3 transition-colors hover:border-cyan-300/55"
                      >
                        <p className="text-sm font-medium">
                          {eventTypeMap[activity.type] ?? activity.type}
                        </p>
                        <p className="text-sm muted">{repoName}</p>
                        <p className="mt-1 text-xs muted">
                          {humanDate(activity.created_at)}
                        </p>
                      </a>
                    );
                  })
                ) : (
                  <p className="text-sm muted">
                    No recent events available from the public API right now.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section-block">
          <div className="container-wrap grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="glass rounded-2xl p-6">
              <h2 className="section-title">Contact</h2>
              <p className="mt-3 muted">
                Open to internship, collaboration, and full-stack/AI project
                opportunities.
              </p>
              <div className="mt-6 space-y-3">
                <a
                  href={`mailto:${EMAIL}`}
                  className="btn-secondary w-full justify-center"
                >
                  <Mail size={16} /> {EMAIL}
                </a>
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-full justify-center"
                >
                  <Github size={16} /> github.com/{GITHUB_USERNAME}
                </a>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold">Send a Message</h3>
              <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
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
                  className="input-base resize-none"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, message: event.target.value }))
                  }
                />
                <button type="submit" className="btn-primary">
                  Send Message <ArrowRight size={16} />
                </button>
                {submitted && (
                  <p className="text-sm text-emerald-300">
                    Message prepared. Your email client should open now.
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-500/20 py-6">
        <div className="container-wrap flex flex-wrap items-center justify-between gap-3 text-sm muted">
          <p>
            Built by Darshan Aradhya • Full Stack Developer • Python Developer • AI
            & Automation Enthusiast
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-current"
            >
              <Github size={14} /> GitHub
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-1 hover:text-current"
            >
              <Mail size={14} /> Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
