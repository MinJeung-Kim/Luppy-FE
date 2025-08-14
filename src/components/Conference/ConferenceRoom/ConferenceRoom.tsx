import { useConference } from '@/context/ConferenceContext';
import { useIsCreatedRoom } from '@/stores';
import CallSetting from '../JoinRoom/CallSetting/CallSetting';
import CreateRoom from '../CreateRoom/CreateRoom';
import JoinRoom from '../JoinRoom/JoinRoom';
import UserList from '../UserList/UserList';
import Search from '../Search/Search';
import styles from "./styles.module.css";

export default function ConferenceRoom() {
    const { isCallSetting, setIsCallSetting } = useConference();
    const isCreatedRoom = useIsCreatedRoom();

    return <div className={styles.conference_container}>
        {!isCreatedRoom ?
            <div className={styles.create_room_wrap}>
                <div className={styles.user_list_wrap}>
                    <Search />
                    <UserList />
                </div>
                <CreateRoom />
            </div>
            : <div className={styles.join_room_wrap}>
                {isCallSetting && <CallSetting onClose={() => setIsCallSetting(false)} />}

                <JoinRoom />
            </div>}
    </div>
}