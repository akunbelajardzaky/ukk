"use server";

import { auth } from "@/auth";
import Link from "next/link";
import { SignOutButton } from "./components/sign-out-button";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return (
      <div>
        <Link href="/user-info"> User Info </Link>
        <SignOutButton />
      </div>
    );
  }

  return redirect("/auth/signin")
}
