/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { Routes, Route } from "react-router-dom";

/* ------------------------------- components ------------------------------- */
import SidebarNav from "../../components/nav/SidebarNav";
import MainContent from "../../components/MainContent";
import FuelTankReadingForm from "./components/FuelTankReadingForm";
import FuelTankReadingList from "./components/FuelTankReadingList";

const FuelTankReadingManagement = () => {
  const sidebarItems = [
    {
      label: "Create Fuel Tank Reading",
      path: "/fuel/management/tank-reading/create",
    },
    {
      label: "Manage Fuel Tank Readings",
      path: "/fuel/management/tank-reading/list",
    },
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        <SidebarNav items={sidebarItems} />
        <MainContent>
          <Routes>
            {/* <Route path="/create" element={<FuelTankForm />} />
            <Route path="/edit/:id" element={<FuelTankForm />} /> */}
            <Route path="/create" element={<FuelTankReadingForm/>}/>
            <Route path="/list" element={<FuelTankReadingList />} />
          </Routes>
        </MainContent>
      </div>
    </div>
  );
};

export default FuelTankReadingManagement;
