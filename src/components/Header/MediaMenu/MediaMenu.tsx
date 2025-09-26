import { MenuItems } from '@/constants/menu';
import { getActions, useIsOpenMenu, useSelectedMenu } from '@/stores';
import HorizontalMenuIcon from '@/components/common/icons/HorizontalMenuIcon';
import styles from "./styles.module.css";

export default function MediaMenu() {
    const selectedMenu = useSelectedMenu();
    const isOpenMenu = useIsOpenMenu();
    const { setSelectedMenu, toggleMenu } = getActions();

    const handleMenuClick = (menuName: string) => {
        setSelectedMenu(menuName);
        toggleMenu()
    };


    return (
        <div className={`${styles.media_menu} ${isOpenMenu ? styles.menu_open : styles.menu_closed}`}>
            <ul className={`${styles.media_menu_list} ${isOpenMenu ? styles.open : styles.closed}`}>
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
            <button className={styles.menu_button} onClick={toggleMenu}><HorizontalMenuIcon /></button>
        </div>
    );
}