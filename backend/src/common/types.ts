export type Difficulty = "easy" | "medium" | "hard";

export interface ScoreDto {
  name: string;
  score: number;
  difficulty: Difficulty;
}

export interface RankingEntry {
  name: string;
  score: number;
  timestamp: string;
}
