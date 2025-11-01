"use client";

import { useEffect, useState } from "react";
import { fetchRankings } from "@/utils/api";

type Difficulty = "easy" | "medium" | "hard";

interface RankingEntry {
  name: string;
  score: number;
  timestamp?: string;
}

interface RankingBoardProps {
  difficulty: Difficulty;
}

export default function RankingBoard({ difficulty }: RankingBoardProps) {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRankings = async () => {
    try {
      const data = await fetchRankings(difficulty);
      setRankings(data);
      setLoading(false);
    } catch (error) {
      console.error("랭킹 조회 실패:", error);
      // 백엔드가 없을 경우 빈 배열로 표시
      setRankings([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRankings();
    // 5초마다 랭킹 갱신
    const interval = setInterval(loadRankings, 5000);
    return () => clearInterval(interval);
  }, [difficulty]);

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        🏆 랭킹
      </h3>
      <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        난이도: {difficulty === "easy" ? "쉬움" : difficulty === "medium" ? "보통" : "어려움"}
      </div>

      {loading ? (
        <div className="text-center text-gray-500">로딩 중...</div>
      ) : rankings.length === 0 ? (
        <div className="text-center text-gray-500">랭킹 데이터가 없습니다.</div>
      ) : (
        <div className="space-y-2">
          {rankings.slice(0, 5).map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {entry.name}
                </span>
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {entry.score}점
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
