import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogIn } from 'lucide-react';
import { loginWithGIST } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, checkAuth } = useAuthStore();

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    const check = async () => {
      if (isLoggedIn) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
        return;
      }

      // 서버에서 세션 확인
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    };

    check();
  }, [isLoggedIn, navigate, location.state, checkAuth]);

  const handleLogin = () => {
    // Callback URL 설정
    const callbackUrl = `${window.location.origin}/auth/callback`;
    loginWithGIST(callbackUrl);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:flex-1 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark" />
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6">
              <img src="/logo.png" alt="G-Match" className="h-16 w-auto brightness-0 invert" />
            </div>
            <p className="text-xl text-primary-foreground/80 mb-8">
              완벽한 룸메이트를 찾는<br />가장 스마트한 방법
            </p>

            <div className="space-y-4">
              {[
                '24개 문항 기반 정밀 분석',
                '가중치 커스터마이징',
                'GIST 기숙사 특화 매칭',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-primary-foreground/90">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Logo for mobile */}
            <div className="lg:hidden flex justify-center mb-4">
              <img src="/logo.png" alt="G-Match" className="h-12 w-auto" />
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-foreground">
                G-Match 시작하기
              </h2>
              <p className="text-muted-foreground mt-2">
                GIST 계정으로 로그인하여 완벽한 룸메이트를 찾아보세요
              </p>
            </div>

            {/* GIST IdP Login Button */}
            <div className="space-y-4">
              <Button
                onClick={handleLogin}
                size="lg"
                className="w-full h-14 text-base"
              >
                <LogIn className="w-5 h-5 mr-2" />
                GIST 계정으로 로그인
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                GIST IdP를 통해 안전하게 로그인합니다.<br />
                처음 로그인하시는 경우 자동으로 회원가입됩니다.
              </p>
            </div>

            {/* Features */}
            <div className="pt-8 border-t border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                G-Match 특징
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🎯', text: '정밀 매칭' },
                  { icon: '🔒', text: '안전한 인증' },
                  { icon: '⚡', text: '빠른 설문' },
                  { icon: '🤝', text: '상호 동의' },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span>{feature.icon}</span>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
