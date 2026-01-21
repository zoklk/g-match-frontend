import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProgressSteps } from '@/components/ProgressSteps';
import { Badge } from '@/components/ui/badge';
import { useSurveyStore } from '@/store/surveyStore';
import { 
  surveyQuestions, 
  surveyCategories, 
  basicInfoQuestions,
  softQuestions,
} from '@/data/surveyQuestions';
import { ArrowLeft, ArrowRight, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const Survey = () => {
  const navigate = useNavigate();
  const {
    currentPhase,
    basicInfo,
    surveyAnswers,
    softAnswers,
    questionWeights,
    setCurrentPhase,
    setBasicInfo,
    setSurveyAnswer,
    setSoftAnswer,
    setQuestionWeight,
    setComplete,
  } = useSurveyStore();

  const phaseLabels = ['기본 정보', '생활 패턴', '가중치 설정'];

  // Phase 1: Basic Info
  const renderPhase1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">기본 정보</h2>
        <p className="text-muted-foreground">매칭에 필요한 기본 정보를 입력해주세요</p>
      </div>

      {/* Info Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-md p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground">
          이 정보는 룸메이트 매칭 시 필수로 충족되야하는 조건을 나열하고 있습니다.
        </p>
      </div>

      <div className="grid gap-6">
        {basicInfoQuestions.map((item) => (
          <div key={item.id} className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              {item.question}
            </label>
            <div className="flex flex-wrap gap-2">
              {item.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setBasicInfo({ [item.id]: option.value })}
                  className={cn(
                    "px-4 py-2 rounded-sm text-sm font-medium transition-colors border-2",
                    basicInfo[item.id as keyof typeof basicInfo] === option.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Phase 2: Survey Questions (Button/Note Format)
  const questionsByCategory = useMemo(() => {
    return surveyCategories.map(category => ({
      ...category,
      questions: surveyQuestions.filter(q => q.category === category.id),
    }));
  }, []);

  // Generate button labels from leftLabel and rightLabel
  const getButtonLabels = (leftLabel: string, rightLabel: string) => {
    return [
      { value: 1, label: leftLabel },
      { value: 2, label: '약간 ' + leftLabel.replace(/[^가-힣a-zA-Z]/g, '') },
      { value: 3, label: '중간' },
      { value: 4, label: '약간 ' + rightLabel.replace(/[^가-힣a-zA-Z]/g, '') },
      { value: 5, label: rightLabel },
    ];
  };

  const renderPhase2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">생활 패턴</h2>
        <p className="text-muted-foreground">각 질문에 대해 본인의 성향을 선택해주세요</p>
      </div>

      {/* Progress indicator */}
      <div className="sticky top-0 bg-surface/95 backdrop-blur-sm py-3 -mx-4 px-4 z-10">
        <div className="flex gap-2 justify-center flex-wrap">
          {surveyCategories.map((category) => {
            const categoryQuestions = surveyQuestions.filter(q => q.category === category.id);
            const answeredCount = categoryQuestions.filter(q => surveyAnswers[q.id] !== undefined).length;
            const isComplete = answeredCount === categoryQuestions.length;
            
            return (
              <Badge
                key={category.id}
                variant={isComplete ? 'default' : 'outline'}
                className={cn(
                  "transition-all",
                  isComplete && "bg-primary"
                )}
              >
                {category.icon} {category.name} ({answeredCount}/{categoryQuestions.length})
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Questions by category */}
      {questionsByCategory.map((category) => (
        <div key={category.id} className="space-y-4">
          <div className="flex items-center gap-3 pb-2 border-b border-border">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                {category.leftAxis} ←→ {category.rightAxis}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {category.questions.map((question, index) => {
              const isAnswered = surveyAnswers[question.id] !== undefined;
              const buttons = getButtonLabels(question.leftLabel, question.rightLabel);
              
              return (
                <div
                  key={question.id}
                  className={cn(
                    "bg-card rounded-md p-5 shadow-sm border transition-all",
                    isAnswered ? "border-primary/30" : "border-border opacity-70"
                  )}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className={cn(
                      "text-sm font-medium px-2 py-0.5 rounded",
                      isAnswered ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      Q{index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {question.question}
                      </h4>
                      {question.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {question.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Button Options */}
                  <div className="flex flex-wrap gap-2">
                    {buttons.map((btn) => (
                      <button
                        key={btn.value}
                        onClick={() => setSurveyAnswer(question.id, btn.value)}
                        className={cn(
                          "px-3 py-2 rounded-sm text-sm font-medium transition-all border-2 flex-1 min-w-[60px]",
                          surveyAnswers[question.id] === btn.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary/50"
                        )}
                      >
                        {btn.value}
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

      {/* Soft Questions */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b border-border">
          <span className="text-2xl">📋</span>
          <div>
            <h3 className="text-lg font-semibold text-foreground">생활 기타</h3>
            <p className="text-sm text-muted-foreground">
              매칭 시 부가 점수로 활용됩니다
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {softQuestions.map((question, index) => {
            const isAnswered = softAnswers[question.id] !== undefined;
            
            return (
              <div
                key={question.id}
                className={cn(
                  "bg-card rounded-md p-5 shadow-sm border transition-all",
                  isAnswered ? "border-primary/30" : "border-border opacity-70"
                )}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className={cn(
                    "text-sm font-medium px-2 py-0.5 rounded",
                    isAnswered ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    Q{index + 1}
                  </span>
                  <h4 className="font-medium text-foreground flex-1">
                    {question.question}
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSoftAnswer(question.id, option.value)}
                      className={cn(
                        "px-4 py-2 rounded-sm text-sm font-medium transition-colors border-2",
                        softAnswers[question.id] === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  // Phase 3: Per-Question Weight Settings
  const renderPhase3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">가중치 설정</h2>
        <p className="text-muted-foreground">
          본인에게 중요한 항목에 더 높은 가중치를 설정하세요
        </p>
      </div>

      <div className="bg-muted/50 rounded-md p-4 text-sm text-muted-foreground mb-6">
        <p>💡 기본값은 x1.0입니다. 중요한 항목은 x2.0으로, 덜 중요한 항목은 x0.5로 조정하세요.</p>
      </div>

      {questionsByCategory.map((category) => (
        <div key={category.id} className="space-y-3">
          <div className="flex items-center gap-3 pb-2 border-b border-border">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                {category.leftAxis} ↔ {category.rightAxis}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {category.questions.map((question, index) => {
              const currentWeight = questionWeights[question.id] ?? 1.0;
              
              return (
                <div
                  key={question.id}
                  className="bg-card rounded-md p-4 shadow-sm border border-border"
                >
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
                      {[
                        { value: 0.5, label: '0.5x' },
                        { value: 1.0, label: '1.0x' },
                        { value: 2.0, label: '2.0x' },
                      ].map((weight) => (
                        <button
                          key={weight.value}
                          onClick={() => setQuestionWeight(question.id, weight.value)}
                          className={cn(
                            "py-1.5 px-2 rounded-sm text-xs font-medium transition-colors border",
                            currentWeight === weight.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-muted-foreground hover:border-primary/50"
                          )}
                        >
                          {weight.label}
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

      {/* Soft Questions Weight */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 pb-2 border-b border-border">
          <span className="text-2xl">📋</span>
          <div>
            <h3 className="text-lg font-semibold text-foreground">생활 기타</h3>
          </div>
        </div>

        <div className="space-y-2">
          {softQuestions.map((question, index) => {
            const currentWeight = questionWeights[question.id] ?? 1.0;
            
            return (
              <div
                key={question.id}
                className="bg-card rounded-md p-4 shadow-sm border border-border"
              >
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
                    {[
                      { value: 0.5, label: '0.5x' },
                      { value: 1.0, label: '1.0x' },
                      { value: 2.0, label: '2.0x' },
                    ].map((weight) => (
                      <button
                        key={weight.value}
                        onClick={() => setQuestionWeight(question.id, weight.value)}
                        className={cn(
                          "py-1.5 px-2 rounded-sm text-xs font-medium transition-colors border",
                          currentWeight === weight.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        {weight.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  // Navigation logic
  const canProceed = useMemo(() => {
    if (currentPhase === 1) {
      return Object.values(basicInfo).every(v => v !== '');
    }
    if (currentPhase === 2) {
      const allQuestionsAnswered = surveyQuestions.every(q => surveyAnswers[q.id] !== undefined);
      const allSoftAnswered = softQuestions.every(q => softAnswers[q.id] !== undefined);
      return allQuestionsAnswered && allSoftAnswered;
    }
    return true;
  }, [currentPhase, basicInfo, surveyAnswers, softAnswers]);

  const handleNext = () => {
    if (currentPhase === 1) {
      setCurrentPhase(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentPhase === 2) {
      setCurrentPhase(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentPhase === 3) {
      setComplete(true);
      navigate('/matching');
    }
  };

  const handleBack = () => {
    if (currentPhase === 1) {
      navigate('/');
    } else if (currentPhase === 2) {
      setCurrentPhase(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentPhase === 3) {
      setCurrentPhase(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate progress for phase 2
  const phase2Progress = useMemo(() => {
    const totalQuestions = surveyQuestions.length + softQuestions.length;
    const answeredQuestions = 
      Object.keys(surveyAnswers).length + Object.keys(softAnswers).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  }, [surveyAnswers, softAnswers]);

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <ProgressSteps
            currentStep={currentPhase}
            totalSteps={3}
            labels={phaseLabels}
          />
        </div>

        {/* Phase 2 progress bar */}
        {currentPhase === 2 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>진행률</span>
              <span>{phase2Progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${phase2Progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentPhase === 1 && renderPhase1()}
            {currentPhase === 2 && renderPhase2()}
            {currentPhase === 3 && renderPhase3()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border sticky bottom-0 bg-surface py-4">
          <Button
            variant="ghost"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
          >
            {currentPhase === 3 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                완료
              </>
            ) : (
              <>
                다음
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Survey;
