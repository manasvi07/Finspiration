import axios from "axios";
import { BACKEND_URL } from "./urls";
import { Auth } from "aws-amplify";

const API_CLIENT = axios.create({
  baseURL: BACKEND_URL
});

API_CLIENT.interceptors.request.use(async function (config) {
  try {
    const session = await Auth.currentSession();
    const accessToken = session.getAccessToken();
    const authToken = session.getIdToken();
    config.headers.Authorization = authToken.jwtToken;
    config.headers.accessToken = accessToken.jwtToken;
    return config;
  } catch(err) {
    return config;
  }
});


export default API_CLIENT;
