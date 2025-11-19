import React from 'react';
import { SavedPlan } from '../types';
import { Trash2, Calendar, User, Target, ArrowRight, Clock } from 'lucide-react';
import { Button } from './Button';

interface HistoryViewProps {
  plans: SavedPlan[];
  onSelect: (plan: SavedPlan) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ plans, onSelect, onDelete, onBack }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Plan History</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Access your saved fitness journeys</p>
        </div>
        <Button variant="outline" onClick={onBack}>
           Back to Builder
        </Button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Clock className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No saved plans yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Generate your first AI plan and save it to see it here.</p>
          <Button onClick={onBack}>Create New Plan</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((saved) => (
            <div 
              key={saved.id} 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded flex items-center gap-1">
                  <Calendar size={12} /> {formatDate(saved.createdAt)}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(saved.id); }}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Delete Plan"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <User size={16} className="text-brand-500" />
                    {saved.profile.name}
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-y-1 gap-x-3">
                    <span className="flex items-center gap-1"><Target size={12} /> {saved.profile.goal}</span>
                    <span>•</span>
                    <span>{saved.profile.level}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <span className="text-xs text-gray-400">{saved.plan.workout.length} Day Split</span>
                <Button 
                    variant="ghost" 
                    className="text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 -mr-2"
                    onClick={() => onSelect(saved)}
                >
                    View Plan <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
