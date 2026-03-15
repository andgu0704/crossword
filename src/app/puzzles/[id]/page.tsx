import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { GameClient } from "./GameClient";

export default async function PuzzlePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

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
    },
  });

  if (!puzzle) notFound();

  return (
    <GameClient
      puzzle={puzzle as never}
      userId={session.user.id!}
    />
  );
}
