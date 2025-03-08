import axios from "axios";
import Swal from "sweetalert2";


const apiClient = axios.create({
  baseURL: "https://api.cuintranet.in/intranetapp/",
  headers: {
    "Content-Type": "application/json",
  },
});


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


// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 403) {
//         Swal.fire({
//             title: 'Session Expire!',
//             text: 'Please login again',
//             icon: 'info',
//             confirmButtonText: 'OK'
//           });
//       localStorage.removeItem("user"); 
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;
