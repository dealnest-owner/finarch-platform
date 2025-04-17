// pages/change-email.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ChangeEmailPage() {
  const router = useRouter();
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 로그인 상태 확인 및 현재 이메일 가져오기
  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }
      setCurrentEmail(session.user.email);
    };
    loadSession();
  }, [router]);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // 이전 메시지 모두 초기화
    setError("");
    setMessage("");

    const email = newEmail.trim().toLowerCase();

    // 비어있는지
    if (!email) {
      setError("변경할 이메일을 입력해주세요.");
      return;
    }
    // 형식 체크
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    // 현재 이메일과 같은지
    if (email === currentEmail) {
      setError("현재 사용 중인 이메일과 동일합니다.");
      return;
    }

    const { error: supaError } = await supabase.auth.updateUser({ email });
    if (supaError) {
      setError(supaError.message);
    } else {
      setMessage(
        "이메일 변경 요청이 전송되었습니다. 새 이메일 주소로 확인 링크를 확인해주세요."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded">
      <h1 className="text-2xl mb-4">✉️ 이메일 변경</h1>
      <p className="mb-2 text-gray-600">
        현재 이메일: <strong>{currentEmail}</strong>
      </p>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <form onSubmit={handleChange} noValidate className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="새 이메일 주소"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded">
          이메일 변경하기
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
