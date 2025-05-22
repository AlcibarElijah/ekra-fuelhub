/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useLogout } from "../hooks/useLogout"

const Navbar = () => {
  const { logout } = useLogout();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="#">EKRA Fuel Hub</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="#">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Link</Link>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><Link className="dropdown-item" to="#">Action</Link></li>
                <li><Link className="dropdown-item" to="#">Another action</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="#">Something else here</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link disabled" to="#" tabIndex="-1" aria-disabled="true">Disabled</Link>
            </li>
          </ul>

          {/* Right side account icon dropdown */}
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle d-flex align-items-center" to="#" id="accountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <FaUserCircle size={22} className="me-1" />
              </Link>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                <li><Link className="dropdown-item" to="#">Profile</Link></li>
                <li><Link className="dropdown-item" to="#">Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" onClick={logout}>Logout</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
