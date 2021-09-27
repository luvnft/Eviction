import axios from "axios";

export default {
  getData: async (url) => {
    const res = await axios.get(url);
    return res.data;
  },
};
