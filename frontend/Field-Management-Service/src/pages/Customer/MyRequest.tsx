import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import API from '../../services/api';

type WorkOrder ={
  id: number;
  title: string;
  status: string;
  priority: string;
  createdOn: string;
}
function MyRequests(){
  const navigate = useNavigate();
  const [requests, setRequests] = useState<WorkOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadig, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Full dataset for requests
  useEffect(()=>{
  const fetchRequest = async () => {
    try{
      const response = await API.get("/customer/view-request");
      setRequests(response.data);
    }catch(error){
      setError("Error fetching request");
    }finally{
      setLoading(false);
    }
  };
  fetchRequest();
},[]);
  // Filter logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      // req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const getStatusBadgeClass = (status: string): string =>{
     switch(status){
      case "NEW":
        return "bg-primary";
      case "ASSIGN":
        return "bg-info text-dark";
      case "IN_PROGRESS":
        return "bg-warning text-dark";
      case "ON_HOLD":
        return "bg-secondry";
      case "COMPLETED":
        return "bg-success";
      case "CLOSED":
        return "bg-dark";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondry";
     }
  };
  const getPriorityColorClass = (priority: string): string =>{
    switch(priority){
      case "LOW":
        return "bg-success";
      case "MEDIUM":
        return "bg-info text-dark";
      case "HIGH":
        return "bg-warning text-dark";
      case "CRITICAL":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  }

  return (
    <div className="d-flex vh-100 bg-light">
      <Sidebar activeItem="My Requests" />
      <main className="flex-grow-1 overflow-auto">
        <div className="container-fluid py-4 min-vh-100">
        <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              {/* Header Title */}
              <h4 className="fw-bold text-dark mb-4">My Requests</h4>

              {/* Controls Row: Search Bar & Filter Dropdown */}
              <div className="row g-3 align-items-center mb-4">
                <div className="col-12 col-md-8 col-lg-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted pe-1">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-2"
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-4 col-lg-3 ms-auto text-end">
                  <div className="input-group">
                    <label className="input-group-text bg-white text-muted border-end-0" htmlFor="filterSelect">
                      Filter
                    </label>
                    <select
                      id="filterSelect"
                      className="form-select border-start-0"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="NEW">New</option>
                      <option value="ASSIGN">Assign</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CLOSED">Close</option>
                      <option value="CANCELLED">Cancel</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Requests Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-4">
                  <thead>
                    <tr className="text-muted small border-bottom">
                      <th scope="col" className="fw-semibold pb-3">ID</th>
                      <th scope="col" className="fw-semibold pb-3">Title</th>
                      <th scope="col" className="fw-semibold pb-3">Status</th>
                      <th scope="col" className="fw-semibold pb-3">Priority</th>
                      <th scope="col" className="fw-semibold pb-3">Created On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <tr
                          key={request.id}
                          onClick={() => navigate(`/Customer/RequestInfo/${request.id}`)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              navigate(`/Customer/RequestInfo/${request.id}`);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          style={{ cursor: 'pointer' }}
                        >
                          <td className="fw-bold text-dark fs-6">RQ-{request.id}</td>
                          <td className="text-body-secondary">{request.title}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(request.status)} rounded-pill px-3 py-2 fw-normal`}>
                              {request.status}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getPriorityColorClass(request.priority)} rounded-pill px-3 py-2 fw-normal fw-bold`}>
                              {request.priority}
                            </span>
                          </td>
                          <td className="text-muted">{request.createdOn}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                          No requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Row: Entries Count & Pagination */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pt-2">
                <span className="text-muted small mb-3 mb-sm-0">
                  Showing 1 to {filteredRequests.length} of 12 entries
                </span>

                <nav aria-label="Page navigation">
                  <ul className="pagination pagination-sm mb-0 align-items-center">
                    <li className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
                      <button className="page-item btn btn-outline-primary rounded-2 px-3 py-1 me-2" onClick={() => setCurrentPage(1)}>
                        1
                      </button>
                    </li>
                    <li className="page-item">
                      <button className="page-link border-0 text-muted me-1" onClick={() => setCurrentPage(2)}>
                        2
                      </button>
                    </li>
                    <li className="page-item">
                      <button className="page-link border-0 text-muted me-1">
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                    <li className="page-item">
                      <button className="page-link border-0 text-muted">
                        <i className="bi bi-chevron-double-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

            </div>
          </div>
        </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default MyRequests;