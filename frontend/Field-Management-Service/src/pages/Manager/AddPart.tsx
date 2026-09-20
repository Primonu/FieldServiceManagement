import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import API from '../../services/api';

function AddPart(){
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    unitCost: '',
    stockQty: '',
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setError('');
    setSubmitted(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await API.post('parts', {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        unitCost: Number(formData.unitCost),
        stockQty: Number(formData.stockQty),
      });
      setSubmitted(true);
      setFormData({ sku: '', name: '', unitCost: '', stockQty: '' });
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 403) {
        setError('You do not have the ADD_PARTS permission. Please sign in with an authorized manager account.');
      } else if (axios.isAxiosError(requestError) && requestError.response?.data?.message) {
        setError(requestError.response.data.message);
      } else {
        setError('Unable to add this part. Please check the details and try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell d-flex bg-ligh min-vh-100">
      <Sidebar activeItem='Parts & Inventory'/>
      <main className="main d-flex justify-content-center align-items-start py-4 bg-light"style={{minWidth:0}}>
        <div className="card border-0 shadow-sm w-100 overflow-hidden" style={{ maxWidth: 600 }}>
          <div className="text-dark p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white bg-opacity-25 rounded-3 p-3">
                <i className="bi bi-box-seam fs-4" />
              </div>
              <div>
                <h1 className="h4 fw-bold mb-1">Add New Part</h1>
                <p className="small mb-0 text-dark-50">Add an item to your inventory catalog.</p>
              </div>
            </div>
          </div>

          <div className="card-body p-4 p-md-5">
            <div className="d-flex align-items-center gap-2 mb-4">
              <span className="badge text-bg-primary rounded-pill">Part details</span>
              <span className="small text-secondary">All fields are required</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark"><i className="bi bi-upc-scan me-2" />SKU Code</label>
                <input type="text" placeholder="e.g. KST-HVAC-102" className="form-control" value={formData.sku} onChange={(event) => handleChange('sku', event.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark"><i className="bi bi-tag me-2" />Part Name</label>
                <input type="text" placeholder="e.g. Dual Run Capacitor" className="form-control" value={formData.name} onChange={(event) => handleChange('name', event.target.value)} required />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark"><i className="bi bi-currency-dollar me-2" />Unit Cost</label>
                  <input type="number" min="0" step="0.01" placeholder="0.00" className="form-control" value={formData.unitCost} onChange={(event) => handleChange('unitCost', event.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark"><i className="bi bi-boxes me-2" />Initial Stock Qty</label>
                  <input type="number" min="0" placeholder="0" className="form-control" value={formData.stockQty} onChange={(event) => handleChange('stockQty', event.target.value)} required />
                </div>
              </div>

              {error && <div className="alert alert-danger d-flex align-items-center gap-2 mt-4 mb-0"><i className="bi bi-exclamation-triangle-fill" />{error}</div>}
              {submitted && <div className="alert alert-success d-flex align-items-center gap-2 mt-4 mb-0"><i className="bi bi-check-circle-fill" />Part added to inventory.</div>}
              <div className="d-flex justify-content-end gap-2 bg-light rounded-3 mt-4 p-3">
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/Manager/Inventory')}>Cancel</button>
                <button type="submit" className="btn btn-primary px-4" disabled={saving}><i className={`bi ${saving ? 'bi-arrow-repeat' : 'bi-check2'} me-2`} />{saving ? 'Saving...' : 'Save Part'}</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
export default AddPart;
