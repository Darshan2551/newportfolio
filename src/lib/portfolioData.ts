import { Code2, Sparkles, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type RepoCategory =
  | "Web Development"
  | "Python"
  | "AI / Automation"
  | "Games"
  | "Experimental Projects";

export type Theme = "dark" | "light";

export type FilterCategory = RepoCategory | "All";

export interface GitHubRepo {
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

export interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
}

export interface ProjectOverride {
  description?: string;
  techStack?: string[];
  categories?: RepoCategory[];
  scoreBoost?: number;
  demoLink?: string;
}

export interface PortfolioRepo extends GitHubRepo {
  normalizedDescription: string;
  categories: RepoCategory[];
  techStack: string[];
  score: number;
  demoLink?: string;
}

export interface SkillGroup {
  title: string;
  icon: LucideIcon;
  items: Array<{
    name: string;
    level: number;
  }>;
}

export const GITHUB_USERNAME = "Darshan2551";
export const EMAIL = "darshanaradhya20@gmail.com";
export const RESUME_URL =
  "https://github.com/Darshan2551/My_resume/blob/main/Darshan_Resume%5B2025%5D1.pdf";

export const FILTERS: FilterCategory[] = [
  "All",
  "Web Development",
  "Python",
  "AI / Automation",
  "Games",
  "Experimental Projects",
];

export const PROJECT_OVERRIDES: Record<string, ProjectOverride> = {
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

export const featuredNarratives = [
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

export const skillGroups: SkillGroup[] = [
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

export const timelineItems = [
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

export const eventTypeMap: Record<string, string> = {
  PushEvent: "Pushed commits",
  CreateEvent: "Created branch/repository",
  WatchEvent: "Starred a repository",
  PullRequestEvent: "Opened/updated pull request",
  IssuesEvent: "Updated issues",
};

export function detectCategories(repo: GitHubRepo): RepoCategory[] {
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

export function inferTechStack(
  repo: GitHubRepo,
  categories: RepoCategory[]
): string[] {
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

export function calculateRepoScore(
  repo: GitHubRepo,
  categories: RepoCategory[]
): number {
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

export function humanDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function fallbackRepos(): PortfolioRepo[] {
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
