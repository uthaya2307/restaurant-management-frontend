import axios from "axios";

const DEV_BASE_URL = "/api";
const PROD_BASE_URL = "https://restaurant-backend-cxaea6behcf7dvhu.southeastasia-01.azurewebsites.net/api";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    (process.env.NODE_ENV === "development" ? DEV_BASE_URL : PROD_BASE_URL)
});

// CRUD APIs
export const getItems = () => API.get("/menu");
export const addItem = (item) => API.post("/menu", item);
export const updateItem = (id, item) => API.put(`/menu/${id}`, item);
export const deleteItem = (id) => API.delete(`/menu/${id}`);
API.interceptors.request.use((req) => {
  console.log("REQUEST URL:", req.baseURL + req.url);
  return req;
});