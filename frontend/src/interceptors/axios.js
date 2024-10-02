import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'localhost:8000', // Replace with your API base URL
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
  });

// Add a request interceptor
axiosInstance.interceptors.request.use(
    function (config) {
      // Do something before the request is sent
      const token = localStorage.getItem('authToken'); // Retrieve auth token from localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      // Handle the error
      return Promise.reject(error);
    }
  );
  
  // Add a response interceptor
  axiosInstance.interceptors.response.use(
    function (response) {
      // Do something with the response data
      console.log('Response:', response);
      return response;
    },
    function (error) {
      // Handle the response error
      if (error.response && error.response.status === 401) {
        // Handle unauthorized error
        console.error('Unauthorized, logging out...');
        // Perform any logout actions or redirect to login page
      }
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;