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

  console.log(`✅ Seeded ${resources.length} resources and ${jobs.length} job applications.`);
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
