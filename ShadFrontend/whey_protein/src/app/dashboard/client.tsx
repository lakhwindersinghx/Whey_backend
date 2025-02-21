"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import MyForm from "@/components/my-form"
import { ScoreRadialChart } from "@/components/score"
import { Progress } from "@/components/ui/progress"
import { NutritionChartComponent } from "@/components/nutrition_component"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ClientPage() {
  // Default mock data for initial view
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
  }

  const [analysisResults, setAnalysisResults] = useState<any>(defaultAnalysisResults)

  // Extract nutritional info from analysisResults
  const nutritionalInfo = analysisResults.nutrition_info

  // Ensure analysisResults.analysis is properly initialized
  const importanceCounts: Record<string, number> = (analysisResults?.analysis ?? []).reduce(
    (acc: Record<string, number>, item: { importance?: string }) => {
      if (!item.importance) return acc; // Skip items without an importance field
      const importance = item.importance.toUpperCase().trim(); // Normalize casing
      acc[importance] = (acc[importance] || 0) + 1;
      return acc;
    },
    {}
  );
  console.log("Analysis Data:", analysisResults.analysis);

  console.log("Processed Importance Counts:", importanceCounts); 


  
const progressData = [
    { category: "High Quality", count: importanceCounts["HIGH QUALITY"] || 0 },
    { category: "Neutral", count: importanceCounts["NEUTRAL"] || 0 },
    { category: "Fillers", count: importanceCounts["FILLER"] || 0 },
    { category: "Artificial", count: importanceCounts["ARTIFICIAL"] || 0 },
    { category: "Unknown", count: importanceCounts["UNKNOWN"] || 0 },
  ];
  
  // Compute total ingredients count
  const totalIngredients: number = Object.values(importanceCounts).reduce((sum, count) => sum + count, 0) || 1;
  
  console.log("Total Ingredients Count:", totalIngredients);
  

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {/* Charts and Progress Bars Section */}
          <div className="col-span-2 bg-muted/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Charts Overview</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Radial Chart */}
              <div className="w-full">
                <ScoreRadialChart score={analysisResults.analysis_summary.score} />
                <p className="mt-2 text-sm text-muted-foreground text-center">Protein Analysis Score</p>
              </div>

              {/* Nutritional Breakdown Pie Chart */}
              <div className="w-full">
                <NutritionChartComponent nutritionInfo={nutritionalInfo} />
                <p className="mt-2 text-sm text-muted-foreground text-center">Nutritional Breakdown</p>
              </div>
            </div>

            {/* Progress Bars Section */}
            {/* Progress Bars Section */}
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-4">Ingredient Summary</h2>
              <div className="grid gap-4">
                {progressData.map(({ category, count }, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{category}</span>
                      <span>
                        {count} / {totalIngredients}
                      </span>
                    </div>
                    <Progress value={(count / totalIngredients) * 100} />
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
  )
}

