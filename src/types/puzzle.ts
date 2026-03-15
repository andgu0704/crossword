export type Direction = "across" | "down";

export interface GridCell {
  isBlack: boolean;
  number?: number | null;
}

export interface SolutionCell {
  letter: string | null;
}

export interface Clue {
  num: number;
  clue: string;
}

export interface PuzzleClues {
  across: Clue[];
  down: Clue[];
}

export interface Puzzle {
  id: string;
  title: string;
  difficulty: string;
  gridSize: number;
  gridData: GridCell[][];
  clues: PuzzleClues;
  createdAt: string;
}

export interface CellCoord {
  row: number;
  col: number;
}

export interface WordInfo {
  cells: CellCoord[];
  clueNum: number;
  direction: Direction;
}
