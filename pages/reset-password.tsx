// pages/reset-password.tsx

import { useState } from "react";
import Link from "next/link";                   // ← 추가
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else {
      setMessage("비밀번호 재설정 이메일이 발송되었습니다.");
      setError("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded">
      <h1 className="text-2xl mb-4">🔑 비밀번호 재설정</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}
      <form onSubmit={handleReset} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="등록된 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded">
          재설정 이메일 보내기
        </button>
      </form>
      <p className="mt-4 text-center">
        <Link href="/" className="text-blue-600">로그인으로 돌아가기</Link>
      </p>
    </div>
  );
}
