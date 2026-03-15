"use client";

import { formatTime } from "@/lib/utils";

interface GameTimerProps {
  elapsed: number;
}

export function GameTimer({ elapsed }: GameTimerProps) {
  return (
    <div className="flex items-center gap-2 text-gray-700">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-mono text-lg font-semibold tabular-nums">{formatTime(elapsed)}</span>
    </div>
  );
}
