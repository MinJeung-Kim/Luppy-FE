import ControllerButton from '@/components/AiWBoard/ControllerButton/ControllerButton';
import styles from "./styles.module.css";

export default function AiWBoard() {

    return <div className={styles.ai_w_board}>
        <ControllerButton />
    </div>;
}