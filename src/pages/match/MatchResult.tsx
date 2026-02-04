import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMatchResult, agreeMatch, rejectMatch } from '@/api/match';
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

interface MatchResultProps {
  onRefresh: () => Promise<void>;
}

const categoryNameMap: Record<string, string> = {
  time: '생활 리듬',
  clean: '공간 관리',
  habit: '생활 습관',
  social: '사회성',
};

const MatchResult = ({ onRefresh }: MatchResultProps) => {
  const { toast } = useToast();
  const { setMatchResult, setLoading } = useMatchStore();
  const [isLoadingResult, setIsLoadingResult] = useState(true);
  const [partnerProperty, setPartnerProperty] = useState<ProfileProperty | null>(null);
  const [partnerSurvey, setPartnerSurvey] = useState<ProfileSurvey | null>(null);
  const [compatibilityScore, setCompatibilityScore] = useState<Record<string, number> | null>(null);
  const [isActing, setIsActing] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

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
        toast({
          title: '결과 로딩 실패',
          description: '매칭 결과를 불러올 수 없습니다.',
          variant: 'destructive',
        });
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

  const handleAgree = async () => {
    setIsActing(true);
    setLoading(true);
    try {
      const res = await agreeMatch();
      if (res.success) {
        toast({ title: '수락 완료', description: '상대방의 응답을 기다리고 있습니다.' });
        await onRefresh();
      } else {
        toast({
          title: '수락 실패',
          description: res.message || '잠시 후 다시 시도해주세요.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: '오류 발생', description: '서버와 연결할 수 없습니다.', variant: 'destructive' });
    } finally {
      setIsActing(false);
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setIsActing(true);
    setLoading(true);
    try {
      const res = await rejectMatch();
      if (res.success) {
        toast({ title: '거절 완료', description: '매칭이 취소되었습니다.' });
        await onRefresh();
      } else {
        toast({
          title: '거절 실패',
          description: res.message || '잠시 후 다시 시도해주세요.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: '오류 발생', description: '서버와 연결할 수 없습니다.', variant: 'destructive' });
    } finally {
      setIsActing(false);
      setLoading(false);
      setRejectDialogOpen(false);
    }
  };

  const getDormLabel = (building: string) => `${building}동`;

  const getPeriodLabel = (period: number) => {
    if (period === 1) return '1학기';
    if (period === 2) return '1년';
    return `${period}학기`;
  };

  if (isLoadingResult) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">매칭 결과 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!partnerProperty) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-muted-foreground">매칭 결과를 찾을 수 없습니다.</p>
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
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">매칭 결과</h2>
            <p className="text-muted-foreground">최적의 룸메이트 후보를 찾았습니다!</p>
          </div>

          {/* Partner Card */}
          <div className="bg-card rounded-md p-6 shadow-md">
            {/* Avatar and Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{partnerProperty.nickname}</h3>
                <p className="text-muted-foreground text-sm">
                  {partnerProperty.student_id}학번 · {getDormLabel(partnerProperty.dorm_building)} · {getPeriodLabel(partnerProperty.stay_period)}
                </p>
                <div className={cn(
                  'text-2xl font-bold font-mono mt-1',
                  overallScore >= 80 ? 'text-primary' :
                  overallScore >= 60 ? 'text-yellow-500' :
                  'text-muted-foreground'
                )}>
                  {overallScore.toFixed(1)}% 유사도
                </div>
              </div>
            </div>

            {/* Badges */}
            {partnerSurvey?.badges && (
              <div className="flex gap-2 flex-wrap mb-6">
                {Object.values(partnerSurvey.badges).map((badge, i) => (
                  <Badge key={i} variant={i === 0 ? 'default' : 'outline'}>
                    {badge}
                  </Badge>
                ))}
              </div>
            )}

            {/* Radar Chart */}
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
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Category Bars */}
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
                            className={cn(
                              'h-full rounded-full',
                              cat.id === 'time' && 'bg-chart-1',
                              cat.id === 'clean' && 'bg-chart-2',
                              cat.id === 'habit' && 'bg-chart-3',
                              cat.id === 'social' && 'bg-chart-4'
                            )}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{cat.leftAxis}</span>
                          <span>{cat.rightAxis}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Property Info */}
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground mb-3">기본 조건</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">흡연</div>
                <div className="text-foreground">{partnerProperty.is_smoker ? 'O' : 'X'}</div>
                <div className="text-muted-foreground">냉장고</div>
                <div className="text-foreground">{partnerProperty.has_fridge ? '보유' : '미보유'}</div>
                <div className="text-muted-foreground">공유기</div>
                <div className="text-foreground">{partnerProperty.has_router ? '보유' : '미보유'}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setRejectDialogOpen(true)}
              disabled={isActing}
            >
              <X className="w-4 h-4 mr-2" />
              거절
            </Button>
            <Button
              className="flex-1"
              onClick={handleAgree}
              disabled={isActing}
            >
              {isActing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              수락
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>매칭을 거절하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              거절하면 초기 상태로 돌아갑니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject}>거절하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MatchResult;
