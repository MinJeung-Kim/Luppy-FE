import { getActions, useSelectedMenu } from "@/stores";
import { MenuItems } from "@/constants/menu";
import styles from "./styles.module.css";

export default function Menu() {
  const selectedMenu = useSelectedMenu();
  const { setSelectedMenu } = getActions();

  const handleMenuClick = (menuName: string) => {
    setSelectedMenu(menuName);
  };

  return (
    <div className={styles.menu_container}>
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
    </div>
  );
}
