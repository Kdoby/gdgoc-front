# 🪰 모기 퇴치 대작전 (Mosquito Reflex Test)

순발력 테스트 게임 - 1분 동안 화면에 날아다니는 곤충들을 잡아 점수를 얻는 게임입니다.

## 🎮 게임 규칙

- **게임 시간**: 1분 (60초)
- **곤충 종류**:
  - 🦟 일반 모기: +1점
  - 🩸 말라리아 모기: +3점
  - 🐝 벌: -5점
- **난이도**: 쉬움 / 보통 / 어려움 (속도와 출현 빈도가 다름)

## 🚀 실행 방법

### 프론트엔드 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 백엔드 실행

```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 개발 서버 실행
npm run start:dev
```

백엔드는 `http://localhost:3001`에서 실행됩니다.

## 📁 프로젝트 구조

```
gdgoc_game_front/
├── src/
│   ├── app/
│   │   ├── page.tsx          # 홈 화면
│   │   └── game/
│   │       └── page.tsx      # 게임 화면
│   ├── components/
│   │   ├── GameBoard.tsx     # 게임 보드 (곤충 이동)
│   │   ├── GameInfo.tsx      # 게임 정보 (시간, 점수)
│   │   └── RankingBoard.tsx  # 랭킹 보드
│   └── utils/
│       └── api.ts            # API 호출 함수
└── backend/
    └── src/
        ├── main.ts           # 서버 진입점
        ├── app.module.ts     # Nest.js 모듈
        └── score/
            ├── score.controller.ts  # API 컨트롤러
            ├── score.service.ts      # 비즈니스 로직
            └── score.model.ts        # 데이터 모델
```

## 🛠 기술 스택

- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Backend**: Nest.js 10, TypeScript
- **상태 관리**: React Hooks (useState, useEffect)

## 📝 API 엔드포인트

### 점수 등록
```
POST /api/score
Body: { name: string, score: number, difficulty: "easy" | "medium" | "hard" }
```

### 랭킹 조회
```
GET /api/rank/:difficulty
Response: [{ name: string, score: number }]
```

### 서버 초기화 (개발용)
```
DELETE /api/reset
```

## ✨ 주요 기능

- ✅ 홈 화면 (이름 입력, 난이도 선택)
- ✅ 게임 화면 (곤충 클릭, 점수 계산)
- ✅ 실시간 타이머
- ✅ 난이도별 속도 및 확률 조정
- ✅ 점수 저장 및 랭킹 표시
- ✅ 서버 메모리 기반 랭킹 시스템

## 📄 PRD

자세한 요구사항은 `prd.md` 파일을 참고하세요.