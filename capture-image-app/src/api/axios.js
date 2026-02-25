import axios from "axios"

const api = axios.create({
    baseURL: "https://image-capture-app-90x2.onrender.com",
    timeout: 60000,
    withCredentials: false,
})

export default api