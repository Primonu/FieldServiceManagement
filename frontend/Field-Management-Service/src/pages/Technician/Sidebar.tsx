import { useState } from "react";
import { useNavigate } from "react-router-dom";

const sidebarLinks = [
  { name: "My Jobs", icon: "bi-card-checklist", path: "/Technician/Dashboard" },
  { name: "Profile", icon: "bi-person", path: "/Technician/Profile" },
  { name: "Part/Inventory", icon: "bi-box-seam", path: "/Technician/Inventory" },
  
];

type SidebarProps = {
  activeItem?: string;
};

function Sidebar({ activeItem = "My Jobs" }: SidebarProps){
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState(activeItem);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };
  return(

  <aside
        className="d-flex flex-column flex-shrink-0 p-3 text-white"
        style={{ width: "240px", backgroundColor: "#0B192C" }}
      >
        <div className="d-flex align-items-center mb-4 px-2">
          <i className="bi bi-shield-lock-fill fs-3 me-2 text-primary"></i>
          <span className="fs-5 fw-bold tracking-wide">KEYSTONE</span>
        </div>

        <ul className="nav nav-pills flex-column mb-auto">
          {sidebarLinks.map((link) => (
            <li className="nav-item mb-1" key={link.name}>
              <button
                type="button"
                onClick={() => {
                  setActiveNav(link.name);
                  navigate(link.path);
                }}
                className={`nav-link d-flex align-items-center justify-content-between text-white ${
                  activeNav === link.name ? "active bg-primary" : "opacity-75"
                }`}
              >
                <div>
                  <i className={`bi ${link.icon} me-2`}></i>
                  {link.name}
                </div>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleLogout}
          className="nav-link d-flex align-items-center text-white"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </aside>

    )
}export default Sidebar;