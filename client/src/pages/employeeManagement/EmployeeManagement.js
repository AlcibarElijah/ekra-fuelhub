/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { Routes, Route } from "react-router-dom";

/* ------------------------------- components ------------------------------- */
import SidebarNav from "../../components/nav/SidebarNav";
import MainContent from "../../components/MainContent";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";

const EmployeeManagement = () => {
  const sidebarItems = [
    {
      label: "Create Employee",
      path: "/employee/management/create",
    },
    {
      label: "Manage Employees",
      path: "/employee/management/list",
    },
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        <SidebarNav items={sidebarItems} />
        <MainContent>
          <Routes>
            <Route path="/create" element={<EmployeeForm />} />
            <Route path="/list" element={<EmployeeList />} />
            <Route path="/edit/:id" element={<EmployeeForm />} />
          </Routes>
        </MainContent>
      </div>
    </div>
  );
};

export default EmployeeManagement;
