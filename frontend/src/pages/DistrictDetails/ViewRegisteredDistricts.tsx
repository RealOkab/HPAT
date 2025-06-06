import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomFetch } from "@hooks/useCustomFetch";
import Buttons from "@components/Buttons";

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

function ViewRegisteredDistricts() {
  const { APICall, fetchedData, error } = useCustomFetch();
  const navigate = useNavigate();
  const { districtId } = useParams();

  useEffect(() => {
    if (!fetchedData) {
      APICall(`/hpat/registeredDistrict/${districtId}`, "get");
    }
  }, [APICall, fetchedData, districtId]);

  return (
    <div className="flex justify-center items-center h-screen  w-[90%] bg-transparent">
      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {fetchedData && (
        <div className="w-full max-w-lg rounded-xl bg-white shadow-lg p-6 space-y-6 transition-transform transform hover:scale-105">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Registered District
          </h2>

          <div className="space-y-4 bg-gray-50 p-5 rounded-lg shadow-sm">
            <div className="border-b pb-3">
              <p className="text-gray-600 text-sm font-semibold">
                District Name:
              </p>
              <span className="text-xl font-medium text-gray-900">
                {(fetchedData as DistrictData).districtName}
              </span>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-600 text-sm font-semibold">State:</p>
              <span className="text-lg font-medium text-gray-800">
                {(fetchedData as DistrictData).state}
              </span>
            </div>

            <div className="border-b pb-3">
              <p className="text-gray-600 text-sm font-semibold">Country:</p>
              <span className="text-lg font-medium text-gray-800">
                {(fetchedData as DistrictData).country}
              </span>
            </div>

            <div>
              <p className="text-gray-600 text-sm font-semibold">
                No. of CiCs:
              </p>
              <span className="text-lg font-medium text-gray-800">
                {(fetchedData as DistrictData).informationCenters.length}
              </span>
            </div>
          </div>

          <section className="flex flex-row ">
            <Buttons
              onClick={() => navigate("/registerDistricts/viewAll")}
              className=" mt-4 mr-4 w-[70%] bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              View Registered Districts
            </Buttons>
            <Buttons
              onClick={() => navigate("/registerDistricts/viewAll")}
              className="w-[30%] mt-4 bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              View CiCs
            </Buttons>
          </section>
        </div>
      )}
    </div>
  );
}

export default ViewRegisteredDistricts;
