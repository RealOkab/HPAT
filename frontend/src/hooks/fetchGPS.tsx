import { useEffect, useState } from "react";

interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}

export default function FetchGPS() {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation(position);

        if (position.coords.accuracy < 10) {
          setSuccess(
            " `Accuracy very good: ${position.coords.accuracy} meters. You can procced.`"
          );
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

  return { location, error, success };
}
