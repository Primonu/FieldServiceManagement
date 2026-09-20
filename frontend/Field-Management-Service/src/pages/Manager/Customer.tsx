import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import API from "../../services/api";

type Customer = {
  id: string | number,
  companyName:string,
  contactPerson:string,
  email:string,
  phone:string,
  address: string,
  active: boolean,
  
}
function Customers(){
  const navigate = useNavigate();
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get<Customer[]>('/customer/all');
        setCustomersData(response.data);
      } catch {
        setError('Failed to fetch customers.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);
  
  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Delete customer?")) return;

    try {
      await API.delete(`/customer/${encodeURIComponent(id)}`);
      setCustomersData((customers) => customers.filter((customer) => customer.id !== id));
    } catch {
      setError('Failed to delete customer.');
    }
  };


  // Search filter logic
  const filteredCustomers = customersData.filter(
    (customer) =>
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-app d-flex bg-light min-vh-100" style={{minWidth:0}}>
      <Sidebar activeItem="Customers" />
      <main className="main-area">
        <div className="bg-light min-vh-100 p-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Customers</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item text-muted">Home</li>
              <li className="breadcrumb-item active text-muted" aria-current="page">
                Customers
              </li>
            </ol>
          </nav>
        </div>
        <button type="button" onClick={() => navigate('/Manager/AddCustomer')} className="btn btn-dark px-3" style={{ backgroundColor: "#0B192C" }}>
          + Add Customer
        </button>
      </div>

      {/* Main Table Card */}
      <div className="card border-0 shadow-sm p-3">
        <div className="card-body">
          {/* Search Input Bar */}
          <div className="mb-4">
            <div className="input-group" style={{ maxWidth: "400px" }}>
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Customers Data Table */}
          <div className="table-responsive">
            <table className="table align-middle text-nowrap">
              <thead className="table-light border-0">
                <tr className="text-secondary small">
                  <th scope="col" className="fw-semibold">Company Name</th>
                  <th scope="col" className="fw-semibold">Contact Person</th>
                  <th scope="col" className="fw-semibold">Email</th>
                  <th scope="col" className="fw-semibold">Phone</th>
                  <th scope="col" className="fw-semibold text-end">Address</th>
                  
                  <th scope="col" className="fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">Loading customers...</td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={7} className="text-center text-danger py-4">{error}</td>
                  </tr>
                )}
                {!loading && !error && filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">No customers found.</td>
                  </tr>
                )}
                {!loading && !error && filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="fw-medium text-dark">{customer.companyName}</td>
                    <td className="text-secondary">{customer.contactPerson}</td>
                    <td className="text-secondary">{customer.email}</td>
                    <td className="text-secondary">{customer.phone}</td>
                    <td className="text-end">{customer.address}</td>
                    
                    <td className="text-end">
                      <button className="btn btn-link text-muted p-0 border-0"
                        onClick={() => navigate(`/Manager/EditCustomer/${encodeURIComponent(customer.id)}`)}>
                        <i className="bi bi-three-dots"></i>Update
                      </button>
                      <button className="btn btn-link text-danger p-0 border-0 ms-2" onClick={() => handleDelete(customer.id)}>
                        <i className="bi bi-trash"></i>Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer & Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
            <span className="text-muted small">
              Showing {filteredCustomers.length} of {customersData.length} customers
            </span>
            <nav aria-label="Page navigation">
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item active">
                  <span className="page-link">1</span>
                </li>
                <li className="page-item">
                  <a className="page-link text-dark" href="#!">2</a>
                </li>
                <li className="page-item">
                  <a className="page-link text-dark" href="#!">3</a>
                </li>
                <li className="page-item">
                  <a className="page-link text-dark" href="#!">9</a>
                </li>
                <li className="page-item">
                  <a className="page-link text-dark" href="#!">&gt;</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
};

export default Customers;