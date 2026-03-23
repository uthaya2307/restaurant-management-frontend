import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:5000/api" // for local testing (fallback to common backend port)
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