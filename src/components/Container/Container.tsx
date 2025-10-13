import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import type { TUser } from '@/stores/slice/auth';
import { getActions, useAccessToken, useSocket } from '@/stores';
import Header from '../Header/Header';
import styles from "./styles.module.css";

type Props = {
    setModalText: React.Dispatch<React.SetStateAction<string>>;
}

export default function Container({ setModalText }: Props) {
    const socket = useSocket();
    const accessToken = useAccessToken();
    const { socketOpen, setIsGlobalModal, setConferenceId } = getActions();

    // accessToken이 변경될 때마다 소켓 연결 상태 업데이트
    useEffect(() => {
        if (accessToken) {
            socketOpen();
        }
    }, [accessToken, socketOpen]);

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

    return (
        <div className={styles.container}>
            <Header />
            <Outlet />
        </div>
    );
}