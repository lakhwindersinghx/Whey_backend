"use client"

import { Legend, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface NutritionInfo {
  calories: number
  protein_per_serving: number
  carbs_per_serving: number
  fat_per_serving: number
}

interface NutritionChartProps {
  nutritionInfo: NutritionInfo
}

const chartConfig = {
  macros: { label: "Macronutrients" },
  protein: { label: "Protein", color: "hsl(217, 91%, 60%)" },
  carbs: { label: "Carbs", color: "hsl(217, 91%, 70%)" },
  fat: { label: "Fat", color: "hsl(217, 91%, 80%)" },
} satisfies ChartConfig

export function NutritionChartComponent({ nutritionInfo }: NutritionChartProps) {
  const chartData = [
    {
      name: "Protein",
      value: nutritionInfo.protein_per_serving,
      fill: "hsl(217, 91%, 60%)",
    },
    {
      name: "Carbs",
      value: nutritionInfo.carbs_per_serving,
      fill: "hsl(217, 91%, 70%)",
    },
    {
      name: "Fat",
      value: nutritionInfo.fat_per_serving,
      fill: "hsl(217, 91%, 80%)",
    },
  ]

  return (
    <Card className="flex flex-col dark:bg-black">
      <CardHeader className="items-center pb-0">
      <CardTitle className="dark:text-white">Macronutrient Breakdown</CardTitle>
      <CardDescription className="dark:text-gray-400">Based on uploaded nutrition label</CardDescription>
      <div className="flex items-center justify-center mt-2">
        <span className="text-2xl text-gray-600 dark:text-blue-300">Calories:</span>
        <span className="ml-1 text-2xl font-medium text-gray-600 dark:text-gray-400"> {nutritionInfo.calories || 0} kcal</span>
      </div>
    </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              label={(entry) => entry.name}
              labelLine={false}
              cx="50%"
              cy="50%"
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              wrapperStyle={{
                paddingLeft: "20px",
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
