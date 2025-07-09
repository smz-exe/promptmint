import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Categories
  console.log("📁 Seeding categories...");
  const categories = [
    {
      name: "Programming",
      slug: "programming",
      description: "Code generation, debugging, and development",
      order: 1,
    },
    {
      name: "Writing",
      slug: "writing",
      description: "Creative and professional writing",
      order: 2,
    },
    {
      name: "Analysis & Research",
      slug: "analysis-research",
      description: "Data analysis and research tasks",
      order: 3,
    },
    {
      name: "Learning & Education",
      slug: "learning-education",
      description: "Educational and study prompts",
      order: 4,
    },
    {
      name: "Creative & Art",
      slug: "creative-art",
      description: "Creative and artistic prompts",
      order: 5,
    },
    {
      name: "Others",
      slug: "others",
      description: "Miscellaneous prompts",
      order: 6,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    console.log(`✅ Category: ${category.name}`);
  }

  // Seed AI Models
  console.log("🤖 Seeding AI models...");
  const aiModels = [
    {
      name: "Claude",
      slug: "claude",
      displayName: "Claude",
      order: 1,
    },
    {
      name: "GPT",
      slug: "gpt",
      displayName: "ChatGPT",
      order: 2,
    },
    {
      name: "Gemini",
      slug: "gemini",
      displayName: "Gemini",
      order: 3,
    },
    {
      name: "Others",
      slug: "others",
      displayName: "Others",
      order: 4,
    },
  ];

  for (const aiModel of aiModels) {
    await prisma.aIModel.upsert({
      where: { slug: aiModel.slug },
      update: aiModel,
      create: aiModel,
    });
    console.log(`✅ AI Model: ${aiModel.displayName}`);
  }

  console.log("✨ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
