import { useEffect, useState } from 'react';
import { getActions, useChatGroupList } from '@/stores';
import { formatTime } from '@/utils/time-format';
import { useMessenger } from '@/context/MessengerContext';
import { getChat, moveChatToGroup, type TChatRoom } from '@/api/chat';
import StarLineIcon from '@/components/common/icons/StarLineIcon';
import SelectBox from '@/components/common/SelectBox/SelectBox';
import StarIcon from '@/components/common/icons/StarIcon';
import Avatar from '@/components/common/Avatar/Avatar';
import styles from "./styles.module.css";

type Props = {
    chatList: TChatRoom[];
}

export default function Chat({ chatList }: Props) {
    const chatGroupList = useChatGroupList();
    const { setAlertMessage, setOpenAlert, joinChatRoom } = getActions();
    const { setChatContent, selectedChat, setSelectedChat, setChatRoomId } = useMessenger();
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

    const handleSelectChat = async (roomId: number) => {
        const result = await getChat(roomId);
        setChatContent(result);
        setChatRoomId(roomId);
        setSelectedChat(roomId);
        setOpenMenuId(null);

        joinChatRoom(roomId);
    };

    const handleToggleMenu = (e: React.MouseEvent, roomId: number) => {
        e.stopPropagation(); // 상위 onClick (채팅 선택) 방지
        setOpenMenuId(prev => (prev === roomId ? null : roomId));
        setSelectedChat(roomId);
    };

    const handleMoveGroup = (groupId: string) => {
        moveChatToGroup(selectedChat!, Number(groupId));
        setAlertMessage(`Chat moved to group ${groupId}`);
        setOpenAlert(true);
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
                chatList.map((chat) => {
                    return <li key={chat.id}
                        className={`${styles.chat_item} ${selectedChat === chat.id ? styles.selected : ''}`}>
                        <div className={styles.guests_img}>
                            {chat.members.map(({ id, name, profile }) => (
                                <Avatar src={profile} alt={`${name}'s avatar`} key={id} />
                            ))}
                        </div>

                        <div className={styles.message_wrap}
                            onClick={() => handleSelectChat(chat.id)}>
                            <div className={styles.guests_wrap} >
                                <div className={styles.guests_name}>
                                    {chat.members.map(({ name }) => name).join(', ')}
                                </div>
                                <span className={styles.time}>{formatTime(chat.createdAt)}</span>
                            </div>

                            {/* <span className={styles.last_message}>{chat.lastMessage}</span> */}
                        </div>

                        {options.length > 0 && <button className={styles.menu_button} onClick={(e) => handleToggleMenu(e, chat.id)} aria-expanded={openMenuId === chat.id}>
                            {chat.chatGroup ? <StarIcon /> : <StarLineIcon />}
                        </button>}
                        {openMenuId && openMenuId === chat.id && (
                            <SelectBox options={options} onClick={handleMoveGroup} />
                        )}
                    </li>
                }
                )
            }
        </ul>
    );
}