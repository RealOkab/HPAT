import { useEffect, useState } from "react";

interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}

export default function FetchGPS() {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (position.coords.accuracy < 10) {
          setLocation(position);
          navigator.geolocation.clearWatch(watchId); //
        } else {
          setError(
            `Accuracy too high: ${position.coords.accuracy} meters. Try moving to an open area.`
          );
        }
      },
      (error) => setError(`Geolocation error: ${error.message}`),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
}
