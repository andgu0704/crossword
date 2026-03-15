"use client";

import { useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";
import { normalizeGeorgianInput } from "@/lib/georgian";
import {
  getWordCells,
  getNextCell,
  getPrevCell,
  getAvailableDirections,
} from "@/lib/crossword-engine";
import type { GridCell, Direction, CellCoord } from "@/types/puzzle";

export function useCrossword(grid: GridCell[][]) {
  const {
    selectedCell,
    direction,
    setCell,
    setSelectedCell,
    setDirection,
    toggleDirection,
  } = useGameStore();

  const selectCell = useCallback(
    (row: number, col: number) => {
      if (grid[row][col].isBlack) return;

      if (selectedCell?.row === row && selectedCell?.col === col) {
        // Same cell tapped: toggle direction
        const available = getAvailableDirections(grid, row, col);
        if (available.length > 1) toggleDirection();
      } else {
        setSelectedCell({ row, col });
        // Auto-pick direction based on availability
        const available = getAvailableDirections(grid, row, col);
        if (available.length === 1) {
          setDirection(available[0]);
        }
      }
    },
    [grid, selectedCell, setSelectedCell, setDirection, toggleDirection]
  );

  const handleInput = useCallback(
    (row: number, col: number, rawValue: string, timerStart: () => void) => {
      timerStart();
      const letter = normalizeGeorgianInput(rawValue);
      if (!letter) return;
      setCell(row, col, letter);

      // Auto-advance
      const next = getNextCell(grid, row, col, direction);
      if (next) setSelectedCell(next);
    },
    [grid, direction, setCell, setSelectedCell]
  );

  const handleBackspace = useCallback(
    (row: number, col: number) => {
      const store = useGameStore.getState();
      if (store.userGrid[row][col]) {
        setCell(row, col, null);
      } else {
        const prev = getPrevCell(grid, row, col, direction);
        if (prev) {
          setCell(prev.row, prev.col, null);
          setSelectedCell(prev);
        }
      }
    },
    [grid, direction, setCell, setSelectedCell]
  );

  const handleArrow = useCallback(
    (row: number, col: number, key: string) => {
      const size = grid.length;
      let next: CellCoord | null = null;

      if (key === "ArrowRight") {
        setDirection("across");
        for (let c = col + 1; c < size; c++) {
          if (!grid[row][c].isBlack) { next = { row, col: c }; break; }
        }
      } else if (key === "ArrowLeft") {
        setDirection("across");
        for (let c = col - 1; c >= 0; c--) {
          if (!grid[row][c].isBlack) { next = { row, col: c }; break; }
        }
      } else if (key === "ArrowDown") {
        setDirection("down");
        for (let r = row + 1; r < size; r++) {
          if (!grid[r][col].isBlack) { next = { row: r, col }; break; }
        }
      } else if (key === "ArrowUp") {
        setDirection("down");
        for (let r = row - 1; r >= 0; r--) {
          if (!grid[r][col].isBlack) { next = { row: r, col }; break; }
        }
      }

      if (next) setSelectedCell(next);
    },
    [grid, setDirection, setSelectedCell]
  );

  const getHighlightedCells = useCallback((): Set<string> => {
    if (!selectedCell) return new Set();
    const cells = getWordCells(grid, selectedCell.row, selectedCell.col, direction);
    return new Set(cells.map((c) => `${c.row}-${c.col}`));
  }, [grid, selectedCell, direction]);

  const selectClue = useCallback(
    (clueNum: number, clueDirection: Direction) => {
      const size = grid.length;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c].number === clueNum && !grid[r][c].isBlack) {
            setSelectedCell({ row: r, col: c });
            setDirection(clueDirection);
            return;
          }
        }
      }
    },
    [grid, setSelectedCell, setDirection]
  );

  return { selectCell, handleInput, handleBackspace, handleArrow, getHighlightedCells, selectClue };
}
