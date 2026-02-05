// ============================================
// Property 관련 타입
// ============================================

export interface PropertyRequest {
  is_smoker: boolean;
  dorm_building: 'G' | 'I' | 'S' | 'T';
  stay_period: 1 | 2 | 3;
  has_fridge: boolean;
  mate_fridge: 0 | 1 | 2; // 0: 상관없음, 1: 선호, 2: 비선호
  has_router: boolean;
  mate_router: 0 | 1 | 2;
}

export interface PropertyResponse {
  property_id: number;
  created_at: string;
  user_id: string;
  nickname: string;
  student_id: number;
  gender: string;
  is_smoker: boolean;
  dorm_building: string;
  stay_period: number;
  has_fridge: boolean;
  mate_fridge: number;
  has_router: boolean;
  mate_router: number;
  match_status: number;
}

// 프로필 표시용 (민감정보 제외)
export interface ProfileProperty {
  nickname: string;
  student_id: number; // 앞 2자리만 (예: 24)
  gender: string;
  is_smoker: boolean;
  dorm_building: string;
  stay_period: number;
  has_fridge: boolean;
  mate_fridge: number;
  has_router: boolean;
  mate_router: number;
}

// ============================================
// Survey 관련 타입
// ============================================

export interface SurveyAnswers {
  [key: string]: number; // time_1~4, clean_1~4, habit_1~4, social_1~5, etc_1~2 → 1~5
}

export interface SurveyWeights {
  [key: string]: number; // 동일 키 → 0.5 | 1.0 | 1.5
}

export interface SurveyRequest {
  surveys: SurveyAnswers;
  weights: SurveyWeights;
}

export interface SurveyResponse {
  survey_id: number;
  created_at: string;
  user_id: string;
  surveys: SurveyAnswers;
  weights: SurveyWeights;
  scores: Record<string, number>;
  badges: string[];
}

// 프로필 표시용 (scores, badges만)
export interface ProfileSurvey {
  scores: Record<string, number>;
  badges: string[];
}

// ============================================
// Profile 상태 조회 타입
// ============================================

export type ProfileStatus = 0 | 1 | 2;
// 0: NO_PROPERTY (property 미작성)
// 1: NO_SURVEY (survey 미작성)
// 2: COMPLETE (프로필 완성)

export interface ProfileStatusResponse {
  success: boolean;
  profile_status: ProfileStatus;
  user_id?: string;
  property?: ProfileProperty;
  survey?: ProfileSurvey;
}

export interface GetPropertyResponse {
  success: boolean;
  property?: PropertyResponse;
  error?: string;
}

export interface GetSurveyResponse {
  success: boolean;
  survey?: SurveyResponse;
  error?: string;
}

export interface SubmitPropertyResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: Record<string, string[]>;
}

export interface SubmitSurveyResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: Record<string, string[]>;
}

// ============================================
// Matching 관련 타입
// ============================================

export enum MatchStatus {
  NOT_STARTED = 0,
  IN_QUEUE = 1,
  MATCHED = 2,
  MY_APPROVED = 3,
  BOTH_APPROVED = 4,
  PARTNER_REJECTED = 5,
  PARTNER_REMATCHED = 6,
}

export interface MatchStatusResponse {
  success: boolean;
  match_status: MatchStatus;
  error?: string;
  message?: string;
}

export interface MatchResultResponse {
  success: boolean;
  match_status: MatchStatus;
  match_id: number;
  compatibility_score: number; // FloatField (120점 만점)
  partner: {
    property: ProfileProperty;
    survey: ProfileSurvey;
  };
  error?: string;
}

export interface ContactResponse {
  success: boolean;
  match_status: MatchStatus;
  partner?: {
    name: string;
    phone: string;
    gender: string;
    student_id: number;
  };
  error?: string;
}

// ============================================
// 에러 타입
// ============================================

export interface MatchApiError {
  success: false;
  error: string;
  message?: string;
  match_status?: MatchStatus;
  match_failed?: boolean;
}
