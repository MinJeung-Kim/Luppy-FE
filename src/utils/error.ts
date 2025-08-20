import { AxiosError } from 'axios';

export function handleAxiosError(error: unknown) {
    if (error instanceof AxiosError) {
        const serverMessage =
            error.response?.data?.message || error.response?.data?.error;

        return {
            error: serverMessage || "세션이 만료되었습니다. 로그인이 필요합니다.",
        };
    }
}