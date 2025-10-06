import { useUser } from '@/stores';
import Avatar from '../common/Avatar/Avatar';
import styles from "./styles.module.css";

export default function Profile() {
    const user = useUser()

    return (
        <div className={styles.profile}>
            <Avatar src={user!.profile} alt='' />
            <span>{user!.name}</span>
            <span>{user!.email}</span>
        </div>
    );
}