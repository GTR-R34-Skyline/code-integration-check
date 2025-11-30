import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun, Sparkles } from "lucide-react";
import { toast } from "sonner";
import SkillGraph from "@/components/SkillGraph";
import LearningPath from "@/components/LearningPath";
import ProductivityHub from "@/components/ProductivityHub";
import FAQEngine from "@/components/FAQEngine";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10">
        <header className="border-b border-border/50 backdrop-blur-lg bg-card/50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text">Zobot-Fusion</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Intelligence Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="skills" className="space-y-6">
            <TabsList className="glass-panel p-1">
              <TabsTrigger value="skills">AI Skill Graph</TabsTrigger>
              <TabsTrigger value="learning">Learning Paths</TabsTrigger>
              <TabsTrigger value="productivity">Productivity</TabsTrigger>
              <TabsTrigger value="faq">FAQ Engine</TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="space-y-6 animate-fade-in">
              <SkillGraph userId={user.id} />
            </TabsContent>

            <TabsContent value="learning" className="space-y-6 animate-fade-in">
              <LearningPath userId={user.id} />
            </TabsContent>

            <TabsContent value="productivity" className="space-y-6 animate-fade-in">
              <ProductivityHub userId={user.id} />
            </TabsContent>

            <TabsContent value="faq" className="space-y-6 animate-fade-in">
              <FAQEngine />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}