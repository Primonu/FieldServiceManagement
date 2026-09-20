import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

type UserProfile = {
  fname?: string;
  lname?: string;
  userEmail?: string;
  phone?: string;
}

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserProfile>({});

  useEffect(()=>{
      try{
        const storedUser = localStorage.getItem('user');
        if(storedUser){
          const profile = JSON.parse(storedUser) as UserProfile;
          setUserData(profile);
        }
      }catch{
        console.log("user not fetch");
      }
    },[]);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar activeItem="Profile" />
      <main className="flex-grow-1 overflow-auto p-4">
        <div className="mb-4 text-center">
          <h3 className="fw-bold text-dark">My Profile</h3>
        </div>

        {/* Profile Content Layout */}
        <div className="row justify-content-center">
          
          {/* Left Column: Avatar & Contact Info */}
          <div className="col-12 col-md-7 col-lg-5 text-center">
            <div className="card border-0 shadow-sm rounded-3 p-4">
              <div className="card-body text-center">
                {/* Profile Badge Avatar */}
                <div
                  className="bg-primary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center fw-bold fs-2 mb-3"
                  style={{ width: '90px', height: '90px' }}
                >
                  DP
                </div>
                
                <h4 className="fw-bold text-dark mb-1">Dispatcher</h4>
                <p className="text-muted small mb-4">{userData.fname || " "} {userData.lname}</p>

                <div className="d-flex flex-column align-items-center gap-2 text-muted small">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-envelope text-secondary"></i>
                    <span>{userData.userEmail}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-telephone text-secondary"></i>
                    <span>{userData.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Update Profile Form */}

        </div>
      </main>
    </div>
  );
};

export default Profile;