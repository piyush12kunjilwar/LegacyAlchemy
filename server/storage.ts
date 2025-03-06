import { 
  type User, type InsertUser,
  type CodeAnalysis, type InsertCodeAnalysis,
  type Achievement, type InsertAchievement
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User>;

  createCodeAnalysis(analysis: InsertCodeAnalysis): Promise<CodeAnalysis>;
  getCodeAnalysisByUser(userId: number): Promise<CodeAnalysis[]>;

  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAchievementsByUser(userId: number): Promise<Achievement[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private codeAnalyses: Map<number, CodeAnalysis>;
  private achievements: Map<number, Achievement>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.codeAnalyses = new Map();
    this.achievements = new Map();
    this.currentId = { users: 1, codeAnalyses: 1, achievements: 1 };

    // Create a default test user
    this.createUser({
      username: "test",
      password: "test123"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, points: 0, level: 1 };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      points: user.points + points,
      level: Math.floor((user.points + points) / 1000) + 1
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async createCodeAnalysis(analysis: InsertCodeAnalysis): Promise<CodeAnalysis> {
    const id = this.currentId.codeAnalyses++;
    const codeAnalysis: CodeAnalysis = {
      ...analysis,
      id,
      createdAt: new Date()
    };
    this.codeAnalyses.set(id, codeAnalysis);
    return codeAnalysis;
  }

  async getCodeAnalysisByUser(userId: number): Promise<CodeAnalysis[]> {
    return Array.from(this.codeAnalyses.values()).filter(
      (analysis) => analysis.userId === userId
    );
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentId.achievements++;
    const newAchievement: Achievement = {
      ...achievement,
      id,
      unlockedAt: new Date()
    };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async getAchievementsByUser(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId
    );
  }
}

export const storage = new MemStorage();