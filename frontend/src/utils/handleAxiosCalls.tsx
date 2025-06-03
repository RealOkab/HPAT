import axios from "axios";

type requestUrl = {
  url: string;
};

const getRequest = async ({ url }: requestUrl) => {
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

const postAndPutRequest = async ({ url }: requestUrl) => {
  try {
    const response = await axios
      .post(url)
      .then((response) => {
        console.log("Data sent successfully:", response.data);

        return response.data;
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        return null;
      });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export { getRequest, postAndPutRequest };
