import axios from "axios";

const api = axios.create({
  baseURL: "http://dongeu47.iptime.org:5000",
});

export default api;
