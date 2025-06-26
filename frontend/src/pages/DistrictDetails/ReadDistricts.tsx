import React, { useEffect } from "react";
import { useCustomFetch } from "@hooks/useCustomFetch";
import Buttons from "@components/Buttons";
import { useNavigate } from "react-router-dom";

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

export default function ReadDistricts() {
  const navigate = useNavigate();
  const { fetchedData, APICall } = useCustomFetch();

  useEffect(() => {
    if (!fetchedData)
      APICall("http://localhost:5000/hpat/registerDistricts/viewAll", "get");
  }, [fetchedData, APICall]);

  if (!fetchedData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-4 rounded-md shadow-md">
          <strong className="font-bold text-lg">Loading...</strong>
          <p className="text-sm">
            Please wait while we fetch the registered districts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-wrap justify-center items-start gap-6 p-6 bg-gray-100/50 min-h-screen">
      <p className="text-2xl font-semibold text-gray-800">
        List of Registered Districts
      </p>
      <section className="flex flex-wrap justify-center items-start gap-6 flex-row">
        {Array.isArray(fetchedData) &&
          fetchedData?.map((district, index: number) => (
            <div
              key={index}
              className="bg-white/90 shadow-lg rounded-lg p-5 w-72 hover:scale-105 transition-transform duration-200 shadow-black"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[1em] font-semibold text-gray-800">
                  {(district as District).districtName}
                </h2>
                <span className="text-gray-500 text-sm">#{index + 1}</span>
              </div>
              <p className="text-gray-600 mt-2">
                🏛 <span className="font-medium">State:</span>{" "}
                {(district as District).state}
              </p>
              <p className="text-gray-600">
                🌍 <span className="font-medium">Country:</span>{" "}
                {(district as District).country}
              </p>
              <p className="text-gray-600">
                🌍 <span className="font-medium">Number of CICs:</span>{" "}
                {(district as District).informationCenters?.length}
              </p>

              <Buttons
                onClick={() =>
                  navigate(`/viewRegisteredDistrict/${district._id}`)
                }
                className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
              >
                View Details
              </Buttons>
            </div>
          ))}
      </section>
    </section>
  );
}
