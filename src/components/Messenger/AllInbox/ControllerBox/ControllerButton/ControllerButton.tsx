import type { ComponentType } from 'react';
import styles from "./styles.module.css";

type Props = {
    Icon: ComponentType;
    onClick: () => void;
};

export default function ControllerButton({ Icon, onClick }: Props) {

    return <button className={styles.controller_button} onClick={onClick}>
        <Icon />
    </button>;
}