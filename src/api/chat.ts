import { axiosPrivate } from "./axios.config";
import type { TUser } from '@/stores/slice/auth';
import { handleAxiosError } from '@/utils/error';

export type TChatGroup = {
    id: number | null;
    name: string;
};

export type TChatRoom = {
    id: number;
    createdAt: string;
    chatGroup: number | null;
    members: TUser[],
    lastChatMsg: string,
    lastChatCreatedAt: string | null,
};

export type TChatContent = {
    id: number;
    msg: string;
    createdAt: string;
    isRead: number;
    chatRoomId: number;
    sender: {
        id: number;
        name: string;
        profile: string;
        email: string;
    }
}

export type TGroup = {
    id: number;
    name: string;
    desc: string;
    emoji: string;
};

export const getChatGroups = async () => {
    try {
        const response = await axiosPrivate.get(`chat-group`);

        return response.data || [];

    } catch (error) {
        handleAxiosError(error);
    }
}

export const createChatRoom = async (memberIds: number[]) => {
    try {
        const response = await axiosPrivate.post("/chat/room", {
            memberIds,
        });
        return response.data;

    } catch (error) {
        handleAxiosError(error);
    }
}

export const getChatRooms = async (groupId: string, page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosPrivate.get(`/chat/room?id=${groupId}&page=${page}&limit=${limit}`);

        return {
            chatList: response.data.chatList,
            totalPages: response.data.totalPages
        };

    } catch (error) {
        handleAxiosError(error);
    }
}

export const getChat = async (roomId: number) => {
    try {
        const response = await axiosPrivate.get(`/chat?id=${roomId}`);
        return response.data;

    } catch (error) {
        return handleAxiosError(error);
    }
}

export const createGroup = async (name: string, desc: string, emoji: string) => {
    try {
        const response = await axiosPrivate.post("/chat-group", {
            name,
            desc,
            emoji,
        });
        return response.data;

    } catch (error) {
        return handleAxiosError(error);
    }
}


export const moveChatToGroup = async (roomId: number, groupId: number) => {
    try {
        const response = await axiosPrivate.patch(`/chat/room`, {
            id: roomId,
            groupId,
        });
        return response.data;

    } catch (error) {

        handleAxiosError(error);
    }
}