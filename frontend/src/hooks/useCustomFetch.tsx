import { useEffect, useState } from "react";
import axios from "axios";

interface District {
  districtName: string;
  state: string;
  country: string;
}

const useCustomFetch = (url: string) => {
  const [data, setData] = useState<District[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      }
    };

    fetchData();
  }, [url]);

  console.log(data);

  return { data, error };
};

export { useCustomFetch };
