import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, User, Loader2, RotateCcw, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMatchResult, getContact, rematch as rematchApi } from '@/api/match';
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

interface MatchContactProps {
  onRefresh: () => Promise<void>;
}

const categoryNameMap: Record<string, string> = {
  time: '생활 리듬',
  clean: '공간 관리',
  habit: '생활 습관',
  social: '사회성',
};

const MatchContact = ({ onRefresh }: MatchContactProps) => {
  const { toast } = useToast();
  const { setMatchResult, setContact, setLoading } = useMatchStore();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [partnerProperty, setPartnerProperty] = useState<ProfileProperty | null>(null);
  const [partnerSurvey, setPartnerSurvey] = useState<ProfileSurvey | null>(null);
  const [compatibilityScore, setCompatibilityScore] = useState<Record<string, number> | null>(null);
  const [contactInfo, setContactInfo] = useState<{ user_id: string; nickname: string } | null>(null);
  const [isRematching, setIsRematching] = useState(false);
  const [rematchDialogOpen, setRematchDialogOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resultRes, contactRes] = await Promise.all([
          getMatchResult(),
          getContact(),
        ]);

        if (resultRes.success) {
          setMatchResult(resultRes);
          setPartnerProperty(resultRes.partner.property);
          setPartnerSurvey(resultRes.partner.survey);
          setCompatibilityScore(resultRes.compatibility_score);
        }

        if (contactRes.success && contactRes.partner) {
          setContact(contactRes);
          setContactInfo(contactRes.partner);
        }
      } catch {
        toast({
          title: '데이터 로딩 실패',
          description: '정보를 불러올 수 없습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
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
      setRematchDialogOpen(false);
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

  const overallScore = compatibilityScore?.overall ?? 0;

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
                  <h3 className="text-xl font-bold text-foreground">{contactInfo.nickname}</h3>
                  {partnerProperty && (
                    <p className="text-muted-foreground text-sm">
                      {partnerProperty.student_id}학번 · {partnerProperty.dorm_building}동
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-muted/50 rounded-md p-4 space-y-3">
                <h4 className="font-semibold text-foreground">연락처 정보</h4>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{contactInfo.user_id}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyContact}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {compatibilityScore && (
                <div className="mt-4 text-center">
                  <span className={cn(
                    'text-2xl font-bold font-mono',
                    overallScore >= 80 ? 'text-primary' :
                    overallScore >= 60 ? 'text-yellow-500' :
                    'text-muted-foreground'
                  )}>
                    {overallScore.toFixed(1)}% 유사도
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Partner Profile */}
          {partnerProperty && partnerSurvey && (
            <div className="bg-card rounded-md p-6 shadow-md">
              {/* Badges */}
              {partnerSurvey.badges && (
                <div className="flex gap-2 flex-wrap mb-6">
                  {Object.values(partnerSurvey.badges).map((badge, i) => (
                    <Badge key={i} variant={i === 0 ? 'default' : 'outline'}>
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Radar Chart */}
              {partnerSurvey.scores && (
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
              {partnerSurvey.scores && (
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
