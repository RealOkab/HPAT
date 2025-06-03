import React, { useEffect, useState } from "react";
import FetchGPS from "@hooks/fetchGPS";

export default function RegisterInformationCenter() {
  const { location, error } = FetchGPS();
  const [errorState, setErrorState] = useState<string>();

  useEffect(() => {
    if (location) {
      console.log("High-accuracy location:", location);
    }

    if (error) {
      setErrorState(error);
    }
  }, [location, error]); //  React will re-run when location or error changes

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Register Information Center
      </h2>
      {errorState && <p className="text-red-500">{errorState}</p>}
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
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
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
        onClick={() => {
          console.log("clicke");
        }}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
      >
        Submit
      </button>
    </div>
  );
}
