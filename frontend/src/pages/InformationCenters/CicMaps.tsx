import { useEffect, useRef, useState } from "react";
import MapComponent from "./OSMMap";
import { useCustomFetch } from "@hooks/useCustomFetch";
import { useLocation } from "react-router-dom";

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

const CiCMaps = () => {
  const { APICall, fetchedData, error } = useCustomFetch();
  const { districtId } = useParams();
  const [cicCoordinates, setCicCoordinates] = useState<string[]>([]);
  const prevFetchedData = useRef<DistrictData | null>(null);
  const location = useLocation();

  // Fetch API when `districtId` changes
  useEffect(() => {
    APICall(`/hpat/registeredDistrict/${districtId}/registeredCiC`, "get");
  }, [districtId]);

  // Update state ONLY when data changes
  useEffect(() => {
    if (
      fetchedData &&
      "informationCenters" in fetchedData &&
      Array.isArray(fetchedData.informationCenters)
    ) {
      const coordinatesArray = fetchedData.informationCenters.map(
        (cic: InformationCenter) =>
          location?.state ? location.state : cic.gpsLocation || ""
      );

      setCicCoordinates(coordinatesArray);
      prevFetchedData.current = {
        ...fetchedData,
        informationCenters: fetchedData.informationCenters ?? [],
      }; // Ensure informationCenters is always an array
    }
  }, [fetchedData, location]); // Only re-run when fetchedData updates

  //console.log(fetchedData);
  return (
    <div className="relative w-full h-[90vh] flex flex-col justify-center items-center">
      {/* Error handling */}
      {error && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-red-100">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      )}

      {/* Title */}
      <h1
        className="flex justify-self-start text-2xl font-bold mb-4 text-black"
        style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}
        data-testid="cic-maps-title"
      >
        Information Centers Map{" "}
        <button
          onClick={() => window.history.back()}
          className="px-1 ml-2 py-1 bg-black text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          {" "}
          Back
        </button>
      </h1>

      {/* Map covering 90% of the page */}
      <div className="w-full h-full">
        <MapComponent
          coordinatesArray={cicCoordinates}
          informationCenters={
            fetchedData &&
            !Array.isArray(fetchedData) &&
            "informationCenters" in fetchedData
              ? (fetchedData.informationCenters as InformationCenter[])
              : []
          }
        />
      </div>
    </div>
  );
};

export default CiCMaps;
