import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User, Loader2, RotateCcw, UserX, Copy } from 'lucide-react';
import { getContact, rematch as rematchApi } from '@/api/match';
import { useMatchStore } from '@/store/matchStore';
import { useToast } from '@/hooks/use-toast';

interface MatchContactFailedProps {
  onRefresh: () => Promise<void>;
}

const MatchContactFailed = ({ onRefresh }: MatchContactFailedProps) => {
  const { toast } = useToast();
  const { setContact, setLoading } = useMatchStore();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [contactInfo, setContactInfo] = useState<{ user_id: string; nickname: string } | null>(null);
  const [isRematching, setIsRematching] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const contactRes = await getContact();
        if (contactRes.success && contactRes.partner) {
          setContact(contactRes);
          setContactInfo(contactRes.partner);
        }
      } catch {
        // 연락처 로딩 실패
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleRematch = async () => {
    setIsRematching(true);
    setLoading(true);
    try {
      const res = await rematchApi();
      if (res.success) {
        toast({ title: '재매칭 요청 완료', description: '새로운 룸메이트를 찾습니다.' });
        await onRefresh();
      } else {
        toast({
          title: '재매칭 실패',
          description: res.message || '잠시 후 다시 시도해주세요.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: '오류 발생', description: '서버와 연결할 수 없습니다.', variant: 'destructive' });
    } finally {
      setIsRematching(false);
      setLoading(false);
    }
  };

  const handleCopyContact = () => {
    if (contactInfo?.user_id) {
      navigator.clipboard.writeText(contactInfo.user_id);
      toast({ title: '복사 완료', description: '연락처가 클립보드에 복사되었습니다.' });
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Failed Banner */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <UserX className="w-10 h-10 text-orange-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">상대방이 재매칭했습니다</h2>
            <p className="text-muted-foreground">
              상대방이 재매칭을 요청했습니다. 아래에 기존 연락처가 남아있습니다.
            </p>
          </div>

          {/* Contact Info (still visible) */}
          {contactInfo && (
            <div className="bg-card rounded-md p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{contactInfo.nickname}</h3>
                  <p className="text-sm text-muted-foreground">이전 매칭 상대</p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-md p-4">
                <h4 className="font-semibold text-foreground mb-2">연락처 정보</h4>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{contactInfo.user_id}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyContact}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Rematch Button */}
          <Button
            className="w-full"
            onClick={handleRematch}
            disabled={isRematching}
          >
            {isRematching ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4 mr-2" />
            )}
            재매칭하기
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchContactFailed;
