import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
};

const initialProfile: Profile = {
  fullName: 'John Smith',
  email: 'john.smith@abccorp.com',
  phone: '+1 212 555-0100',
  company: 'ABC Corp'
};

function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>(initialProfile);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Updated Profile Data:', profile);
    navigate('/Customer/MyProfile');
  };

  return (
    <div className="d-flex vh-100 bg-light">
      <Sidebar activeItem="My Profile" />

      <main className="flex-grow-1 overflow-auto p-4">
        <div className="mb-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item"><a href="#home" className="text-decoration-none text-muted small">Home</a></li>
              <li className="breadcrumb-item"><a href="/Customer/MyProfile" className="text-decoration-none text-muted small">My Profile</a></li>
              <li className="breadcrumb-item active small text-muted" aria-current="page">Edit Profile</li>
            </ol>
          </nav>
          <h3 className="fw-bold text-dark">Edit Profile</h3>
        </div>

        <div className="card border-0 shadow-sm rounded-3 p-3" style={{ maxWidth: '800px' }}>
          <div className="card-body">
            <div className="d-flex align-items-center gap-4 mb-4">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3 flex-shrink-0"
                style={{ width: '80px', height: '80px' }}
              >
                JS
              </div>
              <div>
                <h4 className="fw-bold mb-1 text-dark">{profile.fullName}</h4>
                <p className="text-muted small mb-0">{profile.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <h5 className="fw-bold text-dark mb-4">Profile Information</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="fullName" className="form-label fw-medium small text-dark">Full Name</label>
                  <input id="fullName" name="fullName" type="text" className="form-control" value={profile.fullName} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label fw-medium small text-dark">Email</label>
                  <input id="email" name="email" type="email" className="form-control" value={profile.email} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label fw-medium small text-dark">Phone</label>
                  <input id="phone" name="phone" type="tel" className="form-control" value={profile.phone} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label htmlFor="company" className="form-label fw-medium small text-dark">Company</label>
                  <input id="company" name="company" type="text" className="form-control" value={profile.company} onChange={handleChange} required />
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
                <button type="submit" className="btn btn-primary flex-grow-1 fw-medium rounded-2 py-2">
                  Save Changes
                </button>
                <button type="button" onClick={() => navigate('/Customer/UpdatePassword')} className="btn btn-outline-primary flex-grow-1 fw-medium rounded-2 py-2">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditProfile;