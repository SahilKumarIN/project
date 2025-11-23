import { useState } from 'react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { FoodItem, NutrientConstraints, OptimizationResult } from './types';
import { optimizeMealPlan } from './utils/optimizer';

function App() {
  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const handleOptimize = (foods: FoodItem[], constraints: NutrientConstraints) => {
    const optimizationResult = optimizeMealPlan(foods, constraints);
    setResult(optimizationResult);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Diet Optimization</h1>
          <p className="text-slate-600">Cost-Minimal Meal Plan Generator</p>
          <p className="text-sm text-slate-500 mt-1">Group U - MSL740 | Kumar Rajvansh, Vidhi Jindal, Prateek Kumar Agarwal</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'input'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Input
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'results'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              disabled={!result}
            >
              Results
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'input' && <InputSection onOptimize={handleOptimize} />}
            {activeTab === 'results' && result && <ResultsSection result={result} />}
            {activeTab === 'results' && !result && (
              <div className="text-center py-12 text-slate-500">
                No results yet. Please configure inputs and optimize.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
