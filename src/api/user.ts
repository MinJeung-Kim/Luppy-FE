import { AxiosError } from 'axios';
import { axiosPrivate } from "./axios.config";
import type { TUser } from '@/stores/slice/auth';

export const getUsers = async () => {
    try {
        const response = await axiosPrivate.get("/user");
        const usersData = response.data[0];
        const total = response.data[1];

        const users = usersData.map((user: TUser) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profile: user.profile
        }));

        return { users, total };

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
