import React, { useState } from 'react';
import { Meal } from '../types';
import { generateImageVisual } from '../services/geminiService';
import { Camera, Utensils } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (imageUrl || isLoading) return;
    setIsLoading(true);
    const itemsList = meal.items.map(i => i.name).join(', ');
    const prompt = `A delicious, high-quality food photography shot of ${meal.type}: ${itemsList}. Professional lighting, appetizing presentation.`;
    const url = await generateImageVisual(prompt);
    setImageUrl(url);
    setIsLoading(false);
  };

  const totalCals = meal.items.reduce((acc, curr) => acc + curr.calories, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm break-inside-avoid print-break-inside-avoid">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-md">
                <Utensils size={18} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white">{meal.type}</h3>
        </div>
        <span className="text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
          ~{totalCals} kcal
        </span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">{meal.suggestions}</p>

      <div className="space-y-3">
        {meal.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 last:border-0 pb-2 last:pb-0">
            <div>
              <span className="font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2 text-xs">({item.quantity})</span>
            </div>
            <div className="flex gap-3 text-xs text-gray-400">
                <span>P: {item.protein}</span>
                <span>C: {item.carbs}</span>
                <span>F: {item.fats}</span>
            </div>
          </div>
        ))}
      </div>

      {imageUrl ? (
        <div className="mt-4 rounded-lg overflow-hidden aspect-video relative no-print">
          <img src={imageUrl} alt={meal.type} className="w-full h-full object-cover" />
        </div>
      ) : (
        <button
          onClick={handleGenerateImage}
          disabled={isLoading}
          className="w-full mt-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors no-print"
        >
           {isLoading ? (
            <span className="animate-pulse">Cooking up visual...</span>
          ) : (
            <>
              <Camera size={16} /> See Meal
            </>
          )}
        </button>
      )}
    </div>
  );
};
