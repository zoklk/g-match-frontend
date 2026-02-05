import { create } from 'zustand';
import {
  MatchStatus,
  MatchResultResponse,
  ContactResponse,
  ProfileProperty,
  ProfileSurvey,
} from '@/types/match';

interface MatchState {
  // 서버에서 받아온 매칭 상태
  matchStatus: MatchStatus;

  // 매칭 결과 데이터
  matchId: number | null;
  compatibilityScore: Record<string, number> | null;
  partnerProperty: ProfileProperty | null;
  partnerSurvey: ProfileSurvey | null;

  // 연락처 데이터
  partnerContact: {
    user_id: string;
    nickname: string;
  } | null;

  // 로딩
  isLoading: boolean;

  // Actions
  setMatchStatus: (status: MatchStatus) => void;
  setMatchResult: (data: MatchResultResponse) => void;
  setContact: (data: ContactResponse) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useMatchStore = create<MatchState>()((set) => ({
  matchStatus: MatchStatus.NOT_STARTED,
  matchId: null,
  compatibilityScore: null,
  partnerProperty: null,
  partnerSurvey: null,
  partnerContact: null,
  isLoading: false,

  setMatchStatus: (status) => set({ matchStatus: status }),

  setMatchResult: (data) => set({
    matchStatus: data.match_status,
    matchId: data.match_id,
    compatibilityScore: data.compatibility_score,
    partnerProperty: data.partner.property,
    partnerSurvey: data.partner.survey,
  }),

  setContact: (data) => set({
    matchStatus: data.match_status,
    partnerContact: data.partner ?? null,
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  reset: () => set({
    matchStatus: MatchStatus.NOT_STARTED,
    matchId: null,
    compatibilityScore: null,
    partnerProperty: null,
    partnerSurvey: null,
    partnerContact: null,
    isLoading: false,
  }),
}));
