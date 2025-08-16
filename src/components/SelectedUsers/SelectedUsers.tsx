import type { TUser } from '@/stores/slice/auth';
import styles from "./styles.module.css";

type Props = {
    users: TUser[];
    selectedUsers: number[];
};

export default function SelectedUsers({ users, selectedUsers }: Props) {

    return <ul className={styles.select_users}>
        {users
            .filter((userData: TUser) => selectedUsers.includes(userData.id))
            .map((userData: TUser) => (
                <li key={userData.id} className={styles.select_name}>{userData.name}</li>
            ))}
    </ul>;
}