import { getActions } from '@/stores';
import { logout } from '@/api/auth';
import { AUTH_MESSAGES } from '@/constants/messages';
import styles from "./styles.module.css";

export default function Logout() {

    const { clearAccessToken, setAlertMessage, setOpenAlert } = getActions();

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            setAlertMessage(AUTH_MESSAGES.logout);
            clearAccessToken();
        } else {
            setAlertMessage(result.error);
        }
        setOpenAlert(true);
    };


    return <button className={styles.logout_button} onClick={handleLogout}>
        logout
    </button>;
}