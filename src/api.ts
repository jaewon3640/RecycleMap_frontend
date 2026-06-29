import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({ baseURL });

// ───────────────── 요청 인터셉터: Access Token 자동 첨부 ─────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ───────────────── 토큰 만료 처리 공용 유틸 ─────────────────

// 로그인 정보 정리 후 로그인 화면으로 이동
function forceLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  localStorage.removeItem('nickname');
  window.location.href = '/';
}

// refresh 진행 상태 + 대기 큐
//   동시에 여러 요청이 401 을 받아도 refresh 는 "딱 한 번"만 호출하고,
//   나머지 요청들은 큐에서 대기하다가 새 토큰으로 재개한다(중복 refresh 방지).
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  pendingQueue.forEach((resume) => resume(token));
  pendingQueue = [];
}

// ───────────────── 응답 인터셉터: 401 → refresh → 원요청 재시도 ─────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;
    const url: string = originalRequest?.url || '';

    // 로그인/refresh 엔드포인트 자체의 401 은 재발급 대상이 아님(무한루프 방지)
    const isAuthEndpoint =
      url.includes('/api/auth/login') || url.includes('/api/auth/refresh');

    // 401 이 아니거나, 이미 재시도했거나, 인증 엔드포인트면 그대로 실패 처리
    if (status !== 401 || originalRequest?._retry || isAuthEndpoint) {
      // refresh 엔드포인트가 401 이면 세션이 완전히 끝난 것 → 로그아웃
      if (status === 401 && url.includes('/api/auth/refresh')) {
        forceLogout();
      }
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      forceLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // 이미 누군가 refresh 중이면, 끝날 때까지 큐에서 대기 후 새 토큰으로 재개
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((newToken) => {
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    // 이 요청이 refresh 의 "대표"가 되어 단 한 번만 호출
    isRefreshing = true;
    try {
      // 인터셉터 재귀를 피하려고 기본 axios 로 직접 호출
      const { data } = await axios.post(
        `${baseURL}/api/auth/refresh`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const newAccessToken: string = data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      flushQueue(newAccessToken); // 대기 중이던 요청들 재개
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest); // 원래 요청 재시도
    } catch (refreshError) {
      flushQueue(null); // 대기 요청들도 실패 처리
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
