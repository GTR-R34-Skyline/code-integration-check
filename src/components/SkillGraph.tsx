import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Plus, Trash2, TrendingUp } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

interface SkillGraphProps {
  userId: string;
}

export default function SkillGraph({ userId }: SkillGraphProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", level: 5, category: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, [userId]);

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load skills");
      return;
    }
    setSkills(data || []);
  };

  const addSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name || !newSkill.category) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("skills").insert({
      user_id: userId,
      name: newSkill.name,
      level: newSkill.level,
      category: newSkill.category,
    });

    if (error) {
      toast.error("Failed to add skill");
    } else {
      toast.success("Skill added!");
      setNewSkill({ name: "", level: 5, category: "" });
      fetchSkills();
    }
    setLoading(false);
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete skill");
    } else {
      toast.success("Skill deleted");
      fetchSkills();
    }
  };

  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            AI Skill Graph
          </CardTitle>
          <CardDescription>Track and visualize your skill progression</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={addSkill} className="space-y-4 p-4 glass-panel rounded-lg">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  placeholder="e.g. React Development"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="glass-panel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. Frontend"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="glass-panel"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Skill Level: {newSkill.level}/10</Label>
              <Slider
                value={[newSkill.level]}
                onValueChange={(value) => setNewSkill({ ...newSkill, level: value[0] })}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full neon-border" disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </form>

          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">{category}</h3>
                <div className="grid gap-3">
                  {skills
                    .filter((s) => s.category === category)
                    .map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-4 glass-panel rounded-lg hover:bg-card/70 transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <Badge variant="secondary">{skill.level}/10</Badge>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                              style={{ width: `${(skill.level / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSkill(skill.id)}
                          className="ml-4 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
            {skills.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No skills added yet. Start building your skill graph!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}