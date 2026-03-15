"use client";

import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import type { GridCell } from "@/types/puzzle";

interface CrosswordProviderProps {
  grid: GridCell[][];
  children: React.ReactNode;
}

export function CrosswordProvider({ grid, children }: CrosswordProviderProps) {
  const reset = useGameStore((s) => s.reset);

  useEffect(() => {
    reset(grid.length);
  }, [grid.length, reset]);

  return <>{children}</>;
}
