"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MyForm from "@/components/my-form";
import { ScoreRadialChart } from "@/components/score";
import { Progress } from "@/components/ui/progress";
import { NutritionChartComponent } from "@/components/nutrition_component";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Define the expected props
interface ProteinAnalysisClientProps {
  user: {
    email: string;
    name?: string | null | undefined;
  };
}

export default function ProteinAnalysisClient({ user }: ProteinAnalysisClientProps) {
  // Default mock data
  const defaultAnalysisResults = {
    analysis_summary: {
      score: 0,
      artificial: [],
      blend_detected: [],
      fillers: [],
      high_quality: [],
      neutral: [],
      unknown: [],
    },
    nutrition_info: {
      calories: 1,
      protein_per_serving: 1,
      carbs_per_serving: 1,
      fat_per_serving: 1,
      fiber_per_serving: 1,
    },
  };

  const [analysisResults, setAnalysisResults] = useState<any>(defaultAnalysisResults);

  // Fetch actual data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/protein-analysis");
        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging Log
        setAnalysisResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Updated analysisResults:", analysisResults);
  }, [analysisResults]);

  const nutritionalInfo = analysisResults.nutrition_info;

  const progressData = Object.entries(analysisResults.analysis_summary)
    .filter(([category]) => category !== "score" && category !== "quality_label")
    .map(([category, items]) => ({
      category,
      count: Array.isArray(items) ? items.length : 0,
    }));

  const totalIngredients = progressData.reduce((total, item) => total + item.count, 0) || 1;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {/* Charts and Progress Bars Section */}
          <div className="col-span-2 bg-muted/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Charts Overview</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <ScoreRadialChart score={analysisResults.analysis_summary.score ?? 0} />
                <p className="mt-2 text-sm text-muted-foreground text-center">Protein Analysis Score</p>
              </div>

              <div className="w-full">
                <NutritionChartComponent nutritionInfo={nutritionalInfo} />
                <p className="mt-2 text-sm text-muted-foreground text-center">Nutritional Breakdown</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-bold mb-4">Ingredient Summary</h2>
              <div className="grid gap-4">
                {progressData.map(({ category, count }, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{category.replace("_", " ")}</span>
                      <span>
                        {count} / {totalIngredients}
                      </span>
                    </div>
                    <Progress value={((count || 0) / totalIngredients) * 100} />
                  </div>
                ))}
              </div>
            </div>

            {analysisResults.extracted_ingredients?.length > 0 && (
              <div className="mt-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="extracted-ingredients">
                    <AccordionTrigger>Extracted Ingredients</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6">
                        {analysisResults.extracted_ingredients.map((ingredient: string, index: number) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>

          {/* Right Section: Form */}
          <div className="col-span-1 bg-muted/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Protein Analysis Form</h2>
            <MyForm setAnalysisResults={setAnalysisResults} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
