import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Loader2, RotateCcw, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMatchResult, rematch as rematchApi } from '@/api/match';
import { useMatchStore } from '@/store/matchStore';
import { useToast } from '@/hooks/use-toast';
import { ProfileProperty, ProfileSurvey } from '@/types/match';
import { surveyCategories } from '@/data/surveyQuestions';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface MatchResultFailedProps {
  onRefresh: () => Promise<void>;
}

const categoryNameMap: Record<string, string> = {
  time: '생활 리듬',
  clean: '공간 관리',
  habit: '생활 습관',
  social: '사회성',
};

const MatchResultFailed = ({ onRefresh }: MatchResultFailedProps) => {
  const { toast } = useToast();
  const { setMatchResult, setLoading } = useMatchStore();
  const [isLoadingResult, setIsLoadingResult] = useState(true);
  const [partnerProperty, setPartnerProperty] = useState<ProfileProperty | null>(null);
  const [partnerSurvey, setPartnerSurvey] = useState<ProfileSurvey | null>(null);
  const [compatibilityScore, setCompatibilityScore] = useState<Record<string, number> | null>(null);
  const [isRematching, setIsRematching] = useState(false);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const res = await getMatchResult();
        if (res.success) {
          setMatchResult(res);
          setPartnerProperty(res.partner.property);
          setPartnerSurvey(res.partner.survey);
          setCompatibilityScore(res.compatibility_score);
        }
      } catch {
        // 결과 로딩 실패
      } finally {
        setIsLoadingResult(false);
      }
    };
    loadResult();
  }, []);

  const getRadarData = () => {
    if (!partnerSurvey?.scores) return [];
    return surveyCategories
      .filter((cat) => cat.id !== 'etc')
      .map((cat) => ({
        category: cat.name,
        value: partnerSurvey.scores[categoryNameMap[cat.id]] ?? 0,
        fullMark: 5,
      }));
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

  if (isLoadingResult) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const overallScore = compatibilityScore?.overall ?? 0;

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
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <XCircle className="w-10 h-10 text-red-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">상대방이 거절했습니다</h2>
            <p className="text-muted-foreground">
              아쉽지만 상대방이 매칭을 거절했습니다. 재매칭을 시도해보세요!
            </p>
          </div>

          {/* Partner Profile (who rejected) */}
          {partnerProperty && (
            <div className="bg-card rounded-md p-6 shadow-md opacity-75">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{partnerProperty.nickname}</h3>
                  <div className={cn(
                    'text-xl font-bold font-mono mt-1 text-muted-foreground'
                  )}>
                    {overallScore.toFixed(1)}% 유사도
                  </div>
                </div>
              </div>

              {partnerSurvey?.badges && (
                <div className="flex gap-2 flex-wrap mb-6">
                  {Object.values(partnerSurvey.badges).map((badge, i) => (
                    <Badge key={i} variant="outline">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {partnerSurvey?.scores && (
                <div className="h-56 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={getRadarData()}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="category"
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 5]}
                        tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Radar
                        name="유사도"
                        dataKey="value"
                        stroke="hsl(var(--muted-foreground))"
                        fill="hsl(var(--muted-foreground))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {partnerSurvey?.scores && (
                <div className="space-y-3">
                  {surveyCategories
                    .filter((cat) => cat.id !== 'etc')
                    .map((cat) => {
                      const score = partnerSurvey.scores[categoryNameMap[cat.id]] ?? 0;
                      const percentage = (score / 5) * 100;
                      return (
                        <div key={cat.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{cat.icon}</span>
                              <span className="text-sm font-medium text-foreground">{cat.name}</span>
                            </div>
                            <span className="text-sm font-mono font-semibold text-muted-foreground">
                              {score.toFixed(1)}
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="h-full rounded-full bg-muted-foreground/30"
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
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

export default MatchResultFailed;
