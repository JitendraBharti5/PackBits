import axios from "axios";

const instance =  axios.create({
    baseURL :`https://packbits.onrender.com`,
})
export default instance