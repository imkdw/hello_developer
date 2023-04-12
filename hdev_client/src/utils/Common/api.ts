import axios from "axios";

const api = axios.create({
  baseURL: "https://api.hdev.site:5000",
  withCredentials: true,
});

export default api;
