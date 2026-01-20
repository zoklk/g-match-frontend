import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { useSurveyStore, MatchCandidate } from '@/store/surveyStore';
import { surveyCategories } from '@/data/surveyQuestions';
import { 
  ArrowLeft, 
  RotateCcw, 
  ChevronRight, 
  X,
  User,
  MessageCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// Mock data for demo
const mockCandidates: MatchCandidate[] = [
  {
    id: '1',
    name: '김민수',
    studentYear: '23',
    overallScore: 87,
    categoryScores: { lifestyle: 92, space: 85, habits: 78, social: 90 },
  },
  {
    id: '2',
    name: '이서연',
    studentYear: '24',
    overallScore: 82,
    categoryScores: { lifestyle: 75, space: 88, habits: 85, social: 80 },
  },
  {
    id: '3',
    name: '박준혁',
    studentYear: '23',
    overallScore: 76,
    categoryScores: { lifestyle: 80, space: 70, habits: 82, social: 72 },
  },
  {
    id: '4',
    name: '최유진',
    studentYear: '22',
    overallScore: 71,
    categoryScores: { lifestyle: 65, space: 78, habits: 70, social: 72 },
  },
];

const Results = () => {
  const navigate = useNavigate();
  const { basicInfo, reset } = useSurveyStore();
  const [selectedCandidate, setSelectedCandidate] = useState<MatchCandidate | null>(null);

  const handleRematch = () => {
    reset();
    navigate('/survey');
  };

  // Transform category scores for radar chart
  const getRadarData = (candidate: MatchCandidate) => {
    return surveyCategories.map(cat => ({
      category: cat.name,
      value: candidate.categoryScores[cat.id as keyof typeof candidate.categoryScores] || 0,
      fullMark: 100,
    }));
  };

  // Transform for bar chart
  const getBarData = (candidate: MatchCandidate) => {
    return surveyCategories.map(cat => ({
      name: cat.icon,
      category: cat.name,
      score: candidate.categoryScores[cat.id as keyof typeof candidate.categoryScores] || 0,
    }));
  };

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </button>
          <Button variant="outline" size="sm" onClick={handleRematch}>
            <RotateCcw className="w-4 h-4 mr-2" />
            재매칭
          </Button>
        </div>

        {/* My Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-md p-6 shadow-md mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">내 프로필</h2>
              <p className="text-muted-foreground text-sm">
                {basicInfo.dormBuilding === 'any' ? '동 상관없음' : `${basicInfo.dormBuilding}동 희망`}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Badge variant="lifestyle">🌙 저녁형</Badge>
            <Badge variant="space">🏠 깔끔함</Badge>
            <Badge variant="social">👥 적당한 교류</Badge>
          </div>
        </motion.div>

        {/* Results Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">매칭 결과</h1>
          <p className="text-muted-foreground">
            유사도가 높은 순으로 {mockCandidates.length}명의 후보자를 찾았습니다
          </p>
        </div>

        {/* Candidate Cards */}
        <div className="grid gap-4">
          {mockCandidates.map((candidate, i) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedCandidate(candidate)}
              className="bg-card rounded-md p-5 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary/30"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center shrink-0">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {candidate.name}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {candidate.studentYear}학번
                    </span>
                  </div>
                  
                  {/* Mini bar chart */}
                  <div className="flex gap-1 h-6">
                    {getBarData(candidate).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center"
                        title={`${item.category}: ${item.score}%`}
                      >
                        <div
                          className={cn(
                            "w-8 rounded-t-xs transition-all",
                            idx === 0 && "bg-chart-1",
                            idx === 1 && "bg-chart-2",
                            idx === 2 && "bg-chart-3",
                            idx === 3 && "bg-chart-4"
                          )}
                          style={{ height: `${(item.score / 100) * 24}px` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="text-center shrink-0">
                  <div className={cn(
                    "text-3xl font-bold font-mono",
                    candidate.overallScore >= 80 ? "text-primary" :
                    candidate.overallScore >= 60 ? "text-warning" :
                    "text-muted-foreground"
                  )}>
                    {candidate.overallScore}
                  </div>
                  <div className="text-xs text-muted-foreground">유사도</div>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-foreground/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCandidate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto shadow-xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        {selectedCandidate.name}
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {selectedCandidate.studentYear}학번
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Overall Score */}
                <div className="flex justify-center">
                  <ScoreDisplay
                    score={selectedCandidate.overallScore}
                    size="lg"
                    label="전체 유사도"
                  />
                </div>

                {/* Radar Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={getRadarData(selectedCandidate)}>
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

                {/* Category Scores */}
                <div className="space-y-3">
                  {surveyCategories.map((cat) => {
                    const score = selectedCandidate.categoryScores[cat.id as keyof typeof selectedCandidate.categoryScores];
                    return (
                      <div key={cat.id} className="flex items-center gap-3">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-sm text-foreground w-20">{cat.name}</span>
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              cat.id === 'lifestyle' && "bg-chart-1",
                              cat.id === 'space' && "bg-chart-2",
                              cat.id === 'habits' && "bg-chart-3",
                              cat.id === 'social' && "bg-chart-4"
                            )}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono font-semibold w-10 text-right">
                          {score}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Button */}
                <Button className="w-full" size="lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  연락하기
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Results;
