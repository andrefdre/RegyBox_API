import axios from "axios";
import Cookies from 'js-cookie';

const baseURL = 'http://127.0.0.1:8000/api/'

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
      'Authorization': `JWT ${Cookies.get('access_token')}`,
      'Content-Type': 'application/json',
      'accept': 'application/json'
  }
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
      const originalRequest = error.config;
      // Prevent infinite loops early
      if (error.response.status === 401 && originalRequest.url === baseURL+'token/refresh/') {
          window.location.href = '/login/';
          return Promise.reject(error);
      }

      if (error.response.data.code === "token_not_valid" &&
          error.response.status === 401 && 
          error.response.statusText === "Unauthorized") 
          {
              const refreshToken = Cookies.get('refresh_token');

              if (refreshToken){
                  const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                  // exp date in token is expressed in seconds, while now() returns milliseconds:
                  const now = Math.ceil(Date.now() / 1000);
                  if (tokenParts.exp > now) {
                      return axiosInstance
                      .post('/token/refresh/', {refresh: refreshToken})
                      .then((response) => {
                          Cookies.set('access_token', response.data.access);
                          Cookies.set('refresh_token', response.data.refresh);
          
                          axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                          originalRequest.headers['Authorization'] = "JWT " + response.data.access;
          
                          return axiosInstance(originalRequest);
                      })
                      .catch(err => {
                          console.log(err)
                      });
                  }else{
                      console.log("Refresh token is expired", tokenParts.exp, now);
                      window.location.href = '/login/';
                  }
              }else{
                  console.log("Refresh token not available.")
                  window.location.href = '/login/';
              }
      }
    
   
    // specific error handling done elsewhere
    return Promise.reject(error);
}
);

export default axiosInstance