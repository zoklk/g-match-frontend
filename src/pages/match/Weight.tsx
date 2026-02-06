import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/store/profileStore';
import { getSurvey, submitSurvey } from '@/api/match';
import { surveyQuestions, surveyCategories, SURVEY_REQUIRED_KEYS } from '@/data/surveyQuestions';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api';

const WEIGHT_OPTIONS = [
  { value: 0.5, label: '0.5x' },
  { value: 1.0, label: '1.0x' },
  { value: 1.5, label: '1.5x' },
];

const Weight = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { surveyAnswers, surveyWeights, setSurveyWeight, setSurveyWeights } = useProfileStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 진입 시 기존 weights 불러오기
  useEffect(() => {
    const loadExisting = async () => {
      try {
        const res = await getSurvey();
        if (res.success && res.survey?.weights) {
          setSurveyWeights(res.survey.weights);
        } else {
          // 기존 가중치 없으면 기본값 1.0으로 세팅
          const defaults: Record<string, number> = {};
          SURVEY_REQUIRED_KEYS.forEach((key) => {
            defaults[key] = 1.0;
          });
          setSurveyWeights(defaults);
        }
      } catch {
        const defaults: Record<string, number> = {};
        SURVEY_REQUIRED_KEYS.forEach((key) => {
          defaults[key] = 1.0;
        });
        setSurveyWeights(defaults);
      } finally {
        setIsLoading(false);
      }
    };
    loadExisting();
  }, [setSurveyWeights]);

  const questionsByCategory = useMemo(() => {
    return surveyCategories.map((category) => ({
      ...category,
      questions: surveyQuestions.filter((q) => q.category === category.id),
    }));
  }, []);

  // survey 답변이 없으면 survey 페이지로 보내기
  useEffect(() => {
    const answeredKeys = Object.keys(surveyAnswers);
    if (!isLoading && answeredKeys.length < SURVEY_REQUIRED_KEYS.length) {
      navigate('/match/profile/survey');
    }
  }, [surveyAnswers, isLoading, navigate]);

  const handleSubmit = async () => {
    // 모든 키에 대해 weight가 있는지 확인
    const allWeightsSet = SURVEY_REQUIRED_KEYS.every(
      (key) => surveyWeights[key] !== undefined
    );
    if (!allWeightsSet) {
      toast({ title: '우선순위를 모두 설정해주세요.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitSurvey({
        surveys: surveyAnswers,
        weights: surveyWeights,
      });
      if (res.success) {
        toast({ title: '설문 저장 완료', description: '프로필이 생성되었습니다.' });
        navigate('/match/profile');
      } else {
        toast({ title: '저장 실패', description: res.message || '다시 시도해주세요.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: '오류 발생', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">우선순위 설정</h2>
            <p className="text-muted-foreground">
              본인에게 중요한 항목에 더 높은 우선순위를 설정하세요
            </p>
          </div>



          {questionsByCategory.map((category) => (
            <div key={category.id} className="space-y-3 mb-6">
              <div className="pb-2 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
              </div>

              <div className="space-y-2">
                {category.questions.map((question, index) => {
                  const currentWeight = surveyWeights?.[question.id] ?? 1.0;

                  return (
                    <div key={question.id} className="bg-card rounded-md p-4 shadow-sm border border-border">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              Q{index + 1}
                            </span>
                            <span className="text-sm font-medium text-foreground truncate">
                              {question.question}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-1 shrink-0">
                          {WEIGHT_OPTIONS.map((w) => (
                            <button
                              key={w.value}
                              onClick={() => setSurveyWeight(question.id, w.value)}
                              className={cn(
                                'py-1.5 px-2 rounded-sm text-xs font-medium transition-colors border',
                                currentWeight === w.value
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                              )}
                            >
                              {w.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border sticky bottom-0 bg-surface py-4">
            <Button variant="ghost" onClick={() => navigate('/match/profile/survey')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              이전
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              완료
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Weight;
