export interface FoodItem {
  id: string;
  name: string;
  cost: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  maxServings?: number;
}

export interface NutrientConstraints {
  minCalories: number;
  maxCalories: number;
  minProtein: number;
  maxProtein: number;
  minFat: number;
  maxFat: number;
  minCarbs: number;
  maxCarbs: number;
}

export interface OptimizationResult {
  mealPlan: {
    food: FoodItem;
    servings: number;
    cost: number;
  }[];
  totalCost: number;
  nutrients: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  constraints: NutrientConstraints;
}
