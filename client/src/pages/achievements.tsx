import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AchievementCard } from "@/components/AchievementCard";
import { calculateLevel, calculateNextLevelProgress, ACHIEVEMENTS } from "@/lib/achievements";
import { Trophy } from "lucide-react";

export default function Achievements() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ["/api/user/1/achievements"], // TODO: Replace with actual user ID
  });

  const { data: analyses } = useQuery({
    queryKey: ["/api/user/1/analysis"], // TODO: Replace with actual user ID
  });

  const userPoints = analyses?.reduce((total, analysis) => total + Math.floor(analysis.score / 10), 0) || 0;
  const level = calculateLevel(userPoints);
  const progress = calculateNextLevelProgress(userPoints);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Trophy className="h-10 w-10 text-yellow-500" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
          Your Achievements
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">Level {level}</div>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {userPoints} points • {Math.round(progress)}% to next level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {achievements?.length || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              Out of {ACHIEVEMENTS.length} total achievements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{userPoints}</div>
            <p className="text-sm text-muted-foreground">Points earned</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32" />
            </Card>
          ))
        ) : achievements?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Achievements Yet</h2>
            <p className="text-muted-foreground">
              Start transforming code to earn achievements and level up!
            </p>
          </div>
        ) : (
          achievements?.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))
        )}
      </div>
    </div>
  );
}
