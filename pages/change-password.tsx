// pages/change-password.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";               // ← 이 줄을 추가
import { supabase } from "@/lib/supabaseClient";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 비로그인 차단
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/");
    });
  }, [router]);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.trim() === "" || newPw !== confirmPw) {
      setError("비밀번호가 비어있거나 일치하지 않습니다.");
      setMessage("");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) {
      setError(error.message);
      setMessage("");
    } else {
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded">
      <h1 className="text-2xl mb-4">🔒 비밀번호 변경</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}
      <form onSubmit={handleChange} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="새 비밀번호 확인"
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="p-2 bg-green-600 text-white rounded">
          변경하기
        </button>
      </form>
      <p className="mt-4 text-center">
        <Link href="/profile" className="text-blue-600">
          프로필로 돌아가기
        </Link>
      </p>
    </div>
  );
}
