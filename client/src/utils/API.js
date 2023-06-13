import axios from 'axios';

export default {
  getData: async (url, query) => {
    const res = !query 
      ? await axios.get(url)
      : await axios.get(url, query);
    return res.data;
  }
};