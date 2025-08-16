
import { useEffect, useState } from 'react';
import { getActions, useConferenceId, useSocket, useUser } from '@/stores';
import type { TUser } from '@/stores/slice/auth';
import { useMediaStream } from '@/hooks/useMediaStream';
import { usePeerConnection } from '@/hooks/usePeerConnection';
import VideoCamOffIcon from '@/components/common/icons/VideoCamOffIcon';
import MicrophoneIcon from '@/components/common/icons/MicrophoneIcon';
import VideoCamIcon from '@/components/common/icons/VideoCamIcon';
import SettingIcon from '@/components/common/icons/SettingIcon';
import MicOffIcon from '@/components/common/icons/MicOffIcon';
import { useConference } from '@/context/ConferenceContext';
import UsersIcon from '@/components/common/icons/UsersIcon';
import CallIcon from '@/components/common/icons/CallIcon';
import Avatar from '@/components/common/Avatar/Avatar';
import VideoForm from './VideoForm/VideoForm';
import styles from "./styles.module.css";

export default function JoinRoom() {
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);

    const [isPeerMicOn, setIsPeerMicOn] = useState<boolean>(true);
    const [isPeerVideoOn, setIsPeerVideoOn] = useState<boolean>(true);

    const user = useUser()
    const socket = useSocket();
    const conferenceId = useConferenceId();
    const {
        joinUsers,
        setJoinUsers, setIsCallSetting } = useConference();
    const { stream } = useMediaStream();
    const { sendOffer, sendAnswer, sendMediaState } = getActions()
    const { peerConnection, peerStream } = usePeerConnection()


    const handleMuteToggle = () => {
        const next = !isMicOn;
        stream?.getAudioTracks().forEach(track => { track.enabled = next; });
        setIsMicOn(next);
        if (!conferenceId) return; // 회의 ID 없으면 전송 안 함
        sendMediaState(conferenceId, isVideoOn, next);

    };

    const handleVideoToggle = () => {
        const next = !isVideoOn;
        stream?.getVideoTracks().forEach(track => { track.enabled = next; });
        setIsVideoOn(next);
        if (!conferenceId) return;
        sendMediaState(conferenceId, next, isMicOn);
    };

    useEffect(() => {
        if (!socket) return;

        const handleJoinedConference = async ({ joinUser }: { message: string, joinUser: TUser }) => {
            const offer = await peerConnection.current?.createOffer();
            peerConnection.current?.setLocalDescription(offer!);
            console.log("sent the offer ");
            sendOffer(conferenceId!, offer!)

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
            if (conferenceId) {
                sendMediaState(conferenceId, isVideoOn, isMicOn);
            }
        };

        const handleOffer = async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
            console.log("received the offer ");
            peerConnection.current?.setRemoteDescription(offer);

            const answer = await peerConnection.current?.createAnswer();
            peerConnection.current?.setLocalDescription(answer);
            sendAnswer(conferenceId!, answer!);
            console.log("sent the answer ");

        };

        const handleAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
            console.log("received the answer ");
            peerConnection.current?.setRemoteDescription(answer);
        };

        const handleIcecandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            peerConnection.current?.addIceCandidate(candidate);
            console.log("received the candidate ");
        };

        const handleMediaState = ({ cameraOn, micOn }: { cameraOn: boolean; micOn: boolean }) => {
            setIsPeerVideoOn(cameraOn);
            setIsPeerMicOn(micOn);
            console.log("[signal] peer media state:", { cameraOn, micOn });
        };

        socket.on("userJoined", handleJoinedConference);
        socket.on("offer", handleOffer);
        socket.on("answer", handleAnswer);
        socket.on("icecandidate", handleIcecandidate);
        socket.on("mediaState", handleMediaState);

        return () => {
            socket.off("userJoined", handleJoinedConference);
            socket.off("offer", handleOffer);
            socket.off("answer", handleAnswer);
            socket.off("icecandidate", handleIcecandidate);
            socket.off("mediaState", handleMediaState);
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
            <div className={styles.video_form}>
                {isPeerVideoOn
                    ? <VideoForm isMicOn={isPeerMicOn} /* 필요 시 props로 peerStream 전달 */ />
                    : <Avatar src={joinUsers[0]?.profile} alt='' />
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