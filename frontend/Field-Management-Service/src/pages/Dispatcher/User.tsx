import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function User(){
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const UserData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 212 555 0100",
      role: "Technician",
      status: "Active",
    },
    {
      id: 2,
      name: "Mike Smith",
      email: "mike@example.com",
      phone: "+1 212 555 0101",
      role: "Dispatcher",
      status: "Active",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 212 555 0102",
      role: "Technician",
      status: "Active",
    },
    {
      id: 4,
      name: "David Brown",
      email: "david@example.com",
      phone: "+1 212 555 0103",
      role: "Customer",
      status: "Inactive",
    },
    {
      id: 5,
      name: "Chris Wilson",
      email: "chris@example.com",
      phone: "+1 212 555 0104",
      role: "Dispatcher",
      status: "Active",
    },
  ];

  // Search filter logic
  const filteredUsers = UserData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-app">
      <Sidebar activeItem="Technicians" />
      <main className="main-area">
        <div className="bg-light min-vh-100 p-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Technicians</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item text-muted">Home</li>
              <li className="breadcrumb-item active text-muted" aria-current="page">
                Technicians
              </li>
            </ol>
          </nav>
        </div>
        <button type="button" onClick={() => navigate('/Dispatcher/AddTechnician')} className="btn btn-dark px-3" style={{ backgroundColor: "#0B192C" }}>
          + Add Technician
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
                placeholder="Search technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Technicians Data Table */}
          <div className="table-responsive">
            <table className="table align-middle text-nowrap">
              <thead className="table-light border-0">
                <tr className="text-secondary small">
                  <th scope="col" className="fw-semibold">Name</th>
                  <th scope="col" className="fw-semibold">Email</th>
                  <th scope="col" className="fw-semibold">Phone</th>
                  <th scope="col" className="fw-semibold">Role</th>
                  <th scope="col" className="fw-semibold">Status</th>
                  <th scope="col" className="fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-medium text-dark">{user.name}</td>
                    <td className="text-secondary">{user.email}</td>
                    <td className="text-secondary">{user.phone}</td>
                    <td className="text-secondary">{user.role}</td>
                    <td>
                      <span
                        className={`badge rounded-pill px-2 py-1 ${
                          user.status === "Active"
                            ? "bg-success bg-opacity-10 text-success"
                            : "bg-danger bg-opacity-10 text-danger"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-link text-muted p-0 border-0">
                        <i className="bi bi-three-dots"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer & Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
            <span className="text-muted small">Showing 1 to 5 of 24 entries</span>
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
                  <a className="page-link text-dark" href="#!">5</a>
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

export default User;