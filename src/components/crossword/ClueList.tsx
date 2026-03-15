"use client";

import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores/gameStore";
import { useCrossword } from "@/hooks/useCrossword";
import type { PuzzleClues, GridCell, Direction } from "@/types/puzzle";

interface ClueListProps {
  clues: PuzzleClues;
  grid: GridCell[][];
}

function ClueSection({
  title,
  clues,
  direction,
  onSelectClue,
  activeClueNum,
  activeDirection,
}: {
  title: string;
  clues: { num: number; clue: string }[];
  direction: Direction;
  onSelectClue: (num: number, dir: Direction) => void;
  activeClueNum?: number;
  activeDirection: Direction;
}) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 px-1">
        {title}
      </h3>
      <ul className="space-y-0.5">
        {clues.map(({ num, clue }) => {
          const isActive = activeDirection === direction && activeClueNum === num;
          return (
            <li key={`${direction}-${num}`}>
              <button
                onClick={() => onSelectClue(num, direction)}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded text-sm transition-colors",
                  isActive
                    ? "bg-amber-100 text-amber-900 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span className="font-semibold text-amber-700 mr-1.5">{num}.</span>
                {clue}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function getActiveClueNum(
  grid: GridCell[][],
  selectedRow: number | undefined,
  selectedCol: number | undefined,
  direction: Direction
): number | undefined {
  if (selectedRow === undefined || selectedCol === undefined) return undefined;
  const size = grid.length;
  if (direction === "across") {
    let c = selectedCol;
    while (c > 0 && !grid[selectedRow][c - 1].isBlack) c--;
    return grid[selectedRow][c].number ?? undefined;
  } else {
    let r = selectedRow;
    while (r > 0 && !grid[r - 1][selectedCol].isBlack) r--;
    return grid[r][selectedCol].number ?? undefined;
  }
}

export function ClueList({ clues, grid }: ClueListProps) {
  const { selectedCell, direction } = useGameStore();
  const { selectClue } = useCrossword(grid);

  const activeClueNum = getActiveClueNum(
    grid,
    selectedCell?.row,
    selectedCell?.col,
    direction
  );

  return (
    <div className="flex flex-col gap-4">
      <ClueSection
        title="Across • ჰორიზონტალი"
        clues={clues.across}
        direction="across"
        onSelectClue={selectClue}
        activeClueNum={activeClueNum}
        activeDirection={direction}
      />
      <ClueSection
        title="Down • ვერტიკალი"
        clues={clues.down}
        direction="down"
        onSelectClue={selectClue}
        activeClueNum={activeClueNum}
        activeDirection={direction}
      />
    </div>
  );
}
