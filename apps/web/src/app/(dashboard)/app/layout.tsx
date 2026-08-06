import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
        <Link href="/app" className="font-semibold">
          Siteo
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/app/billing" className="text-neutral-600 hover:text-neutral-900">
            Facturation
          </Link>
          <span className="text-neutral-600">{session.user.email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="text-neutral-600 hover:text-neutral-900">
              Déconnexion
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
