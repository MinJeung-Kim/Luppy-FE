import VideoForm from './VideoForm/VideoForm';
import styles from "./styles.module.css";

export default function JoinRoom() {

    return <div className={styles.join_room_container}>

        <VideoForm />
    </div>;
}