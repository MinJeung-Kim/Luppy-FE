import { AxiosError } from 'axios';
import { axiosPrivate } from "./axios.config";
import type { TUser } from '@/stores/slice/auth';


export type TChatRoom = {
    roomId: number;
    guests: TUser[];
    host: TUser;
    createdAt: string;
};

type TServerChatRoom = {
    id: number;
    createdAt: string;
    host: TUser;
    users: TUser[];
};

export type TChatContent = {
    id: number;
    createdAt: string;
    chatRoom: {
        hostId: number;
        id: number;
    };
    author: {
        id: number;
        name: string;
        profile: string;
    };
    message: string;
};

export const getChatList = async () => {
    try {
        const response = await axiosPrivate.get("/chat/list");
        console.log("getChatList chatList:", response.data);

        const chatList: TChatRoom[] = response.data[0].map((room: TServerChatRoom) => ({
            roomId: room.id,
            guests: room.users,
            host: room.host,
            createdAt: room.createdAt,
        }));

        return { chatList };

    } catch (error) {
        if (error instanceof AxiosError) {
            const serverMessage =
                error.response?.data?.message || error.response?.data?.error;
            console.log('getUsers error : ', serverMessage);

            return {
                error: serverMessage || "세션이 만료되었습니다. 로그인이 필요합니다.",
            };
        }

    }
}

export const getChatContent = async (roomId: number) => {
    try {
        const response = await axiosPrivate.get(`/chat/room/${roomId}`);
        console.log("getChatRoom chatRoom:", response.data);

        const chatContent = response.data.map((chat: TChatContent) => ({
            id: chat.id,
            message: chat.message,
            createdAt: chat.createdAt,
            author: {
                id: chat.author.id,
                name: chat.author.name,
                profile: chat.author.profile,
            },
        }));

        return chatContent;

    } catch (error) {
        if (error instanceof AxiosError) {
            const serverMessage =
                error.response?.data?.message || error.response?.data?.error;
            console.log('getChatRoom error : ', serverMessage);

            return {
                error: serverMessage || "세션이 만료되었습니다. 로그인이 필요합니다.",
            };
        }
    }
}