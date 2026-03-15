import { formatTime } from "@/lib/utils";
import type { UserStats } from "@/types/leaderboard";

interface UserStatCardProps {
  stats: UserStats;
  userName: string | null;
  userImage: string | null;
}

export function UserStatCard({ stats, userName, userImage }: UserStatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-4">
        {userImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={userImage} alt={userName ?? "User"} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-base font-bold text-amber-800">
            {(userName ?? "?")[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{userName ?? "Anonymous"}</p>
          <p className="text-xs text-gray-500">სტატისტიკა</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-amber-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-amber-700">{stats.totalCompleted}</p>
          <p className="text-xs text-gray-500 mt-0.5">გადაჭრილი</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-amber-700">
            {stats.averageSeconds ? formatTime(Math.round(stats.averageSeconds)) : "—"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">საშუალო</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-amber-700">
            {stats.bestTimes[0] ? formatTime(stats.bestTimes[0].durationSeconds) : "—"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">საუკეთესო</p>
        </div>
      </div>
    </div>
  );
}
