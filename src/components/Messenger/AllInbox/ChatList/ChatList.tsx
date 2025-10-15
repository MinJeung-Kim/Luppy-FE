import clsx from "clsx";
import { useQuery } from '@tanstack/react-query';
import { useSelectedGroupId } from '@/stores';
import { getChatRooms, type TChatRoom } from '@/api/chat';
import { useMessenger } from '@/context/MessengerContext';
import DataEmpty from '../DataEmpty/DataEmpty';
import Chat from './Chat';
import ChatRoom from './ChatRoom';
import styles from "./styles.module.css";

export default function ChatList() {
    const { selectedChat, currentPage, setTotalPages } = useMessenger();
    const selectedGroupId = useSelectedGroupId();
    const page = 1;
    const limit = 10;

    const { data } = useQuery<TChatRoom[]>({
        queryKey: ['chatList', selectedGroupId, currentPage, limit],
        queryFn: async () => {
            const result = await getChatRooms(selectedGroupId, page, limit);
            // 페이지네이션 정보 업데이트
            if (result?.totalPages) {
                setTotalPages(result.totalPages);
            }
            return result?.chatList || [];
        },
    })
    return (
        <div
            className={clsx(
                styles.chatList,
                { [styles.grid]: selectedChat }
            )}>
            {data && data.length > 0 ?
                <Chat chatList={data} />
                : <DataEmpty />
            }

            {selectedChat !== null && <ChatRoom />}
        </div>
    );
}