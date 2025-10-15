import clsx from "clsx";
import type { TChatContent } from '@/api/chat';
import useUserStore from '@/stores/useUserStore';
import Avatar from '@/components/common/Avatar/Avatar';
import { formatDate, formatTime } from '@/utils/time-format';
import { useMessenger } from '@/context/MessengerContext';
import styles from "./styles.module.css";


export default function ChatContent() {
    const { user } = useUserStore();
    const { chatContent } = useMessenger();

    const getChatDisplayInfo = (chat: TChatContent, index: number) => {
        const isMe = user.email === chat.sender.email;
        const currentDate = formatDate(chat.createdAt);
        const prevDate = index > 0 && chatContent ? formatDate(chatContent[index - 1].createdAt) : null;
        const shouldShowDate = index === 0 || currentDate !== prevDate;
        return { isMe, currentDate, shouldShowDate };
    };

    return <>
        {chatContent?.map((chat, index) => {
            const { isMe, currentDate, shouldShowDate } = getChatDisplayInfo(chat, index);

            return (
                <div key={chat.id}>
                    {shouldShowDate && (
                        <div className={styles.date_wrap}>
                            <span className={styles.date}>{currentDate}</span>
                        </div>
                    )}
                    <li
                        className={clsx(styles.chat_content, { [styles.me]: isMe })}>
                        {!isMe && <Avatar src={chat.sender.profile} alt={chat.sender.name} />}
                        <div className={styles.author_wrap}>
                            <div className={styles.author_info}>
                                {!isMe && <span className={styles.name}>{chat.sender.name}</span>}
                                <span
                                    className={clsx(styles.time, { [styles.me_time]: isMe })}>
                                    {formatTime(chat.createdAt)}
                                </span>
                            </div>
                            <span className={clsx(styles.message, { [styles.me_message]: isMe })}>
                                {chat.msg}
                            </span>
                        </div>
                    </li>
                </div>
            );
        })}</>;
}