/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { Routes, Route } from "react-router-dom";

/* ------------------------------- components ------------------------------- */
import SidebarNav from "../../components/nav/SidebarNav";
import MainContent from "../../components/MainContent";
import PositionForm from "./components/PositionForm";
import PositionList from "./components/PositionList";

const PositionManagement = () => {
  const sidebarItems = [
    {
      label: "Create Position",
      path: "/employee/management/position/create",
    },
    {
      label: "Manage Positions",
      path: "/employee/management/position/list",
    },
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        <SidebarNav items={sidebarItems} />
        <MainContent>
          <Routes>
            <Route path="/create" element={<PositionForm />} />
            <Route path="/list" element={<PositionList />} />
            <Route path="/edit/:id" element={<PositionForm />} />
          </Routes>
        </MainContent>
      </div>
    </div>
  );
};

export default PositionManagement;
