import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  points: integer("points").notNull().default(0),
  level: integer("level").notNull().default(1),
});

export const codeAnalysis = pgTable("code_analysis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  originalCode: text("original_code").notNull(),
  modernizedCode: text("modernized_code").notNull(),
  language: text("language").notNull(),
  framework: text("framework").notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  analysis: jsonb("analysis").notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCodeAnalysisSchema = createInsertSchema(codeAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CodeAnalysis = typeof codeAnalysis.$inferSelect;
export type InsertCodeAnalysis = z.infer<typeof insertCodeAnalysisSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
