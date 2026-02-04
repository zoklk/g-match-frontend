import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { cancelMatching } from '@/api/match';
import { useMatchStore } from '@/store/matchStore';
import { useToast } from '@/hooks/use-toast';
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

interface MatchWaitingProps {
  onRefresh: () => Promise<void>;
}

const MatchWaiting = ({ onRefresh }: MatchWaitingProps) => {
  const { toast } = useToast();
  const { setLoading } = useMatchStore();
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    setLoading(true);
    try {
      const res = await cancelMatching();
      if (res.success) {
        toast({
          title: '매칭이 취소되었습니다',
          description: '다시 매칭을 시작할 수 있습니다.',
        });
        await onRefresh();
      } else {
        toast({
          title: '취소 실패',
          description: res.message || '잠시 후 다시 시도해주세요.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: '오류 발생',
        description: '서버와 연결할 수 없습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(false);
      setLoading(false);
      setCancelDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[70vh]"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent mb-8"
          />

          <h2 className="text-2xl font-bold text-foreground mb-2">매칭 중...</h2>
          <p className="text-muted-foreground text-center mb-2">
            최적의 룸메이트를 찾고 있습니다
          </p>
          <p className="text-sm text-muted-foreground text-center mb-8">
            대기열에 등록되었습니다. 잠시만 기다려주세요.
          </p>

          <Button
            variant="outline"
            onClick={() => setCancelDialogOpen(true)}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <X className="w-4 h-4 mr-2" />
            )}
            매칭 취소
          </Button>
        </motion.div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>매칭을 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              대기열에서 나가게 됩니다. 다시 매칭을 시작할 수 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>계속 대기</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>취소하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MatchWaiting;
