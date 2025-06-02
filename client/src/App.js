/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------------------------------- pages --------------------------------- */
import Login from "./pages/login/Login";
import AccountSettings from "./pages/accountManagement/AccountSettings";
import UpdatePassword from "./pages/accountManagement/UpdatePassword";
import AccountManagement from "./pages/accountManagement/AccountManagement";
import NotFound from "./pages/NotFound";
import FuelManagement from "./pages/fuelManagement/FuelManagement";
import FuelTankManagement from "./pages/fuelTankManagement/FuelTankManagement";
import FuelTankReadingManagement from "./pages/fuelTankReadingManagement/FuelTankReadingManagement";
import PositionManagement from "./pages/positionManagement/PositionManagement";
import EmployeeManagement from "./pages/employeeManagement/EmployeeManagement";

/* ------------------------------- components ------------------------------- */
import Navbar from "./components/nav/Navbar";

/* -------------------------------- contexts -------------------------------- */
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { user, isLoading: isUserLoading } = useAuthContext();

  if (isUserLoading) return;

  return (
    <div className="App mb-3">
      <BrowserRouter>
        {!user && <Login />}
        {user && (
          <>
            <Navbar />
            <Routes>
              <Route path="/account/settings" element={<AccountSettings />} />
              <Route
                path="/account/update-password"
                element={<UpdatePassword />}
              />
              <Route
                path="/account/management/*"
                element={
                  user.role.name === "admin" ? (
                    <AccountManagement />
                  ) : (
                    <NotFound />
                  )
                }
              />

              <Route
                path="/fuel/management/tank/*"
                element={<FuelTankManagement />}
              />
              <Route
                path="/fuel/management/tank-reading/*"
                element={<FuelTankReadingManagement />}
              />
              <Route path="/fuel/management/*" element={<FuelManagement />} />

              <Route
                path="/employee/management/position/*"
                element={<PositionManagement />}
              />
              <Route
                path="/employee/management/*"
                element={<EmployeeManagement />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        )}
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
