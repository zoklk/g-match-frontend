import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Edit, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProfileStatus } from '@/api/match';
import { ProfileProperty, ProfileSurvey } from '@/types/match';
import { surveyCategories } from '@/data/surveyQuestions';
import { ProfileSlider } from '@/components/ProfileSlider';

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

  // 카테고리 ID -> 백엔드 scores 키 매핑
  const categoryNameMap: Record<string, string> = {
    time: '생활 리듬',
    clean: '공간 관리',
    habit: '생활 습관',
    social: '사회성',
  };

  // 카테고리별 색상 매핑
  const categoryColors: Record<string, string> = {
    time: 'bg-chart-1',
    clean: 'bg-chart-2',
    habit: 'bg-chart-3',
    social: 'bg-chart-4',
  };

  const getDormLabel = (building: string) => {
    return `${building}동`;
  };

  const getGenderLabel = (gender: string) => {
    return gender === 'M' ? '남성' : '여성';
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
                  {property ? `${getGenderLabel(property.gender)} · ${property.student_id}학번${property.dorm_building !== 'A' ? ` · ${getDormLabel(property.dorm_building)}` : ''}` : ''}
                </p>
              </div>
            </div>

            {/* Badges - 슬라이더 위 왼쪽 정렬 */}
            {survey?.badges && Object.keys(survey.badges).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className="flex gap-2 flex-wrap">
                  {Object.values(survey.badges).map((badge, i) => (
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
            {survey?.scores && (
              <div className="space-y-5">
                {surveyCategories
                  .filter((cat) => cat.id !== 'etc')
                  .map((cat) => {
                    const score = survey.scores[categoryNameMap[cat.id]] ?? 3;

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
            {property && (
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
                            property.stay_period === period
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
                          property.is_smoker
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        O
                      </div>
                      <div
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium border-2 transition-colors",
                          !property.is_smoker
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
                          property.has_fridge
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        O
                      </div>
                      <div
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium border-2 transition-colors",
                          !property.has_fridge
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
                          property.has_router
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        O
                      </div>
                      <div
                        className={cn(
                          "px-4 py-2 rounded-md text-sm font-medium border-2 transition-colors",
                          !property.has_router
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

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/match/profile/property')}
            >
              <Edit className="w-4 h-4 mr-2" />
              프로필 수정하기
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
