/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

/* -------------------------------- contexts -------------------------------- */

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          EKRA Fuel Hub
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className={`nav-link dropdown-toggle ${
                  location.pathname.includes("/fuel/management") ? "active" : ""
                }`}
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Fuel
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/fuel/management/create">
                    Fuel Types
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/fuel/management/tank/create"
                  >
                    Fuel Tanks
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Right side account icon dropdown */}
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle d-flex align-items-center"
                to="#"
                id="accountDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUserCircle size={22} className="me-2" />
                <span className="d-none d-sm-inline">{user.username}</span>
              </Link>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="accountDropdown"
              >
                <li>
                  <Link className="dropdown-item" to="/account/settings">
                    Account Settings
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/account/update-password">
                    Update Password
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                {user.role.name === "admin" && (
                  <>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/account/management/create"
                      >
                        Accounts Management
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                  </>
                )}
                <li>
                  <Link className="dropdown-item" onClick={logout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
