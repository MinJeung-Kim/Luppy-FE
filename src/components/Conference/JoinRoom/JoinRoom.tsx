
import { useEffect, useState } from 'react';
import { getActions, useConferenceId, useJoinUser, useSocket, useUser } from '@/stores';
import type { TUser } from '@/stores/slice/auth';
import { useMediaStream } from '@/hooks/useMediaStream';
import { usePeerConnection } from '@/hooks/usePeerConnection';
import VideoCamOffIcon from '@/components/common/icons/VideoCamOffIcon';
import MicrophoneIcon from '@/components/common/icons/MicrophoneIcon';
import VideoCamIcon from '@/components/common/icons/VideoCamIcon';
import SettingIcon from '@/components/common/icons/SettingIcon';
import MicOffIcon from '@/components/common/icons/MicOffIcon';
import { useConference, type TJoinUser } from '@/context/ConferenceContext';
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
    const conferenceId = useConferenceId();
    const joinUser = useJoinUser();

    const {
        setIsCallSetting } = useConference();
    const { stream } = useMediaStream();
    const { sendOffer, sendAnswer, sendMediaState, setJoinUser } = getActions()
    const { peerConnection } = usePeerConnection()


    const handleMuteToggle = () => {
        const next = !isMicOn;
        stream?.getAudioTracks().forEach(track => { track.enabled = next; });
        setIsMicOn(next);
        if (!conferenceId || !user) {
            console.log("handleMuteToggle : 회의 ID 또는 사용자 정보가 없습니다.");
            return
        };

        const host = {
            id: user.id,
            name: user.name,
            profile: user.profile,
            isMicOn: next,
            isVideoOn: isVideoOn
        };
        sendMediaState(conferenceId, host);

    };

    const handleVideoToggle = () => {
        const next = !isVideoOn;
        stream?.getVideoTracks().forEach(track => { track.enabled = next; });
        setIsVideoOn(next);
        if (!conferenceId || !user) {
            console.log("handleVideoToggle : 회의 ID 또는 사용자 정보가 없습니다.");
            return
        };

        const host = {
            id: user.id,
            name: user.name,
            profile: user.profile,
            isMicOn: isMicOn,
            isVideoOn: next
        };
        sendMediaState(conferenceId, host);
    };

    useEffect(() => {
        if (!socket) return;


        const handleJoinedConference = async ({ message, joinUser }: { message: string, joinUser: TUser }) => {
            const offer = await peerConnection.current?.createOffer();
            peerConnection.current?.setLocalDescription(offer!);
            console.log("sent the offer ");
            sendOffer(conferenceId!, offer!);

            console.log('handleJoinedConference : ', message, joinUser);

            const guest = {
                id: joinUser.id,
                name: joinUser.name,
                profile: joinUser.profile,
                isMicOn: true,
                isVideoOn: true
            };

            setJoinUser(guest);
            if (conferenceId) {
                sendMediaState(conferenceId, guest);
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

        const handleMediaState = (guest: TJoinUser) => {
            console.log("[signal] peer media state:", guest);
            // setIsPeerVideoOn(guest.isVideoOn);
            // setIsPeerMicOn(guest.isMicOn);
            setJoinUser(guest);
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
    }, [socket, setJoinUser]);

    return (
        <div className={styles.join_room_container}>

            <div className={styles.video_form}>
                {isVideoOn
                    ? <VideoForm isMicOn={isMicOn} />
                    : <Avatar src={user!.profile} alt='' />
                }
            </div>
            {joinUser && <div className={styles.video_form}>

                {joinUser?.isVideoOn
                    ? <VideoForm isMicOn={joinUser.isMicOn} /* 필요 시 props로 peerStream 전달 */ />
                    : <Avatar src={joinUser.profile} alt='' />}

            </div>}

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
        </div >
    );
}