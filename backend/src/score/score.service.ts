import { Injectable } from "@nestjs/common";
import { Difficulty, RankingEntry, ScoreDto } from "../common/types";
import { Rankings } from "./score.model";

@Injectable()
export class ScoreService {
  private rankings: Rankings = {
    easy: [],
    medium: [],
    hard: [],
  };

  async submitScore(scoreDto: ScoreDto): Promise<{ success: boolean }> {
    const entry: RankingEntry = {
      name: scoreDto.name,
      score: scoreDto.score,
      timestamp: new Date().toISOString(),
    };

    const difficultyRankings = this.rankings[scoreDto.difficulty];
    difficultyRankings.push(entry);

    // 점수 내림차순 정렬, 동점 시 최근 기록 순
    difficultyRankings.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    // 상위 100개만 유지
    if (difficultyRankings.length > 100) {
      this.rankings[scoreDto.difficulty] = difficultyRankings.slice(0, 100);
    }

    return { success: true };
  }

  async getRankings(difficulty: Difficulty): Promise<RankingEntry[]> {
    const difficultyRankings = this.rankings[difficulty];
    // 상위 5명만 반환
    return difficultyRankings.slice(0, 5);
  }

  async reset(): Promise<{ success: boolean }> {
    this.rankings = {
      easy: [],
      medium: [],
      hard: [],
    };
    return { success: true };
  }
}
