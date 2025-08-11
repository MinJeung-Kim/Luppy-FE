import Logout from '../Logout/Logout';
import SearchIcon from "@/components/common/icons/SearchIcon";
import styles from "./styles.module.css";

export default function UserMenu() {

  return (
    <div className={styles.user_menu_container}>
      <div className={styles.search_warp}>
        <SearchIcon />
      </div>
      <Logout />
    </div>
  );
}
