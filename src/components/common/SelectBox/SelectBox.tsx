import { useState } from 'react';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import styles from "./styles.module.css";

export type TMenuItem = {
    deviceId: string;
    label: string;
};

type Props = {
    label: string;
    menu: TMenuItem[];

    selected: TMenuItem;

    onClick: (label: string, item: TMenuItem) => void;
};

export default function SelectBox({ label, menu, selected, onClick }: Props) {
    const [isMenuToggle, setIsMenuToggle] = useState(false);

    return (
        <div className={styles.select_box}>
            <span className={styles.label}>{label}</span>
            <div className={styles.selected_item}
                onClick={() => setIsMenuToggle(!isMenuToggle)}
            >
                <span className={styles.selected_item_name}>{selected.label || menu[0]?.label}</span>
                <ArrowRightIcon />

                <ul className={`${styles.select} ${isMenuToggle ? styles.open : ''}`}>
                    {menu.map(item => (
                        <li key={item.deviceId}
                            className={styles.menu_item}
                            onClick={() => onClick(label, item)}
                        >
                            <span className={styles.item_name} title={item.label}>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}