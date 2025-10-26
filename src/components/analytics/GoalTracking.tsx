import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  CheckCircle,
  Clock,
  BarChart3,
  Trophy
} from 'lucide-react';
import { portfolioTrackingService } from '@/services/portfolioTrackingService';

interface GoalTrackingProps {
  portfolioId: string;
}

interface Goal {
  id: string;
  name: string;
  type: string;
  target: number;
  current: number;
  deadline: Date;
  status: string;
}

interface GoalProgress {
  goalId: string;
  date: string;
  value: number;
  change: number;
  changePercentage: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
  type: string;
}

export function GoalTracking({ portfolioId }: GoalTrackingProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progress, setProgress] = useState<GoalProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoalTracking();
  }, [portfolioId]);

  const loadGoalTracking = async () => {
    try {
      setLoading(true);
      const data = await portfolioTrackingService.getGoalTracking(portfolioId);
      setGoals(data.goals);
      setProgress(data.progress);
      setAchievements(data.achievements);
    } catch (error) {
      console.error('Failed to load goal tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'portfolio_views':
        return <BarChart3 className="h-5 w-5 text-blue-500" />;
      case 'cv_downloads':
        return <Target className="h-5 w-5 text-green-500" />;
      case 'project_interactions':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'contact_submissions':
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <Target className="h-5 w-5 text-gray-500" />;
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      case 'paused':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'streak':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'special':
        return <Award className="h-5 w-5 text-purple-500" />;
      default:
        return <Award className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const completionRate = (goal.current / goal.target) * 100;
          const daysRemaining = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={goal.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{goal.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getGoalIcon(goal.type)}
                  <Badge 
                    variant="secondary" 
                    className={`${getGoalStatusColor(goal.status)} text-white`}
                  >
                    {goal.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{goal.current.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">
                      of {goal.target.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{completionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{daysRemaining} days left</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {completionRate >= 100 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Goal achieved!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progress.map((prog) => {
              const goal = goals.find(g => g.id === prog.goalId);
              if (!goal) return null;

              return (
                <div key={prog.goalId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getGoalIcon(goal.type)}
                    <div>
                      <p className="text-sm font-medium">{goal.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {prog.date} - {prog.value.toLocaleString()} ({prog.change > 0 ? '+' : ''}{prog.changePercentage.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={prog.change > 0 ? 'default' : 'secondary'}>
                      {prog.change > 0 ? '+' : ''}{prog.change}
                    </Badge>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${(prog.value / goal.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
            <Badge variant="secondary" className="ml-auto">
              {achievements.length} unlocked
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex-shrink-0">
                  {getAchievementIcon(achievement.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-yellow-800">{achievement.name}</p>
                  <p className="text-xs text-yellow-600">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                    {achievement.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Add New Goal
            </Button>
            <Button variant="outline" size="sm">
              Export Progress
            </Button>
            <Button variant="outline" size="sm">
              Share Achievements
            </Button>
            <Button variant="outline" size="sm" onClick={loadGoalTracking}>
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
