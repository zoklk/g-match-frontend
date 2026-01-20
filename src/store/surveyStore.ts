import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BasicInfo {
  roomMove: string;
  minPeriod: string;
  dormBuilding: string;
  smoking: string;
  hasFridge: string;
  prefFridge: string;
  hasRouter: string;
  prefRouter: string;
}

export interface SurveyAnswers {
  [key: string]: number;
}

export interface SoftAnswers {
  [key: string]: string;
}

export interface Weights {
  [category: string]: 'low' | 'normal' | 'high';
}

export interface MatchCandidate {
  id: string;
  name: string;
  studentYear: string;
  overallScore: number;
  categoryScores: {
    lifestyle: number;
    space: number;
    habits: number;
    social: number;
  };
}

interface SurveyState {
  currentPhase: number;
  currentStep: number;
  basicInfo: BasicInfo;
  surveyAnswers: SurveyAnswers;
  softAnswers: SoftAnswers;
  weights: Weights;
  matchResults: MatchCandidate[];
  isComplete: boolean;
  
  setCurrentPhase: (phase: number) => void;
  setCurrentStep: (step: number) => void;
  setBasicInfo: (info: Partial<BasicInfo>) => void;
  setSurveyAnswer: (questionId: string, value: number) => void;
  setSoftAnswer: (questionId: string, value: string) => void;
  setWeight: (category: string, weight: 'low' | 'normal' | 'high') => void;
  setMatchResults: (results: MatchCandidate[]) => void;
  setComplete: (complete: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentPhase: 1,
  currentStep: 0,
  basicInfo: {
    roomMove: '',
    minPeriod: '',
    dormBuilding: '',
    smoking: '',
    hasFridge: '',
    prefFridge: '',
    hasRouter: '',
    prefRouter: '',
  },
  surveyAnswers: {},
  softAnswers: {},
  weights: {
    lifestyle: 'normal' as const,
    space: 'normal' as const,
    habits: 'normal' as const,
    social: 'normal' as const,
  },
  matchResults: [],
  isComplete: false,
};

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setCurrentPhase: (phase) => set({ currentPhase: phase }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setBasicInfo: (info) => set((state) => ({ 
        basicInfo: { ...state.basicInfo, ...info } 
      })),
      setSurveyAnswer: (questionId, value) => set((state) => ({
        surveyAnswers: { ...state.surveyAnswers, [questionId]: value }
      })),
      setSoftAnswer: (questionId, value) => set((state) => ({
        softAnswers: { ...state.softAnswers, [questionId]: value }
      })),
      setWeight: (category, weight) => set((state) => ({
        weights: { ...state.weights, [category]: weight }
      })),
      setMatchResults: (results) => set({ matchResults: results }),
      setComplete: (complete) => set({ isComplete: complete }),
      reset: () => set(initialState),
    }),
    {
      name: 'gmatch-survey',
    }
  )
);
