import { useState } from 'react';
import ControllerButton from '@/components/AiWBoard/ControllerButton/ControllerButton';
import styles from "./styles.module.css";


export default function AiWBoard() {
    const [selectedTool, setSelectedTool] = useState<string>("그리기");


    return <div className={styles.ai_w_board}>
        <ControllerButton
            setSelectedTool={setSelectedTool} />
    </div>;
}