"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GameBoard from "@/components/GameBoard";
import GameInfo from "@/components/GameInfo";
import RankingBoard from "@/components/RankingBoard";
import { submitScore } from "@/utils/api";

type Difficulty = "easy" | "medium" | "hard";

export default function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name") || "";
  const difficulty = (searchParams.get("difficulty") || "easy") as Difficulty;

  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!name) {
      router.push("/");
      return;
    }
  }, [name, router]);

  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded]);

  // 게임 종료 시 점수 저장
  useEffect(() => {
    if (gameEnded && gameStarted && name) {
      const saveScore = async () => {
        try {
          await submitScore({
            name,
            score,
            difficulty,
          });
        } catch (error) {
          console.error("점수 저장 실패:", error);
          // 점수 저장 실패해도 게임은 계속 진행 가능
        }
      };
      saveScore();
    }
  }, [gameEnded, gameStarted, name, score, difficulty]);

  const handleStart = () => {
    setGameStarted(true);
    setTimeLeft(60);
    setScore(0);
    setGameEnded(false);
  };

  const handleScoreChange = (points: number) => {
    if (gameStarted && !gameEnded) {
      setScore((prev) => Math.max(0, prev + points));
    }
  };

  const handleRestart = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 게임 정보 및 보드 영역 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 게임 정보 */}
            <GameInfo
              timeLeft={timeLeft}
              score={score}
              difficulty={difficulty}
              gameStarted={gameStarted}
              gameEnded={gameEnded}
            />

            {/* 게임 보드 */}
            <GameBoard
              difficulty={difficulty}
              gameStarted={gameStarted}
              gameEnded={gameEnded}
              onScoreChange={handleScoreChange}
              onStart={handleStart}
            />

            {/* 게임 종료 및 재시작 */}
            {gameEnded && (
              <div className="text-center">
                <div className="mb-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                  <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    게임 종료!
                  </h2>
                  <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                    최종 점수: <span className="font-bold text-indigo-600">{score}점</span>
                  </p>
                  <button
                    onClick={handleRestart}
                    className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    다시 시작하기
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 랭킹 보드 */}
          <div className="lg:col-span-1">
            <RankingBoard difficulty={difficulty} />
          </div>
        </div>
      </div>
    </div>
  );
}
