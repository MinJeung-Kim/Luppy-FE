import { useEffect, useState, useRef } from 'react';
import { getActions, useSocket } from '@/stores';
import { useMessenger } from '@/context/MessengerContext';
import { formatDate } from '@/utils/time-format';
import type { TChatContent } from '@/api/chat';
import TextInput from '@/components/common/TextInput/TextInput';
import AirplaneIcon from '@/components/common/icons/AirplaneIcon';
import Button from '@/components/common/Button/Button';
import ChatContent from '../ChatContent/ChatContent';
import styles from "./styles.module.css";

export default function ChatRoom() {
    const [chatInput, setChatInput] = useState("");
    const chatContentRef = useRef<HTMLUListElement>(null);
    const { chatRoomId, chatContent, setChatContent } = useMessenger();
    const { sendMessage } = getActions();
    const socket = useSocket();

    const handleSendMessage = () => {

        if (!chatInput.trim() || !chatRoomId) return;
        sendMessage(chatRoomId, chatInput);
        setChatInput("");
    };

    const scrollToBottom = () => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatContent]);

    useEffect(() => {
        if (!socket) return;


        const handleMessage = (newChat: TChatContent) => {
            console.log("Received message:", newChat);

            setChatContent((prev) => [...(prev || []), newChat]);
        };

        const handleJoinRoom = (userId: string) => {
            console.log("User joined room:", userId);
        };

        socket.on("sendMessage", handleMessage);
        socket.on("userJoined", handleJoinRoom);

        return () => {
            socket.off("sendMessage", handleMessage);
            socket.off("userJoined", handleJoinRoom);
        };
    }, [socket, setChatContent]);

    return (
        <div className={styles.chatRoom}>
            <ul ref={chatContentRef} className={styles.chat_content_wrap}>
                {(!chatContent || chatContent.length === 0) && (
                    <div className={styles.date_wrap}>
                        <span className={styles.date}>{formatDate(new Date().toISOString())}</span>
                    </div>
                )}
                <ChatContent />
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