"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { GridCell } from "@/types/puzzle";

interface CrosswordCellProps {
  cell: GridCell;
  row: number;
  col: number;
  value: string | null;
  isSelected: boolean;
  isHighlighted: boolean;
  isError: boolean;
  onSelect: (row: number, col: number) => void;
  onInput: (row: number, col: number, value: string) => void;
  onKeyDown: (row: number, col: number, key: string, e: React.KeyboardEvent) => void;
}

export function CrosswordCell({
  cell,
  row,
  col,
  value,
  isSelected,
  isHighlighted,
  isError,
  onSelect,
  onInput,
  onKeyDown,
}: CrosswordCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected]);

  if (cell.isBlack) {
    return <div className="aspect-square bg-gray-900 rounded-sm" />;
  }

  return (
    <motion.div
      className={cn(
        "aspect-square relative border border-gray-300 rounded-sm cursor-pointer select-none transition-colors",
        isSelected
          ? "bg-amber-300 border-amber-500 z-10 shadow-md"
          : isHighlighted
          ? "bg-amber-100 border-amber-300"
          : isError
          ? "bg-red-100 border-red-400"
          : "bg-white hover:bg-amber-50"
      )}
      animate={isError ? { x: [0, -4, 4, -4, 0] } : {}}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(row, col)}
    >
      {cell.number && (
        <span className="absolute top-0.5 left-0.5 text-[0.45rem] sm:text-[0.55rem] font-semibold text-gray-600 leading-none pointer-events-none z-10">
          {cell.number}
        </span>
      )}
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={2}
        value={value ?? ""}
        className="absolute inset-0 w-full h-full bg-transparent text-center font-georgian text-base sm:text-lg lg:text-xl text-gray-900 font-semibold focus:outline-none cursor-pointer caret-transparent uppercase pt-2 sm:pt-3"
        onChange={(e) => onInput(row, col, e.target.value)}
        onKeyDown={(e) => onKeyDown(row, col, e.key, e)}
        onFocus={() => onSelect(row, col)}
        readOnly={false}
      />
    </motion.div>
  );
}
