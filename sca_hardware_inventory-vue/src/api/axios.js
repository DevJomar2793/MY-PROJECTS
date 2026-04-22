import axios from "axios";

const api = axios.create({
  baseURL: "https://atbackend-sca-hardware-inventory-vue.onrender.com",

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
