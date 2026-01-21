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

// Per-question weights: 0.5, 1.0, or 2.0
export interface QuestionWeights {
  [questionId: string]: number;
}

export interface MatchCandidate {
  id: string;
  nickname: string;
  name?: string;
  contact?: string;
  overallScore: number;
  categoryScores: {
    lifestyle: number;
    space: number;
    habits: number;
    social: number;
  };
  badges: string[];
}

export type MatchingStage = 'before' | 'matching' | 'result' | 'confirmed';

interface SurveyState {
  currentPhase: number;
  currentStep: number;
  basicInfo: BasicInfo;
  surveyAnswers: SurveyAnswers;
  softAnswers: SoftAnswers;
  questionWeights: QuestionWeights;
  matchResults: MatchCandidate[];
  currentMatch: MatchCandidate | null;
  matchingStage: MatchingStage;
  excludedIds: string[];
  isComplete: boolean;
  
  setCurrentPhase: (phase: number) => void;
  setCurrentStep: (step: number) => void;
  setBasicInfo: (info: Partial<BasicInfo>) => void;
  setSurveyAnswer: (questionId: string, value: number) => void;
  setSoftAnswer: (questionId: string, value: string) => void;
  setQuestionWeight: (questionId: string, weight: number) => void;
  setMatchResults: (results: MatchCandidate[]) => void;
  setCurrentMatch: (match: MatchCandidate | null) => void;
  setMatchingStage: (stage: MatchingStage) => void;
  addExcludedId: (id: string) => void;
  setComplete: (complete: boolean) => void;
  reset: () => void;
  resetMatching: () => void;
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
  questionWeights: {},
  matchResults: [],
  currentMatch: null,
  matchingStage: 'before' as MatchingStage,
  excludedIds: [],
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
      setQuestionWeight: (questionId, weight) => set((state) => ({
        questionWeights: { ...state.questionWeights, [questionId]: weight }
      })),
      setMatchResults: (results) => set({ matchResults: results }),
      setCurrentMatch: (match) => set({ currentMatch: match }),
      setMatchingStage: (stage) => set({ matchingStage: stage }),
      addExcludedId: (id) => set((state) => ({ 
        excludedIds: [...state.excludedIds, id] 
      })),
      setComplete: (complete) => set({ isComplete: complete }),
      reset: () => set(initialState),
      resetMatching: () => set({ 
        matchingStage: 'before', 
        currentMatch: null 
      }),
    }),
    {
      name: 'gmatch-survey',
    }
  )
);
