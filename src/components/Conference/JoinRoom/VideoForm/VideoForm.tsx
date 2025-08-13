import { useEffect, useRef, useState } from 'react';
import styles from "./styles.module.css";

type Props = {
    isMicOn: boolean;
};

export default function VideoForm({ isMicOn }: Props) {

    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

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
                // setError('카메라와 마이크에 접근할 수 없습니다. 권한을 확인해주세요.');
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

        <video
            className={styles.video}
            ref={videoRef}
            autoPlay
            playsInline // 모바일에서 인라인 재생
            muted={isMicOn} // 자신의 비디오는 음소거
        />
    </div>;
}