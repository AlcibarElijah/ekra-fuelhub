/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { Routes, Route } from "react-router-dom";

/* ------------------------------- components ------------------------------- */
import SidebarNav from "../../components/nav/SidebarNav";
import FuelForm from "./components/FuelForm";
import MainContent from "../../components/MainContent";
import FuelList from "./components/FuelList";

const FuelManagement = () => {
  const sidebarItems = [
    {
      label: "Create Fuel Type",
      path: "/fuel/management/create",
    },
    {
      label: "Manage Fuel Types",
      path: "/fuel/management/list",
    },
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        <SidebarNav items={sidebarItems} />
        <MainContent>
          <Routes>
            <Route path="/create" element={<FuelForm />} />
            <Route path="/list" element={<FuelList />} />
          </Routes>
        </MainContent>
      </div>
    </div>
  );
};

export default FuelManagement;
