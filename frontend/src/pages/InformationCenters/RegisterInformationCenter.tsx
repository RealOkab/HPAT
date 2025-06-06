import React, { useEffect, useState } from "react";
import FetchGPS from "@hooks/fetchGPS";
import { useParams } from "react-router-dom";
import { useCustomFetch } from "@hooks/useCustomFetch"; // Assuming you have a custom hook for handling POST requests

export default function RegisterInformationCenter() {
  const { districtId } = useParams<{ districtId: string }>();

  const { location, error, success } = FetchGPS();
  const [errorState, setErrorState] = useState<string | null>();
  const { APICall } = useCustomFetch();
  const url = `http://localhost:5000/hpat/registeredDistrict/${districtId}/registerCiC`;

  // Fetching all districts to display in the form

  useEffect(() => {
    //  console.log("Location:", location);
    if (error) {
      setErrorState(error);
    } else if (location && location.coords.accuracy < 10) {
      setErrorState(null);
    } else {
      setErrorState(
        "GPS accuracy is too high. Please move to an open area for better accuracy."
      );
    }
  }, [location, error]); //  React will re-run when location or error changes

  const handleFormsubmission = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const formData = {
      informationCenterName: form.informationCenterName.value?.trim(),
      gpsLocation: location
        ? `${location.coords.latitude}, ${location.coords.longitude}`
        : "",
      gpsLocationAccuracy: location ? `${location.coords.accuracy}` : "",
      subDistrict: form.subDistrict.value?.trim(),
      description: form.description.value?.trim(),
    };
    APICall(url, "post", formData);

    form.reset();
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Register Information Center
      </h2>
      {errorState && <p className="text-red-500">{errorState}</p>}
      {success && <p className="text-green-500">{String(success)}</p>}
      <form
        className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-sm"
        onSubmit={handleFormsubmission}
      >
        <p className="text-sm text-gray-500">
          Please ensure your GPS accuracy is below 10 meters before submitting.
        </p>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="informationCenterName"
              className="block text-sm font-medium text-gray-700"
            >
              Information Center Name
            </label>
            <input
              type="text"
              id="informationCenterName"
              name="informationCenterName"
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="gpsLocation"
              className="block text-sm font-medium text-gray-700"
            >
              GPS Location
            </label>
            <input
              type="text"
              id="gpsLocation"
              name="gpsLocation"
              value={
                location
                  ? `${location.coords.latitude}, ${location.coords.longitude}`
                  : ""
              }
              readOnly
              className={`mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 ${
                location?.coords && location.coords.accuracy < 10
                  ? "text-gray-950"
                  : "text-red-500"
              }`}
            />
          </div>
          <div>
            <label
              htmlFor="gpsLocation"
              className="block text-sm font-medium text-gray-700"
            >
              GPS Accuracy
            </label>
            <input
              type="text"
              id="gpsLocationAccuracy"
              name="gpsLocationAccuracy"
              value={location ? `${location.coords.accuracy}` : ""}
              readOnly
              className={`mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 ${
                location?.coords && location.coords.accuracy < 10
                  ? "text-gray-950"
                  : "text-red-500"
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="subDistrict"
              className="block text-sm font-medium text-gray-700"
            >
              Sub District
            </label>
            <input
              type="text"
              id="subDistrict"
              name="subDistrict"
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>
        </div>

        <button
          disabled={!location}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
