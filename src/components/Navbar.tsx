import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-amber-700 tracking-tight">
          ✦ კვესტვორდი
        </Link>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Link href="/puzzles">
                <Button variant="ghost" size="sm">
                  თამაშები
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  რეიტინგი
                </Button>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button variant="secondary" size="sm" type="submit">
                  გასვლა
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">შესვლა</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
