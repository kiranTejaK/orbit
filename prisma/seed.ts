// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database…");

  // Seed Resources
  const resources = await Promise.all([
    prisma.resource.upsert({
      where: { id: "seed-r1" },
      update: {},
      create: {
        id: "seed-r1",
        title: "Next.js Documentation",
        resourceType: "Documentation",
        url: "https://nextjs.org/docs",
        description: "Official Next.js documentation covering App Router, Pages Router, and all APIs.",
        category: "Frontend",
        tags: ["nextjs", "react", "frontend", "documentation"],
        source: "Official",
        favorite: true,
      },
    }),
    prisma.resource.upsert({
      where: { id: "seed-r2" },
      update: {},
      create: {
        id: "seed-r2",
        title: "Prisma ORM Documentation",
        resourceType: "Documentation",
        url: "https://www.prisma.io/docs",
        description: "Prisma ORM — next-generation Node.js and TypeScript ORM.",
        category: "Databases",
        tags: ["prisma", "orm", "database", "typescript"],
        source: "Official",
        favorite: false,
      },
    }),
    prisma.resource.upsert({
      where: { id: "seed-r3" },
      update: {},
      create: {
        id: "seed-r3",
        title: "TypeScript Deep Dive",
        resourceType: "Blog",
        url: "https://basarat.gitbook.io/typescript/",
        description: "Comprehensive TypeScript guide covering advanced patterns and real-world usage.",
        category: "Frontend",
        tags: ["typescript", "javascript", "programming"],
        personalNotes: "Great reference for complex type patterns",
        favorite: true,
      },
    }),
    prisma.resource.upsert({
      where: { id: "seed-r4" },
      update: {},
      create: {
        id: "seed-r4",
        title: "shadcn/ui",
        resourceType: "Open Source Project",
        url: "https://ui.shadcn.com",
        description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
        category: "Frontend",
        tags: ["ui", "components", "react", "tailwind"],
        source: "GitHub",
        favorite: false,
      },
    }),
    prisma.resource.upsert({
      where: { id: "seed-r5" },
      update: {},
      create: {
        id: "seed-r5",
        title: "System Design Primer",
        resourceType: "GitHub Repository",
        url: "https://github.com/donnemartin/system-design-primer",
        description: "Learn how to design large-scale systems. Prep for the system design interview.",
        category: "System Design",
        tags: ["system-design", "interviews", "architecture", "scalability"],
        source: "GitHub",
        favorite: true,
      },
    }),
  ]);

  // Seed Job Applications
  const jobs = await Promise.all([
    prisma.jobApplication.upsert({
      where: { id: "seed-j1" },
      update: {},
      create: {
        id: "seed-j1",
        company: "Google",
        position: "Software Engineer L4",
        source: "LinkedIn",
        jobUrl: "https://careers.google.com",
        appliedDate: new Date("2025-01-15"),
        status: "Technical Round 1",
        salary: "45 LPA",
        hrName: "Priya Sharma",
        hrContact: "priya.sharma@google.com",
        followUpDate: new Date("2025-02-01"),
        resumeVersion: "v4.0",
        notes: "Online assessment completed. Strong performance on system design.",
      },
    }),
    prisma.jobApplication.upsert({
      where: { id: "seed-j2" },
      update: {},
      create: {
        id: "seed-j2",
        company: "Microsoft",
        position: "Senior Full Stack Developer",
        source: "Naukri",
        appliedDate: new Date("2025-01-20"),
        status: "HR Round",
        salary: "38 LPA",
        resumeVersion: "v4.0",
        notes: "Initial HR call went well. Next step: Technical round.",
      },
    }),
    prisma.jobApplication.upsert({
      where: { id: "seed-j3" },
      update: {},
      create: {
        id: "seed-j3",
        company: "Zepto",
        position: "Backend Engineer",
        source: "Referral",
        appliedDate: new Date("2025-01-10"),
        status: "Offer",
        salary: "32 LPA",
        resumeVersion: "v3.5",
        notes: "Offer received! Negotiating salary.",
      },
    }),
    prisma.jobApplication.upsert({
      where: { id: "seed-j4" },
      update: {},
      create: {
        id: "seed-j4",
        company: "Startup XYZ",
        position: "Frontend Developer",
        source: "AngelList",
        appliedDate: new Date("2024-12-15"),
        status: "Rejected",
        resumeVersion: "v3.0",
        notes: "Rejected after technical round. Feedback: need more system design experience.",
      },
    }),
  ]);

  // Seed Daily Planner Todos
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const todayDate = new Date(`${todayStr}T09:00:00Z`);

  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const nextWeekDate = new Date(now);
  nextWeekDate.setDate(nextWeekDate.getDate() + 5);

  const todos = await Promise.all([
    prisma.todo.upsert({
      where: { id: "seed-t1" },
      update: {},
      create: {
        id: "seed-t1",
        title: "Review Orbit Rebrand Assets & Architecture",
        description: "Verify vector icons, dark/light theme consistency, and responsive sidebar navigation.",
        dueDate: todayDate,
        startDate: todayDate,
        priority: "HIGH",
        status: "IN_PROGRESS",
        notes: "Brand guidelines call for geometric ring/planet icon aesthetics.",
        tags: ["branding", "orbit", "design"],
      },
    }),
    prisma.todo.upsert({
      where: { id: "seed-t2" },
      update: {},
      create: {
        id: "seed-t2",
        title: "Finalize Daily Planner Drag & Drop Module",
        description: "Ensure smooth drag-and-drop between section containers on desktop and mobile.",
        dueDate: todayDate,
        startDate: todayDate,
        priority: "URGENT",
        status: "PENDING",
        notes: "Use HTML5 drag-and-drop API with clean drag handle styling.",
        tags: ["planner", "frontend", "ui"],
      },
    }),
    prisma.todo.upsert({
      where: { id: "seed-t3" },
      update: {},
      create: {
        id: "seed-t3",
        title: "Complete System Architecture Audit",
        description: "Overdue review of microservices deployment configuration.",
        dueDate: yesterdayDate,
        startDate: yesterdayDate,
        priority: "HIGH",
        status: "PENDING",
        notes: "Needs urgent follow-up today.",
        tags: ["architecture", "devops"],
      },
    }),
    prisma.todo.upsert({
      where: { id: "seed-t4" },
      update: {},
      create: {
        id: "seed-t4",
        title: "Prepare Sprint Demo Presentation",
        description: "Slide deck covering Career module rebranding and Daily Planner features.",
        dueDate: tomorrowDate,
        startDate: todayDate,
        priority: "MEDIUM",
        status: "PENDING",
        tags: ["meeting", "demo"],
      },
    }),
    prisma.todo.upsert({
      where: { id: "seed-t5" },
      update: {},
      create: {
        id: "seed-t5",
        title: "Setup Automated E2E Test Suite",
        description: "Configure Playwright integration tests for main user workflows.",
        dueDate: nextWeekDate,
        priority: "LOW",
        status: "PENDING",
        tags: ["testing", "qa"],
      },
    }),
    prisma.todo.upsert({
      where: { id: "seed-t6" },
      update: {},
      create: {
        id: "seed-t6",
        title: "Morning Routine & Focus Planning",
        description: "Set daily goals and review priority tasks.",
        dueDate: todayDate,
        priority: "MEDIUM",
        status: "COMPLETED",
        completedAt: new Date(),
        tags: ["routine", "productivity"],
      },
    }),
    prisma.todo.upsert({
      where: { id: "seed-t7" },
      update: {},
      create: {
        id: "seed-t7",
        title: "Explore Raycast & Linear UI Interaction Patterns",
        description: "Inspiration research for high-velocity keyboard shortcuts and micro-interactions.",
        priority: "LOW",
        status: "PENDING",
        notes: "Check command palette and quick filter patterns.",
        tags: ["research", "design-system"],
      },
    }),
  ]);

  console.log(`✅ Seeded ${resources.length} resources, ${jobs.length} career applications, and ${todos.length} planner todos.`);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
