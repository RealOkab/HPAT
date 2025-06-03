import Buttons from "@components/Buttons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface District {
  districtName: string;
  state: string;
  country: string;
}

function ViewRegisteredDistricts() {
  const navigate = useNavigate();

  const { districtId } = useParams();
  const [district, setDistrict] = useState<District | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(`/hpat/registeredDistrict/${districtId}`)
        .then((res) => {
          setDistrict(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
          setError("District not found");
        });
    };
    fetchData();
  }, [districtId]);

  return (
    <div>
      {error && <p>{error}</p>}
      {district && (
        <div className="flex w-[30rem]  h-[30rem] rounded-2xl  items-center justify-center  bg-gray-100 shadow shadow-blue-500/50 bg-gradient-to-br from-blue-500 via-white to-green-600">
          <div className="relative h-[100%] w-[100%] bg-white rounded-lg shadow-md p-8 space-y-4 overflow-hidden flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Registered District
            </h2>
            <div className="space-y-6 h-[70%] bg-white p-6 rounded-lg shadow-md">
              <div>
                <p className="text-gray-600 text-sm font-semibold">
                  District Name:
                </p>
                <span className="text-2xl font-medium text-gray-900">
                  {district.districtName}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600 text-sm font-semibold">State:</p>
                <span className="text-lg font-medium text-gray-800">
                  {district.state}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600 text-sm font-semibold">Country:</p>
                <span className="text-lg font-medium text-gray-800">
                  {district.country}
                </span>
              </div>
            </div>
            <Buttons
              onClick={() => navigate("/registerDistricts/viewAll")}
              className="mt-4 bg-blue-600 text-gray-200 hover:bg-blue-700 px-2 py-2 rounded"
            >
              View Registered Districts
            </Buttons>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewRegisteredDistricts;
