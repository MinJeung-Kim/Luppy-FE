import { useMediaStream } from '@/hooks/useMediaStream';
import styles from "./styles.module.css";

type Props = {
    isMicOn: boolean;
};

export default function VideoForm({ isMicOn }: Props) {
    const { videoRef, error, isLoading } = useMediaStream();


    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (isLoading) {
        return <div className={styles.loading}>카메라를 준비중입니다...</div>;
    }

    return (
        <video
            className={styles.video}
            ref={videoRef}
            autoPlay
            playsInline // 모바일에서 인라인 재생
            muted={isMicOn} // 자신의 비디오는 음소거
        />
    );
}