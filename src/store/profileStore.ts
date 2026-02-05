import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PropertyRequest, SurveyAnswers, SurveyWeights } from '@/types/match';

interface ProfileState {
  // 프로필 작성 진행도 (서버에서 받아온 값)
  profileStatus: 0 | 1 | 2;

  // Property 폼 상태
  propertyData: Partial<PropertyRequest>;

  // Survey 답변 (임시 저장, Weight 완료 시 함께 POST)
  surveyAnswers: SurveyAnswers;

  // 가중치 (임시 저장, Weight 완료 시 함께 POST)
  surveyWeights: SurveyWeights;

  // Actions
  setProfileStatus: (status: 0 | 1 | 2) => void;
  setPropertyData: (data: Partial<PropertyRequest>) => void;
  setPropertyField: (field: string, value: unknown) => void;
  setSurveyAnswer: (questionId: string, value: number) => void;
  setSurveyWeight: (questionId: string, weight: number) => void;
  setSurveyAnswers: (answers: SurveyAnswers) => void;
  setSurveyWeights: (weights: SurveyWeights) => void;
  resetProperty: () => void;
  resetSurvey: () => void;
  resetAll: () => void;
}

const initialPropertyData: Partial<PropertyRequest> = {};
const initialSurveyAnswers: SurveyAnswers = {};
const initialSurveyWeights: SurveyWeights = {};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profileStatus: 0,
      propertyData: initialPropertyData,
      surveyAnswers: initialSurveyAnswers,
      surveyWeights: initialSurveyWeights,

      setProfileStatus: (status) => set({ profileStatus: status }),

      setPropertyData: (data) => set((state) => ({
        propertyData: { ...state.propertyData, ...data },
      })),

      setPropertyField: (field, value) => set((state) => ({
        propertyData: { ...state.propertyData, [field]: value },
      })),

      setSurveyAnswer: (questionId, value) => set((state) => ({
        surveyAnswers: { ...state.surveyAnswers, [questionId]: value },
      })),

      setSurveyWeight: (questionId, weight) => set((state) => ({
        surveyWeights: { ...state.surveyWeights, [questionId]: weight },
      })),

      setSurveyAnswers: (answers) => set({ surveyAnswers: answers }),
      setSurveyWeights: (weights) => set({ surveyWeights: weights }),

      resetProperty: () => set({ propertyData: initialPropertyData }),
      resetSurvey: () => set({
        surveyAnswers: initialSurveyAnswers,
        surveyWeights: initialSurveyWeights,
      }),
      resetAll: () => set({
        profileStatus: 0,
        propertyData: initialPropertyData,
        surveyAnswers: initialSurveyAnswers,
        surveyWeights: initialSurveyWeights,
      }),
    }),
    {
      name: 'gmatch-profile',
    }
  )
);
