import { useState } from "react";
import axios from "axios";
import { AxiosResponse } from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface District {
  districtName: string;
  state: string;
  country: string;
  _id?: string;
  informationCenters?: InformationCenter[];
}

interface InformationCenter {
  informationCenterName: string;
  gpsLocation: string;
  gpsLocationAccuracy: string;
  subDistrict: string;
  description: string;
  _id?: string;
}

interface RegisterCiCResponse {
  newCiC: InformationCenter;
  message: string;
  district: District;
}
interface axiosMethods {
  get: (
    url: string
  ) => Promise<AxiosResponse<District[] | InformationCenter[]>>;
  post?: (url: string, data: unknown) => Promise<AxiosResponse<unknown>>;
}

const useAxios: axiosMethods = {
  get: (url) => axios.get(url),
  post: (url, data) => axios.post(url, data),
};

const useCustomFetch = () => {
  const [fetchedData, setData] = useState<
    District[] | District | InformationCenter[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [postData, setPostData] = useState<unknown>(null);
  const navigate = useNavigate();
  const { districtId } = useParams<{ districtId: string }>();

  // Fetching all districts to display in the form

  // Manual API call function
  const APICall = async (
    url: string,
    method: "get" | "post",
    postData?: unknown
  ) => {
    setLoading(true);
    setError(null);

    if (method === "get") {
      await useAxios
        .get(url)
        .then((res) => {
          console.log("Response data:", res.data);
          setData(res.data);
        })
        .catch((err) => {
          console.error("Error in GET request:", err);
          setError(err.message || "An error occurred while fetching data");
        });
    } else if (method === "post" && useAxios.post) {
      await useAxios
        .post(url, postData)
        .then((res) => {
          navigate(
            `registeredDistrict/${districtId}/registeredCiC/${
              (res.data as RegisterCiCResponse).newCiC?._id
            }/view`
          );
          setPostData(res.data);
        })
        .catch((err) => {
          console.error("Error in POST request:", err);
          setError(err.message || "An error occurred while posting data");
        });
    }
  };

  return { fetchedData, error, loading, APICall, postData };
};

export { useCustomFetch };
