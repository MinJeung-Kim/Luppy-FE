import BaseMenu from '../BaseMenu';
import styles from "./styles.module.css";

export default function Menu() {
  return (
    <BaseMenu
      className={styles.menu_container}
      itemClassName={styles.menu_item}
      menuClassName={styles.menu}
      activeClassName={styles.active}
    />
  );
}

