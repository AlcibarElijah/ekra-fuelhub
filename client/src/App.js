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

/* ------------------------------- components ------------------------------- */
import Navbar from "./components/Navbar";

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
