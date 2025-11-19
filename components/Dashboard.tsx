import React, { useState } from 'react';
import { FitnessPlan } from '../types';
import { ExerciseCard } from './ExerciseCard';
import { MealCard } from './MealCard';
import { playTextToSpeech } from '../services/geminiService';
import { Dumbbell, Utensils, Lightbulb, Download, Volume2, RefreshCcw, Save, Check } from 'lucide-react';
import { Button } from './Button';

interface DashboardProps {
  plan: FitnessPlan;
  onRegenerate: () => void;
  onSave: () => void;
  isSaved: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ plan, onRegenerate, onSave, isSaved }) => {
  const [activeTab, setActiveTab] = useState<'workout' | 'diet' | 'tips'>('workout');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleReadPlan = async () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    
    let textToRead = "";
    if (activeTab === 'workout') {
        textToRead = `Here is your workout plan. ${plan.workout.map(d => `On ${d.day}, focus on ${d.focus}. Exercises include ${d.exercises.map(e => e.name).join(', ')}. `).join(' ')}`;
    } else if (activeTab === 'diet') {
        textToRead = `Here is your nutrition plan. ${plan.diet.meals.map(m => `For ${m.type}, try ${m.items.map(i => i.name).join(' and ')}. `).join(' ')}`;
    } else {
        textToRead = `Here are some tips for you. ${plan.tips.join('. ')}. And remember: ${plan.motivation}`;
    }

    await playTextToSpeech(textToRead);
    setIsPlayingAudio(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-700 pb-20">
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 no-print">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Custom Plan</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">AI-Generated based on your profile</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={isSaved ? "secondary" : "primary"} 
            onClick={onSave} 
            disabled={isSaved}
            className={isSaved ? "bg-green-600 hover:bg-green-700 shadow-green-500/20" : ""}
          >
            {isSaved ? <Check size={18} /> : <Save size={18} />}
            {isSaved ? 'Saved' : 'Save Plan'}
          </Button>
          <Button variant="outline" onClick={handleReadPlan} disabled={isPlayingAudio}>
            <Volume2 size={18} /> {isPlayingAudio ? 'Speaking...' : 'Read'}
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Download size={18} /> PDF
          </Button>
          <Button variant="ghost" onClick={onRegenerate}>
            <RefreshCcw size={18} /> Regenerate
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-print">
        <button
          onClick={() => setActiveTab('workout')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
            activeTab === 'workout' 
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Dumbbell size={18} /> Workouts
        </button>
        <button
          onClick={() => setActiveTab('diet')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
            activeTab === 'diet' 
              ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Utensils size={18} /> Diet Plan
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
            activeTab === 'tips' 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Lightbulb size={18} /> Tips & Motivation
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        
        {/* Workout Tab */}
        <div className={activeTab === 'workout' ? 'block' : 'hidden print:block'}>
            <div className="print:mb-8">
                <h3 className="text-2xl font-bold mb-6 hidden print:block">Workout Plan</h3>
                <div className="grid grid-cols-1 gap-8">
                    {plan.workout.map((day, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 print:border-black">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 font-bold px-3 py-1 rounded text-sm uppercase tracking-wider">
                                {day.day}
                            </span>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{day.focus}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {day.exercises.map((ex, i) => (
                                <ExerciseCard key={i} exercise={ex} />
                            ))}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Diet Tab */}
        <div className={activeTab === 'diet' ? 'block' : 'hidden print:block'}>
            <div className="print:mb-8">
                <h3 className="text-2xl font-bold mb-6 hidden print:block">Diet Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plan.diet.meals.map((meal, idx) => (
                    <MealCard key={idx} meal={meal} />
                    ))}
                </div>
            </div>
        </div>

        {/* Tips Tab */}
        <div className={activeTab === 'tips' ? 'block' : 'hidden print:block'}>
            <div className="print:mb-8">
                <h3 className="text-2xl font-bold mb-6 hidden print:block">Motivation & Tips</h3>
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-8 print:text-black print:bg-none print:border print:border-black">
                    <h3 className="text-xl font-semibold mb-4 opacity-90">Daily Motivation</h3>
                    <blockquote className="text-3xl font-serif italic leading-relaxed">
                    "{plan.motivation}"
                    </blockquote>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Lightbulb className="text-yellow-500" /> Coach Tips
                    </h3>
                    <ul className="space-y-4">
                    {plan.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                        </span>
                        <span>{tip}</span>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};