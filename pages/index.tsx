// pages/index.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/dashboard");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded">
      <h1 className="text-2xl mb-4">🔐 로그인</h1>
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded">
          로그인
        </button>
      </form>

      {/* 비밀번호 재설정 링크 */}
      <p className="mt-4 text-right">
        비밀번호를 잊으셨나요?{" "}
        <Link href="/reset-password" className="text-blue-600">
          재설정하기
        </Link>
      </p>

      {/* 회원가입 링크 */}
      <p className="mt-1">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-blue-600">
          회원가입
        </Link>
      </p>
    </div>
  );
}
