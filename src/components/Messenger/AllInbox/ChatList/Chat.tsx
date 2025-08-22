import { useEffect, useState } from 'react';
import { useChatGroupList } from '@/stores';
import { formatTime } from '@/utils/time-format';
import { useMessenger } from '@/context/MessengerContext';
import { getChatContent, moveChatToGroup, type TChatRoom } from '@/api/chat';
import StarLineIcon from '@/components/common/icons/StarLineIcon';
import SelectBox from '@/components/common/SelectBox/SelectBox';
// import StarIcon from '@/components/common/icons/StarIcon';
import Avatar from '@/components/common/Avatar/Avatar';
import styles from "./styles.module.css";

type Props = {
    chatList: TChatRoom[];
}

export default function Chat({ chatList }: Props) {
    const chatGroupList = useChatGroupList();
    const { setChatContent, selectedChat, setSelectedChat, setChatRoomId } = useMessenger();
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

    const handleSelectChat = async (roomId: number) => {
        const result = await getChatContent(roomId);
        setChatContent(result);
        setChatRoomId(roomId);
        setSelectedChat(roomId);
        setOpenMenuId(null);
    };

    const handleToggleMenu = (e: React.MouseEvent, roomId: number) => {
        e.stopPropagation(); // 상위 onClick (채팅 선택) 방지
        setOpenMenuId(prev => (prev === roomId ? null : roomId));
        console.log('handleToggleMenu : ', roomId);

        setSelectedChat(roomId);
    };

    const handleMoveGroup = (groupId: string) => {
        // 그룹 이동 로직
        console.log('handleMoveGroup selectedChat, groupId  :', selectedChat, groupId);
        moveChatToGroup(selectedChat!, Number(groupId))
    };

    useEffect(() => {
        const newOptions = chatGroupList.map(({ id, name }) => ({
            label: name,
            value: id,
        }));
        setOptions(newOptions);
    }, [chatGroupList]);

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
                            {/* <StarIcon /> */}
                            <StarLineIcon />
                        </button>
                        {openMenuId === chat.roomId && (
                            <SelectBox options={options} onClick={handleMoveGroup} />
                        )}
                    </li>
                ))
            }
        </ul>
    );
}