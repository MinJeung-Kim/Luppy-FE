import { axiosPrivate } from "./axios.config";
import type { TUser } from '@/stores/slice/auth';
import { handleAxiosError } from '@/utils/error';

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
        handleAxiosError(error);
    }
}
