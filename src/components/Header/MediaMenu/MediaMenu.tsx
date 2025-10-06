import clsx from "clsx";
import { getActions, useIsOpenMenu } from '@/stores';
import HorizontalMenuIcon from '@/components/common/icons/HorizontalMenuIcon';
import BaseMenu from '../BaseMenu';
import styles from "./styles.module.css";

export default function MediaMenu() {
    const isOpenMenu = useIsOpenMenu();
    const { toggleMenu } = getActions();

    return (
        <div
            className={clsx(styles.media_menu, { [styles.menu_open]: isOpenMenu })}>
            <BaseMenu
                className={clsx(styles.media_menu_list, { [styles.open]: isOpenMenu })}
                itemClassName={styles.menu_item}
                menuClassName={styles.menu}
                activeClassName={styles.active}
            />
            <button className={styles.menu_button} onClick={toggleMenu}><HorizontalMenuIcon /></button>
        </div>
    );
}