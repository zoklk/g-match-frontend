import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User, Loader2, RotateCcw, UserX } from 'lucide-react';
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
  const [contactInfo, setContactInfo] = useState<{ name: string; phone: string; gender: string; student_id: number } | null>(null);
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
        toast({
          title: '데이터 로딩 실패',
          description: '연락처 정보를 불러올 수 없습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  const getGenderLabel = (gender: string) => {
    return gender === 'M' ? '남성' : '여성';
  };

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

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">연락처 정보를 불러오는 중...</p>
        </div>
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
              아쉽지만 상대방이 매칭을 취소했습니다. 재매칭을 시도해보세요!
            </p>
          </div>

          {/* Contact Card (still visible) */}
          {contactInfo && (
            <div className="bg-card rounded-md p-6 shadow-md opacity-75">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{contactInfo.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {getGenderLabel(contactInfo.gender)} · {contactInfo.student_id}학번
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">연락처 정보</h4>
                <p className="text-foreground text-2xl font-semibold">{contactInfo.phone}</p>
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
