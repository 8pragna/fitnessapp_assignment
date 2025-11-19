import { SavedPlan, FitnessPlan, UserProfile } from '../types';

const STORAGE_KEY = 'ironpath_plans_db';

// Simulate a database save operation
export const savePlan = (plan: FitnessPlan, profile: UserProfile): SavedPlan => {
  const plans = getPlans();
  const newPlan: SavedPlan = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    profile,
    plan
  };
  
  // Add to beginning of array
  plans.unshift(newPlan);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error("Failed to save plan to local storage", e);
    throw new Error("Storage full or disabled");
  }
  
  return newPlan;
};

// Simulate getting all records
export const getPlans = (): SavedPlan[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to retrieve plans", e);
    return [];
  }
};

// Simulate getting a single record
export const getPlanById = (id: string): SavedPlan | undefined => {
  const plans = getPlans();
  return plans.find(p => p.id === id);
};

// Simulate delete operation
export const deletePlan = (id: string): void => {
  const plans = getPlans().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
};
