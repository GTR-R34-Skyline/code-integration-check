import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2, Circle, Plus, Zap, Calendar } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
}

interface ProductivityHubProps {
  userId: string;
}

export default function ProductivityHub({ userId }: ProductivityHubProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load tasks");
      return;
    }
    setTasks(data || []);
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) {
      toast.error("Please enter a task title");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("tasks").insert({
      user_id: userId,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      due_date: newTask.due_date || null,
      status: "pending",
    });

    if (error) {
      toast.error("Failed to add task");
    } else {
      toast.success("Task added!");
      setNewTask({ title: "", description: "", priority: "medium", due_date: "" });
      fetchTasks();
    }
    setLoading(false);
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    const { error } = await supabase
      .from("tasks")
      .update({ 
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null
      })
      .eq("id", taskId);

    if (error) {
      toast.error("Failed to update task");
    } else {
      fetchTasks();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const pendingCount = tasks.filter(t => t.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Productivity & Task Intelligence
          </CardTitle>
          <CardDescription>Smart task management with AI insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={addTask} className="space-y-4 p-4 glass-panel rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Task Title</Label>
              <Input
                id="taskTitle"
                placeholder="What needs to be done?"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="glass-panel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskDesc">Description (Optional)</Label>
              <Textarea
                id="taskDesc"
                placeholder="Add more details..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="glass-panel"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger className="glass-panel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="glass-panel"
                />
              </div>
            </div>
            <Button type="submit" className="w-full neon-border" disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </form>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-4 glass-panel rounded-lg hover:bg-card/70 transition-all"
              >
                <button
                  onClick={() => toggleTaskStatus(task.id, task.status)}
                  className={`mt-1 ${task.status === "completed" ? "text-primary" : "text-muted-foreground"}`}
                >
                  {task.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </h4>
                    <Badge variant={getPriorityColor(task.priority) as any}>
                      {task.priority}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                  {task.due_date && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No tasks yet. Add your first task above!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}