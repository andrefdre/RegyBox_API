import axios from "axios";
import Cookies from 'js-cookie';

const baseURL = 'http://5.249.84.57:8000/api/'

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
      'Authorization': `JWT ${Cookies.get('access_token')}`,
      'Content-Type': 'application/json',
      'accept': 'application/json'
  }
});

let isRefreshing = false;  // Flag to indicate if a refresh is in progress
let refreshSubscribers = [];  // Queue to hold requests while the refresh token is being fetched

function onRrefreshed(token) {
    refreshSubscribers.map(callback => callback(token));
}

function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
}

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && originalRequest.url === baseURL + 'token/refresh/') {
            window.location.href = '/login/';
            return Promise.reject(error);
        }

        if (error.response.data.code === "token_not_valid" &&
            error.response.status === 401 &&
            error.response.statusText === "Unauthorized") {

            const refreshToken = Cookies.get('refresh_token');

            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
                const now = Math.ceil(Date.now() / 1000);

                if (tokenParts.exp > now) {

                    if (!isRefreshing) {
                        isRefreshing = true;

                        return axiosInstance.post('/token/refresh/', { refresh_token: refreshToken })
                            .then(response => {
                                Cookies.set('access_token', response.data.access);
                                Cookies.set('refresh_token', response.data.refresh);

                                axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                                originalRequest.headers['Authorization'] = "JWT " + response.data.access;

                                isRefreshing = false;
                                onRrefreshed(response.data.access);
                                refreshSubscribers = [];  // Clear the queue
                                return axiosInstance(originalRequest);
                            })
                            .catch(err => {
                                console.error('Refresh token error:', err);
                                window.location.href = '/login/';
                                return Promise.reject(err);
                            });
                    }

                    return new Promise((resolve) => {
                        addRefreshSubscriber((token) => {
                            originalRequest.headers['Authorization'] = 'JWT ' + token;
                            resolve(axiosInstance(originalRequest));
                        });
                    });

                } else {
                    console.log("Refresh token is expired", tokenParts.exp, now);
                    window.location.href = '/login/';
                }

            } else {
                console.log("Refresh token not available.");
                window.location.href = '/login/';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance