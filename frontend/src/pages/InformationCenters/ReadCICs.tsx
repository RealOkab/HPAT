import React, { useEffect } from "react";
import { useCustomFetch } from "@hooks/useCustomFetch";
import { useParams } from "react-router-dom";

interface InformationCenter {
  informationCenterName: string;
  gpsLocation: string;
  gpsLocationAccuracy: string;
  subDistrict: string;
  description: string;
  _id?: string;
}

interface DistrictData {
  country: string;
  districtName: string;
  informationCenters: InformationCenter[];
  state: string;
  _id?: string;
}

function ReadCICs() {
  const { APICall, fetchedData, error } = useCustomFetch();
  const { districtId } = useParams<{ districtId: string }>();

  useEffect(() => {
    APICall(`/hpat/registeredDistrict/${districtId}/registeredCiC`, "get");
  }, [districtId]);

  //console.log("fetchedData", fetchedData);

  return (
    <div className="min-h-screen w-full bg-white/70 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
        {fetchedData && (fetchedData as DistrictData).districtName} Information
        Centers
      </h1>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-xl text-center bg-red-100 text-red-700 p-4 rounded-lg mb-6 shadow">
          Error fetching data: {error}
        </div>
      )}

      {/* No CICs Found */}
      {fetchedData &&
        (fetchedData as DistrictData)?.informationCenters.length === 0 && (
          <div className="w-full max-w-xl text-center bg-gray-100 text-gray-600 p-6 rounded-lg mb-6 flex flex-col items-center shadow">
            <span>No Information Centers found for this district.</span>
            <button
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
              onClick={() => {
                window.location.href = `/registeredDistrict/${districtId}/registerCiC`;
              }}
            >
              Register New Information Center
            </button>
          </div>
        )}

      {/* Information Centers Grid */}
      <div className="w-full max-w-7xl flex flex-row flex-wrap justify-center gap-6">
        {fetchedData &&
          (fetchedData as DistrictData)?.informationCenters.map((cic, i) => (
            <section
              key={i}
              className="  w-[300px] shadow-gray-900  bg-white/65 p-6 rounded-xl border border-gray-200 shadow hover:shadow-2xl hover:scale-105 transition-transform duration-300 flex flex-col"
            >
              <h2 className="text-2xl font-semibold text-blue-900 mb-2">
                {cic.informationCenterName}
              </h2>
              <p className="text-gray-700 mb-4 line-clamp-3">
                {cic.description}
              </p>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-semibold text-blue-800">
                    Sub-District:
                  </span>{" "}
                  {cic.subDistrict}
                </p>
                <p>
                  <span className="font-semibold text-blue-800">
                    GPS Location:
                  </span>{" "}
                  {cic.gpsLocation}
                </p>
                <p>
                  <span className="font-semibold text-blue-800">Accuracy:</span>{" "}
                  {cic.gpsLocationAccuracy} meters
                </p>
              </div>
              <section className="flex  flex-row justify-center items-center">
                <button
                  className="mt-auto px-4 py-2 mr-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    window.location.href = `/registeredDistrict/${districtId}/registeredCiC/${cic._id}`;
                  }}
                >
                  Details
                </button>
                <button
                  className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-700 transition-colors"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
              </section>
            </section>
          ))}
      </div>
    </div>
  );
}

export default ReadCICs;
