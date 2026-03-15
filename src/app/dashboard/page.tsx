import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { UserStatCard } from "@/components/leaderboard/UserStatCard";
import type { LeaderboardEntry, UserStats } from "@/types/leaderboard";

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const sessions = await prisma.gameSession.findMany({
    where: { completed: true },
    orderBy: [{ durationSeconds: "asc" }, { mistakeCount: "asc" }],
    take: 50,
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return sessions.map((s, i) => ({
    rank: i + 1,
    userId: s.user.id,
    userName: s.user.name,
    userImage: s.user.image,
    durationSeconds: s.durationSeconds ?? 0,
    mistakeCount: s.mistakeCount,
    usedHint: s.usedHint,
    completedAt: s.completedAt?.toISOString() ?? "",
  }));
}

async function getUserStats(userId: string): Promise<UserStats> {
  const sessions = await prisma.gameSession.findMany({
    where: { userId, completed: true },
    include: { puzzle: { select: { id: true, title: true } } },
  });

  const bestTimes = sessions
    .sort((a, b) => (a.durationSeconds ?? 0) - (b.durationSeconds ?? 0))
    .slice(0, 3)
    .map((s) => ({
      puzzleId: s.puzzleId,
      puzzleTitle: s.puzzle.title,
      durationSeconds: s.durationSeconds ?? 0,
    }));

  const total = sessions.length;
  const avg =
    total > 0
      ? sessions.reduce((sum, s) => sum + (s.durationSeconds ?? 0), 0) / total
      : 0;

  return { totalCompleted: total, bestTimes, averageSeconds: avg };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [leaderboard, userStats] = await Promise.all([
    getLeaderboard(),
    getUserStats(session.user.id),
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">რეიტინგი</h1>
      <p className="text-gray-500 mb-6">საუკეთესო შედეგები</p>

      <div className="mb-6">
        <UserStatCard
          stats={userStats}
          userName={session.user.name ?? null}
          userImage={session.user.image ?? null}
        />
      </div>

      <LeaderboardTable entries={leaderboard} currentUserId={session.user.id} />
    </div>
  );
}
