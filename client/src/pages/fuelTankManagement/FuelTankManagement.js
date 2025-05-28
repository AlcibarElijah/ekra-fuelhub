/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { Routes, Route } from "react-router-dom";

/* ------------------------------- components ------------------------------- */
import SidebarNav from "../../components/nav/SidebarNav";
import MainContent from "../../components/MainContent";
import FuelTankForm from "./components/FuelTankForm";
import FuelTankList from "./components/FuelTankList";

const FuelTankManagement = () => {
  const sidebarItems = [
    {
      label: "Create Fuel Fuel Tank",
      path: "/fuel/management/tank/create",
    },
    {
      label: "Manage Fuel Tanks",
      path: "/fuel/management/tank/list",
    },
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        <SidebarNav items={sidebarItems} />
        <MainContent>
          <Routes>
            <Route path="/create" element={<FuelTankForm />} />
            <Route path="/list" element={<FuelTankList />} />
            <Route path="/edit/:id" element={<FuelTankForm />} />
          </Routes>
        </MainContent>
      </div>
    </div>
  );
};

export default FuelTankManagement;
