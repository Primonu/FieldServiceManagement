import { useEffect, useState } from 'react';
import './css/header.css'

type UserProfile = {
  fname?: string;
  lname?: string;
};

function getNameFromProfile(profile: UserProfile) {
  if (!profile) return '';

  return `${profile.fname || ''} ${profile.lname || ''}`.trim();
}

function Header(){
    const [adminName, setAdminName] = useState('Admin User');

    useEffect(() => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const storedName = getNameFromProfile(JSON.parse(storedUser) as UserProfile);
          if (storedName) setAdminName(storedName);
        }
      } catch {
        // Keep the default name when the stored profile is invalid.
      }
    }, []);

    const avatarInitial = adminName.charAt(0).toUpperCase();

    return(
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {adminName}</p>
          </div>

          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">
              <i className="bi bi-bell" />
            </button>
            <button className="icon-button" aria-label="Messages">
              <i className="bi bi-bell" />
            </button>
            <div className="profile">
              <div className="avatar">{avatarInitial}</div>
              <div>
                <strong>{adminName}</strong>
                <small>Admin</small>
              </div>
              <i className="bi bi-chevron-down" />
            </div>
          </div>
        </header>
    )
}
export default Header;