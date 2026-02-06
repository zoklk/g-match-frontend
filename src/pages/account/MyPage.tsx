import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, User, Mail, Phone, GraduationCap, UserCircle, AlertTriangle } from 'lucide-react';
import { getUserInfo, withdraw } from '@/api/auth';
import { UserResponse } from '@/types/auth';
import { getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 회원탈퇴 모달 상태
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawConfirmation, setWithdrawConfirmation] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getUserInfo();
        if (res.success) {
          setUserInfo(res.user);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const getGenderLabel = (gender?: string) => {
    if (gender === 'M') return '남성';
    if (gender === 'F') return '여성';
    return '-';
  };

  const handleWithdraw = async () => {
    if (withdrawConfirmation !== '회원탈퇴') {
      toast({
        title: '확인 문구가 올바르지 않습니다',
        description: '"회원탈퇴"를 정확히 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await withdraw({ confirmation: withdrawConfirmation });
      if (res.success) {
        toast({
          title: '회원탈퇴가 완료되었습니다',
          description: '30일 이내에 다시 로그인하면 계정을 복구할 수 있습니다.',
        });
        logout();
        navigate('/');
      }
    } catch (err) {
      toast({
        title: '회원탈퇴 실패',
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleCloseModal = () => {
    setIsWithdrawModalOpen(false);
    setWithdrawConfirmation('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-destructive">{error || '사용자 정보를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  const infoItems = [
    { label: '이름', value: userInfo.name, icon: User },
    { label: '닉네임', value: userInfo.nickname || '-', icon: UserCircle },
    { label: '성별', value: getGenderLabel(userInfo.gender), icon: User },
    { label: '학번', value: userInfo.student_id || '-', icon: GraduationCap },
    { label: '이메일', value: userInfo.email, icon: Mail },
    { label: '전화번호', value: userInfo.phone_number || '-', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">마이 페이지</h2>
            <p className="text-muted-foreground">내 계정 정보를 확인할 수 있습니다</p>
          </div>

          {/* Profile Card */}
          <div className="bg-card rounded-md p-6 shadow-md">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{userInfo.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {userInfo.nickname ? `@${userInfo.nickname}` : ''}
                </p>
              </div>
            </div>

            {/* Info List */}
            <div className="space-y-4">
              {infoItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 회원탈퇴 섹션 */}
          <div className="mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setIsWithdrawModalOpen(true)}
            >
              회원탈퇴
            </Button>
          </div>
        </motion.div>
      </div>

      {/* 회원탈퇴 확인 모달 */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              회원탈퇴
            </DialogTitle>
            <DialogDescription className="text-left space-y-3 pt-2">
              <p>회원탈퇴 시 다음 데이터가 삭제됩니다:</p>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>계정 정보 (이메일, 이름, 학번 등)</li>
                <li>매칭 프로필 정보</li>
                <li>설문 응답 데이터</li>
                <li>매칭 이력</li>
              </ul>
              <div className="bg-muted/50 rounded-md p-3 text-sm">
                <p className="font-medium text-foreground">복구 안내</p>
                <p className="text-muted-foreground mt-1">
                  탈퇴 후 30일 이내에 다시 로그인하면 계정을 복구할 수 있습니다.
                  30일이 지나면 모든 데이터가 영구 삭제됩니다.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                탈퇴를 진행하려면 아래에 <span className="font-bold text-foreground">"회원탈퇴"</span>를 입력하세요.
              </p>
              <Input
                placeholder="회원탈퇴"
                value={withdrawConfirmation}
                onChange={(e) => setWithdrawConfirmation(e.target.value)}
                className="text-center"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCloseModal} className="w-full sm:w-auto">
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleWithdraw}
              disabled={withdrawConfirmation !== '회원탈퇴' || isWithdrawing}
              className="w-full sm:w-auto"
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  처리 중...
                </>
              ) : (
                '회원탈퇴'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPage;
