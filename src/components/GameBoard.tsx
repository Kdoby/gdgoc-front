"use client";

import { useEffect, useState, useRef } from "react";

type Difficulty = "easy" | "medium" | "hard";

type BugType = "mosquito" | "malaria" | "bee";

interface Bug {
  id: string;
  type: BugType;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GameBoardProps {
  difficulty: Difficulty;
  gameStarted: boolean;
  gameEnded: boolean;
  onScoreChange: (points: number) => void;
  onStart: () => void;
}

const BUG_SCORES: Record<BugType, number> = {
  mosquito: 1,
  malaria: 3,
  bee: -5,
};

const BUG_EMOJIS: Record<BugType, string> = {
  mosquito: "🦟",
  malaria: "🩸",
  bee: "🐝",
};

const BUG_NAMES: Record<BugType, string> = {
  mosquito: "일반 모기",
  malaria: "말라리아 모기",
  bee: "벌",
};

// 난이도별 설정
const DIFFICULTY_CONFIG = {
  easy: {
    speed: { min: 0.5, max: 1.0 },
    spawnInterval: 2000, // 2초
    probabilities: { mosquito: 0.7, malaria: 0.2, bee: 0.1 },
  },
  medium: {
    speed: { min: 0.8, max: 1.5 },
    spawnInterval: 1500, // 1.5초
    probabilities: { mosquito: 0.6, malaria: 0.25, bee: 0.15 },
  },
  hard: {
    speed: { min: 1.0, max: 2.0 },
    spawnInterval: 1000, // 1초
    probabilities: { mosquito: 0.5, malaria: 0.3, bee: 0.2 },
  },
};

export default function GameBoard({
  difficulty,
  gameStarted,
  gameEnded,
  onScoreChange,
  onStart,
}: GameBoardProps) {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const spawnIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // 곤충 타입 선택 (확률 기반)
  const selectBugType = (): BugType => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const rand = Math.random();
    if (rand < config.probabilities.mosquito) return "mosquito";
    if (rand < config.probabilities.mosquito + config.probabilities.malaria)
      return "malaria";
    return "bee";
  };

  // 새 곤충 생성
  const spawnBug = () => {
    if (!boardRef.current || gameEnded) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const config = DIFFICULTY_CONFIG[difficulty];
    const speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);
    const angle = Math.random() * Math.PI * 2;

    const bug: Bug = {
      id: Math.random().toString(36).substring(7),
      type: selectBugType(),
      x: Math.random() * (boardRect.width - 60),
      y: Math.random() * (boardRect.height - 60),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    };

    setBugs((prev) => [...prev, bug]);
  };

  // 곤충 이동 애니메이션
  useEffect(() => {
    if (!gameStarted || gameEnded || !boardRef.current) return;

    const animate = () => {
      setBugs((prevBugs) => {
        if (!boardRef.current) return prevBugs;

        const boardRect = boardRef.current.getBoundingClientRect();
        const bugSize = 60;

        return prevBugs.map((bug) => {
          let newX = bug.x + bug.vx;
          let newY = bug.y + bug.vy;

          // 벽에 부딪히면 반사
          if (newX <= 0 || newX >= boardRect.width - bugSize) {
            bug.vx *= -1;
            newX = Math.max(0, Math.min(boardRect.width - bugSize, newX));
          }
          if (newY <= 0 || newY >= boardRect.height - bugSize) {
            bug.vy *= -1;
            newY = Math.max(0, Math.min(boardRect.height - bugSize, newY));
          }

          return {
            ...bug,
            x: newX,
            y: newY,
            vx: bug.vx,
            vy: bug.vy,
          };
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameEnded]);

  // 곤충 생성 주기
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const config = DIFFICULTY_CONFIG[difficulty];
    spawnIntervalRef.current = setInterval(spawnBug, config.spawnInterval);

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, [difficulty, gameStarted, gameEnded]);

  // 게임 종료 시 모든 곤충 제거
  useEffect(() => {
    if (gameEnded) {
      setBugs([]);
    }
  }, [gameEnded]);

  // 곤충 클릭 핸들러
  const handleBugClick = (bug: Bug) => {
    if (!gameStarted || gameEnded) return;

    const points = BUG_SCORES[bug.type];
    onScoreChange(points);

    // 클릭된 곤충 제거
    setBugs((prev) => prev.filter((b) => b.id !== bug.id));
  };

  if (!gameStarted) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="mb-6 text-6xl">🪰</div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            게임 준비 완료!
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            아래 버튼을 눌러 게임을 시작하세요.
          </p>
          <button
            onClick={onStart}
            className="rounded-lg bg-indigo-600 px-8 py-3 text-lg font-semibold text-white transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            게임 시작
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={boardRef}
      className="relative h-[600px] w-full overflow-hidden rounded-lg border-2 border-gray-300 bg-gradient-to-br from-green-100 to-emerald-200 dark:border-gray-600 dark:from-gray-800 dark:to-gray-900"
    >
      {bugs.map((bug) => (
        <div
          key={bug.id}
          onClick={() => handleBugClick(bug)}
          className="absolute cursor-pointer transition-transform hover:scale-110 active:scale-95"
          style={{
            left: `${bug.x}px`,
            top: `${bug.y}px`,
            fontSize: "48px",
            userSelect: "none",
            zIndex: 10,
          }}
          title={BUG_NAMES[bug.type]}
        >
          {BUG_EMOJIS[bug.type]}
        </div>
      ))}
      {bugs.length === 0 && !gameEnded && (
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            곤충이 곧 나타납니다...
          </p>
        </div>
      )}
    </div>
  );
}
