import { useQuery } from '@tanstack/react-query';
import { getChatList, type TChatRoom } from '@/api/chat';
// import { getActions } from '@/stores';
import { useMessenger } from '@/context/MessengerContext';
import DataEmpty from '../DataEmpty/DataEmpty';
import Chat from './Chat';
import ChatRoom from './ChatRoom';
import styles from "./styles.module.css";

export default function ChatList() {
    const { selectedChat } = useMessenger();

    // const { setGuests } = getActions();

    const { data } = useQuery<TChatRoom[]>({
        queryKey: ['chatList'],
        queryFn: async () => {
            const result = await getChatList();
            if (result?.error) {
                throw new Error(result.error);
            }
            // setGuests(data!.guests || []); 

            return result?.chatList || [];
        },
        // staleTime: 1000 * 10 // 10초
    })

    return (
        <div className={`${styles.chatList} ${selectedChat ? styles.grid : ''}`}>
            {data && data.length > 0 ? <Chat chatList={data} />
                : <DataEmpty />}

            {selectedChat && <ChatRoom />}
        </div>
    );
}