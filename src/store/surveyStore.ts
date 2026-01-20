import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BasicInfo {
  gender: string;
  studentYear: string;
  stayPeriod: string;
  dormBuilding: string;
}

export interface SurveyAnswers {
  [key: string]: number;
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
  weights: Weights;
  matchResults: MatchCandidate[];
  isComplete: boolean;
  
  setCurrentPhase: (phase: number) => void;
  setCurrentStep: (step: number) => void;
  setBasicInfo: (info: Partial<BasicInfo>) => void;
  setSurveyAnswer: (questionId: string, value: number) => void;
  setWeight: (category: string, weight: 'low' | 'normal' | 'high') => void;
  setMatchResults: (results: MatchCandidate[]) => void;
  setComplete: (complete: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentPhase: 1,
  currentStep: 0,
  basicInfo: {
    gender: '',
    studentYear: '',
    stayPeriod: '',
    dormBuilding: '',
  },
  surveyAnswers: {},
  weights: {},
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
