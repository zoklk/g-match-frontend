// ============================================
// 사용자 정보
// ============================================

export interface User {
  userId: string;
  email: string;
  name: string;
  studentId?: string;
  phoneNumber?: string;
  gender?: 'M' | 'F';
  house?: string;
  nickname?: string;
  isOidcUser?: boolean;
  dateJoined?: string;
}

// 백엔드 응답 원본 (snake_case)
export interface UserResponse {
  user_id: string;
  email: string;
  name: string;
  student_id?: string;
  phone_number?: string;
  gender?: 'M' | 'F';
  house?: string;
  nickname?: string;
  is_oidc_user?: boolean;
  date_joined?: string;
}

// ============================================
// OIDC 관련 타입
// ============================================

// GET /auth/oidc/login (AJAX 요청 시)
export interface OIDCLoginResponse {
  success: true;
  authorization_url: string;
}

// Callback URL 파라미터 (프론트엔드 처리용)
export interface OIDCCallbackParams {
  is_new_user?: string;
  registration_token?: string;
  error?: string;
  needs_recovery?: string;
  user_email?: string;
  recovery_token?: string;
}

// ============================================
// 약관 관련 타입
// ============================================

export interface TermsContent {
  title: string;
  content: string;
}

export interface GetTermsResponse {
  success: true;
  terms_of_service: TermsContent;
  privacy_policy: TermsContent;
}

export interface AgreeTermsRequest {
  terms_of_service: boolean;
  privacy_policy: boolean;
}

// 약관 동의 응답 (Step 1 완료 → Step 2로 이동)
export interface AgreeTermsResponse {
  success: true;
  message: string;
  registration_token: string;  // 새 토큰
  next_step: string;           // 다음 단계 URL
}

// ============================================
// 기본정보 등록 관련 타입 (Step 2)
// ============================================

export interface BasicInfoRequest {
  gender: 'M' | 'F';  // 필수
  nickname: string;   // 필수 (2~20자)
}

export interface BasicInfoResponse {
  success: true;
  message: string;
  user: {
    user_id: string;
    email: string;
    name: string;
    student_id?: string;
  };
}

// ============================================
// 사용자 정보 관련 타입
// ============================================

export interface GetUserInfoResponse {
  success: true;
  user: UserResponse;
}

// 수정 가능한 필드만 (IdP 관리 필드 제외)
export interface UpdateUserInfoRequest {
  gender?: 'M' | 'F';
  house?: string;
  nickname?: string;
}

export interface UpdateUserInfoResponse {
  success: true;
  message: string;
  user: UserResponse;
}

// ============================================
// 로그아웃
// ============================================

export interface LogoutResponse {
  success: true;
  message: string;
}

// ============================================
// 회원탈퇴
// ============================================

export interface WithdrawInfoResponse {
  success: true;
  message: string;
  warning: string;
  deleted_data: string[];
  retention_period: string;
  recovery_info: string;
  confirmation_required: string;
}

export interface WithdrawRequest {
  confirmation: string;
}

export interface WithdrawResponse {
  success: true;
  message: string;
  recovery_info: string;
}

// ============================================
// 계정 복구
// ============================================

export interface RecoveryInfoResponse {
  success: true;
  message: string;
  user_email: string;
  user_name: string;
  deactivated_at: string | null;
  remaining_days: number;
  recovery_info: string;
}

export interface RecoveryRequest {
  confirm_recovery: boolean;
}

export interface RecoveryResponse {
  success: true;
  message: string;
  user: {
    user_id: string;
    email: string;
    name: string;
  };
}

// ============================================
// 에러 타입
// ============================================

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  errors?: Record<string, string[]>;
  login_url?: string;
}

// ============================================
// 변환 함수
// ============================================

export function transformUserResponse(response: UserResponse): User {
  return {
    userId: response.user_id,
    email: response.email,
    name: response.name,
    studentId: response.student_id,
    phoneNumber: response.phone_number,
    gender: response.gender,
    house: response.house,
    nickname: response.nickname,
    isOidcUser: response.is_oidc_user,
    dateJoined: response.date_joined,
  };
}
