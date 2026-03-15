"use client";

import { useCallback } from "react";
import { CrosswordCell } from "./CrosswordCell";
import { useGameStore } from "@/stores/gameStore";
import { useCrossword } from "@/hooks/useCrossword";
import { normalizeGeorgianInput } from "@/lib/georgian";
import type { GridCell } from "@/types/puzzle";

interface CrosswordGridProps {
  grid: GridCell[][];
  onTimerStart: () => void;
  onInputChange?: () => void;
}

export function CrosswordGrid({ grid, onTimerStart, onInputChange }: CrosswordGridProps) {
  const { userGrid, selectedCell, errorCells } = useGameStore();
  const { selectCell, handleInput, handleBackspace, handleArrow, getHighlightedCells } =
    useCrossword(grid);

  const highlighted = getHighlightedCells();
  const size = grid.length;

  const onInput = useCallback(
    (row: number, col: number, rawValue: string) => {
      handleInput(row, col, rawValue, onTimerStart);
      onInputChange?.();
    },
    [handleInput, onTimerStart, onInputChange]
  );

  const onKeyDown = useCallback(
    (row: number, col: number, key: string, e: React.KeyboardEvent) => {
      if (key === "Backspace") {
        e.preventDefault();
        handleBackspace(row, col);
        onInputChange?.();
      } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        e.preventDefault();
        handleArrow(row, col, key);
      } else if (key === "Tab") {
        e.preventDefault();
        // Move to next word — handled by browser focus naturally
      }
    },
    [handleBackspace, handleArrow, onInputChange]
  );

  if (!userGrid.length) return null;

  return (
    <div
      className="w-full max-w-md mx-auto"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gap: "2px",
        padding: "4px",
        background: "#1f2937",
        borderRadius: "8px",
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <CrosswordCell
            key={`${r}-${c}`}
            cell={cell}
            row={r}
            col={c}
            value={userGrid[r]?.[c] ?? null}
            isSelected={selectedCell?.row === r && selectedCell?.col === c}
            isHighlighted={highlighted.has(`${r}-${c}`)}
            isError={errorCells[r]?.[c] === false}
            onSelect={selectCell}
            onInput={onInput}
            onKeyDown={onKeyDown}
          />
        ))
      )}
    </div>
  );
}
