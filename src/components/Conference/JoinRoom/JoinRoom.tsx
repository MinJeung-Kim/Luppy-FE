
import { useEffect, useState } from 'react';
import { useSocket, useUser } from '@/stores';
import type { TUser } from '@/stores/slice/auth';
import { useConference } from '@/context/ConferenceContext';
import VideoForm from './VideoForm/VideoForm';
import MicOffIcon from '@/components/common/icons/MicOffIcon';
import MicrophoneIcon from '@/components/common/icons/MicrophoneIcon';
import CallIcon from '@/components/common/icons/CallIcon';
import VideoCamIcon from '@/components/common/icons/VideoCamIcon';
import VideoCamOffIcon from '@/components/common/icons/VideoCamOffIcon';
import Avatar from '@/components/common/Avatar/Avatar';
import styles from "./styles.module.css";


export default function JoinRoom() {
    const user = useUser()
    const socket = useSocket();
    const {
        // joinUsers, 
        setJoinUsers } = useConference();
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);

    useEffect(() => {
        if (!socket) return;

        const handleJoinedConference = ({ message, joinUser }: { message: string, joinUser: TUser }) => {
            console.log("handleJoinedConference : ", message, joinUser);

            setJoinUsers(prev => [
                ...prev,
                {
                    id: joinUser.id,
                    name: joinUser.name,
                    profile: joinUser.profile,
                    isMicOn: true,
                    isVideoOn: true
                }
            ]);
        };

        socket.on("userJoined", handleJoinedConference);

        return () => {
            socket.off("userJoined", handleJoinedConference);
        };
    }, [socket, setJoinUsers]);

    return <div className={styles.join_room_container}>
        <div className={styles.video_form}>
            {isVideoOn ?
                <VideoForm isMicOn={isMicOn} />
                : <Avatar src={user!.profile} alt='' />}
        </div>

        {/* {joinUsers.map(user => (
            <VideoForm key={user.id} user={user} />
        ))} */}

        <div className={styles.button_container}>
            <button className={styles.microphone_button} onClick={() => setIsMicOn(prev => !prev)}>
                {isMicOn ? <MicOffIcon /> : <MicrophoneIcon />}
            </button>
            <button className={styles.call_button}><CallIcon /></button>
            <button className={styles.video_cam_button} onClick={() => setIsVideoOn(prev => !prev)}>
                {isVideoOn ? <VideoCamIcon /> : <VideoCamOffIcon />}
            </button>
        </div>
    </div>;

}