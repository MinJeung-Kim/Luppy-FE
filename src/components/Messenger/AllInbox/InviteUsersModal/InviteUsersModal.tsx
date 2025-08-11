
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { TUser } from '@/stores/slice/auth';
import { getActions, useSocket, useUser } from '@/stores';
import { useMessenger } from '@/context/MessengerContext';
import { useAvailableUsers } from '@/hooks/useAvailableUsers';
import CheckBox from '@/components/common/CheckBox/CheckBox';
import Modal from '@/components/common/Modal/Modal';
import styles from "./styles.module.css";
import Avatar from '@/components/common/Avatar/Avatar';

export default function InviteUsersModal() {
    const user = useUser();
    const socket = useSocket();
    const queryClient = useQueryClient();
    const { setIsModal } = useMessenger();
    const { createChatRoom } = getActions();
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    const { availableUsers } = useAvailableUsers();

    const handleClose = useCallback(() => {
        setIsModal(false);
    }, [setIsModal]);

    const handleSave = () => {
        createChatRoom(user!.id, selectedUsers);
    }

    useEffect(() => {
        if (!socket) return;

        const handleRoomCreated = ({ host, guests }: { host: TUser; guests: TUser[] }) => {
            console.log("새로운 채팅방이 생성되었습니다.", host, guests);

            // 채팅 룸 리스트를 실시간으로 업데이트
            queryClient.invalidateQueries({ queryKey: ['chatList'] });

            handleClose();
        };

        socket.on("roomCreated", handleRoomCreated);

        return () => {
            socket.off("roomCreated", handleRoomCreated);
        };
    }, [socket, queryClient, handleClose]);

    const handleToggleUser = (userId: number) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId) // 체크 해제
                : [...prev, userId]                // 체크
        );

    };

    return <Modal header='Invite people to chat' onClose={handleClose} onSave={handleSave}>
        <span className={styles.title}>Type name to invite ({selectedUsers.length})</span>
        <ul className={styles.select_users}>
            {availableUsers
                .filter((userData: TUser) => selectedUsers.includes(userData.id))
                .map((userData: TUser) => (
                    <li key={userData.id} className={styles.select_name}>{userData.name}</li>
                ))}
        </ul>
        <ul className={styles.user_container}>
            <span className={styles.title}>Invited</span>
            {availableUsers.map(({ id, name, email, profile }: TUser) =>
                <li className={styles.user_wrap} key={id}>
                    <div className={styles.left}>
                        <Avatar src={profile} alt="profile" />
                        <div className={styles.user}>
                            <span className={styles.name} >{name}</span>
                            <span className={styles.email} >{email}</span>
                        </div>
                    </div>

                    <CheckBox
                        checked={selectedUsers.includes(id)}
                        name={String(id)}
                        onChange={() => handleToggleUser(id)}
                    />

                </li>
            )}</ul>
    </Modal>;
}