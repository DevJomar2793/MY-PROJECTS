import axios from "axios"

const api = axios.create({
    baseURL: "https://my-backend-photobooth-v1.onrender.com",
    timeout: 60000, //60s
    withCredentials: false,
})

export default api