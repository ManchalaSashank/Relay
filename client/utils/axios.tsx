import axios from "axios";

// create an axios instance with a base URL and credentials
const instance = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export default instance;
