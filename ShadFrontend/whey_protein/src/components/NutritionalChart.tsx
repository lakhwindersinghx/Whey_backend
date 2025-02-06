// "use client";

// import { TrendingUp } from "lucide-react";
// import { LabelList, Pie, PieChart } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartStyle} from "@/components/ui/chart";

// // Props interface to receive data dynamically
// interface NutritionalPieChartProps {
//   nutritionalInfo: {
//     calories?: number;
//     protein_per_serving?: number;
//     fat_per_serving?: number;
//     carbs_per_serving?: number;
//     fiber_per_serving?: number;
//   };
// }

// export function NutritionalPieChart({ nutritionalInfo }: NutritionalPieChartProps) {
//   // Prepare chart data dynamically
//   const chartData = [
//     { name: "Calories", value: nutritionalInfo.calories || 0, fill: "#FF6384" },
//     { name: "Protein", value: nutritionalInfo.protein_per_serving || 0, fill: "#36A2EB" },
//     { name: "Fat", value: nutritionalInfo.fat_per_serving || 0, fill: "#FFCE56" },
//     { name: "Carbs", value: nutritionalInfo.carbs_per_serving || 0, fill: "#4BC0C0" },
//     { name: "Fiber", value: nutritionalInfo.fiber_per_serving || 0, fill: "#91FF91" },
//   ];

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Pie Chart - Nutritional Breakdown</CardTitle>
//         <CardDescription>Per Serving</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background">
//           <PieChart>
//             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
//             <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
//               <LabelList
//                 dataKey="name"
//                 className="fill-background"
//                 stroke="none"
//                 fontSize={12}
//                 formatter={(value: string) => `${value}`}
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 font-medium leading-none">
//           Nutritional data per serving analyzed <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Based on nutritional breakdown extracted from the uploaded label
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
