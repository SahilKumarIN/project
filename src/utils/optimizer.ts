import { FoodItem, NutrientConstraints, OptimizationResult } from '../types';

export function optimizeMealPlan(
  foods: FoodItem[],
  constraints: NutrientConstraints
): OptimizationResult {
  const servings = new Array(foods.length).fill(0);

  const sortedByProteinCost = foods
    .map((food, idx) => ({
      idx,
      score: food.protein > 0 ? food.protein / food.cost : 0,
    }))
    .sort((a, b) => b.score - a.score);

  const sortedByCalorieCost = foods
    .map((food, idx) => ({
      idx,
      score: food.calories > 0 ? food.calories / food.cost : 0,
    }))
    .sort((a, b) => b.score - a.score);

  let targetCalories = (constraints.minCalories + constraints.maxCalories) / 2;
  let targetProtein = (constraints.minProtein + constraints.maxProtein) / 2;
  let targetFat = (constraints.minFat + constraints.maxFat) / 2;
  let targetCarbs = (constraints.minCarbs + constraints.maxCarbs) / 2;

  for (const item of sortedByCalorieCost) {
    const idx = item.idx;
    const food = foods[idx];
    const maxAllowed = food.maxServings || 10;

    if (targetCalories > 0 && food.calories > 0) {
      const needed = targetCalories / food.calories;
      const serving = Math.min(needed, maxAllowed);
      servings[idx] = serving;
      targetCalories = Math.max(0, targetCalories - food.calories * serving);
    }
  }

  let nutrients = calculateNutrients(foods, servings);

  for (const item of sortedByProteinCost) {
    const idx = item.idx;
    const food = foods[idx];
    const maxAllowed = food.maxServings || 10;
    const proteinGap = Math.max(0, constraints.minProtein - nutrients.protein);

    if (proteinGap > 0 && food.protein > 0 && servings[idx] < maxAllowed) {
      const needed = proteinGap / food.protein;
      const canAdd = Math.min(needed, maxAllowed - servings[idx]);
      servings[idx] += canAdd;
      nutrients = calculateNutrients(foods, servings);
    }
  }

  nutrients = calculateNutrients(foods, servings);
  for (let i = 0; i < foods.length; i++) {
    const food = foods[i];
    const maxAllowed = food.maxServings || 10;

    const calorieGap = Math.max(0, constraints.minCalories - nutrients.calories);
    if (calorieGap > 0 && food.calories > 0 && servings[i] < maxAllowed) {
      const needed = calorieGap / food.calories;
      const canAdd = Math.min(needed, maxAllowed - servings[i]);
      servings[i] += canAdd;
      nutrients = calculateNutrients(foods, servings);
    }
  }

  const carbsGap = Math.max(0, constraints.minCarbs - nutrients.carbs);
  if (carbsGap > 0) {
    for (let i = 0; i < foods.length; i++) {
      const food = foods[i];
      const maxAllowed = food.maxServings || 10;
      if (food.carbs > 0 && servings[i] < maxAllowed) {
        const needed = carbsGap / food.carbs;
        const canAdd = Math.min(needed, maxAllowed - servings[i]);
        servings[i] += canAdd;
        nutrients = calculateNutrients(foods, servings);
        if (nutrients.carbs >= constraints.minCarbs) break;
      }
    }
  }

  const finalNutrients = calculateNutrients(foods, servings);
  const mealPlan = foods
    .map((food, idx) => ({
      food,
      servings: Math.round(servings[idx] * 100) / 100,
      cost: Math.round(food.cost * servings[idx] * 100) / 100,
    }))
    .filter(item => item.servings > 0.01)
    .sort((a, b) => b.cost - a.cost);

  const totalCost = mealPlan.reduce((sum, item) => sum + item.cost, 0);

  return {
    mealPlan,
    totalCost: Math.round(totalCost * 100) / 100,
    nutrients: {
      calories: Math.round(finalNutrients.calories * 10) / 10,
      protein: Math.round(finalNutrients.protein * 10) / 10,
      fat: Math.round(finalNutrients.fat * 10) / 10,
      carbs: Math.round(finalNutrients.carbs * 10) / 10,
    },
    constraints,
  };
}

function calculateNutrients(foods: FoodItem[], servings: number[]) {
  return foods.reduce(
    (acc, food, idx) => ({
      calories: acc.calories + food.calories * servings[idx],
      protein: acc.protein + food.protein * servings[idx],
      fat: acc.fat + food.fat * servings[idx],
      carbs: acc.carbs + food.carbs * servings[idx],
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

function checkConstraints(
  nutrients: { calories: number; protein: number; fat: number; carbs: number },
  constraints: NutrientConstraints
): boolean {
  return (
    nutrients.calories >= constraints.minCalories * 0.95 &&
    nutrients.calories <= constraints.maxCalories * 1.05 &&
    nutrients.protein >= constraints.minProtein * 0.95 &&
    nutrients.protein <= constraints.maxProtein * 1.05 &&
    nutrients.fat >= constraints.minFat * 0.95 &&
    nutrients.fat <= constraints.maxFat * 1.05 &&
    nutrients.carbs >= constraints.minCarbs * 0.95 &&
    nutrients.carbs <= constraints.maxCarbs * 1.05
  );
}

function getCostEfficiency(food: FoodItem, constraints: NutrientConstraints): number {
  const minCal = Math.max(1, constraints.minCalories);
  const minProt = Math.max(1, constraints.minProtein);
  const minFat = Math.max(1, constraints.minFat);
  const minCarb = Math.max(1, constraints.minCarbs);

  const calorieValue = food.calories / minCal;
  const proteinValue = food.protein / minProt;
  const fatValue = food.fat / minFat;
  const carbsValue = food.carbs / minCarb;

  const totalValue = calorieValue + proteinValue * 1.5 + fatValue + carbsValue;

  return totalValue > 0 ? food.cost / totalValue : food.cost;
}
