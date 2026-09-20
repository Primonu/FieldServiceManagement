import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import API from '../../services/api';

function AddCustomer() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    active: true,
  });
  useEffect(()=>{
    if(!error) return;

    const timer = window.setTimeout(() => {
      setError('');
    }, 3000);

    return () => window.clearTimeout(timer);
  },[error]);

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSubmitted(false);
    
    try{
      await API.post('/customer',{
        companyName: formData.companyName.trim(),
        contactPerson: formData.companyName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        // sites: formData.sites.map((id) => ({id})),
        active: formData.active,
      });
      setSubmitted(true);
      setFormData({ companyName:'',contactPerson:'',email:'',phone:'',address:'',active:true})
    }catch(err: any){
      setError(err.message || 'Failed to submit customer data.');
    }finally{
      setSaving(false);
    }
  };


  return (
    <div className="dashboard-app">
      <Sidebar activeItem="Customers" />
      <main className="main-area"style={{ flex: "1 1 auto", width: "auto", minWidth: 0, marginLeft: 0 }}>
        <div className="bg-light min-vh-100 p-4">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-8">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold text-dark mb-1">Add Customer</h4>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 small">
                      <li className="breadcrumb-item text-muted">Home</li>
                      <li className="breadcrumb-item">
                        <button type="button" onClick={() => navigate('/Dispatcher/Customers')} className="btn btn-link p-0 small text-decoration-none">Customers</button>
                      </li>
                      <li className="breadcrumb-item active text-muted" aria-current="page">Add Customer</li>
                    </ol>
                  </nav>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-3 p-4">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-primary-subtle text-primary rounded-3 p-3">
                      <i className="bi bi-building-add fs-4" />
                    </div>
                    <div>
                      <h5 className="fw-bold text-dark mb-1">Customer Information</h5>
                      <p className="text-muted small mb-0">Add a company and its primary contact.</p>
                    </div>
                  </div>
                  {error &&(
                    <div className='alert alert-danger mb-3'role='alert'>{error}</div>
                  )}
                  {submitted && (
                    <div className='alert alert-success mb-3'role='alert'>Customer created successfully!</div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="companyName" className="form-label small fw-semibold text-dark">Company Name</label>
                        <input id="companyName" type="text" className="form-control" value={formData.companyName} onChange={(event) => handleChange('companyName', event.target.value)} placeholder="e.g. ABC Corp" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="contactPerson" className="form-label small fw-semibold text-dark">Contact Person</label>
                        <input id="contactPerson" type="text" className="form-control" value={formData.contactPerson} onChange={(event) => handleChange('contactPerson', event.target.value)} placeholder="e.g. John Anderson" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label small fw-semibold text-dark">Email</label>
                        <input id="email" type="email" className="form-control" value={formData.email} onChange={(event) => handleChange('email', event.target.value)} placeholder="e.g. john@abccorp.com" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone" className="form-label small fw-semibold text-dark">Phone</label>
                        <input id="phone" type="tel" className="form-control" value={formData.phone} onChange={(event) => handleChange('phone', event.target.value)} placeholder="e.g. +1 212 555 0100" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="address" className="form-label small fw-semibold text-dark">Address</label>
                        <input id="address" type="text" className="form-control" value={formData.address} onChange={(event) => handleChange('address', event.target.value)} placeholder="e.g. 123 Business Parkway" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="active" className="form-label small fw-semibold text-dark">Active Customer</label>
                        <input id="active" type="checkbox" className="form-check-input" checked={formData.active} onChange={(event) => handleChange('active', event.target.checked.toString())} />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                      <button type="button" onClick={() => navigate('/Dispatcher/Customers')} className="btn btn-outline-secondary">Cancel</button>
                      <button type="submit" className="btn btn-primary px-4"><i className="bi bi-person-plus me-2" />{saving ? 'Saving...' : 'Create Customer'}</button>
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

export default AddCustomer;
