import { useQuery } from '@tanstack/react-query';
import { useSelectedGroupId } from '@/stores';
import { getChatList, type TChatRoom } from '@/api/chat';
import { useMessenger } from '@/context/MessengerContext';
import DataEmpty from '../DataEmpty/DataEmpty';
import Chat from './Chat';
import ChatRoom from './ChatRoom';
import styles from "./styles.module.css";

export default function ChatList() {
    const { selectedChat } = useMessenger();
    const selectedGroupId = useSelectedGroupId();

    const { data } = useQuery<TChatRoom[]>({
        queryKey: ['chatList', selectedGroupId],
        queryFn: async () => {
            const result = await getChatList(selectedGroupId);

            return result?.chatList || [];
        },
    })

    return (
        <div className={`${styles.chatList} ${selectedChat ? styles.grid : ''}`}>
            {data && data.length > 0 ? <Chat chatList={data} />
                : <DataEmpty />}

            {selectedChat && <ChatRoom />}
        </div>
    );
}