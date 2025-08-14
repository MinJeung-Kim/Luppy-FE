
import { useEffect, useState } from 'react';
import { useSocket, useUser } from '@/stores';
import type { TUser } from '@/stores/slice/auth';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useConference } from '@/context/ConferenceContext';
import MicrophoneIcon from '@/components/common/icons/MicrophoneIcon';
import VideoCamOffIcon from '@/components/common/icons/VideoCamOffIcon';
import VideoCamIcon from '@/components/common/icons/VideoCamIcon';
import SettingIcon from '@/components/common/icons/SettingIcon';
import MicOffIcon from '@/components/common/icons/MicOffIcon';
import UsersIcon from '@/components/common/icons/UsersIcon';
import CallIcon from '@/components/common/icons/CallIcon';
import Avatar from '@/components/common/Avatar/Avatar';
import VideoForm from './VideoForm/VideoForm';
import styles from "./styles.module.css";

export default function JoinRoom() {
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);

    const user = useUser()
    const socket = useSocket();
    const {
        // joinUsers, 
        setJoinUsers, setIsCallSetting } = useConference();
    const { stream } = useMediaStream();

    const handleMuteToggle = () => {
        stream?.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsMicOn(prev => !prev);
    };

    const handleVideoToggle = () => {
        stream?.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsVideoOn(prev => !prev);
    };

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

    return (
        <div className={styles.join_room_container}>

            <div className={styles.video_form}>
                {isVideoOn
                    ? <VideoForm isMicOn={isMicOn} />
                    : <Avatar src={user!.profile} alt='' />
                }
            </div>

            {/* {joinUsers.map(user => (
            <VideoForm key={user.id} user={user} />
        ))} */}

            <div className={styles.button_container}>
                <button className={styles.call_setting_button} onClick={() => { }}>
                    <UsersIcon />
                </button>
                <div className={styles.video_controls}>
                    <button className={styles.microphone_button} onClick={handleMuteToggle}>
                        {isMicOn ? <MicOffIcon /> : <MicrophoneIcon />}
                    </button>
                    <button className={styles.call_button}><CallIcon /></button>
                    <button className={styles.video_cam_button} onClick={handleVideoToggle}>
                        {isVideoOn ? <VideoCamIcon /> : <VideoCamOffIcon />}
                    </button>
                </div>

                <button className={styles.call_setting_button} onClick={() => setIsCallSetting(true)}>
                    <SettingIcon />
                </button>
            </div>
        </div>
    );
}