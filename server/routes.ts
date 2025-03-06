import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeCode } from "./lib/codeAnalysis";
import { insertCodeAnalysisSchema } from "@shared/schema";
import { z } from "zod";

const codeUploadSchema = z.object({
  code: z.string(),
  language: z.string(),
  framework: z.string(),
  userId: z.number()
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
    try {
      const { code, language, framework, userId } = codeUploadSchema.parse(req.body);

      const analysis = await analyzeCode(code, language, framework);

      const codeAnalysis = await storage.createCodeAnalysis({
        userId,
        originalCode: code,
        modernizedCode: analysis.modernizedCode,
        language,
        framework,
        score: analysis.score,
        analysis: analysis
      });

      // Award points based on code complexity and improvement score
      const pointsEarned = Math.floor(analysis.score / 10);
      const updatedUser = await storage.updateUserPoints(userId, pointsEarned);

      // Check for achievements
      if (analysis.score >= 90) {
        await storage.createAchievement({
          userId,
          type: "code_quality",
          name: "Code Master",
          description: "Achieved excellent code modernization score"
        });
      }

      res.json({
        analysis: codeAnalysis,
        pointsEarned,
        user: updatedUser
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: errorMessage });
    }
  });

  app.get("/api/user/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getAchievementsByUser(userId);
      res.json(achievements);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: errorMessage });
    }
  });

  app.get("/api/user/:userId/analysis", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const analyses = await storage.getCodeAnalysisByUser(userId);
      res.json(analyses);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: errorMessage });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}