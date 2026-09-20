import React, { useEffect, useState,type ChangeEvent, type FormEvent } from 'react';
import Sidebar from './Sidebar';
import API from '../../services/api';
import { useParams } from 'react-router-dom';

type Customer = {
  id: string | number;
  customerId?: string | number;
  name?: string;
  companyName?: string;
  contactPerson?: string;
};
type SiteEditForm = {
  siteName: string;
  appartmentName: string;
  floorNo: string;
  addressDetails: string;
  city: string;
  State: string;
  country: string;
  zipCode: number | string;
  customer?: Customer | string | number;
  customerId?: string | number;
};
type Site = SiteEditForm & {
  id: string | number;
};

const initialProfile: SiteEditForm = {
  siteName: '',
  appartmentName: '',
  floorNo: '',
  addressDetails: '',
  city: '',
  State: '',
  country: '',
  zipCode: '',
};
function UpdateSite() {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<Site>({ id: id || '', ...initialProfile });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | number>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sitesResponse, customersResponse] = await Promise.all([
          API.get<Site[]>('/sites'),
          API.get<Customer[]>('/customer/all'),
        ]);
        const selectedSite = sitesResponse.data.find((item) => String(item.id) === String(id));

        if (!selectedSite) {
          setError('Site not found.');
          return;
        }

        setCustomers(customersResponse.data);
        setSite({ ...selectedSite, State: selectedSite.State || '' });
        const customerValue = selectedSite.customer;
        const nestedCustomerId = customerValue && typeof customerValue === 'object'
          ? customerValue.id
          : customerValue;
        const customerId = selectedSite.customerId
          ?? nestedCustomerId
          ?? (customerValue && typeof customerValue === 'object' && 'customerId' in customerValue
            ? customerValue.customerId
            : undefined);
        setSelectedCustomerId(customerId === undefined ? '' : String(customerId));
      } catch {
        setError('Failed to fetch site details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) void fetchData();
    else {
      setError('Site ID is missing.');
      setLoading(false);
    }
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'customerId') {
      setSelectedCustomerId(value);
    } else {
      setSite((prev) => ({
        ...prev,
        [name]: name === 'zipCode' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !selectedCustomerId) {
      setError('Please select a customer.');
      return;
    }

    setSaving(true);
    setError('');
    setSubmitted(false);
    try {
      await API.put(`/sites/${encodeURIComponent(id)}`, {
        siteName: site.siteName.trim(),
        appartmentName: site.appartmentName.trim(),
        floorNo: site.floorNo.trim(),
        addressDetails: site.addressDetails.trim(),
        city: site.city.trim(),
        State: site.State.trim(),
        country: site.country.trim(),
        zipCode: site.zipCode === '' ? null : Number(site.zipCode),
        customerId: selectedCustomerId,
      });
      setSubmitted(true);
    } catch {
      setError('Failed to update site.');
    } finally {
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
                <h3 className="fw-bold text-dark mb-1">Update Site #{site.id}</h3>
                <p className="text-muted small mb-0">Modify location details and customer assignment.</p>
              </div>
              <button onClick={() => window.history.back()} className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-left me-1"></i> Back
              </button>
            </div>

            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-4">
                {loading && <p className="text-muted">Loading site details...</p>}
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {submitted && <div className="alert alert-success" role="alert">Site updated successfully.</div>}
                {!loading && !error && 
                <form onSubmit={handleSubmit}>
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">General Information</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark fw-medium small">Site Name *</label>
                      <input
                        type="text"
                        name="siteName"
                        className="form-control"
                        value={site.siteName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark fw-medium small">Customer *</label>
                      <select
                        name="customerId"
                        className="form-select"
                        value={selectedCustomerId}
                        onChange={handleInputChange}
                        required
                      >
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name || c.companyName || c.contactPerson || `Customer ${c.id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark fw-medium small">Apartment / Building</label>
                      <input
                        type="text"
                        name="appartmentName"
                        className="form-control"
                        value={site.appartmentName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark fw-medium small">Floor No</label>
                      <input
                        type="text"
                        name="floorNo"
                        className="form-control"
                        value={site.floorNo}
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
                        value={site.addressDetails}
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
                        value={site.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label text-dark fw-medium small">State *</label>
                      <input
                        type="text"
                        name="state"
                        className="form-control"
                        value={site.State}
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
                        value={site.country}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label text-dark fw-medium small">Zip Code</label>
                      <input
                        type="number"
                        name="zipCode"
                        className="form-control"
                        value={site.zipCode || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 border-top pt-3">
                    <button type="button" onClick={() => window.history.back()} className="btn btn-outline-secondary">
                      Cancel
                    </button>
                    <button type="submit"disabled={saving} className="btn btn-primary px-4">
                      {saving ? 'Updating...' : 'Update Site'}
                    </button>
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

export default UpdateSite;