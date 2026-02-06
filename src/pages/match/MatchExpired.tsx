import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Clock, Loader2, RotateCcw } from 'lucide-react';
import { rematch as rematchApi } from '@/api/match';
import { useMatchStore } from '@/store/matchStore';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';

interface MatchExpiredProps {
  onRefresh: () => Promise<void>;
}

const MatchExpired = ({ onRefresh }: MatchExpiredProps) => {
  const { toast } = useToast();
  const { setLoading } = useMatchStore();
  const [isRematching, setIsRematching] = useState(false);

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
    }
  };

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[70vh]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6"
          >
            <Clock className="w-10 h-10 text-amber-500" />
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-2">매칭 시간이 만료되었습니다</h2>
          <p className="text-muted-foreground text-center mb-2">
            24시간 내에 적합한 룸메이트를 찾지 못했습니다.
          </p>
          <p className="text-muted-foreground text-center mb-8">
            재매칭을 통해 다시 시도해보세요!
          </p>

          <Button
            className="w-full max-w-xs"
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

export default MatchExpired;
