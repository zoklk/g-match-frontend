import { api, registrationApi, getApiBaseUrl, setRegistrationToken } from '@/lib/api';
import {
  GetTermsResponse,
  AgreeTermsRequest,
  AgreeTermsResponse,
  BasicInfoRequest,
  BasicInfoResponse,
  LogoutResponse,
  GetUserInfoResponse,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  WithdrawInfoResponse,
  WithdrawRequest,
  WithdrawResponse,
  RecoveryInfoResponse,
  RecoveryRequest,
  RecoveryResponse,
} from '@/types/auth';

// ============================================
// OIDC 로그인
// ============================================

/**
 * GIST IdP 로그인 시작 (로그인/회원가입 통합)
 * 브라우저를 IdP 로그인 페이지로 리다이렉트
 */
export const loginWithGIST = (redirectAfter?: string) => {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams();

  if (redirectAfter) {
    params.set('redirect_after', redirectAfter);
  }

  // 브라우저 리다이렉트 (IdP 로그인 페이지로)
  window.location.href = `${baseUrl}/account/auth/oidc/login?${params}`;
};

/**
 * AJAX 방식으로 Authorization URL 받기 (선택적)
 */
export const getAuthorizationUrl = async (redirectAfter?: string): Promise<string> => {
  const params = new URLSearchParams();
  if (redirectAfter) {
    params.set('redirect_after', redirectAfter);
  }

  const response = await api.get(`/account/auth/oidc/login?${params}`, {
    headers: { 'Accept': 'application/json' },
  });

  return response.data.authorization_url;
};

// ============================================
// 약관 동의 (회원가입)
// ============================================

/**
 * 약관 내용 조회
 */
export const getTerms = async (): Promise<GetTermsResponse> => {
  const response = await api.get<GetTermsResponse>('/account/auth/registration/agree');
  return response.data;
};

/**
 * 약관 동의 (Step 1)
 * 완료 후 새 토큰과 다음 단계 URL 반환
 */
export const agreeTerms = async (
  termsOfService: boolean,
  privacyPolicy: boolean,
  registrationToken: string
): Promise<AgreeTermsResponse> => {
  // 토큰 설정
  setRegistrationToken(registrationToken);

  const response = await registrationApi.post<AgreeTermsResponse>(
    '/account/auth/registration/agree',
    {
      terms_of_service: termsOfService,
      privacy_policy: privacyPolicy,
    } as AgreeTermsRequest
  );

  return response.data;
};

// ============================================
// 기본정보 등록 (Step 2)
// ============================================

/**
 * 기본정보 입력 및 회원가입 완료 (Step 2)
 * - gender: 필수 (M 또는 F)
 * - nickname: 선택 (최대 20자)
 */
export const submitBasicInfo = async (
  data: BasicInfoRequest,
  registrationToken: string
): Promise<BasicInfoResponse> => {
  // 토큰 설정
  setRegistrationToken(registrationToken);

  const response = await registrationApi.post<BasicInfoResponse>(
    '/account/auth/registration/basic-info',
    data
  );

  return response.data;
};

// ============================================
// 로그아웃
// ============================================

/**
 * 로그아웃
 */
export const logout = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>('/account/auth/logout');
  return response.data;
};

// ============================================
// 사용자 정보
// ============================================

/**
 * 사용자 정보 조회
 */
export const getUserInfo = async (): Promise<GetUserInfoResponse> => {
  const response = await api.get<GetUserInfoResponse>('/account/info');
  return response.data;
};

/**
 * 사용자 정보 수정
 * ⚠️ IdP 관리 필드(email, name, student_id, phone_number)는 수정 불가
 */
export const updateUserInfo = async (data: UpdateUserInfoRequest): Promise<UpdateUserInfoResponse> => {
  const response = await api.put<UpdateUserInfoResponse>('/account/info', data);
  return response.data;
};

// ============================================
// 회원탈퇴
// ============================================

/**
 * 회원탈퇴 정보 조회
 */
export const getWithdrawInfo = async (): Promise<WithdrawInfoResponse> => {
  const response = await api.get<WithdrawInfoResponse>('/account/auth/withdraw');
  return response.data;
};

/**
 * 회원탈퇴 요청
 */
export const withdraw = async (data: WithdrawRequest): Promise<WithdrawResponse> => {
  const response = await api.post<WithdrawResponse>('/account/auth/withdraw', data);
  return response.data;
};

// ============================================
// 계정 복구
// ============================================

/**
 * 계정 복구 정보 조회
 * @param recoveryToken - OIDC callback에서 받은 서명된 복구 토큰
 */
export const getRecoveryInfo = async (recoveryToken?: string): Promise<RecoveryInfoResponse> => {
  const config = recoveryToken
    ? { headers: { 'X-Recovery-Token': recoveryToken } }
    : {};
  const response = await api.get<RecoveryInfoResponse>('/account/auth/recovery', config);
  return response.data;
};

/**
 * 계정 복구 요청
 * @param data - 복구 동의 여부
 * @param recoveryToken - OIDC callback에서 받은 서명된 복구 토큰
 */
export const recoverAccount = async (
  data: RecoveryRequest,
  recoveryToken?: string
): Promise<RecoveryResponse> => {
  const config = recoveryToken
    ? { headers: { 'X-Recovery-Token': recoveryToken } }
    : {};
  const response = await api.post<RecoveryResponse>('/account/auth/recovery', data, config);
  return response.data;
};
