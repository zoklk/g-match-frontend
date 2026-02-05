// ============================================
// 백엔드 REQUIRED_KEYS에 맞춘 설문 데이터
// time_1~4, clean_1~4, habit_1~4, social_1~5, etc_1~2 (총 19문항)
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
  { id: 'time', name: '생활 리듬', icon: '', leftAxis: '', rightAxis: '' },
  { id: 'clean', name: '공간 관리', icon: '', leftAxis: '', rightAxis: '' },
  { id: 'habit', name: '생활 습관', icon: '', leftAxis: '', rightAxis: '' },
  { id: 'social', name: '사회성', icon: '', leftAxis: '', rightAxis: '' },
  { id: 'etc', name: '생활 기타', icon: '', leftAxis: '', rightAxis: '' },
];

export const surveyQuestions: Question[] = [
  // ===== 생활 리듬 (time_1~4) =====
  {
    id: 'time_1',
    category: 'time',
    question: '나는 주로 늦은 밤(새벽 1시 이후)에 잠자리에 드는 편이다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'time_2',
    category: 'time',
    question: '나는 아침잠이 많아 기상 시간이 늦은 편이다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'time_3',
    category: 'time',
    question: '나는 잠에서 깨기 위해 알람을 여러 번(5분 간격 등) 설정해야 한다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'time_4',
    category: 'time',
    question: '나는 시험 기간이나 과제 마감 때 밤을 자주 새우는 편이다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },

  // ===== 공간 관리 (clean_1~4) =====
  {
    id: 'clean_1',
    category: 'clean',
    question: '나는 바닥에 머리카락이나 먼지가 보이면 즉시 치우는 편이다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'clean_2',
    category: 'clean',
    question: '나는 쓰레기통이 가득 차기 전에 미리미리 비우는 편이다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'clean_3',
    category: 'clean',
    question: '나는 화장실 청소(물기 제거, 머리카락 정리 등)를 주기적으로 꼼꼼히 한다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'clean_4',
    category: 'clean',
    question: '나는 빨래를 모아두지 않고 소량이라도 자주(2~3일에 한 번) 하는 편이다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },

  // ===== 생활 습관 (habit_1~4) =====
  {
    id: 'habit_1',
    category: 'habit',
    question: '나는 방 안에서 통화를 하거나 기계식 키보드를 사용하는 등 소음에 크게 신경 쓰지 않는다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'habit_2',
    category: 'habit',
    question: '나는 방 안에서 식사(배달 음식, 라면 등)를 해결하는 경우가 많다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'habit_3',
    category: 'habit',
    question: '나는 잘 때 약간의 불빛(무드등)이나 소음(ASMR)이 있어도 잘 자는 편이다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'habit_4',
    category: 'habit',
    question: '나는 실내 공기가 서늘한 것보다 따뜻한 것을 선호한다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },

  // ===== 사회성 (social_1~5) =====
  {
    id: 'social_1',
    category: 'social',
    question: '나는 룸메이트와 일상을 공유하며 친구처럼 지내고 싶다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'social_2',
    category: 'social',
    question: '나는 룸메이트와 밥을 먹거나 운동을 하는 등 활동을 같이 하는 것이 좋다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'social_3',
    category: 'social',
    question: '나는 기숙사 방에 친구나 지인을 자주 초대하는 편이다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'social_4',
    category: 'social',
    question: '나는 휴지나 치약 같은 생필품을 룸메이트와 같이 사서 공유하는 것이 편하다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'social_5',
    category: 'social',
    question: '나는 룸메이트가 방에 항상 같이 있어도 불편하지 않다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },

  // ===== 기타 (etc_1~2) =====
  {
    id: 'etc_1',
    category: 'etc',
    question: '나는 술자리를 좋아하고, 술을 마시고 늦게 들어오는 편이다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
  },
  {
    id: 'etc_2',
    category: 'etc',
    question: '나는 방 안보다 도서관이나 카페 등 밖으로 나가서 활동하는 것을 선호한다.',
    leftLabel: '그렇지 않다',
    rightLabel: '그렇다',
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
      { value: 'A', label: '상관없음' },
    ],
  },
  {
    id: 'stay_period',
    question: '희망 거주 기간',
    type: 'select',
    options: [
      { value: 1, label: '1학기' },
      { value: 2, label: '2학기' },
      { value: 3, label: '3학기' },
      { value: 4, label: '4학기+' },
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
      { value: 0, label: '선호' },
      { value: 1, label: '비선호' },
      { value: 2, label: '상관없음' },
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
      { value: 0, label: '선호' },
      { value: 1, label: '비선호' },
      { value: 2, label: '상관없음' },
    ],
  },
];
