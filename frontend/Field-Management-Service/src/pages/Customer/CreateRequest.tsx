import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Sidebar from './Sidebar';
import API from '../../services/api';

type Site = {
  id: string | number;
  siteName: string;
  addressDetails?: string;
  city?: string;
  customerId?: string | number;
  customer?: { id: string | number; customerId?: string | number };
};

type RequestFormData = {
  location:string;
  issueTitle: string;
  description: string;
  priority: string;
  // files: File[];
};

function CreateRequest(){
  const [formData, setFormData] = useState<RequestFormData>({
    location: '',
    issueTitle: '',
    description: '',
    priority: '',
    // files: []
  });
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await API.get<Site[]>('/sites');
        setSites(response.data);
      } catch {
        setError('Failed to fetch customer locations.');
      } finally {
        setLoadingSites(false);
      }
    };

    void fetchSites();
  }, []);

  const maxCharLimit = 1000;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > maxCharLimit) return;
    setFormData((prev) => ({ ...prev, [name as keyof Omit<RequestFormData, 'files'>]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({ ...prev, files: uploadedFiles }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSubmitted(false);
    setError('');

    const selectedSite = sites.find((site) => String(site.id) === formData.location);
    if (!selectedSite) {
      setError('Please select a location.');
      setSaving(false);
      return;
    }

    const customerId = selectedSite.customerId
      ?? selectedSite.customer?.id
      ?? selectedSite.customer?.customerId;
    if (customerId === undefined || customerId === null || customerId === '') {
      setError('The selected location has no customer assigned.');
      setSaving(false);
      return;
    }

    try {
      const requestData = {
        customerId: Number(
          selectedSite?.customerId ?? selectedSite?.customer?.id
        ),
        siteId: Number(selectedSite?.id),
        title: formData.issueTitle,
        description: formData.description,
        priority: formData.priority
      };
      await API.post('/customer/raise-request',requestData); 
        // attachments: formData.files.map((file) => file.name),
      setSubmitted(true);
      setFormData({ location: '', issueTitle: '', description: '', priority: ''});
    } catch {
      setError('Failed to submit request.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex vh-100 bg-light">
      <Sidebar activeItem="Create Request" />
      <main className="flex-grow-1 overflow-auto">
        <div className="container-fluid py-4 min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          
          {/* Page Header & Breadcrumbs */}
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Create Request</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="#home" className="text-decoration-none text-muted">Home</a>
                </li>
                <li className="breadcrumb-item active text-muted" aria-current="page">
                  Create Request
                </li>
              </ol>
            </nav>
          </div>

          {/* Request Form Card */}
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              <h5 className="fw-bold text-dark mb-4">Request Information</h5>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              {submitted && <div className="alert alert-success" role="alert">Request submitted successfully.</div>}

              <form onSubmit={handleSubmit}>
                {/* Issue Title Input */}
                <div className="mb-3">
                  <label htmlFor="issueTitle" className="form-label fw-medium small">
                    Issue Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="issueTitle"
                    name="issueTitle"
                    className="form-control"
                    placeholder="Enter a short title"
                    value={formData.issueTitle}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Site / Location Dropdown */}
                <div className="mb-3">
                  <label htmlFor="location" className="form-label fw-medium small">
                    Site / Location <span className="text-danger">*</span>
                  </label>
                  <select
                    id="location"
                    name="location"
                    className="form-select text-muted"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled hidden>
                      {loadingSites ? 'Loading locations...' : 'Select location'}
                    </option>
                    {sites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.siteName}{site.city ? ` - ${site.city}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description Textarea */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-medium small">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="form-control"
                    placeholder="Describe your issue in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div className="text-end text-muted small mt-1">
                    {formData.description.length}/{maxCharLimit}
                  </div>
                </div>

                {/* Priority Dropdown */}
                <div className="mb-4">
                  <label htmlFor="priority" className="form-label fw-medium small">
                    Priority <span className="text-danger">*</span>
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="form-select text-muted"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled hidden>Select priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                {/* Attachments Section */}
                {/* <div className="mb-4">
                  <label className="form-label fw-medium small">Attachments</label>
                  <div className="border border-2 border-dashed rounded-3 p-4 text-center bg-light position-relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                      style={{ cursor: 'pointer' }}
                    />
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                      <i className="bi bi-upload text-primary"></i>
                      <span className="text-primary fw-medium small">
                        Upload files or drag and drop
                      </span>
                    </div>
                    <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                      JPG, PNG, PDF up to 10MB
                    </small>
                  </div>
                  {formData.files.length > 0 && (
                    <ul className="list-unstyled mt-2 mb-0">
                      {formData.files.map((file, idx) => (
                        <li key={idx} className="small text-muted">
                          <i className="bi bi-file-earmark me-1"></i>
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div> */}

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-2 pt-2">
                  <button type="button" className="btn btn-outline-secondary px-4">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving || loadingSites} className="btn btn-primary px-4">
                    {saving ? 'Submitting...' : 'Submit Request'}
                  </button>
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
};

export default CreateRequest;