import { useConference } from '@/context/ConferenceContext';
import CreateRoom from '../CreateRoom/CreateRoom';
import JoinRoom from '../JoinRoom/JoinRoom';
import UserList from '../UserList/UserList';
import Search from '../Search/Search';
import styles from "./styles.module.css";

export default function ConferenceRoom() {
    const { isCreatedRoom } = useConference();

    return <div className={styles.conference_container}>
        {!isCreatedRoom ?
            <div className={styles.create_room_wrap}>
                <div className={styles.user_list_wrap}>
                    <Search />
                    <UserList />
                </div>
                <CreateRoom />
            </div>
            : <JoinRoom />}
    </div>
}