import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FoodItem, NutrientConstraints } from '../types';

interface InputSectionProps {
  onOptimize: (foods: FoodItem[], constraints: NutrientConstraints) => void;
}

const InputSection = ({ onOptimize }: InputSectionProps) => {
  const [foods, setFoods] = useState<FoodItem[]>([
    { id: '1', name: 'Rice', cost: 20, calories: 130, protein: 2.7, fat: 0.3, carbs: 28, maxServings: 3 },
    { id: '2', name: 'Lentils', cost: 30, calories: 116, protein: 9, fat: 0.4, carbs: 20, maxServings: 3 },
    { id: '3', name: 'Milk', cost: 25, calories: 61, protein: 3.2, fat: 3.3, carbs: 4.8, maxServings: 4 },
    { id: '4', name: 'Eggs', cost: 15, calories: 155, protein: 13, fat: 11, carbs: 1.1, maxServings: 4 },
    { id: '5', name: 'Vegetables', cost: 35, calories: 65, protein: 3, fat: 0.5, carbs: 13, maxServings: 5 },
  ]);

  const [constraints, setConstraints] = useState<NutrientConstraints>({
    minCalories: 2000,
    maxCalories: 2500,
    minProtein: 50,
    maxProtein: 150,
    minFat: 40,
    maxFat: 80,
    minCarbs: 250,
    maxCarbs: 350,
  });

  const addFood = () => {
    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: '',
      cost: 0,
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      maxServings: 5,
    };
    setFoods([...foods, newFood]);
  };

  const removeFood = (id: string) => {
    setFoods(foods.filter(f => f.id !== id));
  };

  const updateFood = (id: string, field: keyof FoodItem, value: string | number) => {
    setFoods(foods.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleOptimize = () => {
    const validFoods = foods.filter(f => f.name && f.cost > 0);
    if (validFoods.length === 0) {
      alert('Please add at least one valid food item');
      return;
    }
    onOptimize(validFoods, constraints);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Food Items</h2>
          <motion.button
            onClick={addFood}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
            Add Food
          </motion.button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="pb-3 font-medium text-slate-700">Name</th>
                <th className="pb-3 font-medium text-slate-700">Cost (₹)</th>
                <th className="pb-3 font-medium text-slate-700">Calories</th>
                <th className="pb-3 font-medium text-slate-700">Protein (g)</th>
                <th className="pb-3 font-medium text-slate-700">Fat (g)</th>
                <th className="pb-3 font-medium text-slate-700">Carbs (g)</th>
                <th className="pb-3 font-medium text-slate-700">Max Servings</th>
                <th className="pb-3 font-medium text-slate-700"></th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food, idx) => (
                <motion.tr
                  key={food.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * idx }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <td className="py-3">
                    <input
                      type="text"
                      value={food.name}
                      onChange={(e) => updateFood(food.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={food.cost}
                      onChange={(e) => updateFood(food.id, 'cost', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={food.calories}
                      onChange={(e) => updateFood(food.id, 'calories', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      step="0.1"
                      value={food.protein}
                      onChange={(e) => updateFood(food.id, 'protein', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      step="0.1"
                      value={food.fat}
                      onChange={(e) => updateFood(food.id, 'fat', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      step="0.1"
                      value={food.carbs}
                      onChange={(e) => updateFood(food.id, 'carbs', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={food.maxServings || ''}
                      onChange={(e) => updateFood(food.id, 'maxServings', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                    />
                  </td>
                  <td className="py-3">
                    <motion.button
                      onClick={() => removeFood(food.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Nutrient Constraints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Calories', min: 'minCalories', max: 'maxCalories' },
            { label: 'Protein (g)', min: 'minProtein', max: 'maxProtein' },
            { label: 'Fat (g)', min: 'minFat', max: 'maxFat' },
            { label: 'Carbs (g)', min: 'minCarbs', max: 'maxCarbs' },
          ].map(({ label, min, max }, idx) => (
            <motion.div
              key={label}
              className="space-y-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.15 + 0.05 * idx }}
            >
              <label className="block text-sm font-medium text-slate-700">{label}</label>
              <div className="space-y-2">
                <motion.input
                  type="number"
                  placeholder="Min"
                  value={constraints[min as keyof NutrientConstraints]}
                  onChange={(e) => setConstraints({ ...constraints, [min]: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                  whileFocus={{ scale: 1.01 }}
                />
                <motion.input
                  type="number"
                  placeholder="Max"
                  value={constraints[max as keyof NutrientConstraints]}
                  onChange={(e) => setConstraints({ ...constraints, [max]: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          onClick={handleOptimize}
          className="px-8 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors shadow-md"
          whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)' }}
          whileTap={{ scale: 0.98 }}
        >
          Optimize Meal Plan
        </motion.button>
      </motion.div>
    </div>
  );
};

export default InputSection;
