import { useState,ChangeEvent, FormEvent,useEffect } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

type Customer = {
  id: string | number;
  companyName: string;
  contactPerson?: string;
  address?: string;
};

function CreateSite() {
  const navigate = useNavigate();
  const [customer, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [submitted,setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    siteName: '',
    appartmentName: '',
    floorNo: '',
    addressDetails: '',
    city: '',
    State: '',
    country: '',
    zipCode: '',
    customerId: '' as string | number,
  });

  useEffect(() => {
    if (!error) return;

    const timer = window.setTimeout(() => {
      setError('');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [error]);

  useEffect(()=>{
    const fetchCustomers = async () =>{
      try{
        const response = await API.get('/customer/all');
        setCustomers(response.data);
        if(response.data.length > 0){
          setFormData((prev) => ({...prev, customerId: response.data[0].id}));
        }
      }catch{
        setError('Failed to fetch customers list.');
      }finally{
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  },[]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'zipCode' || name === 'customerId' ? value === '' ? '' : Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSubmitted(false);

    if (!formData.customerId) {
      setError('Please select a customer.');
      setSaving(false);
      return;
    }

    const payload = {
      siteName: formData.siteName.trim(),
      appartmentName: formData.appartmentName.trim(),
      floorNo: formData.floorNo.trim(),
      addressDetails: formData.addressDetails.trim(),
      city: formData.city.trim(),
      State: formData.State.trim(),
      country: formData.country.trim(),
      zipCode: formData.zipCode ? Number(formData.zipCode) : null,
    };
    try{
      await API.post(`/sites/${encodeURIComponent(formData.customerId)}`,payload);
      setSubmitted(true);
      setFormData({
        siteName:'',
        appartmentName:'',
        floorNo:'',
        addressDetails:'',
        city:'',
        State:'',
        country:'',
        zipCode:'',
        customerId: customer.length > 0 ? customer[0].id : '',
      });
    }catch(err: unknown){
      setError(err instanceof Error ? err.message : 'Failed to create site.');
    }finally{
      setSaving(false);
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar activeItem="Site Management" />
      <main className="flex-grow-1 overflow-auto p-3 p-md-4" style={{ minWidth: 0 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-xl-9">
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold text-dark mb-1">Create Site</h3>
                <p className="text-muted small mb-0">Add a new location and map it to an existing customer.</p>
              </div>
              <button onClick={() => navigate('/Manager/SiteManagements')} className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-left me-1"></i> Back
              </button>
            </div>

            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-4">
                {error && 
                <div className='alert alert-danger mb-3'>{error}</div>}
                {submitted && (
                  <div className='alert alert-success mb-3'>Site created successfully!</div>
                )}
                <form onSubmit={handleSubmit}>
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">General Information</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark fw-medium small">Site Name *</label>
                      <input
                        type="text"
                        name="siteName"
                        className="form-control"
                        placeholder="e.g. Main Office"
                        value={formData.siteName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark fw-medium small">Customer *</label>
                      {loadingCustomers ? (
                        <p className='text-muted small'>Loading customer...</p>
                      ):(
                      <select
                        name="customerId"
                        className="form-select"
                        value={formData.customerId}
                        onChange={handleInputChange}
                        required
                      >
                        {customer.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.companyName},{c.contactPerson},{c.address}
                          </option>
                        ))}
                      </select>
                      )}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark fw-medium small">Apartment / Building</label>
                      <input
                        type="text"
                        name="appartmentName"
                        className="form-control"
                        placeholder="e.g. Keystone Tower"
                        value={formData.appartmentName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark fw-medium small">Floor No</label>
                      <input
                        type="text"
                        name="floorNo"
                        className="form-control"
                        placeholder="e.g. 3rd Floor"
                        value={formData.floorNo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Address & Location</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <label className="form-label text-dark fw-medium small">Address Details *</label>
                      <input
                        type="text"
                        name="addressDetails"
                        className="form-control"
                        placeholder="Street address or P.O. Box"
                        value={formData.addressDetails}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label text-dark fw-medium small">City *</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label text-dark fw-medium small">State *</label>
                      <input
                        type="text"
                        name="State"
                        className="form-control"
                        value={formData.State}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label text-dark fw-medium small">Country</label>
                      <input
                        type="text"
                        name="country"
                        className="form-control"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label text-dark fw-medium small">Zip Code</label>
                      <input
                        type="number"
                        name="zipCode"
                        className="form-control"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 border-top pt-3">
                    <button type="button" onClick={() => navigate('/Manager/SiteManagements')} className="btn btn-outline-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4"disabled={saving}>
                      {saving ? 'Creating...' : 'Create Site'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateSite;