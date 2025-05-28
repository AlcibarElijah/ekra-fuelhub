/* -------------------------------------------------------------------------- */
/*                                   imports                                  */
/* -------------------------------------------------------------------------- */
import { Link, useLocation } from "react-router-dom";

const SidebarNav = ({ items }) => {
  const location = useLocation();

  return (
    <div className="col-md-3 mb-3">
      <div className="list-group">
        {items &&
          items.map((item) => (
            <Link
              key={"sidebar-nav-link-" + item.label}
              to={item.path}
              className={`list-group-item list-group-item-action ${
                location.pathname.endsWith(item.customActivePath || item.path)
                  ? "active"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SidebarNav;
