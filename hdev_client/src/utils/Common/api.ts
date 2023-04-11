import axios from "axios";

const api = axios.create({
  baseURL: "http://api.hdev.com:5000",
  withCredentials: true,
});

export default api;
