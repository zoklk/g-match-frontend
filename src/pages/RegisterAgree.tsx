import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTerms, agreeTerms } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { transformUserResponse } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Loader2, FileText, Shield, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TermsData {
  terms_of_service: {
    title: string;
    content: string;
  };
  privacy_policy: {
    title: string;
    content: string;
  };
}

const RegisterAgree = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setUser, registrationToken, clearRegistrationToken } = useAuthStore();

  const [terms, setTerms] = useState<TermsData | null>(null);
  const [agreed, setAgreed] = useState({
    termsOfService: false,
    privacyPolicy: false,
  });
  const [loading, setLoading] = useState(false);
  const [termsLoading, setTermsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // location.state 또는 store에서 token 가져오기
  const token = location.state?.registrationToken || registrationToken;

  useEffect(() => {
    if (!token) {
      // 토큰 없으면 로그인 페이지로
      navigate('/auth', { replace: true });
      return;
    }

    // 약관 내용 조회
    fetchTerms();
  }, [token, navigate]);

  const fetchTerms = async () => {
    setTermsLoading(true);
    try {
      const data = await getTerms();
      setTerms(data);
    } catch (err) {
      console.error('Failed to fetch terms:', err);
      setError('약관을 불러오는데 실패했습니다.');
    } finally {
      setTermsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!agreed.termsOfService || !agreed.privacyPolicy) {
      toast({
        title: '약관 동의 필요',
        description: '모든 약관에 동의해야 합니다.',
        variant: 'destructive',
      });
      return;
    }

    if (!token) {
      navigate('/auth', { replace: true });
      return;
    }

    setLoading(true);
    try {
      const response = await agreeTerms(
        agreed.termsOfService,
        agreed.privacyPolicy,
        token
      );

      if (response.success && response.user) {
        // 사용자 정보 변환 및 저장
        const user = transformUserResponse({
          uid: response.user.uid,
          email: response.user.email,
          name: response.user.name,
          student_id: response.user.student_id,
        });
        setUser(user);
        clearRegistrationToken();

        toast({
          title: '회원가입 완료',
          description: 'G-Match에 오신 것을 환영합니다!',
        });

        navigate('/', { replace: true });
      }
    } catch (err: any) {
      console.error('Registration failed:', err);

      if (err.response?.data?.login_url) {
        // 세션 만료 → 다시 로그인
        toast({
          title: '세션 만료',
          description: '세션이 만료되었습니다. 다시 로그인해주세요.',
          variant: 'destructive',
        });
        clearRegistrationToken();
        navigate('/auth', { replace: true });
      } else {
        toast({
          title: '오류',
          description: err.response?.data?.message || '회원가입 처리 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAllAgree = (checked: boolean) => {
    setAgreed({
      termsOfService: checked,
      privacyPolicy: checked,
    });
  };

  const allAgreed = agreed.termsOfService && agreed.privacyPolicy;

  if (termsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">약관을 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-foreground mb-2">오류</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/auth')} size="lg">
            로그인 페이지로
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">약관 동의</h1>
            <p className="text-muted-foreground text-sm">
              서비스 이용을 위해 약관에 동의해주세요
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 전체 동의 */}
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="all-agree"
                checked={allAgreed}
                onCheckedChange={handleAllAgree}
              />
              <label
                htmlFor="all-agree"
                className="text-base font-semibold text-foreground cursor-pointer"
              >
                전체 동의
              </label>
            </div>
          </div>

          {/* 서비스 이용약관 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {terms?.terms_of_service.title || '서비스 이용약관'}
                  </h3>
                  <p className="text-sm text-muted-foreground">필수</p>
                </div>
                <Checkbox
                  id="terms"
                  checked={agreed.termsOfService}
                  onCheckedChange={(checked) =>
                    setAgreed((prev) => ({ ...prev, termsOfService: checked as boolean }))
                  }
                />
              </div>
            </div>
            <ScrollArea className="h-48 p-4">
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {terms?.terms_of_service.content || '약관 내용을 불러오는 중...'}
              </div>
            </ScrollArea>
          </div>

          {/* 개인정보 처리방침 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {terms?.privacy_policy.title || '개인정보 처리방침'}
                  </h3>
                  <p className="text-sm text-muted-foreground">필수</p>
                </div>
                <Checkbox
                  id="privacy"
                  checked={agreed.privacyPolicy}
                  onCheckedChange={(checked) =>
                    setAgreed((prev) => ({ ...prev, privacyPolicy: checked as boolean }))
                  }
                />
              </div>
            </div>
            <ScrollArea className="h-48 p-4">
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {terms?.privacy_policy.content || '약관 내용을 불러오는 중...'}
              </div>
            </ScrollArea>
          </div>

          {/* 동의 버튼 */}
          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full"
            disabled={!allAgreed || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                처리 중...
              </>
            ) : (
              '동의하고 가입하기'
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterAgree;
