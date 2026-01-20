import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProgressSteps } from '@/components/ProgressSteps';
import { SurveySlider } from '@/components/SurveySlider';
import { Badge } from '@/components/ui/badge';
import { useSurveyStore } from '@/store/surveyStore';
import { surveyQuestions, surveyCategories, basicInfoOptions } from '@/data/surveyQuestions';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Survey = () => {
  const navigate = useNavigate();
  const {
    currentPhase,
    basicInfo,
    surveyAnswers,
    weights,
    setCurrentPhase,
    setBasicInfo,
    setSurveyAnswer,
    setWeight,
    setComplete,
  } = useSurveyStore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

      <div className="grid gap-6">
        {Object.entries(basicInfoOptions).map(([key, options]) => (
          <div key={key} className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              {key === 'gender' && '성별'}
              {key === 'studentYear' && '학번'}
              {key === 'stayPeriod' && '입주 기간'}
              {key === 'dormBuilding' && '희망 기숙사 동'}
            </label>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setBasicInfo({ [key]: option.value })}
                  className={cn(
                    "px-4 py-2 rounded-sm text-sm font-medium transition-colors border-2",
                    basicInfo[key as keyof typeof basicInfo] === option.value
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

  // Phase 2: Survey Questions
  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const currentCategory = surveyCategories.find(c => c.id === currentQuestion?.category);

  const renderPhase2 = () => (
    <motion.div
      key={currentQuestionIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-4">
        <Badge variant={currentCategory?.id as any}>
          {currentCategory?.icon} {currentCategory?.name}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {currentQuestionIndex + 1} / {surveyQuestions.length}
        </span>
      </div>

      {/* Question progress bar */}
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIndex + 1) / surveyQuestions.length) * 100}%` }}
        />
      </div>

      <div className="bg-card rounded-md p-6 shadow-md">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {currentQuestion.question}
        </h3>
        {currentQuestion.description && (
          <p className="text-muted-foreground text-sm mb-6">
            {currentQuestion.description}
          </p>
        )}

        <SurveySlider
          value={surveyAnswers[currentQuestion.id] || 3}
          onChange={(value) => setSurveyAnswer(currentQuestion.id, value)}
          leftLabel={currentQuestion.leftLabel}
          rightLabel={currentQuestion.rightLabel}
        />
      </div>
    </motion.div>
  );

  // Phase 3: Weight Settings
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

      <div className="grid gap-4">
        {surveyCategories.map((category) => (
          <div
            key={category.id}
            className="bg-card rounded-md p-5 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <span className="font-semibold text-foreground">{category.name}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {(['low', 'normal', 'high'] as const).map((weight) => (
                <button
                  key={weight}
                  onClick={() => setWeight(category.id, weight)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-sm text-sm font-medium transition-colors border-2",
                    weights[category.id] === weight
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/50"
                  )}
                >
                  {weight === 'low' && '낮음 (0.5x)'}
                  {weight === 'normal' && '보통 (1.0x)'}
                  {weight === 'high' && '높음 (2.0x)'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Navigation logic
  const canProceed = useMemo(() => {
    if (currentPhase === 1) {
      return Object.values(basicInfo).every(v => v !== '');
    }
    if (currentPhase === 2) {
      return surveyAnswers[currentQuestion?.id] !== undefined;
    }
    return true;
  }, [currentPhase, basicInfo, surveyAnswers, currentQuestion]);

  const handleNext = () => {
    if (currentPhase === 1) {
      setCurrentPhase(2);
    } else if (currentPhase === 2) {
      if (currentQuestionIndex < surveyQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentPhase(3);
      }
    } else if (currentPhase === 3) {
      setComplete(true);
      navigate('/results');
    }
  };

  const handleBack = () => {
    if (currentPhase === 1) {
      navigate('/');
    } else if (currentPhase === 2) {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      } else {
        setCurrentPhase(1);
      }
    } else if (currentPhase === 3) {
      setCurrentPhase(2);
      setCurrentQuestionIndex(surveyQuestions.length - 1);
    }
  };

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

        {/* Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentPhase === 1 && renderPhase1()}
            {currentPhase === 2 && renderPhase2()}
            {currentPhase === 3 && renderPhase3()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
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
