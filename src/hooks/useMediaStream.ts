import { useEffect, useState, useRef, useMemo } from 'react';

interface UseMediaStreamReturn {
    stream: MediaStream | null;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    error: string | null;
    isLoading: boolean;
}

export const useMediaStream = (
    video: boolean | MediaTrackConstraints = true,
    audio: boolean | MediaTrackConstraints = true
): UseMediaStreamReturn => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const options = useMemo(() => ({ video, audio }), [video, audio]);

    useEffect(() => {
        const getMediaStream = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia(options);
                setStream(mediaStream);

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error('미디어 스트림을 가져오는데 실패했습니다:', err);
                setError('카메라와 마이크에 접근할 수 없습니다. 권한을 확인해주세요.');
            } finally {
                setIsLoading(false);
            }
        };

        getMediaStream();
    }, [options]);

    // 컴포넌트 언마운트 시 스트림 정리
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    return {
        stream,
        videoRef,
        error,
        isLoading
    };
};
