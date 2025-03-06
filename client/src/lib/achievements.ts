import { type Achievement } from "@shared/schema";

export const ACHIEVEMENT_TYPES = {
  CODE_QUALITY: "code_quality",
  FRAMEWORK_MASTERY: "framework_mastery",
  PRODUCTIVITY: "productivity"
} as const;

export interface AchievementDefinition {
  type: keyof typeof ACHIEVEMENT_TYPES;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    type: "CODE_QUALITY",
    name: "Code Master",
    description: "Achieve a perfect modernization score",
    icon: "🏆"
  },
  {
    type: "FRAMEWORK_MASTERY",
    name: "Framework Pioneer",
    description: "Successfully modernize code to 3 different frameworks",
    icon: "🚀"
  },
  {
    type: "PRODUCTIVITY",
    name: "Speed Demon",
    description: "Modernize 10 code samples in a single day",
    icon: "⚡"
  }
];

export function calculateLevel(points: number): number {
  return Math.floor(points / 1000) + 1;
}

export function calculateNextLevelProgress(points: number): number {
  const currentLevel = calculateLevel(points);
  const currentLevelPoints = (currentLevel - 1) * 1000;
  const nextLevelPoints = currentLevel * 1000;
  return ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
}
