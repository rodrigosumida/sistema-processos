import axios from "axios";

const api = axios.create({
  // __prod__
  // baseURL: "http://localhost:3002/api",
  baseURL: "https://sistema-processos-api-production.up.railway.app/api",
});
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";
export default api;
