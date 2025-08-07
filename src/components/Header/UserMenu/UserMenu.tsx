
import { logout } from "@/api/auth";
import { getActions } from '@/stores';
import SearchIcon from "@/components/common/icons/SearchIcon";
import styles from "./styles.module.css";

export default function UserMenu() {

  const { clearAccessToken,
    setAlertMessage,
    setOpenAlert } = getActions();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setAlertMessage("로그아웃 되었습니다.");
      clearAccessToken();
    } else {
      setAlertMessage(result.error);
    }
    setOpenAlert(true);
  };

  return (
    <div className={styles.user_menu_container}>
      <div className={styles.search_warp}>
        <SearchIcon />
      </div>
      <button className={styles.logout_button} onClick={handleLogout}>
        logout
      </button>
    </div>
  );
}
