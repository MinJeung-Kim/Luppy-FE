import { useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useOpenAlert,
  useIsGlobalModal,
} from "./stores";
import useAuthStore from './stores/useAuthStore';
import Alert from "./components/common/Alert/Alert";
import Login from "./pages/Login/Login";
import Container from './components/Container/Container';
import MediaMenu from './components/Header/MediaMenu/MediaMenu';
import MeetingConfirmModal from './components/Conference/MeetingConfirmModal/MeetingConfirmModal';
import styles from "./App.module.css";

const queryClient = new QueryClient()

function App() {
  const openAlert = useOpenAlert();
  const [modalText, setModalText] = useState('');
  const isGlobalModal = useIsGlobalModal();
  const { token } = useAuthStore()

  return (
    <QueryClientProvider client={queryClient}>
      <main className={styles.main}>

        {token ?
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
