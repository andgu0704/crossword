import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-6xl mb-4">✦</div>
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
        ქართული კვესტვორდი
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        გამოცადე ქართული სიტყვების ცოდნა. ამოხსენი კვესტვორდი და შეედრე სხვებს!
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {session?.user ? (
          <>
            <Link href="/puzzles">
              <Button size="lg">თამაშის დაწყება</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                რეიტინგი
              </Button>
            </Link>
          </>
        ) : (
          <Link href="/login">
            <Button size="lg">შედი და ითამაშე</Button>
          </Link>
        )}
      </div>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full">
        {[
          { icon: "📖", title: "ქართული სიტყვები", desc: "ათობით კვესტვორდი ქართულ ენაზე" },
          { icon: "⏱️", title: "სიჩქარის შეჯიბრი", desc: "ვინ ყველაზე სწრაფად ამოხსნის?" },
          { icon: "🏆", title: "გლობალური რეიტინგი", desc: "შეადარე შედეგები სხვა მოთამაშეებს" },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-white rounded-xl p-5 border border-gray-200 text-left">
            <div className="text-2xl mb-2">{icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
