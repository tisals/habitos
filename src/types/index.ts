export enum UserLevel {
  NIVEL_1 = 1,
  NIVEL_2 = 2,
  NIVEL_3 = 3
}

export enum RitualType {
  CAFE = 'CAFE',
  PIT = 'PIT',
  LIFE = 'LIFE'
}

export interface RitualStep {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  audioPath?: string;
  checkpoints?: string[];
}

export interface Ritual {
  id: string;
  slug: string;
  name: string;
  type: RitualType;
  description: string;
  steps: RitualStep[];
  minLevel: UserLevel;
  requiresPremium: boolean;
  hasAudio: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  level: UserLevel;
  isPremium: boolean;
  role: 'user' | 'admin';
}

export interface CompletionRecord {
  userId: string;
  ritualId: string;
  date: string;
  timestamp: number;
}

export interface UserStats {
  streak: number;
  lastCompletionDate: string | null;
  completionsToday: string[];
}

export interface DailyState {
  userId: string;
  date: string;
  energia: number;
  enfoque: number;
  ruidoMental: number;
  timestamp: number;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'night';
