import axios from "axios";

export default {
  getData: async (url) => {
    const data = await axios.get(url);
    if (url === "./content") {
      return data.data[0];
    } else {
      return data.data;
    }
  },
};
