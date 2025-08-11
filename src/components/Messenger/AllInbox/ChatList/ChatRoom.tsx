import { useEffect, useState, useRef } from 'react';
import { getActions, useSocket, useUser } from '@/stores';
import { useMessenger } from '@/context/MessengerContext';
import { formatDate, formatTime } from '@/utils/time-format';
import type { TServerChatData } from '@/stores/slice/socket';
import type { TChatContent } from '@/api/chat';
import TextInput from '@/components/common/TextInput/TextInput';
import AirplaneIcon from '@/components/common/icons/AirplaneIcon';
import Button from '@/components/common/Button/Button';
import Avatar from '@/components/common/Avatar/Avatar';
import styles from "./styles.module.css";


export default function ChatRoom() {
    const [chatInput, setChatInput] = useState("");
    const chatContentRef = useRef<HTMLUListElement>(null);
    const { chatRoomId, chatContent, setChatContent } = useMessenger();
    const { sendMessage } = getActions();
    const socket = useSocket();
    const user = useUser();

    const getChatDisplayInfo = (chat: TChatContent, index: number) => {
        const isMe = user?.id && Number(user.id) === chat.author.id;
        const currentDate = formatDate(chat.createdAt);
        const prevDate = index > 0 ? formatDate(chatContent[index - 1].createdAt) : null;
        const shouldShowDate = index === 0 || currentDate !== prevDate;

        return {
            isMe,
            currentDate,
            shouldShowDate
        };
    };

    const handleSendMessage = () => {
        if (!chatInput.trim() || !chatRoomId) return;

        sendMessage(chatRoomId, chatInput);
        setChatInput("");
    }

    // 스크롤을 맨 아래로 이동시키는 함수
    const scrollToBottom = () => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    };

    // 채팅 내용이 변경될 때마다 스크롤을 아래로 이동
    useEffect(() => {
        scrollToBottom();
    }, [chatContent]);


    useEffect(() => {
        if (!socket) return;

        const handleMessage = (message: TServerChatData) => {
            console.log("새로운 메시지가 도착했습니다:", message);

            const newChatContent = {
                id: Date.now(),
                createdAt: message.createdAt,
                chatRoom: {
                    hostId: message.chatRoom.hostId,
                    id: message.chatRoom.id,
                },
                author: {
                    id: message.author.id,
                    name: message.author.name,
                    profile: message.author.profile,
                },
                message: message.message,
            };

            setChatContent(prev => [...prev, newChatContent]);
        };
        socket.on("sendMessage", handleMessage);

        return () => {
            socket.off("sendMessage", handleMessage);
        };
    }, [socket, setChatContent]);

    return (
        <div className={styles.chatRoom}>
            <ul ref={chatContentRef} className={styles.chat_content_wrap}>
                {chatContent.length === 0 && (
                    <div className={styles.date_wrap}>
                        <span className={styles.date}>{formatDate(new Date().toISOString())}</span>
                    </div>
                )}
                {chatContent.map((chat, index) => {
                    const { isMe, currentDate, shouldShowDate } = getChatDisplayInfo(chat, index);

                    return (
                        <div key={chat.id}>
                            {shouldShowDate && (
                                <div className={styles.date_wrap}>
                                    <span className={styles.date}>{currentDate}</span>
                                </div>
                            )}
                            <li className={`${styles.chat_content} ${isMe ? styles.me : ""}`}>
                                {!isMe && <Avatar src={chat.author.profile} alt={chat.author.name} />}
                                <div className={styles.author_wrap}>
                                    <div className={styles.author_info}>
                                        {!isMe && <span className={styles.name}>{chat.author.name}</span>}
                                        <span className={`${styles.time} ${isMe ? styles.me_time : ""}`}>
                                            {formatTime(chat.createdAt)}
                                        </span>
                                    </div>
                                    <span className={`${styles.message} ${isMe ? styles.me_message : ""}`}>
                                        {chat.message}
                                    </span>
                                </div>
                            </li>
                        </div>
                    )
                })}
            </ul>
            <div className={styles.chat_input_wrap}>
                <TextInput name={"chatInput"}
                    value={chatInput}
                    placeholder={"메시지를 입력하세요"}
                    isLabel={false}
                    onChange={(e) => setChatInput(e.target.value)} />
                <Button Icon={AirplaneIcon} onClick={handleSendMessage} />
            </div>
        </div>
    );
}