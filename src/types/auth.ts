// ============================================
// 사용자 정보
// ============================================

export interface User {
  uid: string;
  email: string;
  name: string;
  studentId?: string;
  phoneNumber?: string;
  birthYear?: number;
  gender?: 'M' | 'F';
  house?: string;
  isAgePublic?: boolean;
  isHousePublic?: boolean;
  isOidcUser?: boolean;
  dateJoined?: string;
}

// 백엔드 응답 원본 (snake_case)
export interface UserResponse {
  uid: string;
  email: string;
  name: string;
  student_id?: string;
  phone_number?: string;
  birth_year?: number;
  gender?: 'M' | 'F';
  house?: string;
  is_age_public?: boolean;
  is_house_public?: boolean;
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

export interface AgreeTermsResponse {
  success: true;
  message: string;
  user: {
    uid: string;
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
  birth_year?: number;
  gender?: 'M' | 'F';
  house?: string;
  is_age_public?: boolean;
  is_house_public?: boolean;
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
    uid: response.uid,
    email: response.email,
    name: response.name,
    studentId: response.student_id,
    phoneNumber: response.phone_number,
    birthYear: response.birth_year,
    gender: response.gender,
    house: response.house,
    isAgePublic: response.is_age_public,
    isHousePublic: response.is_house_public,
    isOidcUser: response.is_oidc_user,
    dateJoined: response.date_joined,
  };
}
