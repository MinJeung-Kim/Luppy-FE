import { ConferenceProvider } from '@/context/ConferenceContext';
import CreateRoom from '@/components/Conference/CreateRoom/CreateRoom';
import UserList from '@/components/Conference/UserList/UserList';
import Search from '@/components/Conference/Search/Search';
import styles from "./styles.module.css";

export default function Conference() {

    return (
        <div className={styles.conference_container}>
            <ConferenceProvider>
                <div className={styles.user_list_wrap}>
                    <Search />
                    <UserList />
                </div>
                <CreateRoom />
            </ConferenceProvider>
        </div>
    );
}