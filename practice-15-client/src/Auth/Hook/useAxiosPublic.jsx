import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // <--- Important for cookies
});

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;