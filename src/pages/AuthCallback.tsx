import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { UserResponse, transformUserResponse } from '@/types/auth';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setRegistrationToken } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    // URL 파라미터에서 상태 확인
    const isNewUser = searchParams.get('is_new_user') === 'true';
    const registrationToken = searchParams.get('registration_token');
    const errorMsg = searchParams.get('error');

    if (errorMsg) {
      setError(decodeURIComponent(errorMsg));
      return;
    }

    if (isNewUser && registrationToken) {
      // 신규 사용자 → 약관 동의 페이지로 이동
      setRegistrationToken(registrationToken);
      navigate('/register/agree', {
        state: { registrationToken },
        replace: true,
      });
    } else {
      // 기존 사용자 → 사용자 정보 조회 후 메인 페이지로 이동
      await fetchUserInfo();
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await api.get<{ success: boolean; user: UserResponse }>('/account/info');
      if (response.data.success && response.data.user) {
        const user = transformUserResponse(response.data.user);
        setUser(user);
        navigate('/match/profile', { replace: true });
      } else {
        setError('로그인 처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      setError('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleRetry = () => {
    navigate('/auth', { replace: true });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">로그인 오류</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={handleRetry} size="lg">
            다시 시도
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="G-Match" className="h-16 w-auto" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">로그인 처리 중...</p>
      </motion.div>
    </div>
  );
};

export default AuthCallback;
