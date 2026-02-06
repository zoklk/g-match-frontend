import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, User, Loader2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getContact, rematch as rematchApi } from '@/api/match';
import { useMatchStore } from '@/store/matchStore';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface MatchContactProps {
  onRefresh: () => Promise<void>;
}

const MatchContact = ({ onRefresh }: MatchContactProps) => {
  const { toast } = useToast();
  const { setContact, setLoading } = useMatchStore();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [contactInfo, setContactInfo] = useState<{ name: string; phone: string; gender: string; student_id: number } | null>(null);
  const [isRematching, setIsRematching] = useState(false);
  const [rematchDialogOpen, setRematchDialogOpen] = useState(false);

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
    } catch (err) {
      toast({ title: '오류 발생', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setIsRematching(false);
      setLoading(false);
      setRematchDialogOpen(false);
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Success Banner */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-10 h-10 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">매칭 완료!</h2>
            <p className="text-muted-foreground">양측 모두 수락하여 매칭이 성사되었습니다</p>
          </div>

          {/* Contact Card */}
          {contactInfo && (
            <div className="bg-card rounded-md p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
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
            variant="outline"
            className="w-full"
            onClick={() => setRematchDialogOpen(true)}
            disabled={isRematching}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            재매칭하기
          </Button>
        </motion.div>
      </div>

      {/* Rematch Confirmation Dialog */}
      <AlertDialog open={rematchDialogOpen} onOpenChange={setRematchDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>재매칭 하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              현재 매칭을 취소하고 새로운 룸메이트를 다시 매칭합니다.
              상대방에게 재매칭 알림이 전달됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleRematch}>재매칭하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MatchContact;
