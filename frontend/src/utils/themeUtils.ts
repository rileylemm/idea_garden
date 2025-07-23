export interface PlantTheme {
  icon: string;
  bgColor: string;
  color: string;
}

export const getPlantTheme = (category: string): PlantTheme => {
  const themes: Record<string, PlantTheme> = {
    technology: {
      icon: "💻",
      bgColor: "bg-blue-50",
      color: "text-blue-600",
    },
    business: {
      icon: "💼",
      bgColor: "bg-green-50",
      color: "text-green-600",
    },
    creative: {
      icon: "🎨",
      bgColor: "bg-purple-50",
      color: "text-purple-600",
    },
    health: {
      icon: "🏥",
      bgColor: "bg-red-50",
      color: "text-red-600",
    },
    education: {
      icon: "📚",
      bgColor: "bg-yellow-50",
      color: "text-yellow-600",
    },
    lifestyle: {
      icon: "🌿",
      bgColor: "bg-emerald-50",
      color: "text-emerald-600",
    },
    science: {
      icon: "🔬",
      bgColor: "bg-indigo-50",
      color: "text-indigo-600",
    },
    entertainment: {
      icon: "🎭",
      bgColor: "bg-pink-50",
      color: "text-pink-600",
    },
  };

  return themes[category.toLowerCase()] || themes.creative;
};

export const getStageIcon = (stage: string): string => {
  const stageIcons: Record<string, string> = {
    seedling: "🌱",
    growing: "🌿",
    mature: "🌳",
  };

  return stageIcons[stage.toLowerCase()] || stageIcons.seedling;
}; 