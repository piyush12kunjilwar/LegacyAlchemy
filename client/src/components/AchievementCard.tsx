import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Medal } from "lucide-react";
import { type Achievement } from "@shared/schema";
import { format } from "date-fns";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Medal className="h-8 w-8 text-yellow-500" />
          <div>
            <CardTitle className="text-lg">{achievement.name}</CardTitle>
            <CardDescription>{achievement.description}</CardDescription>
            <p className="text-sm text-muted-foreground mt-2">
              Unlocked on {format(new Date(achievement.unlockedAt), "PPP")}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
