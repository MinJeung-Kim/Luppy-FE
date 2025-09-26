import type { StateCreator } from 'zustand';
import { io, Socket } from "socket.io-client";
import { baseURL } from '@/api/axios.config';
import type { BoundState } from '../bound-store';
import type { TJoinUser } from '@/context/ConferenceContext';

export type TServerChatData = {
    sender: { id: number, email: string, name: string, profile: string },
    msg: string,
    chatRoom: number,
    createdAt: string,
}

export interface SocketSliceState {
    socket: Socket | null;
    socketOpen: () => void;
    socketClose: () => void;
    sendMessage: (chatRoomId: number, msg: string) => void;
    joinChatRoom: (roomId: number) => void;
    createConferenceRoom: (roomId: string, guests: number[]) => void;
    joinConferenceRoom: (roomId: string) => void;
    sendOffer: (roomId: string, offer: RTCSessionDescriptionInit) => void;
    sendAnswer: (roomId: string, answer: RTCSessionDescriptionInit) => void;
    sendIcecandidate: (roomId: string, candidate: RTCIceCandidateInit) => void;
    sendMediaState: (roomId: string, joinUser: TJoinUser) => void;
}

export const socketSlice: StateCreator<
    BoundState,
    [],
    [],
    SocketSliceState
> = (set, get) => ({
    socket: null,
    socketOpen: () => {
        const token = get().accessToken;
        if (token) {

            const newSocket = io(baseURL, {
                withCredentials: true,
                auth: {
                    token: `Bearer ${token}`,
                    roomId: get().roomId
                },
                transports: ['websocket', 'polling'], // transport 옵션 명시
                upgrade: true,
                rememberUpgrade: true,
                autoConnect: true,
                timeout: 5000 // 연결 타임아웃 설정
            });

            newSocket.on('connect', () => {
                console.log("Socket connected:", newSocket.id);
            });

            newSocket.on('connect_error', (error) => {
                console.error("Socket connection error:", error);
                console.error("Error details:", {
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });

                if (error.message.includes('401') || error.message.includes('unauthorized')) {
                    console.log("Socket 인증 실패 - 토큰 갱신 후 재시도 필요");
                }
            });

            newSocket.on('disconnect', (reason) => {
                console.log("Socket disconnected:", reason);
            });

            set(() => ({ socket: newSocket }));
        }
    },
    socketClose: () => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.disconnect();
            set({ socket: null });
        }
    },

    sendMessage: (chatRoomId: number, msg: string) => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.emit("sendMessage", { roomId: chatRoomId, msg });
        }
    },
    joinChatRoom: (roomId: number) => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.emit("joinChatRoom", roomId);
        }
    },
    createConferenceRoom: (roomId: string, guests: number[]) => {
        const currentSocket = get().socket;
        if (currentSocket) {

            currentSocket.emit("createConferenceRoom", { roomId, guests });
        }
    },
    joinConferenceRoom: (roomId: string) => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.emit("joinConferenceRoom", { roomId });
        }
    },
    sendOffer: (roomId: string, offer: RTCSessionDescriptionInit) => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.emit("sendOffer", { roomId, offer });
        }
    },
    sendAnswer: (roomId: string, answer: RTCSessionDescriptionInit) => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.emit("sendAnswer", { roomId, answer });
        }
    },
    sendIcecandidate: (roomId: string, candidate: RTCIceCandidateInit) => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.emit("sendIcecandidate", { roomId, candidate });
        }
    },
    sendMediaState: (roomId: string, user: TJoinUser) => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.emit("sendMediaState", { roomId, user });
        }
    }
})