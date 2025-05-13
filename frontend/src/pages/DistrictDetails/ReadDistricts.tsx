import React from "react";
import { useCustomFetch } from "@hooks/useCustomFetch";

interface District {
  districtName: string;
  state: string;
  country: string;
}
export default function ReadDistricts() {
  const { data = [], error } = useCustomFetch(
    `/hpat/registerDistricts/viewAll`
  );

  console.log(data, error);

  if (!data) {
    return (
      <div className="container mx-auto p-4">
        <div
          className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Loading...</strong> Please wait.
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-row flex-wrap items-start  h-[100vh] justify-start gap-4 p-4 ">
      {data?.map((district: District, index: number) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-4 ">
          {index + 1}.
          <h2 className="text-lg font-semibold text-gray-800">
            {district.districtName}
          </h2>
          <p className="text-gray-600">State: {district.state}</p>
          <p className="text-gray-600">Country: {district.country}</p>
        </div>
      ))}
    </section>
  );
}
