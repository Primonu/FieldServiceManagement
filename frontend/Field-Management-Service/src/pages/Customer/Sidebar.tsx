import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: 'bi-grid-fill', path: '/Customer/Dashboard' },
  { label: 'My Requests', icon: 'bi-list-task', path: '/Customer/MyRequests' },
  { label: 'Create Request', icon: 'bi-plus-circle', path: '/Customer/CreateRequest' },
  
];

type SidebarProps = {
  activeItem?: string;
};

function Sidebar({ activeItem = 'Dashboard' }: SidebarProps) {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState(activeItem);

  const handleNavigation = (label: string, path: string) => {
    setActiveNav(label);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ width: '240px', backgroundColor: '#0f2042' }}
    >
      <button
        type="button"
        onClick={() => navigate('/Customer/Dashboard')}
        className="btn d-flex align-items-center mb-4 me-md-auto text-white text-decoration-none px-2"
      >
        <i className="bi-hexagon-fill text-primary me-2 fs-4"></i>
        <div>
          <span className="fs-5 fw-bold d-block lh-1">KEYSTONE</span>
          <small className="text-secondary" style={{ fontSize: '0.65rem' }}>Customer Portal</small>
        </div>
      </button>

      <ul className="nav nav-pills flex-column mb-auto">
        {navItems.map((item) => (
          <li className="nav-item mb-1" key={item.label}>
            <button
              onClick={() => handleNavigation(item.label, item.path)}
              className={`nav-link text-white w-100 text-start d-flex align-items-center rounded-3 py-2 px-3 ${
                activeNav === item.label ? 'active bg-primary' : ''
              }`}
            >
              <i className={`${item.icon} me-3`}></i>
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="pt-3 border-top border-secondary">
        <button
          type="button"
          onClick={handleLogout}
          className="nav-link text-white w-100 text-start d-flex align-items-center px-3 py-2"
        >
          <i className="bi-power me-3"></i>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
