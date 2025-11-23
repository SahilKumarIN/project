import { OptimizationResult } from '../types';
import { motion } from 'motion/react';

interface ResultsSectionProps {
  result: OptimizationResult;
}

const ResultsSection = ({ result }: ResultsSectionProps) => {
  const getNutrientStatus = (value: number, min: number, max: number) => {
    if (value < min) return 'text-red-600';
    if (value > max) return 'text-orange-600';
    return 'text-green-600';
  };

  const maxCost = Math.max(...result.mealPlan.map(item => item.cost));

  return (
    <div className="space-y-8">
      <motion.div
        className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Optimal Meal Plan</h2>
        <motion.p
          className="text-3xl font-bold text-slate-900"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          ₹{result.totalCost.toFixed(2)}
        </motion.p>
        <p className="text-sm text-slate-600 mt-1">Total daily cost</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Selected Foods</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="pb-3 font-medium text-slate-700">Food Item</th>
                <th className="pb-3 font-medium text-slate-700">Servings</th>
                <th className="pb-3 font-medium text-slate-700">Cost per Serving</th>
                <th className="pb-3 font-medium text-slate-700">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {result.mealPlan.map((item, idx) => (
                <motion.tr
                  key={idx}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * idx }}
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="py-3 font-medium text-slate-800">{item.food.name}</td>
                  <td className="py-3 text-slate-600">{item.servings.toFixed(2)}</td>
                  <td className="py-3 text-slate-600">₹{item.food.cost.toFixed(2)}</td>
                  <td className="py-3 font-medium text-slate-800">₹{item.cost.toFixed(2)}</td>
                </motion.tr>
              ))}
              <tr className="font-semibold">
                <td className="py-3 text-slate-800" colSpan={3}>Total</td>
                <td className="py-3 text-slate-900">₹{result.totalCost.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Cost Breakdown</h3>
        <div className="space-y-3">
          {result.mealPlan.map((item, idx) => {
            const percentage = (item.cost / result.totalCost) * 100;
            const barWidth = (item.cost / maxCost) * 100;
            return (
              <motion.div
                key={idx}
                className="flex items-center gap-4 group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * idx }}
                whileHover={{ x: 4 }}
              >
                <div className="w-32 text-sm font-medium text-slate-700">{item.food.name}</div>
                <motion.div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden shadow-sm">
                  <motion.div
                    className="bg-slate-700 h-full rounded-full flex items-center justify-end pr-3 group-hover:bg-slate-600 transition-colors"
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + 0.1 * idx }}
                  >
                    <motion.span
                      className="text-xs text-white font-medium whitespace-nowrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + 0.1 * idx }}
                    >
                      ₹{item.cost.toFixed(2)}
                    </motion.span>
                  </motion.div>
                </motion.div>
                <motion.div
                  className="w-16 text-sm text-slate-600 text-right font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + 0.1 * idx }}
                >
                  {percentage.toFixed(1)}%
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Nutrient Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Calories', value: result.nutrients.calories, min: result.constraints.minCalories, max: result.constraints.maxCalories, unit: 'kcal' },
            { label: 'Protein', value: result.nutrients.protein, min: result.constraints.minProtein, max: result.constraints.maxProtein, unit: 'g' },
            { label: 'Fat', value: result.nutrients.fat, min: result.constraints.minFat, max: result.constraints.maxFat, unit: 'g' },
            { label: 'Carbs', value: result.nutrients.carbs, min: result.constraints.minCarbs, max: result.constraints.maxCarbs, unit: 'g' },
          ].map(({ label, value, min, max, unit }, idx) => {
            const percentage = ((value - min) / (max - min)) * 100;
            const clampedPercentage = Math.max(0, Math.min(100, percentage));
            return (
              <motion.div
                key={label}
                className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + 0.08 * idx }}
                whileHover={{ y: -4 }}
              >
                <div className="text-sm text-slate-600 mb-1">{label}</div>
                <motion.div
                  className={`text-2xl font-bold mb-2 ${getNutrientStatus(value, min, max)}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + 0.08 * idx }}
                >
                  {value.toFixed(1)} {unit}
                </motion.div>
                <div className="text-xs text-slate-500 mb-2">
                  Target: {min} - {max} {unit}
                </div>
                <motion.div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      value < min ? 'bg-red-500' : value > max ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 + 0.08 * idx }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsSection;
