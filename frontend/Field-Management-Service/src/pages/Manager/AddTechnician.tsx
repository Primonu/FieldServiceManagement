import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './css/dashboard.css';

type TechnicianForm = {
  name: string;
  email: string;
  phone: string;
  skills: string;
  status: 'Active' | 'Inactive';
};

const initialForm: TechnicianForm = {
  name: '',
  email: '',
  phone: '',
  skills: '',
  status: 'Active'
};

function AddTechnician() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TechnicianForm>(initialForm);

  const handleChange = (field: keyof TechnicianForm, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Technician added:', formData);
    navigate('/Manager/Technicians');
  };

  return (
    <div className="dashboard-app">
      <Sidebar />
      <main className="main-area">
        <div className="bg-light min-vh-100 p-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-8">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold text-dark mb-1">Add Technician</h4>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 small">
                      <li className="breadcrumb-item text-muted">Home</li>
                      <li className="breadcrumb-item">
                        <button type="button" onClick={() => navigate('/Manager/Technicians')} className="btn btn-link p-0 small text-decoration-none">Technicians</button>
                      </li>
                      <li className="breadcrumb-item active text-muted" aria-current="page">Add Technician</li>
                    </ol>
                  </nav>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-3 p-4">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-primary-subtle text-primary rounded-3 p-3">
                      <i className="bi bi-person-plus fs-4" />
                    </div>
                    <div>
                      <h5 className="fw-bold text-dark mb-1">Technician Information</h5>
                      <p className="text-muted small mb-0">Add a technician to your service team.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label small fw-semibold text-dark">Full Name</label>
                        <input id="name" type="text" className="form-control" value={formData.name} onChange={(event) => handleChange('name', event.target.value)} placeholder="e.g. John Doe" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label small fw-semibold text-dark">Email</label>
                        <input id="email" type="email" className="form-control" value={formData.email} onChange={(event) => handleChange('email', event.target.value)} placeholder="e.g. john@example.com" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone" className="form-label small fw-semibold text-dark">Phone</label>
                        <input id="phone" type="tel" className="form-control" value={formData.phone} onChange={(event) => handleChange('phone', event.target.value)} placeholder="e.g. +1 212 555 0100" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="status" className="form-label small fw-semibold text-dark">Status</label>
                        <select id="status" className="form-select" value={formData.status} onChange={(event) => handleChange('status', event.target.value)}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="skills" className="form-label small fw-semibold text-dark">Skills</label>
                        <input id="skills" type="text" className="form-control" value={formData.skills} onChange={(event) => handleChange('skills', event.target.value)} placeholder="e.g. HVAC, Electrical, Plumbing" required />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                      <button type="button" onClick={() => navigate('/Manager/Technicians')} className="btn btn-outline-secondary">Cancel</button>
                      <button type="submit" className="btn btn-primary px-4"><i className="bi bi-person-plus me-2" />Add Technician</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddTechnician;
