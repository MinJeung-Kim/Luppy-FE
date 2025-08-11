import { useQuery } from '@tanstack/react-query';
import type { TUser } from '@/stores/slice/auth';
import { getUsers } from '@/api/user';
import { useUser } from '@/stores';

/**
 * 현재 사용자를 제외한 사용자 목록을 반환하는 커스텀 훅
 */
export function useAvailableUsers() {
    const user = useUser();

    const { data, ...queryResult } = useQuery<TUser[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const result = await getUsers();
            if (result?.error) {
                throw new Error(result.error);
            }
            return result?.users || [];
        },
    });

    // 현재 사용자를 제외한 사용자 목록
    const availableUsers = data?.filter(userData => userData.id !== user?.id) || [];

    return {
        availableUsers,
        ...queryResult
    };
}
