// pages/delete-account.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 로그인 세션 체크
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  const handleDelete = async () => {
    setError("");

    // 1) 현재 로그인된 유저의 세션을 가져옴
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/");
      return;
    }
    const userId = session.user.id;

    // 2) profiles 테이블에서 해당 레코드 삭제
    const { error: delError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);
    if (delError) {
      setError("프로필 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    // 3) 로그아웃
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    // 4) 로그인 페이지로 리디렉션
    router.push("/");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded">
      <h1 className="text-2xl mb-4">⚠️ 계정 삭제</h1>
      <p className="mb-4">
        계정을 영구 삭제합니다. 삭제된 정보는 복구할 수 없습니다.<br />
        정말 삭제하시겠습니까?
      </p>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex justify-between gap-4">
        <button
          onClick={() => router.push("/profile")}
          className="flex-1 p-2 border rounded"
        >
          취소
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 p-2 bg-red-600 text-white rounded"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}
