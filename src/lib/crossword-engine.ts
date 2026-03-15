import type { GridCell, CellCoord, Direction, WordInfo } from "@/types/puzzle";

export function getWordCells(
  grid: GridCell[][],
  row: number,
  col: number,
  direction: Direction
): CellCoord[] {
  const size = grid.length;
  const cells: CellCoord[] = [];

  if (direction === "across") {
    // Find start of the word
    let c = col;
    while (c > 0 && !grid[row][c - 1].isBlack) c--;
    while (c < size && !grid[row][c].isBlack) {
      cells.push({ row, col: c });
      c++;
    }
  } else {
    let r = row;
    while (r > 0 && !grid[r - 1][col].isBlack) r--;
    while (r < size && !grid[r][col].isBlack) {
      cells.push({ row: r, col });
      r++;
    }
  }

  return cells;
}

export function canGoAcross(grid: GridCell[][], row: number, col: number): boolean {
  const size = grid.length;
  if (grid[row][col].isBlack) return false;
  const leftBlack = col === 0 || grid[row][col - 1].isBlack;
  const rightOpen = col < size - 1 && !grid[row][col + 1].isBlack;
  return leftBlack && rightOpen;
}

export function canGoDown(grid: GridCell[][], row: number, col: number): boolean {
  const size = grid.length;
  if (grid[row][col].isBlack) return false;
  const topBlack = row === 0 || grid[row - 1][col].isBlack;
  const bottomOpen = row < size - 1 && !grid[row + 1][col].isBlack;
  return topBlack && bottomOpen;
}

export function getAvailableDirections(
  grid: GridCell[][],
  row: number,
  col: number
): Direction[] {
  const dirs: Direction[] = [];
  const wordAcross = getWordCells(grid, row, col, "across");
  const wordDown = getWordCells(grid, row, col, "down");
  if (wordAcross.length > 1) dirs.push("across");
  if (wordDown.length > 1) dirs.push("down");
  return dirs;
}

export function getAllWords(grid: GridCell[][]): WordInfo[] {
  const size = grid.length;
  const words: WordInfo[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c].isBlack) continue;
      const num = grid[r][c].number;
      if (!num) continue;

      if (canGoAcross(grid, r, c)) {
        words.push({
          cells: getWordCells(grid, r, c, "across"),
          clueNum: num,
          direction: "across",
        });
      }
      if (canGoDown(grid, r, c)) {
        words.push({
          cells: getWordCells(grid, r, c, "down"),
          clueNum: num,
          direction: "down",
        });
      }
    }
  }

  return words;
}

export function isPuzzleComplete(
  userGrid: (string | null)[][],
  solution: (string | null)[][]
): boolean {
  for (let r = 0; r < solution.length; r++) {
    for (let c = 0; c < solution[r].length; c++) {
      const sol = solution[r][c];
      if (sol === null) continue; // black cell
      if (userGrid[r][c] !== sol) return false;
    }
  }
  return true;
}

export function validateGrid(
  userGrid: (string | null)[][],
  solution: (string | null)[][]
): boolean[][] {
  return solution.map((row, r) =>
    row.map((sol, c) => {
      if (sol === null) return true; // black cell always valid
      return userGrid[r][c] === sol;
    })
  );
}

export function countMistakes(
  userGrid: (string | null)[][],
  solution: (string | null)[][]
): number {
  let mistakes = 0;
  for (let r = 0; r < solution.length; r++) {
    for (let c = 0; c < solution[r].length; c++) {
      const sol = solution[r][c];
      if (sol === null) continue;
      const user = userGrid[r][c];
      if (user && user !== sol) mistakes++;
    }
  }
  return mistakes;
}

export function getNextCell(
  grid: GridCell[][],
  row: number,
  col: number,
  direction: Direction
): CellCoord | null {
  const size = grid.length;
  if (direction === "across") {
    if (col + 1 < size && !grid[row][col + 1].isBlack) return { row, col: col + 1 };
  } else {
    if (row + 1 < size && !grid[row + 1][col].isBlack) return { row: row + 1, col };
  }
  return null;
}

export function getPrevCell(
  grid: GridCell[][],
  row: number,
  col: number,
  direction: Direction
): CellCoord | null {
  const size = grid.length;
  if (direction === "across") {
    if (col - 1 >= 0 && !grid[row][col - 1].isBlack) return { row, col: col - 1 };
  } else {
    if (row - 1 >= 0 && !grid[row - 1][col].isBlack) return { row: row - 1, col };
  }
  return null;
}
