import { useEffect, useRef, useState } from 'react';
import { useMediaStream } from './useMediaStream';
import { getActions, useConferenceId } from '@/stores';

export const usePeerConnection = () => {
    const { stream } = useMediaStream();
    const { sendIcecandidate } = getActions();
    const conferenceId = useConferenceId();
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const [peerStream, setPeerStream] = useState<MediaStream | null>(null);

    useEffect(() => {

        // ICE 서버 설정 추가
        const iceServers = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };

        peerConnection.current = new RTCPeerConnection(iceServers);

        // ICE candidate 이벤트 리스너 추가
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate && conferenceId) {
                // console.log("sent the candidate ", event);
                sendIcecandidate(conferenceId, event.candidate);
            } else if (!conferenceId) {
                console.log('❌ conferenceId가 없음');
            }
            // ICE gathering 완료 시에는 event.candidate가 null이 됩니다 (정상 동작)
        };

        peerConnection.current.ontrack = (event) => {
            console.log("Peer's Stream : ", event.streams);
            setPeerStream(event.streams[0]);
        };

        if (stream) {
            stream.getTracks().forEach(track => {
                peerConnection.current?.addTrack(track, stream);
            });
            console.log("myStream : ", stream);
        }

        return () => {
            peerConnection.current?.close();
        };
    }, [stream, conferenceId, peerConnection, sendIcecandidate]);

    return { peerConnection, peerStream };
};