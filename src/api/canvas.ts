import { AxiosError } from 'axios';
import { axiosPrivate } from './axios.config';

export const analyzeShape = async (fd: FormData) => {
    try {

        const response = await axiosPrivate.post("/canvas/analyze", fd, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.data.ok) throw new Error(response.data.error || "LLM Error");
        return response.data.data.images;

    } catch (error) {
        console.error('API 호출 에러:', error);
        if (error instanceof AxiosError) {
            const serverMessage =
                error.response?.data?.message || error.response?.data?.error;

            return {
                success: false,
                error: serverMessage || `HTTP ${error.response?.status}: ${error.message}`,
            };
        }

        return {
            success: false,
            error: "알 수 없는 오류가 발생했습니다.",
        };
    }
}
