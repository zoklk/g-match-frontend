export interface Question {
  id: string;
  category: string;
  question: string;
  description?: string;
  leftLabel: string;
  rightLabel: string;
  type?: 'slider' | 'time';
  inverseScore?: boolean; // 값이 다를수록 유사도 증가
}

export interface SoftQuestion {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

export const surveyCategories = [
  { id: 'lifestyle', name: '생활 리듬', icon: '🌙', leftAxis: '아침형', rightAxis: '저녁형' },
  { id: 'space', name: '공간 관리', icon: '🏠', leftAxis: '깔끔형', rightAxis: '자유형' },
  { id: 'habits', name: '생활 습관', icon: '🎧', leftAxis: '조용형', rightAxis: '활동형' },
  { id: 'social', name: '사회성', icon: '👥', leftAxis: '독립형', rightAxis: '교류형' },
];

export const surveyQuestions: Question[] = [
  // 생활 리듬 (Lifestyle) - 5문항
  {
    id: 'lifestyle_1',
    category: 'lifestyle',
    question: '평균 취침 시각은 어떻게 되나요?',
    description: '평일 기준으로 답변해주세요',
    leftLabel: '밤 10시 이전',
    rightLabel: '새벽 2시 이후',
  },
  {
    id: 'lifestyle_2',
    category: 'lifestyle',
    question: '평균 기상 시각은 어떻게 되나요?',
    description: '평일 기준으로 답변해주세요',
    leftLabel: '오전 6시 이전',
    rightLabel: '오전 10시 이후',
  },
  {
    id: 'lifestyle_3',
    category: 'lifestyle',
    question: '알람을 몇 번이나 맞추시나요?',
    description: '5분 간격 알람 포함',
    leftLabel: '1번에 기상',
    rightLabel: '5번 이상',
  },
  {
    id: 'lifestyle_4',
    category: 'lifestyle',
    question: '밤새는 빈도가 어떻게 되나요?',
    leftLabel: '거의 없음',
    rightLabel: '주 2회 이상',
  },
  {
    id: 'lifestyle_5',
    category: 'lifestyle',
    question: '방에 있는 시간대가 겹치는 것을 선호하시나요?',
    description: '룸메이트와 방에 있는 시간이 겹치는 것에 대한 선호도',
    leftLabel: '다른 게 좋음',
    rightLabel: '같은 게 좋음',
    inverseScore: true,
  },

  // 공간 관리 (Space) - 5문항
  {
    id: 'space_1',
    category: 'space',
    question: '바닥 정리는 얼마나 자주 하시나요?',
    description: '청소기, 물건 정리 등 포함',
    leftLabel: '매일',
    rightLabel: '월 1회 이하',
  },
  {
    id: 'space_2',
    category: 'space',
    question: '쓰레기는 얼마나 자주 버리시나요?',
    leftLabel: '매일',
    rightLabel: '일주일에 1번',
  },
  {
    id: 'space_3',
    category: 'space',
    question: '빨래는 얼마나 자주 하시나요?',
    leftLabel: '주 3회 이상',
    rightLabel: '2주에 1번',
  },
  {
    id: 'space_4',
    category: 'space',
    question: '화장실 청소는 얼마나 자주 하시나요?',
    leftLabel: '주 2회 이상',
    rightLabel: '월 1회 이하',
  },
  {
    id: 'space_5',
    category: 'space',
    question: '음식물/식기는 바로 처리하시나요?',
    leftLabel: '바로 처리',
    rightLabel: '나중에 한번에',
  },

  // 생활 습관 (Habits) - 4문항
  {
    id: 'habits_1',
    category: 'habits',
    question: '방에서 소음이 발생하는 빈도는 어떤가요?',
    description: '영상 시청, 통화, 타건 등 종합',
    leftLabel: '거의 없음',
    rightLabel: '자주 발생',
  },
  {
    id: 'habits_2',
    category: 'habits',
    question: '방에서 음식을 먹는 빈도는 어떤가요?',
    leftLabel: '거의 안 먹음',
    rightLabel: '매일 먹음',
  },
  {
    id: 'habits_3',
    category: 'habits',
    question: '취침 시 환경은 어떤 것을 선호하시나요?',
    description: '불빛, 소리에 대한 민감도',
    leftLabel: '완전 암막/무음',
    rightLabel: '약간의 빛/소리 OK',
  },
  {
    id: 'habits_4',
    category: 'habits',
    question: '온도 선호도는 어떻게 되나요?',
    description: '에어컨/난방 사용 관련',
    leftLabel: '시원하게',
    rightLabel: '따뜻하게',
  },

  // 사회성 (Social) - 5문항
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
];

export const softQuestions: SoftQuestion[] = [
  {
    id: 'soft_drinking',
    question: '음주 빈도는 어떻게 되나요?',
    options: [
      { value: 'none', label: '안 함' },
      { value: 'monthly', label: '월 1-2회' },
      { value: 'weekly', label: '주 1-2회' },
      { value: 'frequent', label: '주 3회+' },
    ],
  },
  {
    id: 'soft_study_place',
    question: '주로 공부/작업하는 장소는 어디인가요?',
    options: [
      { value: 'room', label: '주로 방' },
      { value: 'half', label: '반반' },
      { value: 'outside', label: '주로 외부' },
    ],
  },
];

export interface BasicInfoOption {
  value: string;
  label: string;
}

export interface BasicInfoQuestion {
  id: string;
  question: string;
  options: BasicInfoOption[];
}

export const basicInfoQuestions: BasicInfoQuestion[] = [
  {
    id: 'roomMove',
    question: '방 이동',
    options: [
      { value: 'keep', label: '기존 방 유지' },
      { value: 'any', label: '상관 없음' },
    ],
  },
  {
    id: 'minPeriod',
    question: '최소 룸메이트 기간',
    options: [
      { value: '1semester', label: '1학기' },
      { value: '1year', label: '1년' },
      { value: 'any', label: '상관없음' },
    ],
  },
  {
    id: 'dormBuilding',
    question: '기숙사 동',
    options: [
      { value: 'A', label: 'A동' },
      { value: 'B', label: 'B동' },
      { value: 'any', label: '상관없음' },
    ],
  },
  {
    id: 'smoking',
    question: '흡연 여부',
    options: [
      { value: 'yes', label: 'O' },
      { value: 'no', label: 'X' },
      { value: 'any', label: '상관없음' },
    ],
  },
  {
    id: 'hasFridge',
    question: '냉장고 보유 여부',
    options: [
      { value: 'yes', label: 'O' },
      { value: 'no', label: 'X' },
    ],
  },
  {
    id: 'prefFridge',
    question: '상대방 냉장고 보유 선호',
    options: [
      { value: 'yes', label: 'O' },
      { value: 'no', label: 'X' },
      { value: 'any', label: '상관없음' },
    ],
  },
  {
    id: 'hasRouter',
    question: '공유기 보유 여부',
    options: [
      { value: 'yes', label: 'O' },
      { value: 'no', label: 'X' },
    ],
  },
  {
    id: 'prefRouter',
    question: '상대방 공유기 보유 선호',
    options: [
      { value: 'yes', label: 'O' },
      { value: 'no', label: 'X' },
      { value: 'any', label: '상관없음' },
    ],
  },
];
