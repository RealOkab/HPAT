import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterDistricts() {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  interface DistrictForm {
    districtName: string;
    state: string;
    country: string;
  }

  const handlePostRequest = async (formData: DistrictForm) => {
    const url = "/hpat/registerDistricts";

    const maxRetries = 3; // Maximum number of retry attempts
    let attempt = 0; // Current retry attempt
    while (attempt < maxRetries) {
      try {
        const response = await axios.post(url, formData);
        console.log("District registered successfully:", response.data);
        navigate(`/viewRegisteredDistrict/${response.data.district?._id}`);
        return; // Exit function if successful
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          setError("Failed to register district after multiple attempts.");
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000)); // Exponential backoff
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const formData: DistrictForm = {
      districtName: form.districtName.value?.trim(),
      state: form.state.value?.trim(),
      country: form.country.value?.trim(),
    };

    if (!formData.districtName || !formData.state || !formData.country) {
      setError("All fields are required.");
      return;
    }

    handlePostRequest(formData);
  };

  return (
    <div className="flex  items-center justify-center  bg-gray-100 shadow shadow-blue-500/50 w-2/5">
      <div className="relative h-full w-full bg-white rounded-lg shadow-md p-8 space-y-4 overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Register District
        </h2>
        <form className="space-y-6 h-[70%]" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="districtName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              District Name
            </label>
            <input
              required
              id="districtName"
              type="text"
              placeholder="Enter district name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              State
            </label>
            <input
              required
              id="state"
              type="text"
              placeholder="Enter state"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Country
            </label>
            <input
              required
              id="country"
              type="text"
              placeholder="Enter country"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
