"use client";

import Image from "next/image";
import { formatTime } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types/leaderboard";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const medals = ["🥇", "🥈", "🥉"];

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  if (!entries.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-4xl mb-3">🏁</p>
        <p>ჯერ არ არის შედეგები. პირველი გახდი!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">მოთამაშე</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">დრო</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">შეცდომა</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600 hidden sm:table-cell">
              რჩევა
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {entries.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            return (
              <tr
                key={`${entry.userId}-${entry.completedAt}`}
                className={isCurrentUser ? "bg-amber-50" : "hover:bg-gray-50"}
              >
                <td className="px-4 py-3 font-bold text-gray-700">
                  {entry.rank <= 3 ? medals[entry.rank - 1] : entry.rank}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {entry.userImage ? (
                      <Image
                        src={entry.userImage}
                        alt={entry.userName ?? "User"}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-800">
                        {(entry.userName ?? "?")[0].toUpperCase()}
                      </div>
                    )}
                    <span className={isCurrentUser ? "font-semibold text-amber-800" : "text-gray-800"}>
                      {entry.userName ?? "Anonymous"}
                      {isCurrentUser && <span className="ml-1 text-xs text-amber-600">(შენ)</span>}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-gray-800">
                  {formatTime(entry.durationSeconds)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{entry.mistakeCount}</td>
                <td className="px-4 py-3 text-right hidden sm:table-cell">
                  {entry.usedHint ? (
                    <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                      გამოყენებულია
                    </span>
                  ) : (
                    <span className="text-xs text-green-600">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
