import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: 'bi-grid-fill', path: '/Dispatcher/Dashboard' },
  { label: 'Work Orders', icon: 'bi-card-checklist', path: '/Dispatcher/WorkOrders' },
  { label: 'Customers', icon: 'bi-people', path: '/Dispatcher/Customers' },
  { label: 'Site Management', icon: 'bi-building', path: '/Dispatcher/SiteManagement' },
  { label: 'Inventory', icon: 'bi-info-circle', path: '/Dispatcher/Inventory' },
  { label: 'Profile', icon: 'bi-person', path: '/Dispatcher/Profile' },
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
      className="d-flex flex-column flex-shrink-0 p-3 text-white"
      style={{ width: '240px', minWidth: '240px', flex: '0 0 240px', backgroundColor: '#0b192c' }}
    >
      <button
        type="button"
        onClick={() => navigate('/Dispatcher/Dashboard')}
        className="d-flex align-items-center mb-4 me-md-auto text-white text-decoration-none px-2"
        style={{ display: 'flex', background: 'transparent', border: 0, paddingTop: '0.6rem', paddingBottom: '0.6rem', opacity: 1, visibility: 'visible' }}
      >
        <i className="bi-hexagon-fill text-primary me-2 fs-4"></i>
        <div>
          <span className="fs-6 fw-bold d-block lh-1">KEYSTONE</span>
          <small className="text-secondary" style={{ fontSize: '0.65rem' }}>Dispatcher Service</small>
        </div>
      </button>

      <ul className="nav nav-pills flex-column flex-grow-1">
        {navItems.map((item) => (
          <li className="nav-item mb-1" key={item.label}>
            <button
              type="button"
              onClick={() => handleNavigation(item.label, item.path)}
              className="w-100 text-start d-flex align-items-center justify-content-between rounded-3 py-2 px-3"
              style={{
                display: 'flex',
                minHeight: '42px',
                color: '#fff',
                backgroundColor: activeNav === item.label ? '#0d6efd' : '#173451',
                border: 0,
                opacity: 1,
                visibility: 'visible',
              }}
            >
              <div className="d-flex align-items-center">
                <i className={`bi ${item.icon} me-3`}></i>
                <span
                  className="small"
                  style={{
                    display: 'inline-block',
                    color: '#fff',
                    opacity: 1,
                    visibility: 'visible',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className="pt-3 border-top border-secondary">
        <button
          type="button"
          onClick={handleLogout}
          className="text-white w-100 text-start d-flex align-items-center px-3 py-2 small"
          style={{ display: 'flex', minHeight: '42px', background: 'transparent', border: 0, opacity: 1, visibility: 'visible' }}
        >
          <i className="bi bi-power me-3"></i>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
