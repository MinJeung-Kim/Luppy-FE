import type { StateCreator } from 'zustand';
import { io, Socket } from "socket.io-client";
import { baseURL } from '@/api/axios.config';
import type { BoundState } from '../bound-store';

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
    createChatRoom: (host: string, guest: string[]) => void;
    sendMessage: (roomId: number, message: string) => void;
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
            console.log("Connecting to socket with token:", token);

            const newSocket = io(`ws:${baseURL}`, {
                withCredentials: true,
                auth: {
                    token: `Bearer ${token}`
                }
            });

            // 소켓 연결 이벤트 리스너 추가
            newSocket.on('connect', () => {
                console.log("Socket connected:", newSocket.id);
            });

            newSocket.on('connect_error', (error) => {
                console.error("Socket connection error:", error);
            });

            newSocket.on('sendMessage', (chatData: TServerChatData) => {
                console.log('새 메시지 받음:', chatData);
                // 받은 메시지를 처리하는 로직
                // 메신저 컨텍스트나 별도의 상태 관리를 통해 UI 업데이트
                const messageReceivedEvent = new CustomEvent('messageReceived', {
                    detail: chatData
                });
                window.dispatchEvent(messageReceivedEvent);
            });

            newSocket.on('disconnect', (reason) => {
                console.log("Socket disconnected:", reason);
            });

            set(() => ({ socket: newSocket })); // 소켓 연결 설정
        }
    },
    socketClose: () => {
        const currentSocket = get().socket;
        if (currentSocket) {
            currentSocket.disconnect();
            set({ socket: null });
        }
    },
    createChatRoom: (host: string, guests: string[]) => {
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
    }
})