import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { validateGrid, countMistakes } from "@/lib/crossword-engine";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { puzzleId } = await req.json();
  if (!puzzleId) {
    return NextResponse.json({ error: "puzzleId required" }, { status: 400 });
  }

  const gameSession = await prisma.gameSession.create({
    data: { userId: session.user.id, puzzleId },
  });

  return NextResponse.json({ sessionId: gameSession.id });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId, userGrid, usedHint } = await req.json();
  if (!sessionId || !userGrid) {
    return NextResponse.json({ error: "sessionId and userGrid required" }, { status: 400 });
  }

  const gameSession = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: { puzzle: { select: { solution: true } } },
  });

  if (!gameSession || gameSession.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const solution = gameSession.puzzle.solution as (string | null)[][];
  const errors = validateGrid(userGrid, solution);
  const mistakes = countMistakes(userGrid, solution);

  // Check if puzzle is complete (all non-black cells filled correctly)
  const isComplete = errors.every((row) => row.every(Boolean));

  const now = new Date();
  const durationSeconds = Math.floor(
    (now.getTime() - gameSession.startedAt.getTime()) / 1000
  );

  const updated = await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      completedAt: isComplete ? now : undefined,
      durationSeconds: isComplete ? durationSeconds : undefined,
      mistakeCount: mistakes,
      completed: isComplete,
      usedHint: usedHint ?? gameSession.usedHint,
    },
  });

  return NextResponse.json({ isComplete, errors, mistakes, durationSeconds });
}
