import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { submitBasicInfo } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { transformUserResponse } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, User, Smile, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RegisterBasicInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { registrationToken, setUser, clearRegistrationToken } = useAuthStore();

  const [gender, setGender] = useState<'M' | 'F' | null>(null);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!registrationToken) {
      // 토큰 없으면 로그인 페이지로
      navigate('/auth', { replace: true });
    }
  }, [registrationToken, navigate]);

  const isNicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 20;

  const handleSubmit = async () => {
    if (!gender) {
      toast({
        title: '성별 선택 필요',
        description: '성별을 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (!nickname.trim() || nickname.trim().length < 2) {
      toast({
        title: '닉네임 입력 필요',
        description: '닉네임은 2자 이상 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (!registrationToken) {
      navigate('/auth', { replace: true });
      return;
    }

    setLoading(true);
    try {
      const response = await submitBasicInfo(
        {
          gender,
          nickname: nickname.trim(),
        },
        registrationToken
      );

      if (response.success && response.user) {
        // 사용자 정보 변환 및 저장
        const user = transformUserResponse({
          user_id: response.user.user_id,
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
      } else if (err.response?.data?.redirect_to) {
        // 약관 동의 필요
        toast({
          title: '약관 동의 필요',
          description: '먼저 약관에 동의해주세요.',
          variant: 'destructive',
        });
        navigate('/register/agree', { replace: true });
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

  if (!registrationToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/register/agree')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">기본정보 입력</h1>
            <p className="text-muted-foreground text-sm">
              마지막 단계입니다
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 성별 선택 (필수) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <Label className="text-base font-semibold">
                성별 <span className="text-destructive">*</span>
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('M')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  gender === 'M'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">M</div>
                  <div className="text-sm text-muted-foreground">남성</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setGender('F')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  gender === 'F'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">F</div>
                  <div className="text-sm text-muted-foreground">여성</div>
                </div>
              </button>
            </div>
            {!gender && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                성별은 필수 입력 항목입니다
              </p>
            )}
          </div>

          {/* 닉네임 (필수) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-primary" />
              <Label htmlFor="nickname" className="text-base font-semibold">
                닉네임 <span className="text-destructive">*</span>
              </Label>
            </div>
            <Input
              id="nickname"
              type="text"
              placeholder="사용할 닉네임을 입력하세요 (2~20자)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="h-12"
              maxLength={20}
            />
            {!isNicknameValid && nickname.length > 0 && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                닉네임은 2자 이상 입력해주세요
              </p>
            )}
            {!nickname && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                닉네임은 필수 입력 항목입니다
              </p>
            )}
          </div>

          {/* 안내 메시지 */}
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p>
              이메일, 이름, 학번, 전화번호는 GIST 계정에서 자동으로 가져옵니다.
              수정이 필요하시면 GIST 계정 설정에서 변경해주세요.
            </p>
          </div>

          {/* 가입 버튼 */}
          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full"
            disabled={!gender || !isNicknameValid || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                처리 중...
              </>
            ) : (
              '가입 완료'
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterBasicInfo;
