import { encode } from 'base-64';

const getProductsId = async () => {
  const headers = new Headers({
    Authorization: `Basic ${encode(
      `${import.meta.env.VITE_API_USERNAME}:${
        import.meta.env.VITE_API_PASSWORD
      }`,
    )}`,
    'Content-type': 'application/json',
  });

  return fetch(import.meta.env.VITE_API_URL, {
    headers,
    method: 'GET',
  });
};

export default getProductsId;
