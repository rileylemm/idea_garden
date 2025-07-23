import type { Idea, IdeaCategory, GrowthStage } from "../types/idea"

export const sampleIdeas: Idea[] = [
  {
    id: "1",
    title: "AI-Powered Garden Assistant",
    description: "An app that uses computer vision to identify plant diseases and suggest treatments",
    category: "technology",
    stage: "growing",
    tags: ["AI", "mobile app", "agriculture"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    content:
      "This idea involves creating a mobile application that leverages artificial intelligence and computer vision to help gardeners identify plant diseases, pests, and nutrient deficiencies. Users would simply take a photo of their plant, and the AI would analyze the image to provide diagnosis and treatment recommendations.",
  },
  {
    id: "2",
    title: "Sustainable Packaging Revolution",
    description: "Biodegradable packaging made from agricultural waste",
    category: "business",
    stage: "seedling",
    tags: ["sustainability", "packaging", "environment"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    content:
      "Develop a new type of packaging material that is completely biodegradable and made from agricultural waste products like rice husks, wheat straw, and corn stalks. This would reduce plastic waste while creating value from agricultural byproducts.",
  },
  {
    id: "3",
    title: "Interactive Story Garden",
    description: "A digital platform where stories grow and branch based on reader choices",
    category: "creative",
    stage: "mature",
    tags: ["storytelling", "interactive", "digital media"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22"),
    content:
      "Create an interactive storytelling platform where narratives branch and evolve based on reader decisions. Stories would be visualized as growing trees, with each branch representing different plot paths. Readers can contribute to story development, creating a collaborative narrative ecosystem.",
  },
  {
    id: "4",
    title: "Mindfulness Micro-Moments",
    description: "Brief 30-second mindfulness exercises for busy professionals",
    category: "personal",
    stage: "growing",
    tags: ["mindfulness", "wellness", "productivity"],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
    content:
      "Design a series of ultra-short mindfulness exercises that can be completed in 30 seconds or less. These would be perfect for busy professionals who want to incorporate mindfulness into their day but have limited time. Each exercise would focus on breathing, awareness, or gratitude.",
  },
  {
    id: "5",
    title: "Urban Vertical Farming Network",
    description: "Community-owned vertical farms in urban apartment buildings",
    category: "innovation",
    stage: "seedling",
    tags: ["urban farming", "community", "sustainability"],
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16"),
    content:
      "Establish a network of small-scale vertical farms integrated into urban apartment buildings. Residents would collectively own and maintain these farms, sharing the harvest and costs. This would provide fresh produce, build community connections, and reduce food transportation emissions.",
  },
  {
    id: "6",
    title: "Quantum Computing Education Platform",
    description: "Interactive learning platform for quantum computing concepts",
    category: "research",
    stage: "growing",
    tags: ["quantum computing", "education", "technology"],
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-21"),
    content:
      "Develop an interactive educational platform that makes quantum computing concepts accessible to students and professionals. The platform would use visual simulations, hands-on exercises, and gamification to teach complex quantum mechanics principles and their applications in computing.",
  },
]

export const getPlantTheme = (category: IdeaCategory) => {
  const themes = {
    technology: {
      icon: "🌱",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    business: {
      icon: "🌿",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    creative: {
      icon: "🌸",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
    personal: {
      icon: "🌻",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    research: {
      icon: "🌺",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    innovation: {
      icon: "🌳",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
  }
  return themes[category]
}

export const getStageIcon = (stage: GrowthStage) => {
  const stages = {
    seedling: "🌱",
    growing: "🌿",
    mature: "🌳",
  }
  return stages[stage]
}
