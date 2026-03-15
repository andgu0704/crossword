import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const puzzle = await prisma.puzzle.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      difficulty: true,
      gridSize: true,
      gridData: true,
      clues: true,
      createdAt: true,
      // solution is intentionally excluded
    },
  });

  if (!puzzle) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(puzzle);
}
