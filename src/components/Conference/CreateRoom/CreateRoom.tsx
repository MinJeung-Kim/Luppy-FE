import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getActions, useSocket, useUser } from '@/stores';
import { useConference } from '@/context/ConferenceContext';
import { useAvailableUsers } from '@/hooks/useAvailableUsers';
import ConferenceImg from "@/assets/images/conference.png";
import SelectedUsers from '@/components/SelectedUsers/SelectedUsers';
import Button from '@/components/common/Button/Button';
import styles from "./styles.module.css";


export default function CreateRoom() {
    const user = useUser();
    const socket = useSocket();
    const { selectedUsers } = useConference();
    const { availableUsers } = useAvailableUsers();
    const { createConferenceRoom, setIsCreatedRoom, setConferenceId } = getActions();

    const handleCreateRoom = () => {
        const roomId = uuidv4();
        setConferenceId(roomId)
        if (user == null) return;
        createConferenceRoom(roomId, user!.id, selectedUsers)
    }

    useEffect(() => {
        if (!socket) return;

        const handleCreatedRoom = ({ message }: { message: string }) => {
            console.log("handleRoomCreated - message  : ", message);
            setIsCreatedRoom(true)
        };

        socket.on("createConferenceRoom", handleCreatedRoom);

        return () => {
            socket.off("createConferenceRoom", handleCreatedRoom);
        };
    }, [socket, setIsCreatedRoom]);


    return (
        <div className={styles.create_room_container}>
            <img src={ConferenceImg} alt="" />
            <div className={styles.title_wrap}>
                <span className={styles.title}>화상 회의 시작</span>
                <span className={styles.sub_title}>기존 연락처와 화상 회의를 시작하거나 링크를 통해 다른 사람을 초대하세요.</span>
            </div>
            <SelectedUsers users={availableUsers} selectedUsers={selectedUsers} />
            <Button text='회의 시작' disabled={selectedUsers.length === 0} onClick={handleCreateRoom} />
        </div>
    );
}