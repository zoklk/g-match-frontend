import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Edit, RefreshCw, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProfileStatus } from '@/api/match';
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

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState<number>(0);
  const [property, setProperty] = useState<ProfileProperty | null>(null);
  const [survey, setSurvey] = useState<ProfileSurvey | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfileStatus();
        if (res.success) {
          setProfileStatus(res.profile_status);
          if (res.property) setProperty(res.property);
          if (res.survey) setSurvey(res.survey);
        }
      } catch {
        // 에러 처리
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // 프로필 미완성 시 리다이렉트
  useEffect(() => {
    if (!isLoading) {
      if (profileStatus === 0) {
        navigate('/match/profile/property');
      } else if (profileStatus === 1) {
        navigate('/match/profile/survey');
      }
    }
  }, [profileStatus, isLoading, navigate]);

  const getRadarData = () => {
    if (!survey?.scores) return [];
    // 백엔드 scores 키: '생활 리듬', '공간 관리', '생활 습관', '사회성'
    const categoryNameMap: Record<string, string> = {
      time: '생활 리듬',
      clean: '공간 관리',
      habit: '생활 습관',
      social: '사회성',
    };

    return surveyCategories
      .filter((cat) => cat.id !== 'etc')
      .map((cat) => ({
        category: cat.name,
        value: survey.scores[categoryNameMap[cat.id]] ?? 0,
        fullMark: 5,
      }));
  };

  const getDormLabel = (building: string) => {
    return `${building}동`;
  };

  const getPeriodLabel = (period: number) => {
    if (period === 1) return '1학기';
    if (period === 2) return '1년';
    return `${period}학기`;
  };

  if (isLoading || profileStatus < 2) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">내 프로필</h2>
            <p className="text-muted-foreground">매칭에 사용될 내 프로필 정보입니다</p>
          </div>

          {/* Profile Card */}
          <div className="bg-card rounded-md p-6 shadow-md mb-6">
            {/* Avatar and Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{property?.nickname}</h3>
                <p className="text-muted-foreground text-sm">
                  {property ? `${property.student_id}학번 · ${getDormLabel(property.dorm_building)} · ${getPeriodLabel(property.stay_period)}` : ''}
                </p>
              </div>
            </div>

            {/* Badges */}
            {survey?.badges && (
              <div className="flex gap-2 flex-wrap mb-6">
                {Object.values(survey.badges).map((badge, i) => (
                  <Badge key={i} variant={i === 0 ? 'default' : 'outline'}>
                    {badge}
                  </Badge>
                ))}
              </div>
            )}

            {/* Radar Chart */}
            {survey?.scores && (
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getRadarData()}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 5]}
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Radar
                      name="점수"
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
            {survey?.scores && (
              <div className="space-y-3">
                {surveyCategories
                  .filter((cat) => cat.id !== 'etc')
                  .map((cat) => {
                    const categoryNameMap: Record<string, string> = {
                      time: '생활 리듬',
                      clean: '공간 관리',
                      habit: '생활 습관',
                      social: '사회성',
                    };
                    const score = survey.scores[categoryNameMap[cat.id]] ?? 0;
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
            {property && (
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3">기본 조건</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">흡연</div>
                  <div className="text-foreground">{property.is_smoker ? 'O' : 'X'}</div>
                  <div className="text-muted-foreground">냉장고</div>
                  <div className="text-foreground">{property.has_fridge ? '보유' : '미보유'}</div>
                  <div className="text-muted-foreground">공유기</div>
                  <div className="text-foreground">{property.has_router ? '보유' : '미보유'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/match/profile/property')}
            >
              <Edit className="w-4 h-4 mr-2" />
              기본정보 수정하기
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/match/profile/survey')}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              설문 수정하기
            </Button>
            <Button className="w-full" onClick={() => navigate('/match')}>
              <ArrowRight className="w-4 h-4 mr-2" />
              매칭하러 가기
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
