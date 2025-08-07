
import { useMessenger } from '@/context/MessengerContext';
import ControllerBox from "./ControllerBox/ControllerBox";
import InviteUsersModal from './InviteUsersModal/InviteUsersModal';
import ChatList from './ChatList/ChatList';
import styles from "./styles.module.css";


export default function AllInbox() {
  const { isModal } = useMessenger();

  return (
    <div className={styles.all_inbox_container}>
      <ControllerBox />
      <ChatList />
      {isModal && <InviteUsersModal />}
    </div>
  );
}
