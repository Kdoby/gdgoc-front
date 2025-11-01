"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const router = useRouter();

  const handleStart = () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요!");
      return;
    }
    router.push(`/game?name=${encodeURIComponent(name)}&difficulty=${difficulty}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md px-6">
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
          {/* 게임 제목 */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
              🪰 모기 퇴치 대작전
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mosquito Reflex Test
            </p>
          </div>

          {/* 설명 */}
          <div className="mb-8 text-center">
            <p className="text-gray-700 dark:text-gray-300">
              1분 동안 화면에 날아다니는 곤충들을 잡아서<br />
              순발력을 테스트해보세요!
            </p>
          </div>

          {/* 유저 이름 입력 */}
          <div className="mb-6">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              유저 이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              maxLength={20}
            />
          </div>

          {/* 난이도 선택 */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              난이도
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                    difficulty === level
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {level === "easy" ? "쉬움" : level === "medium" ? "보통" : "어려움"}
                </button>
              ))}
            </div>
          </div>

          {/* 게임 시작 버튼 */}
          <button
            onClick={handleStart}
            className="w-full rounded-lg bg-indigo-600 px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            게임 시작
          </button>
        </div>
      </main>
    </div>
  );
}
