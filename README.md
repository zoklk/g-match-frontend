# G-Match Frontend

룸메이트 매칭 서비스를 위한 React 기반 프론트엔드 애플리케이션입니다.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn-ui
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Form**: React Hook Form + Zod
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 http://localhost:8080 에서 실행됩니다.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm run test` | 테스트 실행 |
| `npm run preview` | 빌드 미리보기 |

## Project Structure

```
src/
├── pages/        # 페이지 컴포넌트
├── components/   # 재사용 컴포넌트
│   └── ui/       # shadcn-ui 컴포넌트
├── store/        # Zustand 상태 관리
├── hooks/        # 커스텀 훅
├── lib/          # 유틸리티
├── data/         # 데이터 파일
└── test/         # 테스트 파일
```

## Deployment

GitHub Actions를 통해 `main` 브랜치에 푸시 시 AWS S3로 자동 배포됩니다.
