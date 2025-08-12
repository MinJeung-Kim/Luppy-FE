import { useConference } from '@/context/ConferenceContext';
import { useAvailableUsers } from '@/hooks/useAvailableUsers';
import CheckBox from '@/components/common/CheckBox/CheckBox';
import { formatPhoneNumber } from '@/utils/validation';
import Avatar from '@/components/common/Avatar/Avatar';
import styles from "./styles.module.css";

export default function UserList() {
    const { availableUsers } = useAvailableUsers();
    const { selectedUsers, setSelectedUsers } = useConference();

    const handleToggleUser = (userId: number) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId) // 체크 해제
                : [...prev, userId]                // 체크
        );
    };

    return (
        <ul className={styles.user_list}>
            {availableUsers.map(userData => (
                <li key={userData.id} className={styles.user}>
                    <div className={styles.user_item}>
                        <Avatar src={userData.profile} alt={userData.name} />
                        <div className={styles.user_info}>
                            <span className={styles.name}>{userData.name}</span>
                            <span className={styles.phone}>{formatPhoneNumber(userData.phone)}</span>
                        </div>
                    </div>

                    <CheckBox
                        checked={selectedUsers.includes(userData.id)}
                        name={String(userData.id)}
                        onChange={() => handleToggleUser(userData.id)}
                    />
                </li>
            ))}
        </ul>
    );
}