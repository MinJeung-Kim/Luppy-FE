import { useAvailableUsers } from '@/hooks/useAvailableUsers';
import { formatPhoneNumber } from '@/utils/validation';
import Avatar from '@/components/common/Avatar/Avatar';
import styles from "./styles.module.css";

export default function UserList() {
    const { availableUsers } = useAvailableUsers();

    return (
        <div className={styles.user_list}>
            {availableUsers.map(userData => (
                <div key={userData.id} className={styles.user_item}>
                    <Avatar src={userData.profile} alt={userData.name} />
                    <div className={styles.user_info}>
                        <span className={styles.name}>{userData.name}</span>
                        <span className={styles.phone}>{formatPhoneNumber(userData.phone)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}