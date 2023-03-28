import axios from 'axios';

const getProductsId = async () => axios.get(import.meta.env.VITE_API_URL, {
  auth: {
    username: import.meta.env.VITE_API_USERNAME,
    password: import.meta.env.VITE_API_PASSWORD,
  },
});

export default getProductsId;
