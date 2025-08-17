import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // 개발 서버 설정
  server: {
    port: 3000, // 원하는 포트
    host: "127.0.0.1", // IPv6(::1) 대신 IPv4로 강제 (EACCES 회피)
    strictPort: true, // 3000 사용 불가 시 자동 증가 방지
    open: true, // 브라우저 자동 오픈 
  },
});
