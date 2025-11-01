type Difficulty = "easy" | "medium" | "hard";

interface GameInfoProps {
  timeLeft: number;
  score: number;
  difficulty: Difficulty;
  gameStarted: boolean;
  gameEnded: boolean;
}

export default function GameInfo({
  timeLeft,
  score,
  difficulty,
  gameStarted,
  gameEnded,
}: GameInfoProps) {
  const difficultyLabels = {
    easy: "쉬움",
    medium: "보통",
    hard: "어려움",
  };

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <div className="grid grid-cols-3 gap-4 text-center">
        {/* 남은 시간 */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            남은 시간
          </div>
          <div
            className={`text-3xl font-bold ${
              timeLeft <= 10 ? "text-red-600" : "text-indigo-600"
            } dark:text-indigo-400`}
          >
            {timeLeft}초
          </div>
        </div>

        {/* 현재 점수 */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            현재 점수
          </div>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {score}
          </div>
        </div>

        {/* 난이도 */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            난이도
          </div>
          <div
            className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${difficultyColors[difficulty]}`}
          >
            {difficultyLabels[difficulty]}
          </div>
        </div>
      </div>
    </div>
  );
}
