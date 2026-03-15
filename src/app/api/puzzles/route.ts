import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const puzzles = await prisma.puzzle.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      gridSize: true,
      createdAt: true,
      _count: { select: { gameSessions: { where: { completed: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(puzzles);
}
