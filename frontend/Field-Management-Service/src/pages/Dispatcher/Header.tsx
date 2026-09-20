import { useEffect, useState } from "react";

type UserProfile = {
  fname?: string;
  lname?: string;
}
function getNameFromProfile(profile: UserProfile) {
  if (!profile) return '';

  return `${profile.fname || ''} ${profile.lname || ''}`.trim();
}

function Header() {
  const [adminName, setAdminName] = useState('Admin User');
  useEffect(()=>{
    try{
      const storedUser = localStorage.getItem('user');
      if(storedUser){
        const storedName = getNameFromProfile(JSON.parse(storedUser) as UserProfile);
        if(storedName) setAdminName(storedName);
      }
    }catch{
        console.log("User not fetch");
    }
  },[]);
  const avartarInitial = adminName.charAt(0).toUpperCase();
  return (
    <header className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-light border-0 shadow-sm d-md-none">
          <i className="bi bi-list"></i>
        </button>
        <div>
          <h3 className="fw-bold text-dark mb-0">Dashboard</h3>
          <p className="text-muted small mb-0">Welcome back, {adminName}</p>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-white bg-white border-0 shadow-sm text-secondary small d-flex align-items-center gap-2 px-3 py-2 rounded-3">
          <span>{new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            })}
          </span>
          <i className="bi bi-calendar3"></i>
        </button>

        <div className="position-relative bg-white p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
          <i className="bi bi-bell text-secondary"></i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.55rem' }}>
            1
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px' }}>
            {avartarInitial}
          </div>
          <div className="d-none d-sm-block">
            <span className="fw-bold d-block small lh-1 text-dark">Dispatcher</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
