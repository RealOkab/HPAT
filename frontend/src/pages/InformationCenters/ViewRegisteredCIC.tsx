import axios from "axios";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

interface CICDetails<T> {
  informationCenterName: T;
  gpsLocation: string;
  gpsLocationAccuracy: T;
  subDistrict: T;
  description: T;
  _id?: string;
}

export default function ViewRegisteredCIC() {
  const navigate = useNavigate();
  // This component is intended to display the details of a registered CIC
  const { districtId, cicId } = useParams<{
    districtId: string;
    cicId: string;
  }>();

  axios
    .get(
      `http://localhost:5000/hpat/registeredDistrict/${districtId}/registeredCiC/${cicId}`
    )
    .then((response) => {
      console.log(response.data);
    });

  const [cic, setCic] = React.useState<CICDetails<string>>({
    informationCenterName: "",
    gpsLocation: "",
    gpsLocationAccuracy: "",
    subDistrict: "",
    description: "",
    _id: "",
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://localhost:5000/hpat/registeredDistrict/${districtId}/registeredCiC/${cicId}`
      )
      .then((response) => {
        setCic(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load CIC details.");
        setLoading(false);
        console.error("Error fetching CIC details:", err);
      });
  }, [districtId, cicId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-red-500 text-lg">{error}</span>
      </div>
    );
  }

  if (!cic) {
    return null;
  }

  return (
    <div
      className=" flex flex-col items-center  h-[90vh]  w-[90%] p-6 rounded-lg shadow-md justify-start"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
    >
      <h1
        className="text-2xl font-bold mb-4 text-blue-600 justify-self-start"
        style={{ textShadow: "1px 1px 4px rgba(250,250,250,0,0.2)" }}
      >
        CIC Details
      </h1>
      <section
        className="w-full h-full flex flex-col items-center justify-center mb-8"
        style={{
          textShadow: "1px 1px 4px rgba(250,250,250,0,0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <div className="bg-white/70 p-6 rounded-lg shadow-md w-full h-full text-center ">
          <h2 className="text-xl font-semibold mb-4">
            {" "}
            <strong>CIC Name:</strong> {cic.informationCenterName}
          </h2>

          <p className="text-gray-700 mb-2">
            <strong>GPS Location:</strong> {cic.gpsLocation}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>GPS Accuracy:</strong> {cic.gpsLocationAccuracy} meters
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Sub-District:</strong> {cic.subDistrict}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Description:</strong> {cic.description}
          </p>
        </div>
        <div className="mt-6 mb-4 flex gap-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            onClick={() => {
              navigate(
                `/registeredDistrict/${districtId}/registeredCiC/viewInMaps`,
                {
                  state: cic.gpsLocation,
                }
              );
            }}
          >
            Map details
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </section>
    </div>
  );
}
