import type { Experience } from "@/types";

export const ExperienceData: Experience[] = [
  {
    company: "11 BRD, Indian Air Force Station, Ojhar",
    logo: "/company/airforce.png",
    designation: "Data Management & Production Monitoring Intern",
    type: "Internship",
    startDate: "12.2024",
    endDate: "01.2025",
    isCurrent: false,
    description: [
      "Assisted in the management of electronic component data used in aircraft systems at the 11 Base Repair Depot (11BRD), Indian Air Force.",
      "Developed and maintained Excel-based worksheets to monitor real-time production status of Air Force aggregates.",
      "Utilized formulas like VLOOKUP, IF, COUNTIF, COUNTIFS, and SUMIF to automate data analysis and reporting tasks.",
      "Created macros to streamline repetitive processes and improve data accuracy and efficiency.",
      "Collaborated with the technical team to ensure accurate inventory tracking and production documentation.",
      "Supported the Product Research and Development (PRD) department in analyzing and organizing production-related data.",
      "Ensured the confidentiality and integrity of sensitive military data throughout the internship.",
    ],
    skills: [
      { name: "Excel", icon: "/tech-icon/excel.svg" },
    ],
  },
  {
    company: "COSA-GCOERC",
    logo: "/company/logo.png",
    designation: "Technical Head – Student Committee",
    type: "Part-time",
    startDate: "06.2024",
    endDate: "08.2025",
    isCurrent: false,
    description: [
      "Led the technical team of the COSA (Computer Organization of Students Association) committee in organizing and managing all tech-related activities and events.",
      "Designed and developed the official COSA website – cosagcoerc.com.",
      "Managed technical event planning, including coding contests, online competitions, and workshops.",
      "Coordinated with web and design teams to create posters, registration forms, and result publishing portals.",
      "Provided technical support during online/offline events, ensuring smooth execution and resolving any issues.",
      "Worked closely with faculty coordinators and student members for planning, communication, and approvals.",
      "Created Google Forms, managed Excel reports, and issued participation certificates through automated tools.",
      "Mentored junior members of the technical team in web development and technical tools used during events.",
    ],
    skills: [
      { name: "React.js", icon: "/tech-icon/react.svg" },
      { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
      { name: "Tailwind CSS", icon: "/tech-icon/tailwindcss.svg" },
    ],
  },

  // ── ADD NEW COMPANY BELOW ──────────────────────────────────────────────────
  // 1. Copy the block below, uncomment it, and fill in your details.
  // 2. Add the company logo to /public/company/<logo-file> and update `logo`.
  // 3. Set isCurrent: true if this is your active job, false otherwise.
  // 4. `type` must be one of: "Full-time" | "Part-time" | "Internship" | "Freelance" | "Contract"
  // 5. Date format: "MM.YYYY"  (e.g. "03.2026")
  //
  // {
  //   company: "Company Name",
  //   logo: "/company/company-logo.png",
  //   designation: "Your Job Title",
  //   type: "Full-time",
  //   startDate: "MM.YYYY",
  //   endDate: "MM.YYYY",   // or "Present" if isCurrent is true
  //   isCurrent: false,
  //   description: [
  //     "What you did — bullet point 1.",
  //     "What you did — bullet point 2.",
  //   ],
  //   skills: [
  //     { name: "React.js", icon: "/tech-icon/react.svg" },
  //     { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
  //   ],
  // },
];
