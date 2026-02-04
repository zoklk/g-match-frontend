// ============================================
// 백엔드 REQUIRED_KEYS에 맞춘 설문 데이터
// time_1~4, clean_1~4, habit_1~4, social_1~5, etc_1~2 (총 18문항)
// ============================================

export interface Question {
  id: string;
  category: string;
  question: string;
  description?: string;
  leftLabel: string;
  rightLabel: string;
}

export interface SurveyCategory {
  id: string;
  name: string;
  icon: string;
  leftAxis: string;
  rightAxis: string;
}

export const surveyCategories: SurveyCategory[] = [
  { id: 'time', name: '생활 리듬', icon: '🌙', leftAxis: '아침형', rightAxis: '저녁형' },
  { id: 'clean', name: '공간 관리', icon: '🏠', leftAxis: '깔끔형', rightAxis: '자유형' },
  { id: 'habit', name: '생활 습관', icon: '🎧', leftAxis: '조용형', rightAxis: '활동형' },
  { id: 'social', name: '사회성', icon: '👥', leftAxis: '독립형', rightAxis: '교류형' },
  { id: 'etc', name: '생활 기타', icon: '📋', leftAxis: '', rightAxis: '' },
];

export const surveyQuestions: Question[] = [
  // ===== 생활 리듬 (time_1~4) =====
  {
    id: 'time_1',
    category: 'time',
    question: '평균 취침 시각은 어떻게 되나요?',
    description: '평일 기준으로 답변해주세요',
    leftLabel: '밤 10시 이전',
    rightLabel: '새벽 2시 이후',
  },
  {
    id: 'time_2',
    category: 'time',
    question: '평균 기상 시각은 어떻게 되나요?',
    description: '평일 기준으로 답변해주세요',
    leftLabel: '오전 6시 이전',
    rightLabel: '오전 10시 이후',
  },
  {
    id: 'time_3',
    category: 'time',
    question: '알람을 몇 번이나 맞추시나요?',
    description: '5분 간격 알람 포함',
    leftLabel: '1번에 기상',
    rightLabel: '5번 이상',
  },
  {
    id: 'time_4',
    category: 'time',
    question: '밤새는 빈도가 어떻게 되나요?',
    leftLabel: '거의 없음',
    rightLabel: '주 2회 이상',
  },

  // ===== 공간 관리 (clean_1~4) =====
  {
    id: 'clean_1',
    category: 'clean',
    question: '바닥 정리는 얼마나 자주 하시나요?',
    description: '청소기, 물건 정리 등 포함',
    leftLabel: '매일',
    rightLabel: '월 1회 이하',
  },
  {
    id: 'clean_2',
    category: 'clean',
    question: '쓰레기는 얼마나 자주 버리시나요?',
    leftLabel: '매일',
    rightLabel: '일주일에 1번',
  },
  {
    id: 'clean_3',
    category: 'clean',
    question: '화장실 청소는 얼마나 자주 하시나요?',
    leftLabel: '주 2회 이상',
    rightLabel: '월 1회 이하',
  },
  {
    id: 'clean_4',
    category: 'clean',
    question: '빨래는 얼마나 자주 하시나요?',
    leftLabel: '주 3회 이상',
    rightLabel: '2주에 1번',
  },

  // ===== 생활 습관 (habit_1~4) =====
  {
    id: 'habit_1',
    category: 'habit',
    question: '방에서 소음이 발생하는 빈도는 어떤가요?',
    description: '영상 시청, 통화, 타건 등 종합',
    leftLabel: '거의 없음',
    rightLabel: '자주 발생',
  },
  {
    id: 'habit_2',
    category: 'habit',
    question: '방에서 음식을 먹는 빈도는 어떤가요?',
    leftLabel: '거의 안 먹음',
    rightLabel: '매일 먹음',
  },
  {
    id: 'habit_3',
    category: 'habit',
    question: '취침 시 환경은 어떤 것을 선호하시나요?',
    description: '불빛, 소리에 대한 민감도',
    leftLabel: '완전 암막/무음',
    rightLabel: '약간의 빛/소리 OK',
  },
  {
    id: 'habit_4',
    category: 'habit',
    question: '온도 선호도는 어떻게 되나요?',
    description: '에어컨/난방 사용 관련',
    leftLabel: '시원하게',
    rightLabel: '따뜻하게',
  },

  // ===== 사회성 (social_1~5) =====
  {
    id: 'social_1',
    category: 'social',
    question: '룸메이트와 일상 대화를 얼마나 원하시나요?',
    leftLabel: '최소한',
    rightLabel: '자주 대화',
  },
  {
    id: 'social_2',
    category: 'social',
    question: '룸메이트와 함께 활동하는 것을 선호하시나요?',
    description: '밥, 운동 등',
    leftLabel: '각자 생활',
    rightLabel: '함께 활동',
  },
  {
    id: 'social_3',
    category: 'social',
    question: '방에 친구를 초대하는 빈도는 어떤가요?',
    leftLabel: '거의 안 함',
    rightLabel: '자주 초대',
  },
  {
    id: 'social_4',
    category: 'social',
    question: '물건 공유에 대한 의향은 어떤가요?',
    description: '생필품 등',
    leftLabel: '개인 물건만',
    rightLabel: '자유롭게 공유',
  },
  {
    id: 'social_5',
    category: 'social',
    question: '개인 시간이 얼마나 필요하신가요?',
    leftLabel: '많이 필요',
    rightLabel: '상관없음',
  },

  // ===== 기타 (etc_1~2) =====
  {
    id: 'etc_1',
    category: 'etc',
    question: '음주 빈도는 어떻게 되나요?',
    leftLabel: '안 함',
    rightLabel: '주 3회 이상',
  },
  {
    id: 'etc_2',
    category: 'etc',
    question: '주로 공부/작업하는 장소는 어디인가요?',
    leftLabel: '주로 방',
    rightLabel: '주로 외부',
  },
];

