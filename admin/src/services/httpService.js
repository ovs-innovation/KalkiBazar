import axios from "axios";
import Cookies from "js-cookie";

// console.log("base url", import.meta.env.VITE_APP_API_BASE_URL);

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}`,
  timeout: 50000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  console.log("ALL COOKIES AVAILABLE:", document.cookie); // See everything stored

  let adminInfo = Cookies.get("adminInfo");
  let customerInfo = Cookies.get("customerInfo");

  console.log("Raw adminInfo Cookie:", adminInfo);
  console.log("Raw customerInfo Cookie:", customerInfo);

  let token = null;
  if (adminInfo) {
    const parsed = JSON.parse(adminInfo);
    token = parsed?.token || parsed?.tokenValue; // check your object keys
  } else if (customerInfo) {
    const parsed = JSON.parse(customerInfo);
    token = parsed?.token || parsed?.tokenValue;
  }

  console.log("TOKEN BEING SENT:", token);

  return {
    ...config,
    headers: {
      ...config.headers,
      authorization: token ? `Bearer ${token}` : null,
      company: Cookies.get("company") || null,
    },
  };
});

const responseBody = (response) => response.data;

const requests = {
  get: (url, body, headers) =>
    instance.get(url, body, headers).then(responseBody),

  post: (url, body) => instance.post(url, body).then(responseBody),

  put: (url, body, headers) =>
    instance.put(url, body, headers).then(responseBody),

  patch: (url, body) => instance.patch(url, body).then(responseBody),

  delete: (url, body) => instance.delete(url, body).then(responseBody),
};

export default requests;
