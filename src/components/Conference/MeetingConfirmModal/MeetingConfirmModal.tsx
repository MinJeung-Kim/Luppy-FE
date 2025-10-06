import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TUser } from '@/stores/slice/auth';
import { getActions, useConferenceId, useSocket, useUser } from '@/stores';
import type { TJoinUser } from '@/context/ConferenceContext';
import Modal from '@/components/common/Modal/Modal';
import styles from "./styles.module.css";

type Props = {
    text: string
}

export default function MeetingConfirmModal({ text }: Props) {
    const user = useUser();
    const socket = useSocket();
    const navigate = useNavigate()
    const conferenceId = useConferenceId();
    const { setJoinUser, setIsGlobalModal, joinConferenceRoom, setIsCreatedRoom } = getActions();

    const [host, setHost] = useState<TJoinUser | null>(null);

    const handleClose = () => {
        setIsGlobalModal(false);
    };

    const handleSave = () => {
        console.log("회의실에 참여합니다.", conferenceId, user!);

        joinConferenceRoom(conferenceId!);
        setIsCreatedRoom(true); // 회의실 참여 상태로 변경
        setJoinUser(host);
        navigate('/conference');
        handleClose()
    }

    useEffect(() => {
        if (!socket) return;

        const handleConferenceInvitation = ({ host }: { host: TUser, }) => {
            console.log("handleConferenceInvitation - hostName : ", host);

            const joinUser = {
                id: host.id,
                name: host.name,
                profile: host.profile,
                isMicOn: true,
                isVideoOn: true
            };

            setHost(joinUser);

        };

        socket.on("conferenceInvitation", handleConferenceInvitation);

        return () => {
            socket.off("conferenceInvitation", handleConferenceInvitation);
        };
    }, [socket]);

    return <Modal
        header='화상 회의 초대'
        onClose={handleClose}
        onSave={handleSave}  >
        <div className={styles.meeting_modal_container}>
            <div className={styles.host_wrap}>
                <span className={styles.host_name}>{text}</span>
                <span className={styles.title}> 님이 회의실에 초대했습니다.</span>
            </div>
            <span className={styles.sub_title}>회의에 참여하시겠습니까?</span>
        </div>
    </Modal>;
}