import { useState } from 'react';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import styles from "./styles.module.css";

type Props = {
    label: string;
    menu: {
        deviceId: string;
        label: string;
    }[];
};

export default function SelectBox({ label, menu }: Props) {
    const [isMenuToggle, setIsMenuToggle] = useState(false);
    const [selectedItem, setSelectedItem] = useState(menu[0]?.label || '');

    const handleItemClick = (item: { deviceId: string; label: string }) => {
        setSelectedItem(item.label);
        setIsMenuToggle(false);
    };

    return (
        <div className={styles.select_box}>
            <span className={styles.label}>{label || menu[0].label}</span>
            <div className={styles.selected_item}
                onClick={() => setIsMenuToggle(!isMenuToggle)}
            >
                <span className={styles.selected_item_name}>{selectedItem || menu[0]?.label}</span>
                <ArrowRightIcon />

                <ul className={`${styles.select} ${isMenuToggle ? styles.open : ''}`}>
                    {menu.map(item => (
                        <li key={item.deviceId}
                            className={styles.menu_item}
                            onClick={() => handleItemClick(item)}
                        >
                            <span className={styles.item_name}>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}