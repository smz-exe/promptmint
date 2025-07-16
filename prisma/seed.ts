import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Categories
  console.log("📁 Seeding categories...");
  const categoriesData = [
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

  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    console.log(`✅ Category: ${category.name}`);
  }

  // Seed AI Models
  console.log("🤖 Seeding AI models...");
  const aiModelsData = [
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

  for (const aiModel of aiModelsData) {
    await prisma.aIModel.upsert({
      where: { slug: aiModel.slug },
      update: aiModel,
      create: aiModel,
    });
    console.log(`✅ AI Model: ${aiModel.displayName}`);
  }

  // Seed Sample Users
  console.log("👥 Seeding sample users...");
  const sampleUsers = [
    {
      id: "sample-user-1",
      email: "alex@example.com",
      username: "alexdev",
      displayName: "Alex Chen",
      bio: "Full-stack developer passionate about AI and clean code. Creating prompts to boost productivity.",
    },
    {
      id: "sample-user-2",
      email: "maria@example.com",
      username: "mariawriter",
      displayName: "Maria Rodriguez",
      bio: "Content strategist and creative writer. Exploring the intersection of AI and storytelling.",
    },
    {
      id: "sample-user-3",
      email: "sam@example.com",
      username: "samresearcher",
      displayName: "Sam Kim",
      bio: "Data scientist and researcher. Building better prompts for analysis and insights.",
    },
    {
      id: "sample-user-4",
      email: "taylor@example.com",
      username: "taylorartist",
      displayName: "Taylor Johnson",
      bio: "Digital artist and creative technologist. Experimenting with AI for artistic expression.",
    },
    {
      id: "sample-user-5",
      email: "jordan@example.com",
      username: "jordanedu",
      displayName: "Jordan Liu",
      bio: "Educator and learning designer. Creating prompts to enhance educational experiences.",
    },
  ];

  for (const user of sampleUsers) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
    console.log(`✅ User: ${user.displayName} (@${user.username})`);
  }

  // Get seeded categories and AI models for prompt cards
  const categories = await prisma.category.findMany();
  const aiModels = await prisma.aIModel.findMany();

  const programmingCategory = categories.find((c) => c.slug === "programming");
  const writingCategory = categories.find((c) => c.slug === "writing");
  const analysisCategory = categories.find(
    (c) => c.slug === "analysis-research",
  );
  const learningCategory = categories.find(
    (c) => c.slug === "learning-education",
  );
  const creativeCategory = categories.find((c) => c.slug === "creative-art");
  const othersCategory = categories.find((c) => c.slug === "others");

  const claudeModel = aiModels.find((m) => m.slug === "claude");
  const gptModel = aiModels.find((m) => m.slug === "gpt");
  const geminiModel = aiModels.find((m) => m.slug === "gemini");

  // Seed Sample Prompt Cards
  console.log("💎 Seeding sample prompt cards...");
  const samplePromptCards = [
    {
      title: "Code Review Assistant",
      description:
        "A comprehensive prompt for AI-powered code reviews that focuses on security, performance, and best practices.",
      promptText: `Please review the following code and provide feedback on:

1. **Security vulnerabilities** - Look for common security issues like SQL injection, XSS, authentication flaws
2. **Performance optimization** - Identify bottlenecks, unnecessary computations, or inefficient algorithms
3. **Code quality** - Check for adherence to best practices, naming conventions, and maintainability
4. **Error handling** - Ensure proper exception handling and edge case coverage
5. **Documentation** - Assess if the code is well-documented and self-explanatory

For each issue found, provide:
- Severity level (Critical/High/Medium/Low)
- Specific location in the code
- Detailed explanation of the problem
- Suggested fix with example code
- Explanation of why the fix improves the code

Focus on actionable feedback that helps improve code quality and security.`,
      categoryId: programmingCategory?.id ?? "",
      aiModelId: claudeModel?.id ?? "",
      authorId: "sample-user-1",
      likesCount: 45,
      rarity: "SILVER" as const,
    },
    {
      title: "Creative Story Generator",
      description:
        "Generate engaging short stories with rich characters and compelling narratives.",
      promptText: `Create a compelling short story (800-1200 words) with the following elements:

**Setting**: [Specify time period, location, and atmosphere]
**Main Character**: Create a protagonist with clear motivations, flaws, and unique voice
**Conflict**: Include both internal and external conflicts that drive the narrative
**Theme**: Weave in universal themes like love, loss, growth, or redemption

**Structure Requirements**:
- Hook the reader within the first paragraph
- Include vivid sensory details and show, don't tell
- Build tension towards a climactic moment
- Provide a satisfying resolution that ties back to the theme

**Style Guidelines**:
- Use active voice and varied sentence structure
- Include dialogue that reveals character
- Balance description with action
- End with emotional resonance

Please make the story original, engaging, and emotionally impactful.`,
      categoryId: writingCategory?.id ?? "",
      aiModelId: gptModel?.id ?? "",
      authorId: "sample-user-2",
      likesCount: 67,
      rarity: "GOLD" as const,
    },
    {
      title: "Data Analysis Framework",
      description:
        "Systematic approach to analyzing datasets and extracting meaningful insights.",
      promptText: `Analyze the provided dataset using this comprehensive framework:

## 1. Data Exploration
- Examine data structure, types, and dimensions
- Identify missing values, outliers, and data quality issues
- Generate descriptive statistics and initial observations

## 2. Hypothesis Formation
- Based on initial exploration, formulate 3-5 testable hypotheses
- Clearly state expected relationships between variables
- Justify each hypothesis with domain knowledge or preliminary findings

## 3. Statistical Analysis
- Choose appropriate statistical methods for each hypothesis
- Perform correlation analysis, regression, or other relevant tests
- Calculate effect sizes and confidence intervals
- Address multiple comparison corrections if needed

## 4. Visualization
- Create informative charts that support your findings
- Use appropriate chart types for data characteristics
- Include proper labels, legends, and captions
- Highlight key patterns and relationships

## 5. Interpretation & Recommendations
- Summarize key findings in plain language
- Discuss limitations and potential confounding factors
- Provide actionable recommendations based on results
- Suggest areas for further investigation

Present findings in a clear, structured report suitable for both technical and non-technical audiences.`,
      categoryId: analysisCategory?.id ?? "",
      aiModelId: claudeModel?.id ?? "",
      authorId: "sample-user-3",
      likesCount: 89,
      rarity: "GOLD" as const,
    },
    {
      title: "Learning Path Designer",
      description:
        "Create personalized learning paths for any skill or topic with clear milestones.",
      promptText: `Design a comprehensive learning path for [TOPIC/SKILL] with the following structure:

## Assessment & Personalization
- Assess current knowledge level (Beginner/Intermediate/Advanced)
- Identify learning style preferences (visual, auditory, kinesthetic, reading)
- Determine available time commitment and learning goals
- Consider any prerequisites or background knowledge

## Learning Path Structure

### Phase 1: Foundation (Weeks 1-2)
- Core concepts and terminology
- Fundamental principles and theories
- Basic practical exercises
- **Milestone**: Can explain key concepts to others

### Phase 2: Application (Weeks 3-4)
- Hands-on projects and real-world applications
- Problem-solving scenarios
- Skill-building exercises
- **Milestone**: Complete first practical project

### Phase 3: Mastery (Weeks 5-6)
- Advanced techniques and edge cases
- Integration with other skills/tools
- Teaching or mentoring others
- **Milestone**: Demonstrate expertise through portfolio

## Resources & Materials
- Recommended books, courses, and tutorials
- Practice platforms and tools
- Communities and forums for support
- Assessment methods and progress tracking

## Success Metrics
Define clear, measurable outcomes for each phase that demonstrate skill acquisition and retention.`,
      categoryId: learningCategory?.id ?? "",
      aiModelId: geminiModel?.id ?? "",
      authorId: "sample-user-5",
      likesCount: 34,
      rarity: "SILVER" as const,
    },
    {
      title: "Digital Art Concept Generator",
      description:
        "Generate unique digital art concepts with detailed visual descriptions and techniques.",
      promptText: `Create a detailed digital art concept with the following specifications:

## Visual Concept
**Theme**: [Specify mood, emotion, or narrative theme]
**Style**: Choose from: Photorealistic, Stylized, Abstract, Minimalist, Surreal, Retro-futuristic
**Color Palette**: Define 5-7 core colors with hex codes and emotional associations
**Composition**: Describe layout, focal points, and visual hierarchy

## Technical Specifications
**Medium**: Digital painting, 3D render, photo manipulation, vector art, etc.
**Resolution**: Recommended dimensions and DPI
**Software**: Suggested tools (Photoshop, Blender, Illustrator, Procreate, etc.)
**Techniques**: Specific methods, brushes, or effects to achieve the desired look

## Artistic Elements
**Lighting**: Direction, quality, and mood of lighting
**Texture**: Surface qualities and material properties
**Depth**: Perspective, atmospheric effects, layering
**Movement**: How the eye travels through the composition

## Inspiration & References
- Cite 2-3 artistic movements or contemporary artists
- Mention specific works that inspire elements of the concept
- Explain how this concept builds upon or differs from existing work

## Execution Notes
- Estimated time for completion
- Skill level required
- Potential challenges and solutions
- Tips for achieving professional results

The concept should be original, technically feasible, and artistically compelling.`,
      categoryId: creativeCategory?.id ?? "",
      aiModelId: gptModel?.id ?? "",
      authorId: "sample-user-4",
      likesCount: 23,
      rarity: "BRONZE" as const,
    },
    {
      title: "Meeting Minutes AI Assistant",
      description:
        "Transform meeting recordings or notes into professional, actionable meeting minutes.",
      promptText: `Convert the provided meeting content into professional meeting minutes using this format:

## Meeting Header
**Date**: [Date]
**Time**: [Start time - End time]
**Location/Platform**: [Physical location or video platform]
**Meeting Type**: [Team standup, project review, client call, etc.]
**Attendees**: [List participants with roles]
**Facilitator**: [Meeting leader]

## Agenda Review
List the planned agenda items and note any deviations or additions during the meeting.

## Key Discussions
For each major topic discussed:
- **Topic**: Clear, descriptive heading
- **Summary**: 2-3 sentence overview of the discussion
- **Key Points**: Bullet points of important details
- **Decisions Made**: Any concrete decisions reached
- **Open Questions**: Unresolved issues requiring follow-up

## Action Items
| Task | Owner | Due Date | Priority | Status |
|------|-------|----------|----------|---------|
| [Specific action] | [Name] | [Date] | [High/Med/Low] | [Not Started] |

## Next Steps
- Immediate actions required before next meeting
- Agenda items for next meeting
- Follow-up meetings or communications needed

## Parking Lot
Items mentioned but not discussed in detail, requiring future attention.

**Note**: Ensure all action items are specific, measurable, and assigned to individuals with realistic due dates.`,
      categoryId: othersCategory?.id ?? "",
      aiModelId: claudeModel?.id ?? "",
      authorId: "sample-user-1",
      likesCount: 56,
      rarity: "GOLD" as const,
    },
    {
      title: "API Documentation Generator",
      description:
        "Generate comprehensive API documentation with examples and best practices.",
      promptText: `Create detailed API documentation for the provided endpoint(s) using this structure:

## API Overview
**Base URL**: [API base URL]
**Authentication**: [Method: API key, OAuth, Basic Auth, etc.]
**Rate Limiting**: [Requests per minute/hour limits]
**API Version**: [Current version and versioning strategy]

## Endpoint Documentation

### [HTTP METHOD] /endpoint-path

**Description**: Clear explanation of what this endpoint does and when to use it.

**Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| param1 | string | Yes | Parameter description | "example_value" |
| param2 | integer | No | Optional parameter | 42 |

**Request Headers**:
\`\`\`
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
\`\`\`

**Request Body** (if applicable):
\`\`\`json
{
  "field1": "string",
  "field2": 123,
  "nested_object": {
    "sub_field": "value"
  }
}
\`\`\`

**Response Examples**:

**Success (200)**:
\`\`\`json
{
  "status": "success",
  "data": {
    "id": "12345",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "total_count": 1
  }
}
\`\`\`

**Error Responses**:
- **400 Bad Request**: Invalid parameters
- **401 Unauthorized**: Invalid or missing authentication
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

**Code Examples**:

\`\`\`javascript
// JavaScript/Node.js
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
\`\`\`

\`\`\`python
# Python
import requests

response = requests.post(
    'https://api.example.com/endpoint',
    headers={'Authorization': f'Bearer {token}'},
    json=data
)
\`\`\`

Include SDKs, testing instructions, and common integration patterns.`,
      categoryId: programmingCategory?.id ?? "",
      aiModelId: claudeModel?.id ?? "",
      authorId: "sample-user-3",
      likesCount: 78,
      rarity: "GOLD" as const,
    },
    {
      title: "Business Proposal Writer",
      description:
        "Craft compelling business proposals that win clients and secure funding.",
      promptText: `Write a professional business proposal using this comprehensive framework:

## Executive Summary
- **Project Overview**: 2-3 sentences describing the project/opportunity
- **Key Benefits**: Primary value propositions for the client
- **Investment Required**: Total cost and timeline
- **Expected ROI**: Quantified benefits and return on investment

## Problem Statement
- **Current Situation**: Client's existing challenges or pain points
- **Impact Analysis**: Consequences of not addressing the problem
- **Market Context**: Industry trends and competitive landscape
- **Urgency Factors**: Why action is needed now

## Proposed Solution
- **Approach**: High-level methodology and strategy
- **Deliverables**: Specific outcomes and tangible results
- **Timeline**: Phased implementation schedule
- **Success Metrics**: How results will be measured

## Implementation Plan
### Phase 1: Discovery & Planning (Week 1-2)
- Stakeholder interviews and requirements gathering
- Current state analysis and gap assessment
- Detailed project plan and resource allocation

### Phase 2: Development & Execution (Week 3-8)
- Core implementation activities
- Regular progress reviews and adjustments
- Quality assurance and testing

### Phase 3: Deployment & Optimization (Week 9-10)
- Go-live activities and user training
- Performance monitoring and fine-tuning
- Knowledge transfer and documentation

## Investment & Terms
**Total Investment**: $[Amount]
- Professional services: $[Amount]
- Technology/tools: $[Amount]
- Ongoing support: $[Amount]

**Payment Terms**: [Schedule and milestones]
**Guarantee**: [Performance guarantees or refund policy]

## Why Choose Us
- **Relevant Experience**: Specific examples of similar successful projects
- **Team Expertise**: Key team members and their qualifications
- **Client Testimonials**: Quotes from satisfied clients
- **Competitive Advantages**: What sets us apart

## Next Steps
1. Proposal review meeting (within 5 business days)
2. Contract negotiation and signing
3. Project kickoff (target start date)

**Proposal Valid Until**: [Date]
**Contact Information**: [Name, phone, email]

Make the proposal client-focused, results-oriented, and professionally formatted.`,
      categoryId: writingCategory?.id ?? "",
      aiModelId: gptModel?.id ?? "",
      authorId: "sample-user-2",
      likesCount: 41,
      rarity: "SILVER" as const,
    },
  ];

  for (const promptCard of samplePromptCards) {
    if (promptCard.categoryId && promptCard.aiModelId && promptCard.categoryId !== "" && promptCard.aiModelId !== "") {
      await prisma.promptCard.create({
        data: promptCard,
      });
      console.log(`✅ Prompt Card: ${promptCard.title}`);
    }
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
