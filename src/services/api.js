import axios from "axios";

const API = axios.create({
  baseURL: "restaurant-backend-cxaea6behcf7dvhu.southeastasia-01.azurewebsites.net/api/menu"
});

// CRUD APIs
export const getItems = () => API.get("/menu");
export const addItem = (item) => API.post("/menu", item);
export const updateItem = (id, item) => API.put(`/menu/${id}`, item);
export const deleteItem = (id) => API.delete(`/menu/${id}`);
