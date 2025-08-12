import { useEffect, useRef, useState } from 'react';
import { useUser } from '@/stores';
import Avatar from '@/components/common/Avatar/Avatar';
import MicOffIcon from '@/components/common/icons/MicOffIcon';
import MicrophoneIcon from '@/components/common/icons/MicrophoneIcon';
import VideoCamOffIcon from '@/components/common/icons/VideoCamOffIcon';
import VideoCamIcon from '@/components/common/icons/VideoCamIcon';
import CallIcon from '@/components/common/icons/CallIcon';
import styles from "./styles.module.css";

export default function VideoForm() {
    const user = useUser();

    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string>('');

    const [isMicOn, setIsMicOn] = useState<boolean>(false);
    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);

    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                setStream(mediaStream);

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error('미디어 스트림을 가져오는데 실패했습니다:', err);
                setError('카메라와 마이크에 접근할 수 없습니다. 권한을 확인해주세요.');
            }
        };

        getMediaStream();
    }, []);

    // 컴포넌트 언마운트 시 스트림 정리
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);
    return <div className={styles.video_form}>
        {error && <div className={styles.error_message}>{error}</div>}

        <div className={styles.video_container}>
            {isVideoOn ? (
                <video
                    ref={videoRef}
                    autoPlay
                    muted={isMicOn} // 자신의 비디오는 음소거
                    playsInline // 모바일에서 인라인 재생
                />
            ) : (
                <Avatar src={user!.profile} alt='' />
            )}
        </div>

        <div className={styles.button_container}>
            <button className={styles.microphone_button} onClick={() => setIsMicOn(!isMicOn)}>
                {isMicOn ? <MicOffIcon /> : <MicrophoneIcon />}
            </button>
            <button className={styles.call_button}><CallIcon /></button>
            <button className={styles.video_cam_button} onClick={() => setIsVideoOn(!isVideoOn)}>
                {isVideoOn ? <VideoCamIcon /> : <VideoCamOffIcon />}
            </button>
        </div>
    </div>;
}