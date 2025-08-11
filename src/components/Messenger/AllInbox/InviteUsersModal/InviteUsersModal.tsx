
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers } from '@/api/user';
import type { TGuest } from '@/api/chat';
import type { User } from '@/stores/slice/auth';
import { getActions, useSocket, useUser } from '@/stores';
import { useMessenger } from '@/context/MessengerContext';
import CheckBox from '@/components/common/CheckBox/CheckBox';
import Modal from '@/components/common/Modal/Modal';
import styles from "./styles.module.css";

export default function InviteUsersModal() {
    const user = useUser();
    const socket = useSocket();
    const queryClient = useQueryClient();
    const { setIsModal } = useMessenger();
    const { createChatRoom } = getActions();
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    const { data } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const result = await getUsers();
            if (result?.error) {
                throw new Error(result.error);
            }
            return result?.users || [];
        },
        // staleTime: 1000 * 10 // 10초
    })

    // 현재 사용자를 제외한 사용자 목록
    const availableUsers = data?.filter(userData => userData.id !== user?.id) || [];

    const handleClose = useCallback(() => {
        setIsModal(false);
    }, [setIsModal]);

    const handleSave = () => {
        createChatRoom(user!.id, selectedUsers);
    }

    useEffect(() => {
        if (!socket) return;

        const handleRoomCreated = ({ host, guests }: { host: TGuest; guests: TGuest[] }) => {
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
                .filter((userData: User) => selectedUsers.includes(userData.id))
                .map((userData: User) => (
                    <li key={userData.id} className={styles.select_name}>{userData.name}</li>
                ))}
        </ul>
        <ul className={styles.user_container}>
            <span className={styles.title}>Invited</span>
            {availableUsers.map(({ id, name, email, profile }: User) =>
                <li className={styles.user_wrap} key={id}>
                    <div className={styles.left}>
                        <img className={styles.avatar} src={profile} alt="profile" />
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