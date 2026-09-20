import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import API from '../../services/api';

type Customer = {
  id: number | string;
  name?:string;
  companyName?: string;
  contactPerson?:string;
  address?:string;
};
type WorkOrderSummary = {
  id: string | number;
  title: string;
  status: string;
};

type Site = {
  id: number | string;
  siteName: string;
  appartmentName: string;
  floorNo: string;
  addressDetails: string;
  city: string;
  State?: string;
  country: string;
  zipCode: number;
  customer?: Customer;
  customerId?: number | string;
  workOrders?: WorkOrderSummary[];
  workOrderSummary?: WorkOrderSummary[];
};

function SiteManagement() {
  const navigate = useNavigate();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState<string>('');
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const sitesResponse = await API.get<Site[]>('/sites');
        const customersById = new Map<string,Customer>(
        sitesResponse.data.map((customer) => [String(customer.id), customer])
        );
          const updateSites = sitesResponse.data.map((site) =>{
          const customerId = site.customerId ?? site.customer?.id;
          const customer = site.customer??(customerId !== undefined ? customersById.get(String(customerId)):undefined);

          return {
            ...site,customer,
          };
        });
        setSites(updateSites);

        // setSites(sitesResponse.data.map((site) => {
        //   const customerId = site.customerId ?? site.customer?.id;
        //   const customer = site.customer?.companyName || site.customer?.contactPerson
        //     ? site.customer
        //     : customerId !== undefined
        //       ? customersById.get(String(customerId))
        //       : undefined;

        //   return { ...site, customer };
        // }));
      } catch {
        setError('Failed to fetch sites.');
      } finally {
        setLoading(false);
      }
    };

    void fetchSites();
  }, []);

  const handleDeleteSite = async (id: number | string) => {
    if (!window.confirm('Are you sure you want to delete this site?')) return;

    try {
      await API.delete(`/sites/${encodeURIComponent(id)}`);
      setSites((currentSites) => currentSites.filter((site) => site.id !== id));
    } catch {
      setError('Failed to delete site.');
    }
  };

  // Search Filter Logic
  const filteredSites = sites.filter(
    (s) =>
      s.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.customer?.companyName || s.customer?.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex bg-light min-vh-100">
        <Sidebar activeItem='Site Management'/>
        <main className="flex-grow-1 overflow-auto p-3 p-md-4 main-area" style={{ minWidth: 0 }}>
      <div className="row justify-content-center">
        <div className="col-12 col-xl-11">
          
          {/* Header & Controls */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h3 className="fw-bold text-dark mb-1">Manage Sites</h3>
              <p className="text-muted small mb-0">View, add, and inspect customer sites and attached work orders.</p>
            </div>
            
            <button 
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => navigate('/Manager/CreateSite')} aria-label="Add New Site"
            >
              <i className="bi bi-plus-lg"></i>
              Add New Site
            </button>
          </div>

          {/* Main Card Grid */}
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              
              {/* Search Filter Bar */}
              <div className="row mb-4">
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search by site name, city, or customer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Sites Data Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr className="text-muted small border-bottom">
                      <th>Site Name</th>
                      <th>Customer</th>
                      <th>Apartment / Floor</th>
                      <th>City & State</th>
                      <th>Zip Code</th>
                      <th>Work Orders</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-muted small">
                          Loading sites...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-danger small">
                          {error}
                        </td>
                      </tr>
                    ) : filteredSites.length > 0 ? (
                      filteredSites.map((site) => (
                        <tr key={site.id}>
                          <td className="fw-bold text-dark small">{site.siteName}</td>
                          <td className="small text-muted">{site.customer?.name || site.customer?.companyName || site.customer?.contactPerson || '—'}</td>
                          <td className="small text-muted">
                            {site.appartmentName} {site.floorNo ? `(${site.floorNo})` : ''}
                          </td>
                          <td className="small text-muted">{`${site.city}, ${site.State || site.State || ''}`}</td>
                          <td className="small text-muted">{site.zipCode || '—'}</td>
                          <td>
                            <div className="d-flex flex-column align-items-start gap-1">
                              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 fw-medium small">
                                {site.workOrderSummary?.length || site.workOrders?.length || 0} Orders
                              </span>
                              {(site.workOrderSummary || site.workOrders)?.map((workOrder) => (
                                <span key={workOrder.id} className="small text-muted">
                                  {workOrder.status}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() => navigate(`/Manager/UpdateSite/${encodeURIComponent(site.id)}`)} aria-label={`View details for ${site.id}`}><i className="bi bi-eye" />Update
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDeleteSite(site.id)}>
                              <i className="bi bi-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-muted small">
                          No sites found matching your query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>
      </div>
      </main>
    </div>
  );
};

export default SiteManagement;