import { useBoundStore } from '@/stores/bound-store';
import { refreshAccessToken } from '@/api/axios.config';
import { getTokenRemainingTime } from '@/utils/jwt';

/**
 * 토큰 자동 갱신을 위한 타이머 관리
 */
class TokenRefreshManager {
    private refreshTimer: NodeJS.Timeout | null = null;

    /**
     * 토큰 자동 갱신 타이머 시작
     */
    startAutoRefresh() {
        this.stopAutoRefresh(); // 기존 타이머 정리

        const checkAndRefresh = () => {
            const token = useBoundStore.getState().accessToken;
            if (!token) {
                console.log("🔍 토큰이 없어 자동 갱신 중단");
                return;
            }

            const remainingTime = getTokenRemainingTime(token);
            console.log(`⏰ 토큰 남은 시간: ${remainingTime}초`);

            // 토큰이 5분 이내에 만료되면 갱신 시도
            if (remainingTime > 0 && remainingTime < 300) { // 5분 = 300초
                console.log("🔄 토큰이 곧 만료됩니다. 자동 갱신 시도...");
                this.performAutoRefresh();
            } else if (remainingTime <= 0) {
                console.log("❌ 토큰이 이미 만료됨");
                this.stopAutoRefresh();
            }
        };

        // 1분마다 토큰 상태 확인
        this.refreshTimer = setInterval(checkAndRefresh, 60000);

        // 즉시 한 번 확인
        checkAndRefresh();
    }

    /**
     * 자동 토큰 갱신 수행
     */
    private async performAutoRefresh() {
        try {
            const newToken = await refreshAccessToken();
            if (newToken) {
                console.log("✅ 자동 토큰 갱신 성공");
                useBoundStore.getState().setAccessToken(newToken);
            } else {
                console.log("❌ 자동 토큰 갱신 실패");
                this.stopAutoRefresh();
            }
        } catch (error) {
            console.error("❌ 자동 토큰 갱신 중 오류:", error);
            this.stopAutoRefresh();
        }
    }

    /**
     * 토큰 자동 갱신 타이머 중지
     */
    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
            console.log("⏹️ 토큰 자동 갱신 타이머 중지");
        }
    }
}

export const tokenRefreshManager = new TokenRefreshManager();
