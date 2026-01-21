import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useSurveyStore, MatchCandidate } from '@/store/surveyStore';
import { surveyCategories } from '@/data/surveyQuestions';
import { 
  ArrowLeft, 
  Play,
  X,
  Check,
  User,
  RotateCcw,
  Phone,
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
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

// Random nickname generator
const adjectives = ['활발한', '조용한', '따뜻한', '시원한', '부지런한', '느긋한', '밝은', '차분한'];
const animals = ['펭귄', '고양이', '강아지', '토끼', '곰', '여우', '사자', '돌고래'];

const generateNickname = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj} ${animal}`;
};

// Mock candidates
const mockCandidates: MatchCandidate[] = [
  {
    id: '1',
    nickname: generateNickname(),
    name: '김민수',
    contact: '010-1234-5678',
    overallScore: 87,
    categoryScores: { lifestyle: 92, space: 85, habits: 78, social: 90 },
    badges: ['🌙 저녁형', '🏠 깔끔함', '👥 적당한 교류'],
  },
  {
    id: '2',
    nickname: generateNickname(),
    name: '이서연',
    contact: '010-2345-6789',
    overallScore: 82,
    categoryScores: { lifestyle: 75, space: 88, habits: 85, social: 80 },
    badges: ['☀️ 아침형', '🏠 깔끔함', '🔇 조용한'],
  },
  {
    id: '3',
    nickname: generateNickname(),
    name: '박준혁',
    contact: '010-3456-7890',
    overallScore: 76,
    categoryScores: { lifestyle: 80, space: 70, habits: 82, social: 72 },
    badges: ['🌙 저녁형', '🎧 활동적', '👤 독립적'],
  },
];

const Matching = () => {
  const navigate = useNavigate();
  const { 
    matchingStage, 
    currentMatch,
    excludedIds,
    setMatchingStage, 
    setCurrentMatch,
    addExcludedId,
    resetMatching,
  } = useSurveyStore();

  const [rematchDialogOpen, setRematchDialogOpen] = useState(false);
  const [dontMatchAgain, setDontMatchAgain] = useState(false);
  const [isFromReject, setIsFromReject] = useState(false);

  // Simulate matching process
  const startMatching = () => {
    setMatchingStage('matching');
    
    // Simulate finding a match after 3 seconds
    setTimeout(() => {
      const availableCandidates = mockCandidates.filter(c => !excludedIds.includes(c.id));
      if (availableCandidates.length > 0) {
        setCurrentMatch(availableCandidates[0]);
        setMatchingStage('result');
      } else {
        // No more candidates
        setMatchingStage('before');
      }
    }, 3000);
  };

  const handleAccept = () => {
    // Simulate other person also accepting
    setMatchingStage('confirmed');
  };

  const handleReject = () => {
    setIsFromReject(true);
    setRematchDialogOpen(true);
  };

  const handleRematchConfirm = () => {
    if (dontMatchAgain && currentMatch) {
      addExcludedId(currentMatch.id);
    }
    setDontMatchAgain(false);
    setRematchDialogOpen(false);
    startMatching();
  };

  const handleRematchCancel = () => {
    setDontMatchAgain(false);
    setRematchDialogOpen(false);
    if (isFromReject) {
      resetMatching();
    }
    setIsFromReject(false);
  };

  const openRematchDialog = () => {
    setIsFromReject(false);
    setRematchDialogOpen(true);
  };

  const getRadarData = (candidate: MatchCandidate) => {
    return surveyCategories.map(cat => ({
      category: cat.name,
      value: candidate.categoryScores[cat.id as keyof typeof candidate.categoryScores] || 0,
      fullMark: 100,
    }));
  };

  // Before Matching Stage
  const renderBeforeStage = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <h2 className="text-2xl font-bold text-foreground mb-4">매칭 준비 완료</h2>
      <p className="text-muted-foreground text-center mb-8">
        설문 결과를 바탕으로 최적의 룸메이트를 찾아드립니다
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startMatching}
        className="w-40 h-40 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        <Play className="w-12 h-12 mb-2" />
        <span className="text-lg font-semibold">매칭 시작</span>
      </motion.button>
    </motion.div>
  );

  // Matching (Loading) Stage
  const renderMatchingStage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent mb-8"
      />
      
      <h2 className="text-2xl font-bold text-foreground mb-2">매칭 중...</h2>
      <p className="text-muted-foreground text-center mb-8">
        최적의 룸메이트를 찾고 있습니다
      </p>

      <Button 
        variant="outline" 
        onClick={() => {
          setMatchingStage('before');
          setCurrentMatch(null);
        }}
      >
        <X className="w-4 h-4 mr-2" />
        매칭 취소
      </Button>
    </motion.div>
  );

  // Result Stage (Before Confirmation)
  const renderResultStage = () => {
    if (!currentMatch) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">매칭 결과</h2>
          <p className="text-muted-foreground">최적의 룸메이트 후보를 찾았습니다!</p>
        </div>

        {/* Candidate Card */}
        <div className="bg-card rounded-md p-6 shadow-md">
          {/* Avatar and Nickname (no real name) */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{currentMatch.nickname}</h3>
              <div className={cn(
                "text-2xl font-bold font-mono",
                currentMatch.overallScore >= 80 ? "text-primary" :
                currentMatch.overallScore >= 60 ? "text-warning" :
                "text-muted-foreground"
              )}>
                {currentMatch.overallScore}% 유사도
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap mb-6">
            {currentMatch.badges.map((badge, i) => (
              <Badge 
                key={i}
                variant={i === 0 ? 'lifestyle' : i === 1 ? 'space' : 'social'}
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* Radar Chart */}
          <div className="h-56 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={getRadarData(currentMatch)}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
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

          {/* Category Bars */}
          <div className="space-y-2">
            {surveyCategories.map((cat) => {
              const score = currentMatch.categoryScores[cat.id as keyof typeof currentMatch.categoryScores];
              return (
                <div key={cat.id} className="flex items-center gap-2">
                  <span className="text-sm w-20">{cat.icon} {cat.name}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        cat.id === 'lifestyle' && "bg-chart-1",
                        cat.id === 'space' && "bg-chart-2",
                        cat.id === 'habits' && "bg-chart-3",
                        cat.id === 'social' && "bg-chart-4"
                      )}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono w-10 text-right">{score}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleReject}
          >
            <X className="w-4 h-4 mr-2" />
            거절
          </Button>
          <Button 
            className="flex-1"
            onClick={handleAccept}
          >
            <Check className="w-4 h-4 mr-2" />
            수락
          </Button>
        </div>
      </motion.div>
    );
  };

  // Confirmed Stage (Both Accepted)
  const renderConfirmedStage = () => {
    if (!currentMatch) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="space-y-6"
      >
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

        {/* Confirmed Card with Contact Info */}
        <div className="bg-card rounded-md p-6 shadow-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{currentMatch.name}</h3>
              <p className="text-muted-foreground">{currentMatch.nickname}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-muted/50 rounded-md p-4 space-y-3">
            <h4 className="font-semibold text-foreground mb-3">연락처 정보</h4>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{currentMatch.contact}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap mt-4">
            {currentMatch.badges.map((badge, i) => (
              <Badge 
                key={i}
                variant={i === 0 ? 'lifestyle' : i === 1 ? 'space' : 'social'}
              >
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Rematch Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={openRematchDialog}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          재매칭하기
        </Button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-surface py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {matchingStage === 'before' && renderBeforeStage()}
          {matchingStage === 'matching' && renderMatchingStage()}
          {matchingStage === 'result' && renderResultStage()}
          {matchingStage === 'confirmed' && renderConfirmedStage()}
        </AnimatePresence>

        {/* Rematch Dialog */}
        <AlertDialog open={rematchDialogOpen} onOpenChange={setRematchDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>재매칭 하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                새로운 룸메이트를 다시 매칭합니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="dontMatch" 
                  checked={dontMatchAgain}
                  onCheckedChange={(checked) => setDontMatchAgain(checked as boolean)}
                />
                <label 
                  htmlFor="dontMatch" 
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  다시 만나지 않기
                </label>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleRematchCancel}>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleRematchConfirm}>확인</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Matching;
