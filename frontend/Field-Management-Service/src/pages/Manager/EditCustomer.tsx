import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import API from '../../services/api';

type CustomerEditForm = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  active:boolean;
};

type Customer = CustomerEditForm & {
  id: string | number;
};

const initialProfile: CustomerEditForm = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  active: true
};

function EditCustomer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CustomerEditForm>(initialProfile);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await API.get<Customer[]>('/customer/all');
        const customer = response.data.find((item) => String(item.id) === String(id));

        if (!customer) {
          setError('Customer not found.');
          return;
        }

        setFormData({
          companyName: customer.companyName || '',
          contactPerson: customer.contactPerson || '',
          email: customer.email || '',
          phone: customer.phone || '',
          address: customer.address || '',
          active: customer.active ?? true,
        });
      } catch {
        setError('Failed to fetch customer details.');
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchCustomer();
    } else {
      setError('Customer ID is missing.');
      setFetching(false);
    }
  }, [id]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((currentProfile) => ({ ...currentProfile, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    setSaving(true);
    setSubmitted(false);
    setError('');

    try {
      await API.put(`/customer/${encodeURIComponent(formData.email)}`, {
        companyName: formData.companyName.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        active: formData.active,
      });
      setSubmitted(true);
    } catch {
      setError('Failed to update customer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar activeItem="Customers" />
      <main className="flex-grow-1 overflow-auto p-4"style={{minWidth:0}}>
        <div className="mb-4">
          <h3 className="fw-bold text-dark mb-1">Edit Customer</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item text-muted">
              <button type="button" onClick={() => navigate('/Manager/Dashboard')} className="btn btn-link p-0 small text-decoration-none">Home</button></li>
              <li className="breadcrumb-item">
                <button type="button" onClick={() => navigate('/Manager/Customers')} className="btn btn-link p-0 small text-decoration-none">Customers</button>
              </li>
              <li className="breadcrumb-item active text-muted" aria-current="page">Edit Customer</li>
            </ol>
          </nav>
        </div>

         <div className="row g-4 align-items-start">
          <div className="col-12 col-md-7 col-lg-7">
            <div className="card border-0 shadow-sm rounded-3 p-3">
              <div className="card-body">
                <h5 className="fw-bold text-dark mb-4">Customer Information</h5>
                {fetching && <p className="text-muted">Loading customer details...</p>}
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {submitted && <div className="alert alert-success" role="alert">Customer updated successfully.</div>}
                {!fetching && !error && <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="companyName" className="form-label fw-medium small text-dark">Company Name</label>
                    <input id="companyName" name="companyName" type="text" className="form-control" value={formData.companyName} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contactPerson" className="form-label fw-medium small text-dark">Contact Person</label>
                    <input id="contactPerson" name="contactPerson" type="text" className="form-control" value={formData.contactPerson} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-medium small text-dark">Email</label>
                    <input id="email" name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="phone" className="form-label fw-medium small text-dark">Phone</label>
                    <input id="phone" name="phone" type="tel" className="form-control" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="address" className="form-label fw-medium small text-dark">Address</label>
                    <input id="address" name="address" type="text" className="form-control" value={formData.address} onChange={handleChange} required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="active" className="form-label fw-medium small text-dark">Active Customer</label>
                    <input id="active" name="active" type="checkbox" className="form-check-input" checked={formData.active} onChange={(event) => setFormData((currentProfile) => ({ ...currentProfile, active: event.target.checked }))} />
                  </div>
                  <div className="d-flex gap-2 pt-2">
                    <button type="submit" disabled={saving} className="btn btn-primary flex-grow-1 fw-medium py-2 rounded-2">{saving ? 'Saving...' : 'Save Changes'}</button>
                    <button type="button" onClick={() => navigate('/Manager/Customers')} className="btn btn-outline-secondary flex-grow-1 fw-medium py-2 rounded-2">Cancel</button>
                  </div>
                </form>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditCustomer;
