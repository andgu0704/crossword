import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const puzzleId = searchParams.get("puzzleId");

  const where = {
    completed: true,
    ...(puzzleId ? { puzzleId } : {}),
  };

  const sessions = await prisma.gameSession.findMany({
    where,
    orderBy: [{ durationSeconds: "asc" }, { mistakeCount: "asc" }],
    take: 100,
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  const entries = sessions.map((s, i) => ({
    rank: i + 1,
    userId: s.user.id,
    userName: s.user.name,
    userImage: s.user.image,
    durationSeconds: s.durationSeconds ?? 0,
    mistakeCount: s.mistakeCount,
    usedHint: s.usedHint,
    completedAt: s.completedAt?.toISOString() ?? "",
  }));

  return NextResponse.json(entries);
}
