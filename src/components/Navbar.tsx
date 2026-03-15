import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { SignOutButton } from "./SignOutButton";

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
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">შესვლა</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">რეგისტრაცია</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
