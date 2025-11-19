import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { Dashboard } from './components/Dashboard';
import { HistoryView } from './components/HistoryView';
import { UserProfile, FitnessPlan, SavedPlan } from './types';
import { generateFitnessPlan } from './services/geminiService';
import { savePlan, getPlans, deletePlan } from './services/storageService';
import { Moon, Sun, Dumbbell, History, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [step, setStep] = useState<'input' | 'loading' | 'result' | 'history'>('input');
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);

  // Initialize Theme and load plans
  useEffect(() => {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isSystemDark);
    if (isSystemDark) {
        document.documentElement.classList.add('dark');
    }
    setSavedPlans(getPlans());
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleFormSubmit = async (profile: UserProfile) => {
    setUserProfile(profile);
    setStep('loading');
    setIsSaved(false);
    try {
      const generatedPlan = await generateFitnessPlan(profile);
      setPlan(generatedPlan);
      setStep('result');
    } catch (error) {
      console.error(error);
      alert("Failed to generate plan. Please ensure API_KEY is set and valid.");
      setStep('input');
    }
  };

  const handleRegenerate = () => {
    if (userProfile) {
        handleFormSubmit(userProfile);
    } else {
        setStep('input');
    }
  };

  const handleSavePlan = () => {
    if (plan && userProfile && !isSaved) {
        savePlan(plan, userProfile);
        setIsSaved(true);
        setSavedPlans(getPlans()); // refresh list
    }
  };

  const handleSelectHistory = (saved: SavedPlan) => {
      setPlan(saved.plan);
      setUserProfile(saved.profile);
      setIsSaved(true); // It's already in DB
      setStep('result');
  };

  const handleDeleteHistory = (id: string) => {
      deletePlan(id);
      setSavedPlans(getPlans());
  };

  const goToHistory = () => {
      setSavedPlans(getPlans());
      setStep('history');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* Navbar */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 no-print">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 text-brand-600 dark:text-brand-500 cursor-pointer"
            onClick={() => setStep('input')}
          >
            <Dumbbell className="h-8 w-8" strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hidden sm:inline">IronPath AI</span>
          </div>
          
          <div className="flex items-center gap-2">
            {step !== 'input' && step !== 'loading' && (
                <button 
                    onClick={() => { setStep('input'); setPlan(null); setIsSaved(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <Plus size={18} /> <span className="hidden sm:inline">New Plan</span>
                </button>
            )}
            
            <button 
                onClick={goToHistory}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${step === 'history' ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
                <History size={18} /> <span className="hidden sm:inline">History</span>
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        {step === 'input' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">AI Coach</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Build your dream physique with a hyper-personalized workout and diet plan generated by Gemini AI in seconds.
              </p>
              {savedPlans.length > 0 && (
                  <button 
                    onClick={goToHistory}
                    className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    View {savedPlans.length} saved plans <History size={14} />
                  </button>
              )}
            </div>
            <InputForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-500">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
              <Dumbbell className="absolute inset-0 m-auto text-brand-500 animate-pulse" size={32} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Crafting Your Plan</h3>
              <p className="text-gray-500 dark:text-gray-400">Analyzing your profile, calculating macros, and selecting exercises...</p>
            </div>
          </div>
        )}

        {step === 'result' && plan && (
          <Dashboard 
            plan={plan} 
            onRegenerate={handleRegenerate} 
            onSave={handleSavePlan}
            isSaved={isSaved}
          />
        )}

        {step === 'history' && (
            <HistoryView 
                plans={savedPlans}
                onSelect={handleSelectHistory}
                onDelete={handleDeleteHistory}
                onBack={() => setStep('input')}
            />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-600 border-t border-gray-200 dark:border-gray-800 no-print">
        <p>© {new Date().getFullYear()} IronPath AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;