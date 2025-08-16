import { useEffect, useState, useRef } from 'react';

interface UseMediaStreamReturn {
    stream: MediaStream | null;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    error: string | null;
    isLoading: boolean;
    videos: MediaDeviceInfo[];
    microphones: MediaDeviceInfo[];

    getMediaStream: (deviceId?: string) => Promise<void>;
}

export const useMediaStream = (
): UseMediaStreamReturn => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [videos, setVideos] = useState<MediaDeviceInfo[]>([]);
    const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const getMicrophone = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const microphone = devices.filter(device => device.kind === 'audioinput');
            setMicrophones(microphone);
            return microphone;
        } catch (error) {
            console.error('Error getting microphone:', error);
            setMicrophones([]);
            return [];
        }
    };

    const getVideos = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setVideos(videoDevices);
            return videoDevices;
        } catch (error) {
            console.error('Error getting videos:', error);
            setVideos([]);
            return [];
        }
    };

    const getMediaStream = async (deviceId?: string) => {
        setIsLoading(true);
        setError(null);

        const initialConstraints = { facingMode: "user" };
        const cameraConstraints = {
            deviceId: { exact: deviceId }
        };

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: deviceId ? cameraConstraints : initialConstraints
            });
            setStream(mediaStream);
            console.log("미디어 스트림을 가져왔습니다:", mediaStream);

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


    // 컴포넌트 마운트 시 초기화
    useEffect(() => {
        getMicrophone();
        getVideos();
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

    return {
        stream,
        videoRef,
        error,
        isLoading,
        videos,
        microphones,
        getMediaStream
    };
};
