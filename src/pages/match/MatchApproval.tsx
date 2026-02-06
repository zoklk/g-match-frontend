import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, User, Loader2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMatchResult, cancelMatching } from '@/api/match';
import { useMatchStore } from '@/store/matchStore';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';
import { ProfileProperty, ProfileSurvey } from '@/types/match';
import { surveyCategories } from '@/data/surveyQuestions';
import { ProfileSlider } from '@/components/ProfileSlider';
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

interface MatchApprovalProps {
  onRefresh: () => Promise<void>;
}

const categoryNameMap: Record<string, string> = {
  time: '생활 리듬',
  clean: '공간 관리',
  habit: '생활 습관',
  social: '사회성',
};

const categoryColors: Record<string, string> = {
  time: 'bg-chart-1',
  clean: 'bg-chart-2',
  habit: 'bg-chart-3',
  social: 'bg-chart-4',
};

const MatchApproval = ({ onRefresh }: MatchApprovalProps) => {
  const { toast } = useToast();
  const { setMatchResult, setLoading } = useMatchStore();
  const [isLoadingResult, setIsLoadingResult] = useState(true);
  const [partnerProperty, setPartnerProperty] = useState<ProfileProperty | null>(null);
  const [partnerSurvey, setPartnerSurvey] = useState<ProfileSurvey | null>(null);
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

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
        // 결과 로딩 실패 시 기본 상태 유지
      } finally {
        setIsLoadingResult(false);
      }
    };
    loadResult();
  }, []);

  const getDormLabel = (building: string) => `${building}동`;

  const getGenderLabel = (gender: string) => {
    return gender === 'M' ? '남성' : '여성';
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    setLoading(true);
    try {
      const res = await cancelMatching();
      if (res.success) {
        toast({ title: '수락 취소', description: '매칭이 취소되었습니다.' });
        await onRefresh();
      } else {
        toast({
          title: '취소 실패',
          description: res.message || '잠시 후 다시 시도해주세요.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({ title: '오류 발생', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setIsCancelling(false);
      setLoading(false);
      setCancelDialogOpen(false);
    }
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

  const overallScore = typeof compatibilityScore === 'number' ? compatibilityScore : 0;

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Waiting Banner */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Clock className="w-8 h-8 text-yellow-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">상대방 응답 대기 중</h2>
            <p className="text-muted-foreground">
              수락하셨습니다! 상대방의 응답을 기다리고 있습니다.
            </p>
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
                  {getGenderLabel(partnerProperty.gender)} · {partnerProperty.student_id}학번 · {getDormLabel(partnerProperty.dorm_building)}
                </p>
                <div className={cn(
                  'text-2xl font-bold font-mono mt-1',
                  overallScore >= 90 ? 'text-primary' :
                  overallScore >= 70 ? 'text-yellow-500' :
                  'text-muted-foreground'
                )}>
                  {overallScore.toFixed(2)}점
                </div>
              </div>
            </div>

            {/* Badges */}
            {partnerSurvey?.badges && Object.keys(partnerSurvey.badges).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className="flex gap-2 flex-wrap">
                  {Object.values(partnerSurvey.badges).map((badge, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-sm px-4 py-1.5 border-primary/50 text-primary"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MBTI Style Sliders */}
            {partnerSurvey?.scores && (
              <div className="space-y-5">
                {surveyCategories
                  .filter((cat) => cat.id !== 'etc')
                  .map((cat) => {
                    const score = partnerSurvey.scores[categoryNameMap[cat.id]] ?? 3;

                    return (
                      <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProfileSlider
                          leftLabel={cat.leftAxis}
                          rightLabel={cat.rightAxis}
                          categoryName={cat.name}
                          value={score}
                          color={categoryColors[cat.id]}
                        />
                      </motion.div>
                    );
                  })}
              </div>
            )}

            {/* Property Info */}
            {partnerProperty && (
              <div className="mt-8 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-4">기본 정보</h4>
                <div className="space-y-3">
                  {/* 희망 거주기간 */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-16">거주기간</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((period) => (
                        <div
                          key={period}
                          className={cn(
                            "px-3 py-2 rounded-md text-sm font-medium border-2 transition-colors",
                            partnerProperty.stay_period === period
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-muted-foreground"
                          )}
                        >
                          {period === 4 ? '4학기+' : `${period}학기`}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 흡연 */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-16">흡연</span>
                    <div className="flex gap-2">
                      <div
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium border-2 transition-colors",
                          partnerProperty.is_smoker
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        O
                      </div>
                      <div
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium border-2 transition-colors",
                          !partnerProperty.is_smoker
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        X
                      </div>
                    </div>
                  </div>

                  {/* 냉장고 */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-16">냉장고</span>
                    <div className="flex gap-2">
                      <div
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium border-2 transition-colors",
                          partnerProperty.has_fridge
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        O
                      </div>
                      <div
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium border-2 transition-colors",
                          !partnerProperty.has_fridge
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        X
                      </div>
                    </div>
                  </div>

                  {/* 공유기 */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-16">공유기</span>
                    <div className="flex gap-2">
                      <div
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium border-2 transition-colors",
                          partnerProperty.has_router
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        O
                      </div>
                      <div
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium border-2 transition-colors",
                          !partnerProperty.has_router
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        X
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cancel Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setCancelDialogOpen(true)}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <X className="w-4 h-4 mr-2" />
            )}
            수락 취소하기
          </Button>
        </motion.div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>수락을 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              수락을 취소하면 매칭이 취소되고 초기 상태로 돌아갑니다.
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

export default MatchApproval;
