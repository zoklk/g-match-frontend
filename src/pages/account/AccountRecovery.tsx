import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, XCircle, AlertTriangle } from 'lucide-react';
import { getRecoveryInfo, recoverAccount, getUserInfo } from '@/api/auth';
import { RecoveryInfoResponse, transformUserResponse } from '@/types/auth';
import { getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AccountRecovery = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [recoveryInfo, setRecoveryInfo] = useState<RecoveryInfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const redirectAfter = searchParams.get('redirect_after');
  const recoveryToken = searchParams.get('recovery_token');

  useEffect(() => {
    const load = async () => {
      try {
        // 복구 토큰을 사용하여 복구 정보 조회
        const res = await getRecoveryInfo(recoveryToken || undefined);
        if (res.success) {
          setRecoveryInfo(res);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [recoveryToken]);

  const handleRecover = async () => {
    setIsRecovering(true);
    try {
      // 복구 토큰을 사용하여 복구 요청
      const res = await recoverAccount({ confirm_recovery: true }, recoveryToken || undefined);
      if (res.success) {
        // 기존 로그인 플로우와 동일하게 사용자 정보 조회 후 store에 저장
        const userInfoRes = await getUserInfo();
        if (userInfoRes.success && userInfoRes.user) {
          const user = transformUserResponse(userInfoRes.user);
          setUser(user);
        }

        toast({
          title: '계정이 복구되었습니다',
          description: '다시 돌아오신 것을 환영합니다!',
        });

        // 기존 로그인 플로우와 동일하게 /match/profile로 이동
        // redirectAfter가 전체 URL인 경우 pathname만 추출
        let targetPath = '/match/profile';
        if (redirectAfter) {
          try {
            const url = new URL(redirectAfter, window.location.origin);
            // 같은 origin인 경우에만 pathname 사용
            if (url.origin === window.location.origin) {
              targetPath = url.pathname + url.search;
            }
          } catch {
            // URL 파싱 실패 시 상대 경로로 가정
            if (redirectAfter.startsWith('/')) {
              targetPath = redirectAfter;
            }
          }
        }
        navigate(targetPath, { replace: true });
      }
    } catch (err) {
      toast({
        title: '계정 복구 실패',
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const handleCancel = () => {
    toast({
      title: '계정 복구가 취소되었습니다',
    });
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-destructive">복구 불가</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/')}>
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!recoveryInfo) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>복구 정보를 찾을 수 없습니다</CardTitle>
            <CardDescription>다시 로그인을 시도해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/')}>
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>계정 복구</CardTitle>
            <CardDescription>
              이전에 탈퇴한 계정이 발견되었습니다
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 사용자 정보 */}
            <div className="bg-muted/50 rounded-md p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">이메일</span>
                <span className="font-medium">{recoveryInfo.user_email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">이름</span>
                <span className="font-medium">{recoveryInfo.user_name}</span>
              </div>
              {recoveryInfo.deactivated_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">탈퇴일</span>
                  <span className="font-medium">
                    {new Date(recoveryInfo.deactivated_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              )}
            </div>

            {/* 경고 메시지 */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-400">
                  복구 가능 기간: {recoveryInfo.remaining_days}일 남음
                </p>
                <p className="text-amber-700 dark:text-amber-500 mt-1">
                  {recoveryInfo.recovery_info}
                </p>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleRecover}
                disabled={isRecovering}
                className="w-full"
              >
                {isRecovering ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    복구 중...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    계정 복구하기
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isRecovering}
                className="w-full"
              >
                취소
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              복구하지 않으면 {recoveryInfo.remaining_days}일 후 모든 데이터가 영구 삭제됩니다.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AccountRecovery;
