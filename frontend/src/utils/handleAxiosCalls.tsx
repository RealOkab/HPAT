import axios from "axios";

type getRequestProp = {
  url: string;
};

const getRequest = async ({ url }: getRequestProp) => {
  try {
    const response = await axios
      .get(url)
      .then((response) => {
        console.log("Data fetched successfully:", response.data);

        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return null;
      });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export { getRequest };
