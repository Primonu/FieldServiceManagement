import { useEffect, useState, type FormEvent } from "react";
import API from "../../services/api";
import Sidebar from "./Sidebar";

type Customer ={
    id: number;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
};
type Site = {
  id: string | number;
  siteName: string;
  addressDetails?: string;
  city?: string;
  State?: string;
  country?: string;
  customerId?: string | number;
};

type WorkOrderFormData = {
  customerId: number | "",
  siteId: number | "",
  title: string;
  description: string;
  priority: string;
  // files: File[];
};

function CreateWorkOrder(){
  const [formData, setFormData] = useState<WorkOrderFormData>({
    customerId: '',
    siteId: '',
    title: '',
    description: '',
    priority: '',
    // files: []
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingSites, setLoadingSites] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState('');

  useEffect(() => {
    if (!error) return;

    const timer = window.setTimeout(() => {
      setError('');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get<Customer[]>('/customer/all');
        setCustomers(response.data);
      } catch {
        setError('Failed to fetch customer');
      } finally {
        setLoadingCustomer(false);
      }
    };

    void fetchCustomers();
  }, []);
  //fetch site when customer changes
  useEffect(()=>{
    if(!formData.customerId){
        setSites([]);
        return;
    }
    const fetchSites = async () =>{
        try{
            setLoadingSites(true);
            setError("");
            
            const response = await API.get<Site[]>(`/sites/customer/${formData.customerId}`);
            setSites(response.data);
        }catch{
            setError("Failed to fetch sites.");
        }finally{
            setLoadingSites(false);
        }
    };
    fetchSites();
  },[formData.customerId]);

  const maxCharLimit = 1000;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) =>{
    const {name, value} = e.target;
    setFormData({
        ...formData,
        [name]:value,
    });
  };
  //customer change
  const handleCustomerChange = (
    e:React.ChangeEvent<HTMLSelectElement>
  ) =>{
    const customerId = e.target.value;
    setFormData({
        ...formData,customerId: customerId ? Number(customerId) : "",
        siteId: '',
    });
    setSites([]);
    setSuccess("");
    setError('');
  };

  const handleSiteChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  )=>{
    setFormData({
        ...formData, siteId: e.target.value ? Number(e.target.value) : "",
    });
  };
  //create workOrder
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if(!formData.customerId){
        setError("Please select a customer.");
        return;
    }
    if(!formData.siteId){
        setError("Please select a site.");
        return;
    }
    if(!formData.title.trim()){
        setError("Please enter work order title.");
        return;
    }
    if(!formData.description.trim()){
        setError("Please enter description.");
        return;
    }
    if(!formData.priority){
        setError("Please select priority");
        return;
    }

    try {
      setSaving(true);
      const requestData = {
        customer: {id: Number(formData.customerId),active: true},
        site: {id: Number(formData.siteId)},
        title: formData.title,
        description: formData.description,
        priority: formData.priority
      };
      await API.post('/work-orders',requestData); 
      setSuccess("Work order created successfully.");
      setFormData({
        customerId: "",
        siteId: '',
        title: '',
        description: '',
        priority:'',
      });
      setSites([]);
    } catch {
      setError('Failed to submit request.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex vh-100 bg-light">
      <Sidebar activeItem="Work Orders" />
      <main className="flex-grow-1 overflow-auto">
        <div className="container-fluid py-4 min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          
          {/* Page Header & Breadcrumbs */}
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">Create Work Order</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="#home" className="text-decoration-none text-muted">Home</a>
                </li>
                <li className="breadcrumb-item active text-muted" aria-current="page">
                  Create Work
                </li>
              </ol>
            </nav>
          </div>

          {/* Request Form Card */}
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              <h5 className="fw-bold text-dark mb-4">Work Information</h5>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              {success && <div className="alert alert-success" role="alert">{success}</div>}

              <form onSubmit={handleSubmit}>
                {/*Customer*/}
                <div className="mb-3">
                  <label className="form-label fw-medium small">
                    Customer <span className="text-danger">*</span>
                  </label>
                  <select
                  className="form-select text-muted"value={formData.customerId}onChange={handleCustomerChange}disabled={loadingCustomer}
                  >
                    <option value="">
                        {loadingCustomer ? "Loading customer...":"Select Customer"}
                    </option>
                    {customers.map((customer) =>(
                        <option key={customer.id}value={customer.id}>
                            {customer.companyName},{customer.contactPerson}
                        </option>
                    ))}
                  </select>
                </div>
                {/* Site / Location Dropdown */}
                <div className="mb-3">
                  <label className="form-label fw-medium small">
                    Sites <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select text-muted"
                    value={formData.siteId}
                    onChange={handleSiteChange}disabled={!formData.customerId || loadingSites}
                  >
                    <option value="">
                      {!formData.customerId ? 'Select customer first' : loadingSites ? 'Loading sites...' : "Select site"}
                    </option>
                    {sites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.siteName}{site.city ? ` - ${site.city}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Issue Title Input */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-medium small">
                    Issue Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Enter a short title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
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
                    {saving ? 'Creating...' : 'Create Work Order'}
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
export default CreateWorkOrder;