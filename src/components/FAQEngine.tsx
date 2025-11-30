import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export default function FAQEngine() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    filterFAQs();
  }, [searchQuery, selectedCategory, faqs]);

  const fetchFAQs = async () => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load FAQs:", error);
      return;
    }
    setFaqs(data || []);
  };

  const filterFAQs = () => {
    let filtered = faqs;

    if (selectedCategory) {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredFaqs(filtered);
  };

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            FAQ & Support Engine
          </CardTitle>
          <CardDescription>AI-powered knowledge base and support</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-panel"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`item-${index}`}
                className="glass-panel rounded-lg border-0 px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="text-left">
                    <h4 className="font-medium">{faq.question}</h4>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 pb-2">
                    <p className="text-muted-foreground">{faq.answer}</p>
                    {faq.tags.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {faq.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No FAQs found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}