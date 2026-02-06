import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1alpha1';

// CSRF 설정
// Prod (S3 배포): VITE_CSRF_ENABLED=true → csrftoken 쿠키 → X-CSRFToken 헤더 자동 전송
// Dev (로컬):     미설정 → CSRF 비활성 (B/E도 CSRF_ENABLED=False)
const CSRF_ENABLED = import.meta.env.VITE_CSRF_ENABLED === 'true';

const csrfConfig = CSRF_ENABLED
  ? { xsrfCookieName: 'csrftoken', xsrfHeaderName: 'X-CSRFToken' }
  : {};

// 기본 API 클라이언트
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키(세션) 전송 필수
  ...csrfConfig,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 회원가입 전용 API 인스턴스 (X-Registration-Token 헤더 추가)
export const registrationApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  ...csrfConfig,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Registration Token 설정 함수
export const setRegistrationToken = (token: string) => {
  registrationApi.defaults.headers.common['X-Registration-Token'] = token;
};

// Registration Token 초기화
export const clearRegistrationToken = () => {
  delete registrationApi.defaults.headers.common['X-Registration-Token'];
};

// API Base URL 가져오기 (OIDC 리다이렉트용)
export const getApiBaseUrl = () => API_BASE_URL;

/**
 * Axios 에러에서 사용자에게 보여줄 메시지를 추출합니다.
 * - 서버 응답이 있으면: 서버가 보낸 message/error/detail 필드 사용
 * - 네트워크 에러(서버 무응답): "서버와 연결할 수 없습니다."
 * - 그 외: "알 수 없는 오류가 발생했습니다."
 */
export const getErrorMessage = (error: unknown, fallback?: string): string => {
  if (axios.isAxiosError(error)) {
    // 서버가 응답을 보낸 경우 (4xx, 5xx 등)
    const data = error.response?.data;
    if (data) {
      // Django REST 응답 형태에 따라 메시지 추출
      if (typeof data.message === 'string') return data.message;
      if (typeof data.error === 'string') return data.error;
      if (typeof data.detail === 'string') return data.detail;
      // non_field_errors 배열 (Django Form 에러)
      if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
        return data.non_field_errors[0];
      }
    }
    // 네트워크 에러 (서버 무응답, timeout 등)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return '서버와 연결할 수 없습니다.';
    }
    // 상태 코드 기반 기본 메시지
    const status = error.response?.status;
    if (status === 400) return fallback || '잘못된 요청입니다.';
    if (status === 403) return '권한이 없습니다.';
    if (status === 404) return '요청한 정보를 찾을 수 없습니다.';
    if (status === 409) return '요청이 충돌했습니다. 잠시 후 다시 시도해주세요.';
    if (status === 429) return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    if (status && status >= 500) return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
  return fallback || '알 수 없는 오류가 발생했습니다.';
};

// 에러 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;

    switch (status) {
      case 401:
        // 인증 필요 - 로그인 페이지로 리다이렉트
        if (errorData?.error === 'Authentication required') {
          // 현재 경로가 auth 관련이 아닐 때만 리다이렉트
          if (!window.location.pathname.startsWith('/auth') &&
              !window.location.pathname.startsWith('/register')) {
            window.location.href = '/auth';
          }
        }
        break;
      case 410:
        // Deprecated API 호출
        console.error('Deprecated API called:', errorData?.message);
        break;
    }

    return Promise.reject(error);
  }
);

// registrationApi도 동일한 인터셉터 적용
registrationApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;

    if (status === 401 && errorData?.login_url) {
      // 세션 만료 - 다시 로그인 필요
      console.error('Registration session expired');
    }

    return Promise.reject(error);
  }
);
