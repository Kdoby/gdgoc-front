import { Controller, Post, Get, Delete, Body, Param } from "@nestjs/common";
import { ScoreService } from "./score.service";
import { ScoreDto } from "../common/types";

@Controller("api")
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post("score")
  async submitScore(@Body() scoreDto: ScoreDto) {
    return await this.scoreService.submitScore(scoreDto);
  }

  @Get("rank/:difficulty")
  async getRankings(@Param("difficulty") difficulty: string) {
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return [];
    }
    return await this.scoreService.getRankings(difficulty as "easy" | "medium" | "hard");
  }

  @Delete("reset")
  async reset() {
    return await this.scoreService.reset();
  }
}
