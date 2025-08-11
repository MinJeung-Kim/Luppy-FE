import Search from '@/components/Conference/Search/Search';
import UserList from '@/components/Conference/UserList/UserList';
import styles from "./styles.module.css";

export default function Conference() {

    return (
        <div className={styles.conference_container}>
            <Search />
            <UserList />
        </div>
    );
}