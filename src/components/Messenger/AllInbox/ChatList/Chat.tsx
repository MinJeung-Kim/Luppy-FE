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
    const [isOpen, setIsOpen] = useState(false);
    const { setChatContent, selectedChat, setSelectedChat, setChatRoomId } = useMessenger();

    const handleSelectChat = async (roomId: number) => {

        const result = await getChatContent(roomId);
        setChatContent(result);
        setChatRoomId(roomId);
        setSelectedChat(roomId);
    }

    const handleOpenMenu = () => {
        setIsOpen(true)
    }

    return (
        <ul className={styles.chat}>
            {
                chatList.map((chat) => (
                    <li key={chat.roomId} className={`${styles.chat_item} ${selectedChat === chat.roomId ? styles.selected : ''}`} onClick={() => handleSelectChat(chat.roomId)}>
                        <div className={styles.guests_img}>
                            {chat.guests.map(({ id, name, profile }) => (
                                <Avatar src={profile} alt={`${name}'s avatar`} key={id} />
                            ))}
                        </div>

                        <div className={styles.message_wrap}>
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

                        <button className={styles.menu_button} onClick={handleOpenMenu}>
                            <MenuIcon />
                        </button>
                        {isOpen && <div className={styles.menu}>Menu Content</div>}
                    </li>
                ))
            }
        </ul>
    );
}