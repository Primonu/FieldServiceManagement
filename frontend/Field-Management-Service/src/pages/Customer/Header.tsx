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
      <div>
        <h2 className="fw-bold mb-1">Dashboard</h2>
        <p className="text-muted mb-0">Welcome back, {adminName}</p>
      </div>

      <div className="d-flex align-items-center gap-3">
        <select className="form-select border-0 shadow-sm" style={{ width: 'auto' }}>
          <option>ABC Corp</option>
        </select>
        <div className="position-relative">
          <i className="bi-bell fs-5 cursor-pointer"></i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
            2
          </span>
        </div>
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px' }}>
          {avartarInitial}
        </div>
      </div>
    </header>
  );
}

export default Header;
