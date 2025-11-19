import React, { useState } from 'react';
import { Exercise } from '../types';
import { generateImageVisual } from '../services/geminiService';
import { Camera, Info } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleGenerateImage = async () => {
    if (imageUrl || isLoading) return;
    setIsLoading(true);
    // "Nano Banana" works best with clear subjects.
    const prompt = `A professional instructional fitness illustration of a person performing the exercise: ${exercise.name}. White background, clear pose, anatomical style or realistic gym photography style.`;
    const url = await generateImageVisual(prompt);
    setImageUrl(url);
    setIsLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{exercise.name}</h4>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-400 hover:text-brand-500 transition-colors"
        >
          <Info size={18} />
        </button>
      </div>

      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Sets: {exercise.sets}</span>
        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Reps: {exercise.reps}</span>
        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Rest: {exercise.rest}</span>
      </div>

      {showInfo && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3 animate-in fade-in">
          {exercise.notes}
        </p>
      )}

      {imageUrl ? (
        <div className="mt-3 rounded-lg overflow-hidden aspect-video relative bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 no-print">
          <img src={imageUrl} alt={exercise.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <button
          onClick={handleGenerateImage}
          disabled={isLoading}
          className="w-full mt-2 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors no-print"
        >
          {isLoading ? (
            <span className="animate-pulse">Generating Visual...</span>
          ) : (
            <>
              <Camera size={16} /> Visualize Exercise
            </>
          )}
        </button>
      )}
    </div>
  );
};
