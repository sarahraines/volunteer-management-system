import axios from 'axios';
import axiosRetry from 'axios-retry';

const baseURL = `${process.env.REACT_APP_BACKEND_HOST}/api/`;
const accessToken = localStorage.getItem("access_token");

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 20000,
    headers: {
        'Authorization': "JWT " + accessToken,
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && originalRequest.url === axiosInstance.baseURL+'token/refresh/') {
        window.location.href = '/login/';
        return Promise.reject(error);
    }
      
    if (error.response && error.response.status === 401 && error.response.data.code === "token_not_valid") {
        const refresh_token = localStorage.getItem('refresh_token');

        try {
            const response = await axiosInstance
                .post('/token/refresh/', { refresh: refresh_token });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
            originalRequest.headers['Authorization'] = "JWT " + response.data.access;
            return axiosInstance(originalRequest);
        } catch (_) {
            window.location.href = '/login/';
            return Promise.reject(error);
        }
      }
      return Promise.reject(error);
  }
);

const retryDelay = () => {
    const mSec = 1000;
    const randomMSec = 1000 * Math.random();
    return mSec + randomMSec;
};

axiosRetry(axiosInstance, {
    retries: 0,
    retryDelay,
    retryCondition: axiosRetry.isRetryableError,
});

export function setNewHeaders(response) {
    axiosInstance.defaults.headers["Authorization"] = "JWT " + response.data.access;
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    localStorage.setItem("user_id", response.data.user_id);
}

export default axiosInstance;