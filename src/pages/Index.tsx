import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Target, TrendingUp, HelpCircle } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[150px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px] animate-pulse-glow" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 glass-panel px-6 py-3 rounded-full animate-fade-in">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Powered by AI & Zoho SalesIQ</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Welcome to
              <span className="block mt-2 neon-text">Zobot-Fusion</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Your AI-powered skill, productivity, and support engine. Designed to work seamlessly with Zoho SalesIQ Zobot
              for intelligent automation and insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button size="lg" onClick={() => navigate("/auth")} className="neon-border text-lg px-8">
                Get Started
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="glass-panel text-lg px-8">
                Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-32 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Skill Graph</h3>
              <p className="text-muted-foreground">
                Track and visualize your skills with animated graphs and intelligent recommendations.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learning Paths</h3>
              <p className="text-muted-foreground">
                AI-generated personalized learning roadmaps to achieve your goals faster.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Productivity Hub</h3>
              <p className="text-muted-foreground">
                Smart task management with AI insights and daily productivity reports.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">FAQ Engine</h3>
              <p className="text-muted-foreground">
                AI-powered support system with instant answers to your questions.
              </p>
            </div>
          </div>

          {/* Zobot Integration Info */}
          <div className="mt-32 glass-panel p-8 rounded-2xl border-2 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <h2 className="text-3xl font-bold mb-4 text-center">Zobot Bridge Integration</h2>
            <p className="text-muted-foreground text-center mb-6">
              Embed this script to enable Zobot integration:
            </p>
            <div className="glass-panel p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <code className="text-primary">
                &lt;script src="{window.location.origin}/bridge.js"&gt;&lt;/script&gt;
              </code>
            </div>
            <p className="text-muted-foreground text-sm text-center mt-4">
              Access functions like zobot.getUserSkills(), zobot.getLearningPath(), and more!
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/50 backdrop-blur-lg mt-20">
          <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
            <p>Built with Lovable Cloud • Powered by AI</p>
          </div>
        </footer>
      </div>
    </div>
  );
}