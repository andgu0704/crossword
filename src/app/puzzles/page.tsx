import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const difficultyLabel: Record<string, string> = {
  easy: "მარტივი",
  medium: "საშუალო",
  hard: "რთული",
};

const difficultyColor: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

export default async function PuzzlesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const puzzles = await prisma.puzzle.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      gridSize: true,
      _count: { select: { gameSessions: { where: { completed: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">კვესტვორდები</h1>
      <p className="text-gray-500 mb-6">აირჩიე სირთულე და დაიწყე</p>
      <div className="grid gap-4">
        {puzzles.map((puzzle) => (
          <Link key={puzzle.id} href={`/puzzles/${puzzle.id}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-400 hover:shadow-sm transition-all flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-gray-900">{puzzle.title}</h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[puzzle.difficulty] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {difficultyLabel[puzzle.difficulty] ?? puzzle.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {puzzle.gridSize}×{puzzle.gridSize} · {puzzle._count.gameSessions} გადაჭრილი
                </p>
              </div>
              <div className="text-2xl text-amber-600">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
