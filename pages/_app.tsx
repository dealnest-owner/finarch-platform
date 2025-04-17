// pages/_app.tsx

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // 헤더를 표시하지 않을 경로 목록
  const noHeader = [
    "/", 
    "/signup", 
    "/reset-password", 
    "/change-password",
    "/change-email",
    "/delete-account"    // 계정 삭제 페이지도 헤더 숨김
  ];

  return (
    <>
      {/* 해당 경로가 아니면 헤더 노출 */}
      {!noHeader.includes(router.pathname) && <Header />}
      <Component {...pageProps} />
    </>
  );
}
