import { redirect } from "next/navigation";
import { auth } from "./auth";

// The dashboard layout already redirects logged-out visitors, but Next
// renders layouts and pages in parallel: the page body still runs, and
// `session!.user!.id!` then throws before the redirect lands, turning a
// plain "please log in" into a 500. Pages call this instead so the guard
// happens where the value is actually read.
export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}
