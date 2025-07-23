export interface Idea {
  id: string
  title: string
  description: string
  category: IdeaCategory
  stage: GrowthStage
  tags: string[]
  createdAt: Date
  updatedAt: Date
  content?: string
}

export type IdeaCategory = "technology" | "business" | "creative" | "personal" | "research" | "innovation"

export type GrowthStage = "seedling" | "growing" | "mature"

export interface PlantTheme {
  icon: string
  color: string
  bgColor: string
  borderColor: string
}
