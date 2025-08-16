import type { StateCreator } from 'zustand';
import { io, Socket } from "socket.io-client";
import { baseURL } from '@/api/axios.config';
import type { BoundState } from '../bound-store';
import type { TJoinUser } from '@/context/ConferenceContext';

export type TServerChatData = {
    author: { id: number, email: string, name: string, profile: string },
    message: string,
    chatRoom: {
        id: number,
        hostId: number,
        createdAt: string,
    },
    createdAt: string,
}

export interface SocketSliceState {
    socket: Socket | null;
    socketOpen: () => void;
    socketClose: () => void;
    createChatRoom: (host: number, guest: number[]) => void;
    sendMessage: (roomId: number, message: string) => void;
    createConferenceRoom: (roomId: string, host: number, guests: number[]) => void;
    joinConferenceRoom: (roomId: string, userId: number) => void;
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
                    token: `Bearer ${token}`
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

            newSocket.on('sendMessage', (chatData: TServerChatData) => {
                console.log('새 메시지 받음:', chatData);
                const messageReceivedEvent = new CustomEvent('messageReceived', {
                    detail: chatData
                });
                window.dispatchEvent(messageReceivedEvent);
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
    createChatRoom: (host: number, guests: number[]) => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.emit("createChatRoom", { host, guests });
        }
    },
    sendMessage: (roomId: number, message: string) => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.emit("sendMessage", { roomId, message });
        }
    },
    createConferenceRoom: (roomId: string, host: number, guests: number[]) => {
        const currentSocket = get().socket;
        if (currentSocket) {

            currentSocket.emit("createConferenceRoom", { roomId, host, guests });
        }
    },
    joinConferenceRoom: (roomId: string, host: number) => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.emit("joinConferenceRoom", { roomId, host });
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