import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TransformationView } from "@/components/TransformationView";
import { Code2, Trophy, ArrowRight } from "lucide-react";
import { calculateLevel, calculateNextLevelProgress } from "@/lib/achievements";
import { type CodeAnalysis } from "@shared/schema";

export default function Dashboard() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<CodeAnalysis | null>(null);
  
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ["/api/user/1/analysis"], // TODO: Replace with actual user ID
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/user/1/achievements"], // TODO: Replace with actual user ID
  });

  const userPoints = analyses?.reduce((total, analysis) => total + Math.floor(analysis.score / 10), 0) || 0;
  const level = calculateLevel(userPoints);
  const progress = calculateNextLevelProgress(userPoints);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Code Alchemist Dashboard
        </h1>
        <Button asChild>
          <Link href="/upload">
            <Code2 className="mr-2 h-4 w-4" />
            Upload Code
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Level {level}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {userPoints} points • {Math.round(progress)}% to next level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {analyses?.length || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              Total code transformations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {achievements?.length || 0}
            </div>
            <Link href="/achievements" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transformations</CardTitle>
          </CardHeader>
          <CardContent>
            {analysesLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded" />
                ))}
              </div>
            ) : analyses?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transformations yet. Start by uploading some code!
              </div>
            ) : (
              <div className="space-y-4">
                {analyses?.slice(0, 5).map((analysis: CodeAnalysis) => (
                  <div
                    key={analysis.id}
                    className="p-4 rounded-lg border cursor-pointer hover:bg-accent"
                    onClick={() => setSelectedAnalysis(analysis)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{analysis.language} → {analysis.framework}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{analysis.score}/100</p>
                        <p className="text-sm text-muted-foreground">
                          +{Math.floor(analysis.score / 10)} points
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {achievementsLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded" />
                ))}
              </div>
            ) : achievements?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No achievements yet. Keep coding to earn badges!
              </div>
            ) : (
              <div className="space-y-4">
                {achievements?.slice(0, 5).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-4 p-4 rounded-lg border">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedAnalysis && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-8">
          <div className="container mx-auto h-full overflow-auto">
            <Button
              variant="ghost"
              className="absolute top-4 right-4"
              onClick={() => setSelectedAnalysis(null)}
            >
              Close
            </Button>
            <TransformationView analysis={selectedAnalysis} />
          </div>
        </div>
      )}
    </div>
  );
}
