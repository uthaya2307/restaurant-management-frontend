import axios from "axios";

const API = axios.create({
  baseURL: "https://restaurant-backend-xxxx.azurewebsites.net/api"
});

// CRUD APIs
export const getItems = () => API.get("/menu");
export const addItem = (item) => API.post("/menu", item);
export const updateItem = (id, item) => API.put(`/menu/${id}`, item);
export const deleteItem = (id) => API.delete(`/menu/${id}`);