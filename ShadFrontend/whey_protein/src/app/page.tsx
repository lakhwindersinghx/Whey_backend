"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MyForm from "@/components/my-form";
import { ScoreRadialChart } from "@/components/score"; // Radial Chart
import { Progress } from "@/components/ui/progress"; // Progress Bars
import { CollapsibleIngredients } from "@/components/CollapsibleIngredients";

export default function Page() {
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);

  // Prepare progress bar data
  const progressData =
    analysisResults && analysisResults.analysis_summary
      ? Object.entries(analysisResults.analysis_summary)
          .filter(([category]) => category !== "score" && category !== "quality_label")
          .map(([category, items]) => ({
            category,
            count: Array.isArray(items) ? items.length : 0,
          }))
      : [];

  const totalIngredients =
    progressData.reduce((total, item) => total + item.count, 0) || 1; // Avoid division by zero

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
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid grid-cols-3 gap-4">
            {/* Left Column: Ingredient Summary */}
            <div className="col-span-2 bg-muted/50 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Ingredient Summary</h2>
              {analysisResults ? (
                <div className="flex items-start gap-6">
                 <div className="flex flex-col items-center w-1/2">
                 {/* Radial Chart */}
                 {analysisResults.analysis_summary?.score !== undefined && (
                   <div className="mb-6">
                     <ScoreRadialChart score={analysisResults.analysis_summary.score} />
                   </div>
                 )}
        

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


                  {/* Progress Bars */}
                  <div className="flex flex-col gap-4 w-1/2">
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
              ) : (
                <p>No results available yet.</p>
              )}
            </div>

            {/* Right Column: Protein Analysis Form */}
            <div className="bg-muted/50 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Protein Analysis Form</h2>
              <MyForm setAnalysisResults={setAnalysisResults} />
            </div>
          </div>

          {/* Collapsible Ingredients
          {analysisResults && analysisResults.extracted_ingredients?.length > 0 && (
            <div className="bg-muted/50 rounded-xl p-6 mt-4">
              <CollapsibleIngredients ingredients={analysisResults.extracted_ingredients} />
            </div>
          )} */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
