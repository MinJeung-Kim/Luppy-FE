import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TUser } from '@/stores/slice/auth';
import { getActions, useUser } from '@/stores';
import { createChatRoom } from '@/api/chat';
import { useMessenger } from '@/context/MessengerContext';
import { useAvailableUsers } from '@/hooks/useAvailableUsers';
import SelectedUsers from '@/components/SelectedUsers/SelectedUsers';
import CheckBox from '@/components/common/CheckBox/CheckBox';
import Avatar from '@/components/common/Avatar/Avatar';
import Modal from '@/components/common/Modal/Modal';
import styles from "./styles.module.css";

export default function InviteUsersModal() {
    const user = useUser();
    const { setIsModal } = useMessenger();
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const { availableUsers } = useAvailableUsers();
    const { setOpenAlert, setAlertMessage } = getActions();
    const queryClient = useQueryClient();

    const handleClose = useCallback(() => {
        setIsModal(false);
    }, [setIsModal]);

    const handleSave = () => {
        mutateCreateChat();
        setIsModal(false);
    }

    const { mutate: mutateCreateChat } = useMutation({
        mutationFn: async () => {
            if (selectedUsers.length < 1) throw new Error('팀원을 선택해 주세요.');
            return await createChatRoom([user!.id, ...selectedUsers]);
        },
        onSuccess: () => {
            setAlertMessage('채팅 방이 생성되었습니다.');
            setOpenAlert(true);
            // 목록 재조회
            queryClient.invalidateQueries({ queryKey: ['chatList'] });

        },
        onError: () => {
            setAlertMessage('채팅 방 생성에 실패했습니다.');
            setOpenAlert(true);
        }
    });

    const handleToggleUser = (userId: number) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId) // 체크 해제
                : [...prev, userId]                // 체크
        );
    };

    return (
        <Modal header='Invite people to chat' onClose={handleClose} onSave={handleSave}>
            <span className={styles.title}>Type name to invite ({selectedUsers.length})</span>
            <SelectedUsers users={availableUsers} selectedUsers={selectedUsers} />
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
                )}
            </ul>
        </Modal>
    );
}