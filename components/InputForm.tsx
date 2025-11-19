import React, { useState } from 'react';
import { UserProfile, Gender, Goal, Level, Location, DietType } from '../types';
import { GENDER_OPTIONS, GOAL_OPTIONS, LEVEL_OPTIONS, LOCATION_OPTIONS, DIET_OPTIONS } from '../constants';
import { Button } from './Button';
import { ChevronRight, ChevronLeft, Activity } from 'lucide-react';

interface InputFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    gender: Gender.Male,
    height: 170,
    weight: 70,
    goal: Goal.WeightLoss,
    level: Level.Beginner,
    location: Location.Gym,
    diet: DietType.Standard,
    medicalHistory: '',
    stressLevel: 'Medium',
  });

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Basics</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input 
            type="text" 
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            placeholder="Enter your name"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
            <input 
              type="number" 
              value={profile.age}
              onChange={(e) => handleChange('age', Number(e.target.value))}
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
            <select 
              value={profile.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {GENDER_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
            <input 
              type="number" 
              value={profile.height}
              onChange={(e) => handleChange('height', Number(e.target.value))}
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
            <input 
              type="number" 
              value={profile.weight}
              onChange={(e) => handleChange('weight', Number(e.target.value))}
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Goals & Lifestyle</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Goal</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {GOAL_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => handleChange('goal', option)}
                className={`p-2 text-sm rounded-lg border ${profile.goal === option ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-brand-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fitness Level</label>
          <div className="flex gap-2">
             {LEVEL_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => handleChange('level', option)}
                className={`flex-1 p-2 text-sm rounded-lg border ${profile.level === option ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-brand-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

         <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workout Location</label>
          <div className="flex gap-2">
             {LOCATION_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => handleChange('location', option)}
                className={`flex-1 p-2 text-sm rounded-lg border ${profile.location === option ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-brand-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Nutrition & Health</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dietary Preference</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DIET_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => handleChange('diet', option)}
                className={`p-2 text-sm rounded-lg border ${profile.diet === option ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-brand-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Medical History / Injuries (Optional)</label>
          <textarea
            value={profile.medicalHistory}
            onChange={(e) => handleChange('medicalHistory', e.target.value)}
            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none h-24 resize-none"
            placeholder="e.g., Lower back pain, Asthma..."
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-100 dark:bg-brand-900 rounded-full text-brand-600 dark:text-brand-300">
            <Activity size={24} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Setup Your Profile</h1>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-8 rounded-full transition-colors ${step >= i ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
        <Button 
          variant="ghost" 
          onClick={prevStep} 
          disabled={step === 1}
          className={step === 1 ? 'invisible' : ''}
        >
          <ChevronLeft size={20} /> Back
        </Button>

        {step < 3 ? (
          <Button onClick={nextStep}>
            Next <ChevronRight size={20} />
          </Button>
        ) : (
          <Button onClick={() => onSubmit(profile)} isLoading={isLoading} variant="primary" className="w-32">
            Generate Plan
          </Button>
        )}
      </div>
    </div>
  );
};
