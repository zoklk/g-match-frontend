import { api } from '@/lib/api';
import {
  ProfileStatusResponse,
  GetPropertyResponse,
  SubmitPropertyResponse,
  PropertyRequest,
  GetSurveyResponse,
  SubmitSurveyResponse,
  SurveyRequest,
  MatchStatusResponse,
  MatchResultResponse,
  ContactResponse,
} from '@/types/match';

// ============================================
// Profile API
// ============================================

/** 프로필 상태 조회 (profile_status: 0/1/2) */
export const getProfileStatus = async (): Promise<ProfileStatusResponse> => {
  const response = await api.get<ProfileStatusResponse>('/match/profile/');
  return response.data;
};

// NOTE: getProperty()와 getSurvey()는 더 이상 사용하지 않습니다.
// 대신 getProfileStatus()를 사용하여 profile_status와 함께 property, survey 데이터를 받아옵니다.

/** 기존 property 조회 (재작성 시 기본값용) - DEPRECATED */
export const getProperty = async (): Promise<GetPropertyResponse> => {
  const response = await api.get<GetPropertyResponse>('/match/profile/property/');
  return response.data;
};

/** 새 property 생성 */
export const submitProperty = async (data: PropertyRequest): Promise<SubmitPropertyResponse> => {
  const response = await api.post<SubmitPropertyResponse>('/match/profile/property/', data);
  return response.data;
};

// /** 기존 survey 조회 (재작성 시 기본값용) - DEPRECATED */
export const getSurvey = async (): Promise<GetSurveyResponse> => {
  const response = await api.get<GetSurveyResponse>('/match/profile/survey/');
  return response.data;
};

/** 새 survey + weights 생성 */
export const submitSurvey = async (data: SurveyRequest): Promise<SubmitSurveyResponse> => {
  const response = await api.post<SubmitSurveyResponse>('/match/profile/survey/', data);
  return response.data;
};

// ============================================
// Matching API
// ============================================

/** 현재 매칭 상태 조회 */
export const getMatchStatus = async (): Promise<MatchStatusResponse> => {
  const response = await api.get<MatchStatusResponse>('/match/matching/');
  return response.data;
};

/** 매칭 시작 (대기열 등록) */
export const startMatching = async (): Promise<MatchStatusResponse> => {
  const response = await api.post<MatchStatusResponse>('/match/matching/start/');
  return response.data;
};

/** 매칭 취소 */
export const cancelMatching = async (): Promise<MatchStatusResponse> => {
  const response = await api.post<MatchStatusResponse>('/match/matching/cancel/');
  return response.data;
};

/** 매칭 결과 상세 조회 (상대 프로필) */
export const getMatchResult = async (): Promise<MatchResultResponse> => {
  const response = await api.get<MatchResultResponse>('/match/matching/result/');
  return response.data;
};

/** 매칭 수락 */
export const agreeMatch = async (): Promise<MatchStatusResponse> => {
  const response = await api.post<MatchStatusResponse>('/match/matching/agree/');
  return response.data;
};

/** 매칭 거절 */
export const rejectMatch = async (): Promise<MatchStatusResponse> => {
  const response = await api.post<MatchStatusResponse>('/match/matching/reject/');
  return response.data;
};

/** 상대방 연락처 조회 (BOTH_APPROVED 이후) */
export const getContact = async (): Promise<ContactResponse> => {
  const response = await api.get<ContactResponse>('/match/matching/contact/');
  return response.data;
};

/** 재매칭 요청 */
export const rematch = async (): Promise<MatchStatusResponse> => {
  const response = await api.post<MatchStatusResponse>('/match/matching/rematch/');
  return response.data;
};
