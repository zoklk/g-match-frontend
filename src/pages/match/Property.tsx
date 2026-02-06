import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/store/profileStore';
import { getProperty, submitProperty } from '@/api/match';
import { propertyQuestions } from '@/data/surveyQuestions';
import { PropertyRequest } from '@/types/match';
import { useToast } from '@/hooks/use-toast';

const Property = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { propertyData, setPropertyField, setPropertyData } = useProfileStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 진입 시 profile 상태 확인 및 기존 property 불러오기
  useEffect(() => {
    const loadExisting = async () => {
      try {
        const res = await getProperty();
        if (res.success && res.property && res.success) {
          // 기존 property가 있으면 불러오기 (재작성 시 기본값)
          setPropertyData({
            dorm_building: res.property.dorm_building as PropertyRequest['dorm_building'],
            stay_period: res.property.stay_period as PropertyRequest['stay_period'],
            is_smoker: res.property.is_smoker,
            has_fridge: res.property.has_fridge,
            mate_fridge: res.property.mate_fridge as PropertyRequest['mate_fridge'],
            has_router: res.property.has_router,
            mate_router: res.property.mate_router as PropertyRequest['mate_router'],
          });
        }
      } catch {
        // 기존 데이터 없으면 무시
      } finally {
        setIsLoading(false);
      }
    };
    loadExisting();
  }, [setPropertyData]);

  const isComplete = () => {
    const required = ['dorm_building', 'stay_period', 'is_smoker', 'has_fridge', 'mate_fridge', 'has_router', 'mate_router'];
    return required.every((key) => propertyData[key as keyof PropertyRequest] !== undefined);
  };

  const handleSubmit = async () => {
    if (!isComplete()) return;
    setIsSubmitting(true);
    try {
      const res = await submitProperty(propertyData as PropertyRequest);
      if (res.success) {
        toast({ title: 'Property 저장 완료', description: '설문 작성으로 이동합니다.' });
        navigate('/match/profile/survey');
      } else {
        toast({ title: '저장 실패', description: res.error || '다시 시도해주세요.', variant: 'destructive' });
      }
    } catch {
      toast({ title: '오류 발생', description: '서버 연결을 확인해주세요.', variant: 'destructive' });
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
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">기본 조건</h2>
            <p className="text-muted-foreground">매칭에 필요한 기본 조건을 입력해주세요</p>
          </div>

          {/* Info Banner */}
          <div className="grid gap-6">
            {propertyQuestions.map((item) => (
              <div key={item.id} className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  {item.question}
                </label>
                <div className="flex flex-wrap gap-2">
                  {item.options?.map((option) => (
                    <button
                      key={String(option.value)}
                      onClick={() => setPropertyField(item.id, option.value)}
                      className={cn(
                        'px-4 py-2 rounded-sm text-sm font-medium transition-colors border-2',
                        propertyData[item.id as keyof PropertyRequest] === option.value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary/50'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="mt-8 pt-6 border-t border-border">
            <Button
              onClick={handleSubmit}
              disabled={!isComplete() || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              다음: 설문 작성
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Property;
