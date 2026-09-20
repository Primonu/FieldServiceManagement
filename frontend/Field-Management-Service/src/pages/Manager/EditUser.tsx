import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import API from '../../services/api';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

type Role = 'Manager' | 'Technician' | 'Dispatcher' | 'Customer';

const roles: Array<{ name: Role; icon: string }> = [
  { name: 'Manager', icon: 'bi-shield-lock' },
  { name: 'Technician', icon: 'bi-person-gear' },
  { name: 'Dispatcher', icon: 'bi-headset' },
  { name: 'Customer', icon: 'bi-building' },
];

function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>('Manager');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    userEmail: '',
    phone: '',
    password: '',
    role: 'MANAGER',
  });

  // Fetch target user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.get(`/user_auth/users/${id}`);
        const userData = response.data;

        setFormData({
          fname: userData.fname || '',
          lname: userData.lname || '',
          userEmail: userData.userEmail || '',
          phone: userData.phone || '',
          password: '', // Leave blank unless user wishes to change it
          role: userData.role || 'MANAGER',
        });

        // Set local UI role state for button highlight
        const matchedRole = roles.find(
          (r) => r.name.toUpperCase() === userData.role
        );
        if (matchedRole) {
          setRole(matchedRole.name);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const responseData = err.response?.data;
          const backendMessage =
            typeof responseData === 'string'
              ? responseData
              : responseData?.message || responseData?.error;
          setError(backendMessage || 'Failed to fetch user details.');
        } else {
          setError('An unexpected error occurred while loading user details.');
        }
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  // Auto-dismiss errors after 3 seconds
  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(''), 3000);
    return () => window.clearTimeout(timer);
  }, [error]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleRoleChange = (selectedRole: Role) => {
    setRole(selectedRole);
    setFormData((previous) => ({
      ...previous,
      role: selectedRole.toUpperCase(),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);
    setError('');
    setLoading(true);

    try {
      // Exclude empty password if not modified
      const payload = { ...formData };
      if (!payload.password) {
        delete (payload as Partial<typeof payload>).password;
      }

      await API.put(`/user_auth/users/${id}`, payload);
      setSubmitted(true);
      setTimeout(() => navigate('/users'), 1500); // Redirect back to list page after success
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data;
        const backendMessage =
          typeof responseData === 'string'
            ? responseData
            : responseData?.message || responseData?.error;

        setError(
          backendMessage ||
            `Update failed${err.response?.status ? ` (${err.response.status})` : ''}. Please try again.`
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page d-flex min-vh-100">
      <Sidebar activeItem='User Management'/>
      <main className="registration-page flex-grow-1 bg-light p-4">
        <section className="form-panel mx-auto" style={{ maxWidth: '700px' }}>
          <div className="form-shell card shadow-sm border-0 p-4 rounded-3">
            
            <header className="form-header mb-4 border-bottom pb-2 d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h3 fw-bold text-dark mb-0">Edit User</h2>
                <small className="text-muted">User ID: #{id}</small>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => navigate('/users')}
              >
                Cancel
              </button>
            </header>

            {fetching ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="fname" className="form-label small fw-semibold text-secondary">
                      FIRST NAME
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted">
                        <i className="bi bi-person" aria-hidden="true" />
                      </span>
                      <input
                        id="fname"
                        name="fname"
                        type="text"
                        className="form-control"
                        autoComplete="given-name"
                        value={formData.fname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="lname" className="form-label small fw-semibold text-secondary">
                      LAST NAME
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted">
                        <i className="bi bi-person-badge" aria-hidden="true" />
                      </span>
                      <input
                        id="lname"
                        name="lname"
                        type="text"
                        className="form-control"
                        autoComplete="family-name"
                        value={formData.lname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="userEmail" className="form-label small fw-semibold text-secondary">
                    WORK EMAIL
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <i className="bi bi-envelope" aria-hidden="true" />
                    </span>
                    <input
                      id="userEmail"
                      name="userEmail"
                      type="email"
                      className="form-control"
                      placeholder="name@company.com"
                      autoComplete="email"
                      value={formData.userEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label small fw-semibold text-secondary">
                    PHONE NUMBER
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <i className="bi bi-telephone" aria-hidden="true" />
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="form-control"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label small fw-semibold text-secondary">
                    PASSWORD <span className="text-muted fw-normal">(Leave blank to keep unchanged)</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <i className="bi bi-lock" aria-hidden="true" />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control password-input"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} />
                    </button>
                  </div>
                </div>

                <fieldset className="mb-4 border-0 p-0">
                  <legend className="form-label small fw-semibold text-secondary mb-2 fs-6">
                    PRIMARY ROLE
                  </legend>
                  <div className="row g-2">
                    {roles.map((item) => (
                      <div className="col-6 col-sm-4" key={item.name}>
                        <button
                          type="button"
                          className={`btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 ${
                            role === item.name ? 'btn-primary' : 'btn-outline-secondary'
                          }`}
                          onClick={() => handleRoleChange(item.name)}
                          aria-pressed={role === item.name}
                        >
                          <i className={`bi ${item.icon}`} aria-hidden="true" />
                          <span>{item.name}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </fieldset>

                <div className="d-flex gap-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-50 py-2"
                    onClick={() => navigate('/users')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary w-50 py-2 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    <i className="bi bi-check-lg" aria-hidden="true" />
                  </button>
                </div>

                {error && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {error}
                  </div>
                )}

                {submitted && (
                  <div className="alert alert-success mt-3 mb-0" role="status">
                    User updated successfully! Redirecting...
                  </div>
                )}
              </form>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}

export default EditUser;