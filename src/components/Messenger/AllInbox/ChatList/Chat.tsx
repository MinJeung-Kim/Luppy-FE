import { useState } from 'react';
import { getChatContent, type TChatRoom } from '@/api/chat';
import { useMessenger } from '@/context/MessengerContext';
import { formatTime } from '@/utils/time-format';
import Avatar from '@/components/common/Avatar/Avatar';
import MenuIcon from '@/components/common/icons/MenuIcon';
import styles from "./styles.module.css";

type Props = {
    chatList: TChatRoom[];
}

export default function Chat({ chatList }: Props) {
    // roomId 기준으로 어떤 채팅 아이템의 메뉴가 열려있는지 추적
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const { setChatContent, selectedChat, setSelectedChat, setChatRoomId } = useMessenger();

    const handleSelectChat = async (roomId: number) => {
        const result = await getChatContent(roomId);
        setChatContent(result);
        setChatRoomId(roomId);
        setSelectedChat(roomId);
        // 채팅 선택 시 열려있는 메뉴 닫기
        setOpenMenuId(null);
    };

    const handleToggleMenu = (e: React.MouseEvent, roomId: number) => {
        e.stopPropagation(); // 상위 onClick (채팅 선택) 방지
        setOpenMenuId(prev => (prev === roomId ? null : roomId));
    };

    return (
        <ul className={styles.chat}>
            {
                chatList.map((chat) => (
                    <li key={chat.roomId}
                        className={`${styles.chat_item} ${selectedChat === chat.roomId ? styles.selected : ''}`}>
                        <div className={styles.guests_img}>
                            {chat.guests.map(({ id, name, profile }) => (
                                <Avatar src={profile} alt={`${name}'s avatar`} key={id} />
                            ))}
                        </div>

                        <div className={styles.message_wrap}
                            onClick={() => handleSelectChat(chat.roomId)}>
                            <div className={styles.guests_wrap} >
                                <div className={styles.guests_name}>
                                    {chat.guests.map(({ id, name }, index) => (
                                        <span key={id}>
                                            {name}
                                            {index < chat.guests.length - 1 && ', '}
                                        </span>
                                    ))}
                                </div>
                                <span className={styles.time}>{formatTime(chat.createdAt)}</span>
                            </div>

                            <span className={styles.last_message}>대화를 시작해보세요</span>
                        </div>

                        <button className={styles.menu_button} onClick={(e) => handleToggleMenu(e, chat.roomId)} aria-expanded={openMenuId === chat.roomId}>
                            <MenuIcon />
                        </button>
                        {openMenuId === chat.roomId && (
                            <div className={styles.menu} role="menu">
                                Menu Content
                            </div>
                        )}
                    </li>
                ))
            }
        </ul>
    );
}