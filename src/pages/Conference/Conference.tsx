import Search from '@/components/Conference/Search/Search';
import UserList from '@/components/Conference/UserList/UserList';
import CreateRoom from '@/components/Conference/CreateRoom/CreateRoom';
import styles from "./styles.module.css";

export default function Conference() {

    return (
        <div className={styles.conference_container}>
            <div className={styles.user_list_wrap}>
                <Search />
                <UserList />
            </div>
            <CreateRoom />

        </div>
    );
}