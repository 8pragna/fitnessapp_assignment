export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum Goal {
  WeightLoss = 'Weight Loss',
  MuscleGain = 'Muscle Gain',
  Endurance = 'Endurance',
  Maintenance = 'Maintenance',
  Flexibility = 'Flexibility',
}

export enum Level {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export enum Location {
  Gym = 'Gym',
  Home = 'Home',
  Outdoor = 'Outdoor',
}

export enum DietType {
  Standard = 'Standard',
  Vegetarian = 'Vegetarian',
  Vegan = 'Vegan',
  Keto = 'Keto',
  Paleo = 'Paleo',
}

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  goal: Goal;
  level: Level;
  location: Location;
  diet: DietType;
  medicalHistory?: string;
  stressLevel?: string;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
}

export interface Meal {
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  items: MealItem[];
  suggestions: string;
}

export interface DietPlanDay {
  day: string; // Usually "Daily Plan" or specific days
  meals: Meal[];
}

export interface FitnessPlan {
  workout: WorkoutDay[];
  diet: DietPlanDay; // Simplified to one daily plan example for MVP, or array
  motivation: string;
  tips: string[];
}

export interface SavedPlan {
  id: string;
  createdAt: number;
  profile: UserProfile;
  plan: FitnessPlan;
}