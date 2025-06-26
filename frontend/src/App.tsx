import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const RegisterDistricts = lazy(
  () => import("@pages/DistrictDetails/RegisterDistricts")
);
const ReadDistricts = lazy(
  () => import("@pages/DistrictDetails/ReadDistricts")
);

const ViewRegisteredDistricts = lazy(
  () => import("@pages/DistrictDetails/ViewRegisteredDistricts")
);
const RegisterInformationCenter = lazy(
  () => import("@pages/InformationCenters/RegisterInformationCenter")
);
const ReadCICs = lazy(() => import("@pages/InformationCenters/ReadCICs"));
const CiCMaps = lazy(() => import("@pages/InformationCenters/CicMaps"));

const ViewRegisteredCIC = lazy(
  () => import("@pages/InformationCenters/ViewRegisteredCIC")
);


function App() {
  return (
    <main className=" flex flex-col font-sans bg-[url('/src/assets/hpat-bg.avif')] bg-cover bg-gradient-to-br w-screen from-purple-500 via-white to-green-600 min-h-screen flex items-center justify-center">
      <Suspense>
        <BrowserRouter>
          <Routes>
            <Route path="/registerDistricts" element={<RegisterDistricts />} />
            <Route
              path="/viewRegisteredDistrict/:districtId"
              element={<ViewRegisteredDistricts />}
            />
            <Route
              path="/registerDistricts/viewAll"
              element={<ReadDistricts />}
            />

            <Route
              path="/registeredDistrict/:districtId/registeredCiC/viewInMaps"
              element={<CiCMaps />}
            ></Route>
            <Route
              path="/registeredDistrict/:districtId/registeredCiC/readCICS"
              element={<ReadCICs />}
            ></Route>

            <Route
              path="/registeredDistrict/:districtId/registerCiC"
              element={<RegisterInformationCenter />}
            />

            <Route
              path="/registeredDistrict/:districtId/registeredCiC/:cicId"
              element={<ViewRegisteredCIC />}
            />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </main>
  );
}

export default App;
