import { useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeAuth } from "./api/auth";
import {
  useOpenAlert,
  useAccessToken,
  getActions,
} from "./stores";
import { setupAxiosInterceptors } from "./api/axios.config";
import Alert from "./components/common/Alert/Alert";
import Login from "./pages/Login/Login";
import styles from "./App.module.css";

const queryClient = new QueryClient()

function App() {
  const openAlert = useOpenAlert();
  const accessToken = useAccessToken();
  const { setAccessToken, socketOpen } = getActions();

  const initAuth = useCallback(async () => {
    // sessionStorage에 토큰이 있으면 사용, 없으면 refresh token으로 재발급
    const savedToken = sessionStorage.getItem('accessToken');

    if (savedToken && !accessToken) {
      console.log("💾 세션에서 토큰 복원:", savedToken ? "토큰 있음" : "토큰 없음");
      setAccessToken(savedToken);
      setupAxiosInterceptors();
      return;
    }

    if (accessToken) {
      console.log("✅ 이미 토큰이 있음, 초기화 건너뛰기");
      setupAxiosInterceptors();
      return;
    }

    // 저장된 토큰이 없으면 refresh token으로 재발급 시도
    console.log("🔄 토큰 없음 - refresh token으로 재발급 시도");

    const result = await initializeAuth();

    if (result.success && result.accessToken) {
      setAccessToken(result.accessToken);
    } else if (result.error) {
      // 세션이 만료된 경우에만 에러 메시지 표시 (선택적)
      console.log("Auth initialization:", result.error);
      // setAlertMessage(result.error as string);
      // setOpenAlert(true);
    }

    setupAxiosInterceptors(); // 인터셉터 설정
  }, [setAccessToken, accessToken]);

  // accessToken이 변경될 때마다 소켓 연결 상태 업데이트
  useEffect(() => {
    if (accessToken) {
      socketOpen();
    }
  }, [accessToken, socketOpen]);

  useEffect(() => {
    setupAxiosInterceptors();
    initAuth();
  }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className={styles.main}>

        {accessToken ? <Outlet /> : <Login />}
        {openAlert && <Alert />}
      </main>
    </QueryClientProvider>

  );
}

export default App;
