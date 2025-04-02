// import axios from "axios";
// import Swal from "sweetalert2";


// const apiClient = axios.create({
//   baseURL: "http://172.17.2.247:8080/intranetapp/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


// apiClient.interceptors.request.use(
//   (config) => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = user?.access;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


// // apiClient.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response && error.response.status === 403) {
// //         Swal.fire({
// //             title: 'Session Expire!',
// //             text: 'Please login again',
// //             icon: 'info',
// //             confirmButtonText: 'OK'
// //           });
// //       localStorage.removeItem("user"); 
// //       window.location.href = "/login";
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// export default apiClient;
import axios from "axios";
import Swal from "sweetalert2";

const apiClient = axios.create({
  baseURL: "http://172.17.2.247:8080/intranetapp/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Add Token to Headers
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle 403 and Timeout
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        Swal.fire({
          title: "Session Expired!",
          text: "Your session has expired. Please log in again.",
          icon: "info",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.removeItem("user");
          window.location.href = "/login";
        });
      }
    } else if (error.code === "ECONNABORTED") {
      // Handle Timeout Errors
      Swal.fire({
        title: "Request Timeout",
        text: "The server took too long to respond. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
