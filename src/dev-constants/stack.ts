import type { StackGroup } from "@/types";

/**
 * Every entry here is backed by shipped work — see the project it came from in the comment.
 * Nothing goes in this list that isn't in a real codebase; a stack section that lists tools
 * you can't discuss in an interview costs more than it earns.
 */
export const TechStackGroups: StackGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "TypeScript", icon: "/tech-icon/typescript.svg" }, // every web + RN project
      { name: "JavaScript", icon: "/tech-icon/js.svg" },
      { name: "Python", icon: "/tech-icon/python.svg" }, // Grievance Resolver (FastAPI)
      { name: "SQL", icon: "/tech-icon/postgresql.svg" },
      { name: "C++", icon: "/tech-icon/c++.svg" },
    ],
  },
  {
    label: "Mobile",
    items: [
      { name: "React Native", icon: "/tech-icon/react.svg" }, // Snap2Fix, LokalMusic, MenuForge
      { name: "Expo", icon: "/tech-icon/Expo.svg" }, // LokalMusic
      { name: "Android", icon: "/tech-icon/android.svg" }, // Snap2Fix + LokalMusic release builds
    ],
  },
  {
    label: "Web",
    items: [
      { name: "React", icon: "/tech-icon/react.svg" },
      { name: "Next.js", icon: "/tech-icon/nextjs.svg", hasDarkIcon: true }, // Snap2Fix web, this site
      { name: "Tailwind CSS", icon: "/tech-icon/tailwindcss.svg" },
      { name: "shadcn/ui", icon: "/tech-icon/shadcnui.svg", hasDarkIcon: true },
      { name: "Zustand", icon: "/tech-icon/zustand.svg" }, // LokalMusic
      { name: "Zod", icon: "/tech-icon/zod.svg" }, // Snap2Fix forms
      { name: "React Hook Form", icon: "/tech-icon/react-hook-form.svg" }, // Snap2Fix
      { name: "Vite", icon: "/tech-icon/vitejs.svg" }, // Blood-O
    ],
  },
  {
    label: "Backend & Data",
    items: [
      { name: "Supabase", icon: "/tech-icon/supabase.svg" }, // Snap2Fix, Grievance, Blood-O
      { name: "PostgreSQL", icon: "/tech-icon/postgresql.svg" },
      { name: "Row Level Security" }, // Snap2Fix + Blood-O auth model
      { name: "Firebase", icon: "/tech-icon/firebase.svg" }, // Snap2Fix FCM
      { name: "Appwrite", icon: "/tech-icon/appwrite.svg" }, // MenuForge
      { name: "FastAPI" }, // Grievance Resolver
      { name: "Node.js", icon: "/tech-icon/nodejs.svg" },
    ],
  },
  {
    label: "AI",
    items: [
      { name: "Gemini", icon: "/tech-icon/gemini.svg" }, // Snap2Fix routing, this site's chatbot
      { name: "LangGraph", icon: "/tech-icon/langgraph-color.svg" }, // Grievance Resolver
      { name: "LangChain", icon: "/tech-icon/langchain.svg" },
      { name: "OpenAI", icon: "/tech-icon/openai.svg", hasDarkIcon: true },
      { name: "Groq" }, // Grievance Resolver provider layer
    ],
  },
  {
    label: "Tooling",
    items: [
      { name: "Git", icon: "/tech-icon/git.svg" },
      { name: "GitHub", icon: "/tech-icon/github.svg", hasDarkIcon: true },
      { name: "Vercel", icon: "/tech-icon/vercel.svg", hasDarkIcon: true },
      { name: "Postman", icon: "/tech-icon/postman.svg" },
      { name: "Figma", icon: "/tech-icon/figma.svg" },
      { name: "Biome" },
    ],
  },
];