// 백엔드 REQUIRED_KEYS
export const SURVEY_REQUIRED_KEYS = [
  'time_1', 'time_2', 'time_3', 'time_4',
  'clean_1', 'clean_2', 'clean_3', 'clean_4',
  'habit_1', 'habit_2', 'habit_3', 'habit_4',
  'social_1', 'social_2', 'social_3', 'social_4', 'social_5',
  'etc_1', 'etc_2',
];

// Property 기본 정보 질문 (기숙사 동 등)
export interface PropertyQuestion {
  id: string;
  question: string;
  type: 'boolean' | 'select' | 'preference';
  options?: { value: string | number | boolean; label: string }[];
}

export const propertyQuestions: PropertyQuestion[] = [
  {
    id: 'dorm_building',
    question: '희망 기숙사 동',
    type: 'select',
    options: [
      { value: 'G', label: 'G동' },
      { value: 'I', label: 'I동' },
      { value: 'S', label: 'S동' },
      { value: 'T', label: 'T동' },
    ],
  },
  {
    id: 'stay_period',
    question: '최소 입주 기간',
    type: 'select',
    options: [
      { value: 1, label: '1학기' },
      { value: 2, label: '2학기 (1년)' },
      { value: 3, label: '3학기' },
    ],
  },
  {
    id: 'is_smoker',
    question: '흡연 여부',
    type: 'boolean',
    options: [
      { value: true, label: 'O' },
      { value: false, label: 'X' },
    ],
  },
  {
    id: 'has_fridge',
    question: '냉장고 보유 여부',
    type: 'boolean',
    options: [
      { value: true, label: 'O' },
      { value: false, label: 'X' },
    ],
  },
  {
    id: 'mate_fridge',
    question: '상대방 냉장고 보유 선호',
    type: 'preference',
    options: [
      { value: 0, label: '상관없음' },
      { value: 1, label: '선호' },
      { value: 2, label: '비선호' },
    ],
  },
  {
    id: 'has_router',
    question: '공유기 보유 여부',
    type: 'boolean',
    options: [
      { value: true, label: 'O' },
      { value: false, label: 'X' },
    ],
  },
  {
    id: 'mate_router',
    question: '상대방 공유기 보유 선호',
    type: 'preference',
    options: [
      { value: 0, label: '상관없음' },
      { value: 1, label: '선호' },
      { value: 2, label: '비선호' },
    ],
  },
];
