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
  const { setAccessToken, setOpenAlert, setAlertMessage, socketOpen } = getActions();

  const initAuth = useCallback(async () => {
    const result = await initializeAuth();

    if (result.error) {
      setAlertMessage(result.error as string);
      setOpenAlert(true);
    }
    setAccessToken(result.accessToken);

    setupAxiosInterceptors(); // 인터셉터 설정
  }, [setAccessToken, setAlertMessage, setOpenAlert]);

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
