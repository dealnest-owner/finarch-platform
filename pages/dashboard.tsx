// pages/dashboard.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/");
      else setLoading(false);
    });
  }, [router]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-3xl mb-4">대시보드</h1>
      <p>FINARCH 플랫폼에 오신 것을 환영합니다!</p>
    </main>
  );
}
