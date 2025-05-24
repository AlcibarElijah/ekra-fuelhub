import { Link, Routes, Route, useLocation } from "react-router-dom";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

const AccountManagement = () => {
  const location = useLocation();

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-3">
          <div className="list-group">
            <Link
              to="/account/management/create"
              className={`list-group-item list-group-item-action ${
                location.pathname.endsWith("/create") ? "active" : ""
              }`}
            >
              Create User
            </Link>
            <Link
              to="/account/management/list"
              className={`list-group-item list-group-item-action ${
                location.pathname.endsWith("/list") ? "active" : ""
              }`}
            >
              Manage Users
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <Routes>
            <Route path="/create" element={<UserForm />} />
            <Route path="/list" element={<UserList />} />
            <Route path="/edit/:id" element={<UserForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
