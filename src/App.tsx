import { useCallback, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeAuth } from "./api/auth";
import {
  useOpenAlert,
  useAccessToken,
  getActions,
  useIsGlobalModal,
} from "./stores";
import { setupAxiosInterceptors } from "./api/axios.config";
import Alert from "./components/common/Alert/Alert";
import Login from "./pages/Login/Login";
import Container from './components/Container/Container';
import MediaMenu from './components/Header/MediaMenu/MediaMenu';
import MeetingConfirmModal from './components/Conference/MeetingConfirmModal/MeetingConfirmModal';
import styles from "./App.module.css";

const queryClient = new QueryClient()

function App() {
  const openAlert = useOpenAlert();
  const accessToken = useAccessToken();
  const { setAccessToken } = getActions();
  const [modalText, setModalText] = useState('');
  const isGlobalModal = useIsGlobalModal();


  // const initAuth = useCallback(async () => {
  //   // sessionStorage에 토큰이 있으면 사용, 없으면 refresh token으로 재발급
  //   const savedToken = sessionStorage.getItem('accessToken');

  //   if (savedToken && !accessToken) {
  //     console.log("💾 세션에서 토큰 복원:", savedToken ? "토큰 있음" : "토큰 없음");
  //     setAccessToken(savedToken);
  //     setupAxiosInterceptors();
  //     return;
  //   }

  //   if (accessToken) {
  //     console.log("✅ 이미 토큰이 있음, 초기화 건너뛰기");
  //     setupAxiosInterceptors();
  //     return;
  //   }

  //   // 저장된 토큰이 없으면 refresh token으로 재발급 시도
  //   console.log("🔄 토큰 없음 - refresh token으로 재발급 시도");

  //   const result = await initializeAuth();

  //   if (result.success && result.accessToken) {
  //     setAccessToken(result.accessToken);
  //   } else if (result.error) {
  //     // 세션이 만료된 경우에만 에러 메시지 표시 (선택적)
  //     console.log("Auth initialization:", result.error);
  //     // setAlertMessage(result.error as string);
  //     // setOpenAlert(true);
  //   }

  //   setupAxiosInterceptors(); // 인터셉터 설정
  // }, [setAccessToken, accessToken]);



  // useEffect(() => {
  //   setupAxiosInterceptors();
  //   initAuth();
  // }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className={styles.main}>

        {accessToken ?
          <>
            <MediaMenu />
            <Container setModalText={setModalText} />

            {isGlobalModal && <MeetingConfirmModal text={modalText} />}

          </>
          : <Login />}
        {openAlert && <Alert />}
      </main>
    </QueryClientProvider>

  );
}

export default App;
