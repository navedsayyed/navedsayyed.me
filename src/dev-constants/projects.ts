import type { Projects } from "@/types";

export const ProjectsData: Projects[] = [
  {
    icon: "/projects/snap2fix.png",
    title: "Snap2Fix",
    tagline: "Smart Complaint Management System",
    date: "2025-01-15",
    // repo: "https://github.com/navedsayyed/Snap2Fix",
    liveLink: "https://snap2fix.vercel.app/",
    apkLink:
      "https://github.com/navedsayyed/Snap2Fix-Releases/releases/latest/download/Snap2Fix.apk",
    description: [
      "Built a role-based campus complaint management mobile application enabling users, technicians, and administrators to track maintenance issues in real time.",
      "Implemented authentication, complaint submission workflow, and status tracking with backend integration.",
      "Integrated push notifications using Firebase Cloud Messaging (FCM) and Notifee for real-time alerts.",
      "Used Supabase (PostgreSQL) for backend services and real-time data synchronization.",
      "Implemented QR scanning, media upload, and animated UI using React Native libraries.",
      "Deployed a complementary web platform for complaint management and administration.",
    ],
    screenshots: [
      "/projects/snap2fix/ss-1.webp",
      "/projects/snap2fix/ss-2.webp",
      "/projects/snap2fix/ss-3.webp",
      "/projects/snap2fix/ss-4.webp",
      "/projects/snap2fix/ss-5.webp",
      "/projects/snap2fix/ss-6.webp",
      "/projects/snap2fix/ss-7.webp",
      "/projects/snap2fix/ss-8.webp",
      "/projects/snap2fix/ss-9.webp",
      "/projects/snap2fix/ss-10.webp",
      "/projects/snap2fix/ss-11.webp",
      "/projects/snap2fix/ss-12.webp",
      "/projects/snap2fix/ss-13.webp",
      "/projects/snap2fix/ss-14.webp",
      

    ],
    techStack: [
      { name: "React Native", icon: "/tech-icon/react.svg" },
      { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
      { name: "Supabase", icon: "/tech-icon/supabase.svg" },
      { name: "Firebase", icon: "/tech-icon/firebase.svg" },
    ],
  },
  {
    icon: "/projects/lokalmusic.png",
    title: "LokalMusic",
    tagline: "Music Streaming Application",
    date: "2024-11-10",
    repo: "https://github.com/navedsayyed/LokalMusic",
    // liveLink: "https://snap2fix.vercel.app/",
    apkLink:
      "https://github.com/navedsayyed/LokalMusic-Releases/releases/latest/download/LokalMusic.apk",
    description: [
      "Developed a full-featured music streaming mobile application supporting online streaming and offline downloads.",
      "Integrated JioSaavn API for fetching songs, artists, playlists, and lyrics dynamically.",
      "Implemented background music playback, playlist management, and queue reordering.",
      "Built smooth UI animations and gesture-based interactions for enhanced user experience.",
      "Added offline download functionality using file system storage.",
    ],
    screenshots: [
      "/projects/LokalMusic/ss-1.webp",
      "/projects/LokalMusic/ss-2.webp",
      "/projects/LokalMusic/ss-3.webp",
      "/projects/LokalMusic/ss-4.webp",
      "/projects/LokalMusic/ss-5.webp",
      "/projects/LokalMusic/ss-6.webp",
      "/projects/LokalMusic/ss-7.webp",
      "/projects/LokalMusic/ss-8.webp",
      "/projects/LokalMusic/ss-9.webp",
      "/projects/LokalMusic/ss-10.webp",
      "/projects/LokalMusic/ss-11.webp",
      "/projects/LokalMusic/ss-12.webp",
      "/projects/LokalMusic/ss-13.webp",
      "/projects/LokalMusic/ss-14.webp",
      "/projects/LokalMusic/ss-15.webp",
      "/projects/LokalMusic/ss-16.webp",
      "/projects/LokalMusic/ss-17.webp",
      "/projects/LokalMusic/ss-18.webp",
    ],
    techStack: [
      { name: "React Native", icon: "/tech-icon/react.svg" },
      { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
      { name: "Zustand", icon: "/tech-icon/zustand.svg" },
      { name: "Expo", icon: "/tech-icon/expo.svg" },
    ],
  },
  {
    icon: "/projects/grievance-resolver.png",
    title: "Grievance Resolver",
    tagline: "AI-Powered Citizen Complaint System",
    date: "2026-03-17",
    repo: "https://github.com/Hamizkhan08/Grievance-Resolver",
    liveLink: "https://grievanceresolver.vercel.app/",
    description: [
      "Built an AI-powered grievance management system using 8+ autonomous agents for classification, sentiment analysis, SLA assignment, and escalation.",
      "Implemented multilingual chatbot support (English, Hindi, Marathi) with voice input/output, real-time tracking, and intelligent complaint routing.",
      "Developed a full-stack architecture (React + FastAPI) with Supabase integration and LLM support (Groq/OpenAI).",
      "Designed an agentic AI workflow using LangChain + LangGraph for automated follow-ups, escalation workflows, and citizen communication.",
      "Included heatmap visualization, complaint status updates, and community discussion features for transparent public grievance handling.",
    ],
    screenshots: [
      "/projects/grievance-resolver/ss-1.webp",
      "/projects/grievance-resolver/ss-2.webp",
      "/projects/grievance-resolver/ss-3.webp",
      "/projects/grievance-resolver/ss-4.webp",
      "/projects/grievance-resolver/ss-5.webp",
      "/projects/grievance-resolver/ss-6.webp",
      "/projects/grievance-resolver/ss-7.webp",
      "/projects/grievance-resolver/ss-8.webp",
      "/projects/grievance-resolver/ss-9.webp",
      "/projects/grievance-resolver/ss-10.webp",
    ],

    techStack: [
      { name: "React", icon: "/tech-icon/react.svg" },
      { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
      { name: "FastAPI", icon: "/tech-icon/python.svg" },
      { name: "LangChain", icon: "/tech-icon/openai.svg" },
      { name: "Supabase", icon: "/tech-icon/supabase.svg" },
    ],
  },
  {
    icon: "/projects/MenuForge.png",
    title: "MenuForge",
    tagline: "Digital Menu Management System for Restaurants",
    date: "2024-09-20",
    // repo: "https://github.com/navedsayyed/MenuForge",
    // liveLink: "https://menuforge.vercel.app/",
    apkLink:
      "https://github.com/navedsayyed/MenuForge-Releases/releases/latest/download/MenuForge.apk",
    description: [
      "Developed a mobile application for restaurant owners to manage menu items, generate QR codes, and create digital menus.",
      "Implemented CRUD operations for menu management with backend integration.",
      "Enabled QR-based menu sharing and automatic PDF menu generation for restaurants.",
      "Built reusable UI components and structured navigation for scalable architecture.",
      "Implemented media upload and sharing functionality within the application.",
    ],
    screenshots: [
      "/projects/MenuForge/ss-1.webp",
      "/projects/MenuForge/ss-2.webp",
      "/projects/MenuForge/ss-3.webp",
      "/projects/MenuForge/ss-4.webp",
      "/projects/MenuForge/ss-5.webp",
      "/projects/MenuForge/ss-6.webp",
      "/projects/MenuForge/ss-7.webp",
      "/projects/MenuForge/ss-8.webp",
    ],
    techStack: [
      { name: "React Native", icon: "/tech-icon/react.svg" },
      { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
      { name: "Appwrite", icon: "/tech-icon/appwrite.svg" },
    ],
  },
  {
    icon: "/projects/logo.png",
    title: "COSA - Website",
    tagline: "Student Community and Events Platform",
    liveLink: "https://cosagcoerc.com",
    description: [
      "Built a responsive web platform (cosagcoerc.com) showcasing events, achievements, and community activities for 1,000+ students.",
      "Implemented dynamic content rendering, event galleries with lightbox, and modular data structure for easy updates.",
      "Designed modern UI with Tailwind CSS and shadcn-ui, including animations, dark mode, and mobile-first responsiveness.",
    ],
    screenshots: [
      "/projects/COSA-Website/ss-1.webp",
      "/projects/COSA-Website/ss-2.webp",
      "/projects/COSA-Website/ss-3.webp",
      
    ],

    techStack: [
      { name: "React", icon: "/tech-icon/react.svg" },
      { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
      { name: "Tailwind CSS", icon: "/tech-icon/tailwindcss.svg" },
      { name: "shadcn/ui", icon: "/tech-icon/shadcnui.svg", hasDarkIcon: true },
      { name: "Vite", icon: "/tech-icon/vitejs.svg" },
    ],
  },
  {
    icon: "/projects/blood-o.png",
    title: "Blood-O",
    tagline: "Blood Donation Management Platform",
    date: "2024-07-05",
    // repo: "https://github.com/navedsayyed/Snap2Fix",
    liveLink: "https://navedsayyed.github.io/Blood-Donation",
    // apkLink:"https://github.com/navedsayyed/App-Releases/releases/download/snap2fix-v2026.03.16-0242/app-arm64-v8a-release.apk",
    description: [
      "Built a full-stack web platform connecting blood donors with recipients for efficient blood request management.",
      "Implemented donor registration, blood search system, and urgent request management.",
      "Integrated Supabase backend with PostgreSQL database for authentication and real-time data operations.",
      "Designed responsive UI using Tailwind CSS and modern component libraries.",
      "Implemented form validation, API data fetching, and analytics dashboard for administrators.",
    ],
    screenshots: [
      "/projects/blood-o/ss-1.webp",
      "/projects/blood-o/ss-2.webp",
      "/projects/blood-o/ss-3.webp",
      "/projects/blood-o/ss-4.webp",
      "/projects/blood-o/ss-5.webp",
    ],
    techStack: [
      { name: "React", icon: "/tech-icon/react.svg" },
      { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
      { name: "Supabase", icon: "/tech-icon/supabase.svg" },
      { name: "Tailwind CSS", icon: "/tech-icon/tailwindcss.svg" },
      { name: "shadcn/ui", icon: "/tech-icon/shadcnui.svg", hasDarkIcon: true },
      { name: "React Query", icon: "/tech-icon/reactquery.svg" },
      { name: "Zod", icon: "/tech-icon/zod.svg" },
    ],
  },

  // ── ADD NEW PROJECT BELOW ──────────────────────────────────────────────────
  // 1. Copy the block below, uncomment it, and fill in your details.
  // 2. Add the project icon to /public/projects/<icon-file> and update `icon`.
  // 3. `liveLink` and `repo` are both optional — omit either if not applicable.
  // 4. `apkLink` and `docsLink` are optional — add only when available.
  // 5. `date` format: "YYYY-MM-DD"
  //
  // {
  //   icon: "/projects/your-project-icon.png",
  //   title: "Project Title",
  //   tagline: "Short one-line description",
  //   date: "YYYY-MM-DD",
  //   description: [
  //     "What you built and why it matters.",
  //     "A key technical challenge you solved.",
  //     "A notable feature or result.",
  //   ],
  //   liveLink: "https://your-live-link.com",   // optional
  //   repo: "https://github.com/you/repo",       // optional
  //   apkLink: "/apk/your-app.apk",              // optional
  //   docsLink: "https://docs.your-project.com", // optional
  //   techStack: [
  //     { name: "React", icon: "/tech-icon/react.svg" },
  //     { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
  //   ],
  // },
];
