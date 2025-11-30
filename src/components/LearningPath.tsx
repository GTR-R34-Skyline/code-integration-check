import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Target, Play, CheckCircle2, Clock } from "lucide-react";

interface LearningPathData {
  id: string;
  goal: string;
  steps: { title: string; completed: boolean; duration: string }[];
  progress: number;
  status: string;
}

interface LearningPathProps {
  userId: string;
}

export default function LearningPath({ userId }: LearningPathProps) {
  const [paths, setPaths] = useState<LearningPathData[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPaths();
  }, [userId]);

  const fetchPaths = async () => {
    const { data, error } = await supabase
      .from("learning_paths")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load learning paths");
      return;
    }
    // Cast the Json type to our expected type
    const typedData = (data || []).map(path => ({
      ...path,
      steps: path.steps as unknown as { title: string; completed: boolean; duration: string }[]
    }));
    setPaths(typedData);
  };

  const generatePath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal) {
      toast.error("Please enter a goal");
      return;
    }

    setLoading(true);
    
    // Mock AI-generated steps
    const mockSteps = [
      { title: `Learn fundamentals of ${newGoal}`, completed: false, duration: "2 weeks" },
      { title: `Practice intermediate concepts`, completed: false, duration: "3 weeks" },
      { title: `Build real-world projects`, completed: false, duration: "4 weeks" },
      { title: `Master advanced techniques`, completed: false, duration: "3 weeks" },
    ];

    const { error } = await supabase.from("learning_paths").insert({
      user_id: userId,
      goal: newGoal,
      steps: mockSteps,
      progress: 0,
      status: "active",
    });

    if (error) {
      toast.error("Failed to create learning path");
    } else {
      toast.success("Learning path generated!");
      setNewGoal("");
      fetchPaths();
    }
    setLoading(false);
  };

  const toggleStep = async (pathId: string, stepIndex: number) => {
    const path = paths.find((p) => p.id === pathId);
    if (!path) return;

    const updatedSteps = [...path.steps];
    updatedSteps[stepIndex].completed = !updatedSteps[stepIndex].completed;
    
    const completedCount = updatedSteps.filter((s) => s.completed).length;
    const newProgress = Math.round((completedCount / updatedSteps.length) * 100);

    const { error } = await supabase
      .from("learning_paths")
      .update({ 
        steps: updatedSteps, 
        progress: newProgress,
        status: newProgress === 100 ? "completed" : "active"
      })
      .eq("id", pathId);

    if (error) {
      toast.error("Failed to update progress");
    } else {
      fetchPaths();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Learning Path Generator
          </CardTitle>
          <CardDescription>AI-powered personalized learning roadmaps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={generatePath} className="space-y-4 p-4 glass-panel rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="goal">What do you want to learn?</Label>
              <Input
                id="goal"
                placeholder="e.g. Full-stack development with React and Node.js"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="glass-panel"
              />
            </div>
            <Button type="submit" className="w-full neon-border" disabled={loading}>
              <Play className="w-4 h-4 mr-2" />
              Generate Learning Path
            </Button>
          </form>

          <div className="space-y-4">
            {paths.map((path) => (
              <Card key={path.id} className="glass-panel">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{path.goal}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Badge variant={path.status === "completed" ? "default" : "secondary"}>
                          {path.status}
                        </Badge>
                        <span>{path.progress}% Complete</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Progress value={path.progress} className="mt-4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {path.steps.map((step, index) => (
                      <button
                        key={index}
                        onClick={() => toggleStep(path.id, index)}
                        className="w-full flex items-start gap-3 p-3 glass-panel rounded-lg hover:bg-card/70 transition-all text-left"
                      >
                        <div className={`mt-1 ${step.completed ? "text-primary" : "text-muted-foreground"}`}>
                          {step.completed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-current" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                            {step.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {step.duration}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {paths.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No learning paths yet. Generate your first one above!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}