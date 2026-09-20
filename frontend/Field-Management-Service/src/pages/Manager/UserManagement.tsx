import { useEffect, useState } from 'react';
import API from '../../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

type User ={
  id: number;
  fname: string;
  lname: string;
  userEmail: string;
  phone: string;
  role: 'MANAGER' | 'TECHNICIAN' | 'DISPATCHER' | 'CUSTOMER';
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Clear auto-dismissing error banner
  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => {
      setError('');
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [error]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/user_auth');
      setUsers(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data;
        const backendMessage = typeof responseData === 'string'
          ? responseData
          : responseData?.message || responseData?.error;

        setError(
          err.response?.status === 403
            ? backendMessage || 'Access denied. Your account does not have permission to view users.'
            : backendMessage ||
              `Failed to load users${err.response?.status ? ` (${err.response.status})` : ''}. Please try again.`
        );
      } else {
        setError('An unexpected error occurred while fetching users.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await API.delete(`/user_auth/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data;
        const backendMessage = typeof responseData === 'string'
          ? responseData
          : responseData?.message || responseData?.error;

        setError(backendMessage || 'Failed to delete user.');
      } else {
        setError('An unexpected error occurred while deleting user.');
      }
    }
  };

  // Helper badge color utility for roles
  const getRoleBadgeClass = (role: User['role']) => {
    switch (role) {
      case 'MANAGER':
        return 'bg-danger-subtle text-danger border-danger-subtle';
      case 'TECHNICIAN':
        return 'bg-info-subtle text-info border-info-subtle';
      case 'DISPATCHER':
        return 'bg-warning-subtle text-warning border-warning-subtle';
      case 'CUSTOMER':
        return 'bg-success-subtle text-success border-success-subtle';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  };

  // Search & Filter Logic
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.fname} ${user.lname}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="dashboard-page d-flex min-vh-100">
      <Sidebar activeItem="User Management" />
      <main className="flex-grow-1 bg-light p-4 overflow-auto main-area">
        <section className="mx-auto" style={{ maxWidth: '1000px' }}>
          
          {/* Header & Controls */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h2 className="h3 fw-bold text-dark mb-1">User Management</h2>
              <p className="text-muted small mb-0">Manage registered system accounts and role permissions.</p>
            </div>
            
            <button 
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => navigate('/Manager/CreateUser')}
            >
              <i className="bi bi-person-plus-fill" aria-hidden="true" />
              <span>Create User</span>
            </button>
          </div>

          {/* Main Card */}
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-4">
              
              {/* Filter Controls Bar */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <i className="bi bi-search" aria-hidden="true" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <select
                    className="form-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="ALL">All Roles</option>
                    <option value="MANAGER">Manager</option>
                    <option value="TECHNICIAN">Technician</option>
                    <option value="DISPATCHER">Dispatcher</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading users...</span>
                  </div>
                  <p className="text-muted small mt-2">Loading user directory...</p>
                </div>
              ) : (
                /* Data Table */
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr className="text-muted small border-bottom">
                        <th>USER</th>
                        <th>WORK EMAIL</th>
                        <th>PHONE</th>
                        <th>ROLE</th>
                        <th className="text-end">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div 
                                  className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center"
                                  style={{ width: '36px', height: '36px', fontSize: '14px' }}
                                >
                                  {user.fname?.[0]}{user.lname?.[0]}
                                </div>
                                <div>
                                  <span className="fw-semibold text-dark d-block">
                                    {user.fname} {user.lname}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="small text-secondary">{user.userEmail}</td>
                            <td className="small text-secondary">{user.phone || '—'}</td>
                            <td>
                              <span className={`badge border px-2.5 py-1 fw-semibold rounded-pill small ${getRoleBadgeClass(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary me-2"
                                title="Edit User"
                                onClick={() => navigate(`/Manager/EditUser/${user.id}`)}
                              >
                                <i className="bi bi-pencil" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                title="Delete User"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <i className="bi bi-trash" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-5 text-muted small">
                            No users found matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserManagement;