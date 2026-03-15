import { create } from "zustand";
import type { Direction, CellCoord } from "@/types/puzzle";

interface GameState {
  userGrid: (string | null)[][];
  selectedCell: CellCoord | null;
  direction: Direction;
  errorCells: boolean[][];
  isComplete: boolean;
  sessionId: string | null;

  setUserGrid: (grid: (string | null)[][]) => void;
  setCell: (row: number, col: number, value: string | null) => void;
  setSelectedCell: (cell: CellCoord | null) => void;
  setDirection: (direction: Direction) => void;
  toggleDirection: () => void;
  setErrorCells: (errors: boolean[][]) => void;
  setIsComplete: (v: boolean) => void;
  setSessionId: (id: string) => void;
  reset: (size: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  userGrid: [],
  selectedCell: null,
  direction: "across",
  errorCells: [],
  isComplete: false,
  sessionId: null,

  setUserGrid: (grid) => set({ userGrid: grid }),

  setCell: (row, col, value) => {
    const grid = get().userGrid.map((r) => [...r]);
    grid[row][col] = value;
    set({ userGrid: grid });
  },

  setSelectedCell: (cell) => set({ selectedCell: cell }),

  setDirection: (direction) => set({ direction }),

  toggleDirection: () =>
    set((state) => ({ direction: state.direction === "across" ? "down" : "across" })),

  setErrorCells: (errors) => set({ errorCells: errors }),

  setIsComplete: (v) => set({ isComplete: v }),

  setSessionId: (id) => set({ sessionId: id }),

  reset: (size) => {
    const empty = Array.from({ length: size }, () => Array(size).fill(null));
    set({
      userGrid: empty,
      selectedCell: null,
      direction: "across",
      errorCells: [],
      isComplete: false,
      sessionId: null,
    });
  },
}));
