import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, User } from 'lucide-react';
import { startMatching } from '@/api/match';
import { useMatchStore } from '@/store/matchStore';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';

interface MatchHomeProps {
  onRefresh: () => Promise<void>;
}

const MatchHome = ({ onRefresh }: MatchHomeProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setLoading } = useMatchStore();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    setLoading(true);
    try {
      const res = await startMatching();
      if (res.success) {
        await onRefresh();
      } else {
        toast({
          title: '매칭 시작 실패',
          description: res.message || '잠시 후 다시 시도해주세요.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: '매칭 시작 실패',
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    } finally {
      setIsStarting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[70vh]"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">매칭 준비 완료</h2>
          <p className="text-muted-foreground text-center mb-8">
            설문 결과를 바탕으로 최적의 룸메이트를 찾아드립니다
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            disabled={isStarting}
            className="w-40 h-40 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
          >
            <Play className="w-12 h-12 mb-2" />
            <span className="text-lg font-semibold">
              {isStarting ? '시작 중...' : '매칭 시작'}
            </span>
          </motion.button>

          <div className="mt-12 flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/match/profile')}
            >
              <User className="w-4 h-4 mr-2" />
              내 프로필 보기
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchHome;
