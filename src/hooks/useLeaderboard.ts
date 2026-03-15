"use client";

import { useQuery } from "@tanstack/react-query";
import type { LeaderboardEntry } from "@/types/leaderboard";

async function fetchLeaderboard(puzzleId: string): Promise<LeaderboardEntry[]> {
  const res = await fetch(`/api/leaderboard?puzzleId=${puzzleId}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

export function useLeaderboard(puzzleId: string) {
  return useQuery({
    queryKey: ["leaderboard", puzzleId],
    queryFn: () => fetchLeaderboard(puzzleId),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}
