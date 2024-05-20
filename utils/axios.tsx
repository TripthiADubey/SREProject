import axios from "axios";
import { BASE_URL } from "./Urls";

const AXIOS_CLIENT = axios.create({
  baseURL: BASE_URL,
});

export default AXIOS_CLIENT;
