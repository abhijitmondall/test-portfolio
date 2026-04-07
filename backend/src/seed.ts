import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  // Use `ADMIN_PASSWORD` from environment for seeding. In production the env var is required.
  let adminPlain = process.env.ADMIN_PASSWORD;
  if (!adminPlain) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "ADMIN_PASSWORD environment variable is required for production seeding",
      );
    }
    // Local/dev fallback (do NOT commit this value or use it in production)
    adminPlain = "Admin@123";
  }

  const hashedPwd = await bcrypt.hash(adminPlain, 12);
  await prisma.user.upsert({
    where: { email: "abhijeetmondal5@gmail.com" },
    update: {},
    create: {
      email: "abhijeetmondal5@gmail.com",
      password: hashedPwd,
      name: "Abhijit Mondal",
      role: "SUPER_ADMIN",
    },
  });

  // Profile
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      name: "Abhijit Mondal",
      title: "Full-Stack Engineer",
      tagline:
        "Building scalable web apps with clean code & critical thinking.",
      bio: "I'm a Full-Stack Engineer from Bangladesh with 5+ years of experience crafting scalable, production-grade web applications. I specialize in the MERN stack, Next.js, and TypeScript — turning complex problems into elegant, user-focused solutions. Passionate about clean architecture, performance optimization, and mentoring the next generation of developers.",
      email: "abhijeetmondal5@gmail.com",
      phone: "+8801985412273",
      location: "Dhaka, Bangladesh",
      available: true,
    },
  });

  // Social links
  await prisma.socialLink.deleteMany();
  const socialLinks = [
    {
      platform: "GitHub",
      url: "https://github.com/abhijitmondall",
      icon: "github",
      order: 1,
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/abhijitmondall/",
      icon: "linkedin",
      order: 2,
    },
    {
      platform: "Fiverr",
      url: "https://www.fiverr.com/developer_avi",
      icon: "fiverr",
      order: 3,
    },
    {
      platform: "Upwork",
      url: "https://www.upwork.com/freelancers/~01532b67b472bb704f",
      icon: "upwork",
      order: 4,
    },
    {
      platform: "CodeChef",
      url: "https://www.codechef.com/users/abhijitmondal",
      icon: "codechef",
      order: 5,
    },
    {
      platform: "Codeforces",
      url: "https://codeforces.com/profile/abhijitmondal",
      icon: "codeforces",
      order: 6,
    },
  ];
  await prisma.socialLink.createMany({ data: socialLinks });

  // Experiences
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        company: "Agency Handy",
        role: "Software Engineer II",
        type: "Full-time",
        locationType: "Hybrid",
        location: "Bangladesh",
        startDate: new Date("2025-04-01"),
        endDate: new Date("2025-08-31"),
        current: false,
        companyUrl: "https://agencyhandy.com",
        description: [
          "Led front-end development of core SaaS features, fixing critical production bugs for scalability and reliability.",
          "Drove front-end architecture using MERN stack, focusing on workflow automation and performance optimization.",
          "Conducted R&D to explore solutions for technically challenging product requirements.",
          "Mentored junior developers through code reviews and knowledge-sharing sessions.",
          "Collaborated with cross-functional teams to deliver responsive UI using React.js, Material UI, and TypeScript.",
        ],
        order: 1,
      },
      {
        company: "IMPULSION",
        role: "Freelance Web Developer",
        type: "Freelance",
        locationType: "Remote",
        startDate: new Date("2022-06-01"),
        endDate: new Date("2024-06-30"),
        current: false,
        description: [
          "Collaborated with a team to develop the company website and multiple client projects.",
          "Partnered with design team to translate creative concepts into functional, user-friendly solutions.",
          "Delivered high-quality results that enhanced the company's digital presence.",
        ],
        order: 2,
      },
      {
        company: "Upwork & Fiverr",
        role: "Freelance Web Designer & Developer",
        type: "Freelance",
        locationType: "Remote",
        startDate: new Date("2019-08-01"),
        endDate: new Date("2024-06-30"),
        current: false,
        description: [
          "Delivered numerous freelance projects over 5 years, consistently meeting client expectations and deadlines.",
          "Worked closely with clients to translate business goals into functional, user-friendly solutions.",
          "Demonstrated strong problem-solving abilities across all phases of development.",
        ],
        order: 3,
      },
    ],
  });

  // Education
  await prisma.education.deleteMany();
  await prisma.education.create({
    data: {
      institution: "National University, Bangladesh",
      degree: "Bachelor of Science",
      field: "Computer Science & Engineering",
      startDate: new Date("2016-01-01"),
      endDate: new Date("2020-12-31"),
      current: false,
      order: 1,
    },
  });

  // Skills
  await prisma.skillCategory.deleteMany();
  const categories = [
    {
      name: "Frontend",
      icon: "monitor",
      order: 1,
      skills: [
        { name: "React.js", level: 92, order: 1 },
        { name: "Next.js", level: 90, order: 2 },
        { name: "TypeScript", level: 88, order: 3 },
        { name: "JavaScript ES6+", level: 95, order: 4 },
        { name: "Tailwind CSS", level: 90, order: 5 },
        { name: "Redux / Zustand", level: 85, order: 6 },
        { name: "HTML / CSS / SCSS", level: 95, order: 7 },
      ],
    },
    {
      name: "Backend",
      icon: "server",
      order: 2,
      skills: [
        { name: "Node.js", level: 88, order: 1 },
        { name: "Express.js", level: 88, order: 2 },
        { name: "MongoDB / Mongoose", level: 85, order: 3 },
        { name: "PostgreSQL", level: 82, order: 4 },
        { name: "Prisma ORM", level: 82, order: 5 },
        { name: "WebSocket", level: 75, order: 6 },
        { name: "RESTful APIs", level: 92, order: 7 },
      ],
    },
    {
      name: "Languages",
      icon: "code",
      order: 3,
      skills: [
        { name: "C / C++", level: 85, order: 1 },
        { name: "JavaScript", level: 95, order: 2 },
        { name: "TypeScript", level: 88, order: 3 },
        { name: "Python", level: 70, order: 4 },
      ],
    },
    {
      name: "Tools & DevOps",
      icon: "wrench",
      order: 4,
      skills: [
        { name: "Git / GitHub", level: 90, order: 1 },
        { name: "Vercel / Netlify", level: 88, order: 2 },
        { name: "Firebase", level: 80, order: 3 },
        { name: "Postman", level: 85, order: 4 },
        { name: "VS Code", level: 92, order: 5 },
      ],
    },
  ];

  for (const cat of categories) {
    const { skills, ...catData } = cat;
    const category = await prisma.skillCategory.create({ data: catData });
    await prisma.skill.createMany({
      data: skills.map((s) => ({ ...s, categoryId: category.id })),
    });
  }

  // Projects
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        title: "MelodyMasters",
        slug: "melodymasters",
        description:
          "A comprehensive music school booking platform with student, instructor, and admin dashboards.",
        longDesc:
          "MelodyMasters is a full-stack music school management system featuring role-based dashboards for students, instructors, and administrators. Built with a focus on scalability and user experience, it includes secure Stripe payment integration, real-time class booking, and comprehensive admin controls.",
        liveUrl: "https://melodymaster-app.vercel.app/",
        githubUrl: "https://github.com/abhijitmondall/MelodyMaster-Client",
        featured: true,
        published: true,
        order: 1,
        tags: ["Full-Stack", "Music", "SaaS"],
        techStack: [
          "Next.js",
          "Node.js",
          "Express.js",
          "PostgreSQL",
          "Prisma ORM",
          "Stripe",
          "JWT",
        ],
        category: "Full-Stack",
      },
      {
        title: "MediStore",
        slug: "medistore",
        description:
          "A comprehensive medical management platform with patient, doctor, and admin dashboards.",
        longDesc:
          "MediStore is a full-stack medical management system featuring role-based dashboards for patients, doctors, and administrators. Built with a focus on scalability and user experience.",
        liveUrl: "https://medistore-app.vercel.app/",
        githubUrl: "https://github.com/abhijitmondall/l2_a4_client",
        featured: true,
        published: true,
        order: 1,
        tags: ["Full-Stack", "Medical", "SaaS"],
        techStack: [
          "Next.js",
          "Node.js",
          "Express.js",
          "PostgreSQL",
          "Prisma ORM",
          "JWT",
        ],
        category: "Full-Stack",
      },
      {
        title: "Recipe App",
        slug: "recipe-app",
        description:
          "A feature-rich recipe app built with vanilla JavaScript using MVC architecture.",
        longDesc:
          "A single-page recipe application built from scratch with HTML, CSS, SCSS, and Vanilla JavaScript following the Model-View-Controller software architectural pattern. Features include recipe search, bookmarking, and pagination.",
        liveUrl: "https://recipe-app-by-avi.netlify.app/",
        githubUrl: "https://github.com/abhijitmondall/recipe-project",
        featured: true,
        published: true,
        order: 2,
        tags: ["Frontend", "JavaScript", "MVC"],
        techStack: ["HTML", "CSS", "SCSS", "JavaScript", "MVC Pattern"],
        category: "Frontend",
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
