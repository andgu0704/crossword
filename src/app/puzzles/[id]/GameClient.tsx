"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CrosswordGrid } from "@/components/crossword/CrosswordGrid";
import { CrosswordProvider } from "@/components/crossword/CrosswordProvider";
import { ClueList } from "@/components/crossword/ClueList";
import { GameTimer } from "@/components/crossword/GameTimer";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/stores/gameStore";
import { useTimer } from "@/hooks/useTimer";
import { validateGrid } from "@/lib/crossword-engine";
import type { Puzzle } from "@/types/puzzle";
import Link from "next/link";

interface GameClientProps {
  puzzle: Puzzle;
  userId: string;
}

function GameControls({
  puzzle,
  onCheck,
  onReveal,
  elapsed,
}: {
  puzzle: Puzzle;
  onCheck: () => void;
  onReveal: () => void;
  elapsed: number;
}) {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div>
        <h1 className="font-bold text-gray-900 text-lg">{puzzle.title}</h1>
        <span className="text-xs text-gray-500">{puzzle.gridSize}×{puzzle.gridSize}</span>
      </div>
      <div className="flex items-center gap-3">
        <GameTimer elapsed={elapsed} />
        <Button variant="secondary" size="sm" onClick={onCheck}>
          შემოწმება
        </Button>
        <Button variant="ghost" size="sm" onClick={onReveal}>
          გამოჩენა
        </Button>
      </div>
    </div>
  );
}

function SuccessModal({
  elapsed,
  mistakes,
  onClose,
}: {
  elapsed: number;
  mistakes: number;
  onClose: () => void;
}) {
  const mm = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const ss = (elapsed % 60).toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
      >
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">გილოცავ!</h2>
        <p className="text-gray-500 mb-6">კვესტვორდი ამოხსნილია</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-amber-700 font-mono">
              {mm}:{ss}
            </p>
            <p className="text-xs text-gray-500">დრო</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-amber-700">{mistakes}</p>
            <p className="text-xs text-gray-500">შეცდომა</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/dashboard">
            <Button className="w-full">რეიტინგის ნახვა</Button>
          </Link>
          <Link href="/puzzles">
            <Button variant="secondary" className="w-full" onClick={onClose}>
              სხვა კვესტვორდი
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Mobile bottom sheet for clues
function ClueDrawer({
  puzzle,
  isOpen,
  onToggle,
}: {
  puzzle: Puzzle;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-40 bg-amber-600 text-white rounded-full px-4 py-2.5 shadow-lg text-sm font-semibold lg:hidden flex items-center gap-2"
      >
        {isOpen ? "დახურვა ✕" : "მინიშნებები ↑"}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-30 bg-white rounded-t-2xl shadow-2xl max-h-[60vh] overflow-y-auto p-4 lg:hidden"
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <ClueList clues={puzzle.clues} grid={puzzle.gridData} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function GameClient({ puzzle, userId }: GameClientProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showClues, setShowClues] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [finalElapsed, setFinalElapsed] = useState(0);
  const [finalMistakes, setFinalMistakes] = useState(0);
  const sessionStarted = useRef(false);

  const { elapsed, start: startTimer, stop: stopTimer } = useTimer();
  const { userGrid, setErrorCells, setIsComplete } = useGameStore();

  const handleTimerStart = useCallback(async () => {
    if (sessionStarted.current) return;
    sessionStarted.current = true;
    startTimer();

    const res = await fetch("/api/game-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puzzleId: puzzle.id }),
    });
    if (res.ok) {
      const { sessionId: id } = await res.json();
      setSessionId(id);
    }
  }, [puzzle.id, startTimer]);

  const handleCheck = useCallback(async () => {
    if (!sessionId || !userGrid.length) return;
    const res = await fetch("/api/game-sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, userGrid }),
    });
    if (!res.ok) return;
    const { isComplete, errors, mistakes, durationSeconds } = await res.json();
    setErrorCells(errors);
    if (isComplete) {
      stopTimer();
      setIsComplete(true);
      setFinalElapsed(durationSeconds);
      setFinalMistakes(mistakes);
      setShowSuccess(true);
    }
  }, [sessionId, userGrid, setErrorCells, setIsComplete, stopTimer]);

  const handleReveal = useCallback(async () => {
    if (!sessionId || !userGrid.length) return;
    await fetch("/api/game-sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, userGrid, usedHint: true }),
    });
  }, [sessionId, userGrid]);

  return (
    <CrosswordProvider grid={puzzle.gridData}>
      <div className="max-w-5xl mx-auto">
        <GameControls
          puzzle={puzzle}
          onCheck={handleCheck}
          onReveal={handleReveal}
          elapsed={elapsed}
        />
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Grid */}
          <div className="flex-1 min-w-0">
            <CrosswordGrid
              grid={puzzle.gridData}
              onTimerStart={handleTimerStart}
              onInputChange={undefined}
            />
          </div>
          {/* Clues — desktop sidebar */}
          <div className="hidden lg:block w-72 shrink-0 bg-white rounded-xl border border-gray-200 p-4 max-h-[70vh] overflow-y-auto">
            <ClueList clues={puzzle.clues} grid={puzzle.gridData} />
          </div>
        </div>
      </div>

      {/* Mobile clue drawer */}
      <ClueDrawer
        puzzle={puzzle}
        isOpen={showClues}
        onToggle={() => setShowClues((v) => !v)}
      />

      {/* Success modal */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            elapsed={finalElapsed}
            mistakes={finalMistakes}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>
    </CrosswordProvider>
  );
}
