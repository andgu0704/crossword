export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string | null;
  userImage: string | null;
  durationSeconds: number;
  mistakeCount: number;
  usedHint: boolean;
  completedAt: string;
}

export interface UserStats {
  totalCompleted: number;
  bestTimes: { puzzleId: string; puzzleTitle: string; durationSeconds: number }[];
  averageSeconds: number;
}
