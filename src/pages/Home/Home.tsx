import { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import { getActions, useIsGlobalModal, useSelectedMenu, useSocket } from "@/stores";
import MeetingConfirmModal from '@/components/Conference/MeetingConfirmModal/MeetingConfirmModal';
import MediaMenu from '@/components/Header/MediaMenu/MediaMenu';
import { HOME_PAGE_META } from "@/constants/page_messages";
import Header from "@/components/Header/Header";
import { MenuItems } from "@/constants/menu";
import styles from "./styles.module.css";
import type { TUser } from '@/stores/slice/auth';

export default function Home() {
  const socket = useSocket();
  const selectedMenu = useSelectedMenu();
  const isGlobalModal = useIsGlobalModal();
  const { setIsGlobalModal, setConferenceId } = getActions();
  const [modalText, setModalText] = useState('');

  useEffect(() => {
    if (!socket) return;

    const handleConferenceInvitation = ({ host, roomId }: { host: TUser, roomId: string | null }) => {
      console.log("handleConferenceInvitation - hostName : ", host);
      setModalText(host.name);
      setConferenceId(roomId);
      setIsGlobalModal(true);
    };

    socket.on("conferenceInvitation", handleConferenceInvitation);

    return () => {
      socket.off("conferenceInvitation", handleConferenceInvitation);
    };
  }, [socket]);

  // 선택된 메뉴에 해당하는 컴포넌트 찾기
  const currentMenuItem = MenuItems.find((item) => item.name === selectedMenu);
  const currentContent = currentMenuItem?.content || (
    <div>컴포넌트를 찾을 수 없습니다.</div>
  );

  return (
    <>
      <Helmet>
        <title>{HOME_PAGE_META.title}</title>
        <meta name="description" content={HOME_PAGE_META.description} />
        <meta property="og:title" content={HOME_PAGE_META.ogTitle} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.home_container}>
        <MediaMenu />
        <Header />
        {currentContent}
        {isGlobalModal && <MeetingConfirmModal text={modalText} />}
      </div>
    </>
  );
}
