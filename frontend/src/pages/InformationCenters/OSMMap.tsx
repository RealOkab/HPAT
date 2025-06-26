import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface InformationCenter {
  informationCenterName: string;
  gpsLocation: string;
  gpsLocationAccuracy: string;
  subDistrict: string;
  description: string;
  _id?: string;
}

const MapComponent = ({
  coordinatesArray,
  informationCenters,
}: {
  coordinatesArray: string[];
  informationCenters: InformationCenter[];
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  console.log("Final coordinatesArray:", coordinatesArray);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Initialize the map with default fallback location
      mapInstance.current = L.map(mapRef.current).setView([5.63, -0.24], 15);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap, okabonline</a> contributors',
      }).addTo(mapInstance.current);

      markersLayer.current = L.layerGroup().addTo(mapInstance.current);
    }

    if (markersLayer.current) {
      markersLayer.current.clearLayers();
    }

    const bounds = L.latLngBounds([]);

    coordinatesArray.forEach((coordString, index) => {
      console.log(`Processing coordinate ${index}:`, coordString);

      if (coordString && coordString.includes(",")) {
        const [lat, lng] = coordString.split(",").map(Number);

        if (!isNaN(lat) && !isNaN(lng)) {
          //console.log(`Adding marker at: ${lat}, ${lng}`);

          // Find the matching information center for this coordinate
          const infoCenter = informationCenters.find(
            (ic) => ic.gpsLocation === `${lat}, ${lng}`
          );
          const popupText = infoCenter
            ? `${infoCenter.informationCenterName}: ${lat}, ${lng}`
            : `CIC Location: ${lat}, ${lng}`;
          const marker = L.marker([lat, lng])
            .addTo(markersLayer.current!)
            .bindPopup(popupText);

          bounds.extend(marker.getLatLng()); // ✅ Expand bounds to include all locations
        } else {
          console.error(`Invalid LatLng detected: ${lat}, ${lng}`);
        }
      } else {
        console.error(`Invalid coordinate format: ${coordString}`);
      }
    });

    // ✅ Ensure `fitBounds()` works and fits **all** markers in view
    if (bounds.isValid() && mapInstance.current) {
      //console.log("Adjusting map view to fit all markers.");
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinatesArray, informationCenters]); // Ensure updates happen when coordinates change

  //console.log("Obed", informationCenters);

  return (
    <div
      ref={mapRef}
      className="h-[90vh] w-[90%] rounded-lg shadow-md border justify-center items-center self-center mx-auto"
    />
  );
};

export default MapComponent;
