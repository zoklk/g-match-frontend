export interface Question {
  id: string;
  category: string;
  question: string;
  description?: string;
  leftLabel: string;
  rightLabel: string;
}

export const surveyCategories = [
  { id: 'lifestyle', name: '생활 리듬', icon: '🌙', color: 'chart-1' },
  { id: 'space', name: '공간 관리', icon: '🏠', color: 'chart-2' },
  { id: 'habits', name: '생활 습관', icon: '🎧', color: 'chart-3' },
  { id: 'social', name: '사회성', icon: '👥', color: 'chart-4' },
];

export const surveyQuestions: Question[] = [
  // 생활 리듬 (Lifestyle)
  {
    id: 'lifestyle_1',
    category: 'lifestyle',
    question: '주로 몇 시에 잠자리에 드시나요?',
    description: '평일 기준 평균 취침 시간을 생각해주세요',
    leftLabel: '밤 10시 이전',
    rightLabel: '새벽 2시 이후',
  },
  {
    id: 'lifestyle_2',
    category: 'lifestyle',
    question: '아침에 일어나는 시간은 어떻게 되나요?',
    description: '평일 기준 평균 기상 시간을 생각해주세요',
    leftLabel: '오전 6시 이전',
    rightLabel: '오전 10시 이후',
  },
  {
    id: 'lifestyle_3',
    category: 'lifestyle',
    question: '주말에도 비슷한 생활 패턴을 유지하시나요?',
    leftLabel: '주말에도 동일',
    rightLabel: '완전히 다름',
  },
  {
    id: 'lifestyle_4',
    category: 'lifestyle',
    question: '밤에 활동하는 것을 선호하시나요?',
    leftLabel: '아침형 인간',
    rightLabel: '완전 올빼미형',
  },
  {
    id: 'lifestyle_5',
    category: 'lifestyle',
    question: '낮잠을 자주 자시나요?',
    leftLabel: '거의 안 잠',
    rightLabel: '매일 낮잠',
  },

  // 공간 관리 (Space)
  {
    id: 'space_1',
    category: 'space',
    question: '방 청소는 얼마나 자주 하시나요?',
    description: '청소기, 정리정돈 등을 포함합니다',
    leftLabel: '매일',
    rightLabel: '월 1회 이하',
  },
  {
    id: 'space_2',
    category: 'space',
    question: '물건 정리를 어떻게 하시나요?',
    leftLabel: '항상 정리정돈',
    rightLabel: '어질러져도 OK',
  },
  {
    id: 'space_3',
    category: 'space',
    question: '공용 공간 사용에 대한 생각은?',
    leftLabel: '엄격하게 분리',
    rightLabel: '자유롭게 공유',
  },
  {
    id: 'space_4',
    category: 'space',
    question: '방 온도에 대한 선호도는?',
    leftLabel: '시원하게',
    rightLabel: '따뜻하게',
  },
  {
    id: 'space_5',
    category: 'space',
    question: '방에서 음식을 먹는 것에 대해 어떻게 생각하시나요?',
    leftLabel: '절대 안 됨',
    rightLabel: '자유롭게',
  },

  // 생활 습관 (Habits)
  {
    id: 'habits_1',
    category: 'habits',
    question: '음악이나 영상을 볼 때 이어폰을 사용하시나요?',
    description: '공부할 때나 휴식할 때 모두 포함합니다',
    leftLabel: '항상 이어폰',
    rightLabel: '스피커 선호',
  },
  {
    id: 'habits_2',
    category: 'habits',
    question: '방에서 통화를 자주 하시나요?',
    leftLabel: '거의 안 함',
    rightLabel: '자주 함',
  },
  {
    id: 'habits_3',
    category: 'habits',
    question: '알람 소리에 대해 어떻게 생각하시나요?',
    leftLabel: '한 번에 기상',
    rightLabel: '여러 번 울림',
  },
  {
    id: 'habits_4',
    category: 'habits',
    question: '공부할 때 음악이나 소리가 필요한가요?',
    leftLabel: '완전 무음',
    rightLabel: '항상 음악 필요',
  },
  {
    id: 'habits_5',
    category: 'habits',
    question: '흡연/음주에 대한 생각은?',
    leftLabel: '전혀 안 함',
    rightLabel: '자유롭게',
  },

  // 사회성 (Social)
  {
    id: 'social_1',
    category: 'social',
    question: '룸메이트와 얼마나 교류하고 싶으신가요?',
    description: '대화, 식사, 활동 등을 포함합니다',
    leftLabel: '최소한의 교류',
    rightLabel: '친한 친구처럼',
  },
  {
    id: 'social_2',
    category: 'social',
    question: '친구를 방에 초대하는 것에 대해 어떻게 생각하시나요?',
    leftLabel: '방문 금지',
    rightLabel: '자유롭게 초대',
  },
  {
    id: 'social_3',
    category: 'social',
    question: '방에서 혼자 있는 시간이 중요한가요?',
    leftLabel: '매우 중요',
    rightLabel: '상관없음',
  },
  {
    id: 'social_4',
    category: 'social',
    question: '갈등이 생겼을 때 어떻게 해결하시나요?',
    leftLabel: '바로 대화',
    rightLabel: '시간 두고 해결',
  },
];

export const basicInfoOptions = {
  gender: [
    { value: 'male', label: '남성' },
    { value: 'female', label: '여성' },
  ],
  studentYear: [
    { value: '24', label: '24학번' },
    { value: '23', label: '23학번' },
    { value: '22', label: '22학번' },
    { value: '21', label: '21학번' },
    { value: '20', label: '20학번 이상' },
  ],
  stayPeriod: [
    { value: '1semester', label: '1학기' },
    { value: '2semester', label: '2학기' },
    { value: '1year', label: '1년' },
    { value: '2year', label: '2년 이상' },
  ],
  dormBuilding: [
    { value: 'A', label: 'A동' },
    { value: 'B', label: 'B동' },
    { value: 'C', label: 'C동' },
    { value: 'D', label: 'D동' },
  ],
};
