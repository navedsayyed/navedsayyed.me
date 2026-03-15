import type { Projects } from "@/types";

export const ProjectsData: Projects[] = [
  {
    icon: "/projects/snap2fix.png",
    title: "Snap2Fix",
    tagline: "Smart Complaint Management System",
    date: "2025-01-15",
    description: [
      "Built a role-based campus complaint management mobile application enabling users, technicians, and administrators to track maintenance issues in real time.",
      "Implemented authentication, complaint submission workflow, and status tracking with backend integration.",
      "Integrated push notifications using Firebase Cloud Messaging (FCM) and Notifee for real-time alerts.",
      "Used Supabase (PostgreSQL) for backend services and real-time data synchronization.",
      "Implemented QR scanning, media upload, and animated UI using React Native libraries.",
      "Deployed a complementary web platform for complaint management and administration.",
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
    description: [
      "Developed a full-featured music streaming mobile application supporting online streaming and offline downloads.",
      "Integrated JioSaavn API for fetching songs, artists, playlists, and lyrics dynamically.",
      "Implemented background music playback, playlist management, and queue reordering.",
      "Built smooth UI animations and gesture-based interactions for enhanced user experience.",
      "Added offline download functionality using file system storage.",
    ],
    techStack: [
      { name: "React Native", icon: "/tech-icon/react.svg" },
      { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
      { name: "Zustand", icon: "/tech-icon/zustand.svg" },
      { name: "Expo", icon: "/tech-icon/expo.svg" },
    ],
  },
  {
    icon: "/projects/restaurant-admin.png",
    title: "Restaurant Admin App",
    tagline: "Digital Menu Management System",
    date: "2024-09-20",
    description: [
      "Developed a mobile application for restaurant owners to manage menu items, generate QR codes, and create digital menus.",
      "Implemented CRUD operations for menu management with backend integration.",
      "Enabled QR-based menu sharing and automatic PDF menu generation for restaurants.",
      "Built reusable UI components and structured navigation for scalable architecture.",
      "Implemented media upload and sharing functionality within the application.",
    ],
    techStack: [
      { name: "React Native", icon: "/tech-icon/react.svg" },
      { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
      { name: "Appwrite", icon: "/tech-icon/appwrite.svg" },
    ],
  },
  {
    icon: "/projects/blood-o.png",
    title: "Blood-O",
    tagline: "Blood Donation Management Platform",
    date: "2024-07-05",
    description: [
      "Built a full-stack web platform connecting blood donors with recipients for efficient blood request management.",
      "Implemented donor registration, blood search system, and urgent request management.",
      "Integrated Supabase backend with PostgreSQL database for authentication and real-time data operations.",
      "Designed responsive UI using Tailwind CSS and modern component libraries.",
      "Implemented form validation, API data fetching, and analytics dashboard for administrators.",
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
  // 4. `date` format: "YYYY-MM-DD"
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
  //   techStack: [
  //     { name: "React", icon: "/tech-icon/react.svg" },
  //     { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
  //   ],
  // },
];
