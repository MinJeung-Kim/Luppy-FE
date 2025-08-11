// JWT 토큰 유틸리티 함수들

/**
 * JWT 토큰을 디코딩하여 페이로드 반환
 */
export const decodeJWT = (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (error) {
        console.error('JWT decode error:', error);
        return null;
    }
};

/**
 * JWT 토큰이 만료되었는지 확인
 */
export const isTokenExpired = (token: string): boolean => {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
        return true; // 페이로드가 없거나 만료 시간이 없으면 만료된 것으로 간주
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

/**
 * 토큰의 남은 시간(초) 반환
 */
export const getTokenRemainingTime = (token: string): number => {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
        return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = payload.exp - currentTime;
    return Math.max(0, remainingTime);
};
