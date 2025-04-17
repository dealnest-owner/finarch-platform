// components/Header.tsx
"use client";

import Link from "next/link";
//  next/navigation 대신 next/router에서 import
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      return;
    }
    router.push("/");
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md">
      <Link href="/dashboard">
        <img src="/logo.png" alt="FINARCH" className="h-8" />
      </Link>
      <nav className="space-x-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/profile">Profile</Link>
        {/* form 내 버튼이 아니니까 type="button" 명시 */}
        <button type="button" onClick={handleLogout} className="ml-4">
          Logout
        </button>
      </nav>
    </header>
  );
}
