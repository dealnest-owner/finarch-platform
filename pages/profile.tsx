// pages/profile.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }
      const user = session.user;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("id", user.id)
        .single();
      if (error || !data) {
        console.error(error);
        router.push("/dashboard");
      } else {
        setProfile(data);
        setName(data.full_name || "");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  const handleUpdate = async () => {
    if (!profile) return;
    if (name.trim() === "") {
      setError("이름을 입력해주세요.");
      setMessage("");
      return;
    }
    setError("");
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", profile.id);
    if (error) {
      setError(error.message);
      setMessage("");
    } else {
      setMessage("프로필이 업데이트되었습니다.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="max-w-md mx-auto mt-8 p-6 border rounded">
      <h1 className="text-2xl mb-4">프로필 수정</h1>
      <p className="mb-2">Email: {profile?.email}</p>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Full Name"
      />
      <button
        onClick={handleUpdate}
        className="w-full p-2 bg-blue-600 text-white rounded"
      >
        업데이트
      </button>

      {/* 비밀번호 변경 링크 */}
      <p className="mt-4 text-center">
        <Link href="/change-password" className="text-blue-600">
          비밀번호 변경
        </Link>
      </p>

      {/* 이메일 변경 링크 */}
      <p className="mt-2 text-center">
        <Link href="/change-email" className="text-blue-600">
          이메일 변경
        </Link>
      </p>

      {/* 계정 삭제 링크 */}
      <p className="mt-4 text-center">
        <Link href="/delete-account" className="text-red-600">
          계정 삭제
        </Link>
      </p>
    </main>
  );
}
