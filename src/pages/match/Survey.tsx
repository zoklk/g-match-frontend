import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/store/profileStore';
import { getSurvey } from '@/api/match';
import { surveyQuestions, surveyCategories } from '@/data/surveyQuestions';

const Survey = () => {
  const navigate = useNavigate();
  const { surveyAnswers, setSurveyAnswer, setSurveyAnswers } = useProfileStore();
  const [isLoading, setIsLoading] = useState(true);

  // 진입 시 기존 survey 불러오기
  useEffect(() => {
    const loadExisting = async () => {
      try {
        const res = await getSurvey();
        if (res.success && res.survey) {
          // 기존 survey가 있으면 불러오기 (재작성 시 기본값)
          setSurveyAnswers(res.survey.surveys);
        }
      } catch {
        // 기존 데이터 없으면 무시
      } finally {
        setIsLoading(false);
      }
    };
    loadExisting();
  }, [setSurveyAnswers]);

  const questionsByCategory = useMemo(() => {
    return surveyCategories.map((category) => ({
      ...category,
      questions: surveyQuestions.filter((q) => q.category === category.id),
    }));
  }, []);

  const answeredCount = Object.keys(surveyAnswers || {}).length;
  const totalCount = surveyQuestions.length;
  const allAnswered = answeredCount === totalCount;
  const progress = Math.round((answeredCount / totalCount) * 100);

  const handleNext = () => {
    if (allAnswered) {
      navigate('/match/profile/weight');
    }
  };

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 120; // sticky header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <div className="max-w-2xl mx-auto">
        {/* Title Section - Not sticky */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 px-4"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">생활 패턴</h2>
          <p className="text-muted-foreground">각 질문에 대해 본인의 성향을 선택해주세요</p>
        </motion.div>
      </div>

      {/* Progress and Category badges - Sticky header (max-w 바깥) */}
      <div className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-2xl mx-auto py-4 px-4">
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>진행률</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Category progress badges */}
        <div className="flex gap-1.5 sm:gap-2 justify-center flex-wrap">
          {surveyCategories.map((category) => {
            const catQuestions = surveyQuestions.filter((q) => q.category === category.id);
            const catAnswered = catQuestions.filter((q) => (surveyAnswers && surveyAnswers[q.id]) !== undefined).length;
            const isComplete = catAnswered === catQuestions.length;

            return (
              <Badge
                key={category.id}
                variant={isComplete ? 'default' : 'outline'}
                className={cn('transition-all cursor-pointer hover:scale-105 text-xs px-2 py-1', isComplete && 'bg-primary')}
                onClick={() => scrollToCategory(category.id)}
              >
                {category.name} ({catAnswered}/{catQuestions.length})
              </Badge>
            );
          })}
        </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Questions by category */}
        <div className="space-y-8 px-4">
            {questionsByCategory.map((category) => (
              <div key={category.id} id={`category-${category.id}`} className="space-y-4 scroll-mt-32">
                <div className="pb-2 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                </div>

                <div className="space-y-4">
                  {category.questions.map((question, index) => {
                    const isAnswered = (surveyAnswers && surveyAnswers[question.id]) !== undefined;

                    return (
                      <div
                        key={question.id}
                        className={cn(
                          'bg-card rounded-md p-5 shadow-sm border transition-all',
                          isAnswered ? 'border-primary/30' : 'border-border opacity-70'
                        )}
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <span
                            className={cn(
                              'text-sm font-medium px-2 py-0.5 rounded',
                              isAnswered ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            )}
                          >
                            Q{index + 1}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{question.question}</h4>
                            {question.description && (
                              <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
                            )}
                          </div>
                        </div>

                        {/* 1~5 선택 버튼 */}
                        <div className="flex gap-1 sm:gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => setSurveyAnswer(question.id, val)}
                              className={cn(
                                'py-2 rounded-sm text-sm font-medium transition-all border-2 flex-1 min-w-0',
                                (surveyAnswers && surveyAnswers[question.id]) === val
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border bg-background text-foreground hover:border-primary/50'
                              )}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                          <span>{question.leftLabel}</span>
                          <span>{question.rightLabel}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        {/* Navigation - Sticky at bottom */}
        <div className="sticky bottom-0 bg-surface/95 backdrop-blur-sm border-t border-border/50 py-4 px-4 mt-8">
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => navigate('/match/profile/property')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              이전
            </Button>
            <Button onClick={handleNext} disabled={!allAnswered}>
              다음: 우선순위 설정
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;
