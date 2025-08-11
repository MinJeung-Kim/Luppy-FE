import { useState } from 'react';
import { MenuItems } from '@/constants/menu';
import { getActions, useSelectedMenu } from '@/stores';
import HorizontalMenuIcon from '@/components/common/icons/HorizontalMenuIcon';
import styles from "./styles.module.css";

export default function MediaMenu() {
    const selectedMenu = useSelectedMenu();
    const { setSelectedMenu } = getActions();
    const [isOpen, setIsOpen] = useState(false);

    const handleMenuClick = (menuName: string) => {
        setSelectedMenu(menuName);
    };

    const handleOpenMenu = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div className={`${styles.media_menu} ${isOpen ? styles.menu_open : styles.menu_closed}`}>
            <ul className={`${styles.media_menu_list} ${isOpen ? styles.open : styles.closed}`}>
                {MenuItems.map(({ name, Icon }) => (
                    <div
                        key={name}
                        className={`${styles.menu_item} ${selectedMenu === name ? styles.active : ""
                            }`}
                        onClick={() => handleMenuClick(name)}
                    >
                        <Icon />
                        <span className={styles.menu}>{name}</span>
                    </div>
                ))}
            </ul>
            <button className={styles.menu_button} onClick={handleOpenMenu}><HorizontalMenuIcon /></button>
        </div>
    );
}