import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useSurveyStore } from '@/store/surveyStore';
import { surveyCategories } from '@/data/surveyQuestions';
import { 
  ArrowLeft, 
  Flag,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Mock user profile data
const mockProfile = {
  id: '1',
  nickname: '활발한 펭귄',
  overallScore: 85,
  categoryScores: {
    lifestyle: 80,
    space: 90,
    habits: 75,
    social: 85,
  },
  badges: ['🌙 저녁형', '🏠 깔끔함', '👥 적당한 교류'],
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { basicInfo } = useSurveyStore();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');

  // Transform category scores for radar chart (4 axes)
  const getRadarData = () => {
    return surveyCategories.map(cat => ({
      category: cat.name,
      value: mockProfile.categoryScores[cat.id as keyof typeof mockProfile.categoryScores] || 0,
      fullMark: 100,
    }));
  };

  const handleReport = () => {
    if (reportText.trim()) {
      toast({
        title: '신고가 접수되었습니다',
        description: '검토 후 조치하겠습니다.',
      });
      setReportText('');
      setReportOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로
          </button>
          <button
            onClick={() => setReportOpen(true)}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            title="신고하기"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-md p-6 shadow-md mb-6"
        >
          {/* Avatar and Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{mockProfile.nickname}</h2>
              <p className="text-muted-foreground text-sm">
                {basicInfo.dormBuilding === 'any' ? '동 상관없음' : `${basicInfo.dormBuilding}동 희망`}
              </p>
            </div>
          </div>

          {/* 3 Badges */}
          <div className="flex gap-2 flex-wrap mb-6">
            {mockProfile.badges.map((badge, i) => (
              <Badge 
                key={i} 
                variant={i === 0 ? 'lifestyle' : i === 1 ? 'space' : 'social'}
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* 4-Axis Radar Chart */}
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
                  domain={[0, 100]}
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

          {/* 4-Item Slide Chart (Bar indicators) */}
          <div className="space-y-3">
            {surveyCategories.map((cat) => {
              const score = mockProfile.categoryScores[cat.id as keyof typeof mockProfile.categoryScores];
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    </div>
                    <span className="text-sm font-mono font-semibold text-muted-foreground">
                      {score}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={cn(
                        "h-full rounded-full",
                        cat.id === 'lifestyle' && "bg-chart-1",
                        cat.id === 'space' && "bg-chart-2",
                        cat.id === 'habits' && "bg-chart-3",
                        cat.id === 'social' && "bg-chart-4"
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
        </motion.div>

        {/* Report Dialog */}
        <AlertDialog open={reportOpen} onOpenChange={setReportOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>신고/피드백</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="신고 사유 또는 피드백을 자유롭게 입력해주세요..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleReport}>확인</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Profile;
