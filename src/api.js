import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:3002",
    headers:{
        "Content-Type":"application/json",
    },

});
export default instance;