import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoading, checkAuth } = useAuthStore();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verify = async () => {
      // 항상 서버에서 인증 상태를 확인
      // (localStorage의 isLoggedIn만 믿지 않고, B/E 세션 유효성을 검증)
      const result = await checkAuth();
      setIsValid(result);
      setChecking(false);
    };

    verify();
  }, [checkAuth]);

  // 인증 확인 중
  if (checking || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">로그인 확인 중...</p>
        </div>
      </div>
    );
  }

  // 비로그인 상태 - 로그인 페이지로 리다이렉트
  if (!isValid) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
