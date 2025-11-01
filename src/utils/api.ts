const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ScoreData {
  name: string;
  score: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface RankingEntry {
  name: string;
  score: number;
  timestamp?: string;
}

// 점수 등록
export async function submitScore(data: ScoreData): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("점수 등록 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("점수 등록 오류:", error);
    // 백엔드가 없어도 게임은 진행 가능하도록 에러를 무시하지 않지만
    // 개발 단계에서는 에러를 로그만 남기고 계속 진행
    throw error;
  }
}

// 랭킹 조회
export async function fetchRankings(
  difficulty: "easy" | "medium" | "hard"
): Promise<RankingEntry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rank/${difficulty}`);

    if (!response.ok) {
      throw new Error("랭킹 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("랭킹 조회 오류:", error);
    // 백엔드가 없을 경우 빈 배열 반환
    return [];
  }
}

// 서버 초기화 (개발용)
export async function resetServer(): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reset`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("서버 초기화 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("서버 초기화 오류:", error);
    throw error;
  }
}
