// import { useGuests } from '@/stores';
import { useMessenger } from '@/context/MessengerContext';
import { getChatContent, type TChatRoom } from '@/api/chat';
import { formatTime } from '@/utils/time-format';
import styles from "./styles.module.css";


type Props = {
    chatList: TChatRoom[];
}

export default function Chat({ chatList }: Props) {
    // const guests = useGuests();
    const { setChatContent, selectedChat, setSelectedChat, setChatRoomId } = useMessenger();


    const handleSelectChat = async (roomId: number) => {

        const result = await getChatContent(roomId);
        console.log('chatContent', result);
        setChatContent(result);
        setChatRoomId(roomId);
        setSelectedChat(roomId);
    }

    return (
        <ul className={styles.chat}>
            {
                chatList.map((chat) => (
                    <li key={chat.roomId} className={`${styles.chat_item} ${selectedChat === chat.roomId ? styles.selected : ''}`} onClick={() => handleSelectChat(chat.roomId)}>
                        <div className={styles.guests_img}>
                            {chat.guests.map(({ id, name, profile }) => (
                                <img src={profile} alt={`${name}'s avatar`} className={styles.avatar} key={id} />
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
                    </li>
                ))
            }
        </ul>
    );
}