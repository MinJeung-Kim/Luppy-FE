import type { ComponentType } from 'react';
import clsx from "clsx";
import styles from "./styles.module.css";

type Props = {
    Icon: ComponentType;
    onClick: () => void;
    disabled?: boolean;
};

export default function ControllerButton({ Icon, onClick, disabled = false }: Props) {

    return <button
        className={clsx(styles.controller_button, { [styles.disabled]: disabled })}
        onClick={onClick} disabled={disabled}>
        <Icon />
    </button>;
}