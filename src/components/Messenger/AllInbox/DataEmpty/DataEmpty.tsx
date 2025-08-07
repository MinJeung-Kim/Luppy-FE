
import EmptyMsgImg from "@/assets/images/empty_message.png";
import styles from "./styles.module.css";

export default function DataEmpty() {

    return (
        <div className={styles.data_empty_container}>
            <img src={EmptyMsgImg} alt="No messages" />
            <span className={styles.title}>메세지를 찾을 수 없나요?</span>
            <span className={styles.subtitle}>기존 연락처와 새로운 대화를 시작하거나 링크가 있는 사람을 초대하세요.</span>
        </div>
    );
}