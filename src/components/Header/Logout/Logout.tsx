import { getActions } from '@/stores';
import { logout } from '@/api/auth';
import { AUTH_MESSAGES } from '@/constants/messages';
import styles from "./styles.module.css";
import useAuthStore from '@/stores/useAuthStore';

export default function Logout() {
    const { clearAccessToken } = useAuthStore()
    const { setAlertMessage, setOpenAlert } = getActions();

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            clearAccessToken();
            setAlertMessage(AUTH_MESSAGES.logout);
        } else {
            setAlertMessage(result.error);
        }
        setOpenAlert(true);
    };


    return <button className={styles.logout_button} onClick={handleLogout}>
        logout
    </button>;
}