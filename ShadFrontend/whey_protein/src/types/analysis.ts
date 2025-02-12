export interface NutritionInfo {
  calories: number
  protein_per_serving: number
  carbs_per_serving: number
  fat_per_serving: number
  fiber_per_serving: number
}

export interface AnalysisSummary {
  score: number
  artificial: string[]
  blend_detected: string[]
  fillers: string[]
  high_quality: string[]
  neutral: string[]
  unknown: string[]
}

export interface AnalysisResults {
  analysis_summary: AnalysisSummary
  nutrition_info: NutritionInfo
  extracted_ingredients?: string[]
}

export interface ProgressItem {
  category: string
  count: number
}

