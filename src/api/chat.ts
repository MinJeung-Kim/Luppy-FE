import { axiosPrivate } from "./axios.config";
import type { TUser } from '@/stores/slice/auth';
import { handleAxiosError } from '@/utils/error';

export type TChatGroup = {
    id: number | null;
    name: string;
};

export type TChatRoom = {
    roomId: number;
    guests: TUser[];
    host: TUser;
    createdAt: string;
    chatGroup: TChatGroup
};

type TServerChatRoom = {
    id: number;
    createdAt: string;
    host: TUser;
    users: TUser[];
    chatGroup: TChatGroup
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

export type TGroup = {
    id: number;
    name: string;
    description: string;
    emoji: string;
};


export const getChatList = async (id: string) => {
    try {
        const response = await axiosPrivate.get(`/chat/list?groupId=${id}`);
        console.log('1-getChatList: ', response.data[0]);
        response.data[0].forEach((room: TServerChatRoom, idx: number) => {
            console.log(`room[${idx}]:`, room);
        });
        try {
            const chatList: TChatRoom[] = response.data[0].map((room: TServerChatRoom) => {

                return {
                    roomId: room.id,
                    guests: room.users,
                    host: room.host,
                    createdAt: room.createdAt,
                    chatGroup: room.chatGroup
                        ? { id: room.chatGroup.id, name: room.chatGroup.name }
                        : { id: 0, name: '' },
                };
            });
            return { chatList };
        } catch (e) {
            console.error('map error:', e);
        }
    } catch (error) {
        handleAxiosError(error);
    }
}

export const getChatContent = async (roomId: number) => {
    try {
        const response = await axiosPrivate.get(`/chat/room/${roomId}`);

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
        return handleAxiosError(error);
    }
}

export const createGroup = async (name: string, description: string, emoji: string) => {
    try {
        const response = await axiosPrivate.post("/chat/group", {
            name,
            description,
            emoji,
        });
        return response.data;

    } catch (error) {
        return handleAxiosError(error);
    }
}

export const getGroupList = async () => {
    try {
        const response = await axiosPrivate.get(`/chat/group`);

        // 서버가 배열을 직접 주는지, { groupList: [...] } 형태로 주는지 모두 대응
        const groupList = Array.isArray(response.data)
            ? response.data
            : (response.data?.groupList || []);

        return { groupList };
    } catch (error) {
        handleAxiosError(error);
    }
}

export const moveChatToGroup = async (id: number, groupId: number) => {
    try {
        const response = await axiosPrivate.patch(`/chat/group/${id}`, {
            groupId,
        });
        return response.data;

    } catch (error) {

        handleAxiosError(error);
    }
}