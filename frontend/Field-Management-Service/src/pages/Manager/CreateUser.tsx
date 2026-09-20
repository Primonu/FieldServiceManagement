import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import API from '../../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

type Role = 'Manager' | 'Technician' | 'Dispatcher' | 'Customer';

const roles: Array<{ name: Role; icon: string }> = [
  { name: 'Manager', icon: 'bi-shield-lock' },
  { name: 'Technician', icon: 'bi-person-gear' },
  { name: 'Dispatcher', icon: 'bi-headset' },
  { name: 'Customer', icon: 'bi-building' },
];

function CreateUser() {
  const [role, setRole] = useState<Role>('Manager');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    userEmail: '',
    phone: '',
    password: '',
    role: 'MANAGER',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;

    const timer = window.setTimeout(() => {
      setError('');
    }, 3000);

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
      await API.post('/user_auth/register', {
        ...formData,
      });
      setSubmitted(true);
      setFormData({ fname: '', lname: '', userEmail: '', phone: '', password: '', role: 'MANAGER' });
      setRole('Manager');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data;
        const backendMessage = typeof responseData === 'string'
          ? responseData
          : responseData?.message || responseData?.error;

        setError(
          backendMessage ||
            `Registration failed${err.response?.status ? ` (${err.response.status})` : ''}. Please try again.`,
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-app">
    <Sidebar activeItem="User Management"/>
    <main className="main-area">
        <div className="bg-light min-vh-100 p-4">
          <div className='row justify-content-center'>
            <div className='col-12 col-xl-8'>
              <div className='d-flex justify-content-between align-items-center mb-4'>
                <div>
            <h2 className="fw-bold text-dark mb-1">Create User</h2>
            <nav aria-label="breadcrumb">
              <ol className='breadcrumb mb-0 small'>
                <li className='breadcrumb-item text-muted'>Home</li>
                <li className='breadcrumb-item'>User</li>
                <li className='breadcrumb-item active text-muted'aria-current="page">Add User</li>
              </ol>
            </nav>
            </div>
            </div>
          <div className='card border-0 shadow-sm rounded-3 p-4'>
            <div className='card-body'>
              <div className='d-flex align-items-center gap-3 mb-4'>
                <div className='bg-primary-subtle text-primary rounded-3 p-3'>
                  <i className='bi bi-building-add fs-4'/>
                </div>
                <div>
                  <h5 className='fw-bold text-dark mb-1'>User Information</h5>
                </div>
              </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="fname" className="form-label small fw-semibold text-secondary">
                  FIRST NAME
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                  <i className="bi bi-person" aria-hidden="true" /></span>
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

              <div className="col-md-6">
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
                SECURE PASSWORD
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
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
              <legend className="form-label small fw-semibold text-secondary mb-2 fs-6">PRIMARY ROLE</legend>
              <div className="row g-2">
                {roles.map((item) => (
                  <div className="col-6 col-sm-4" key={item.name}>  
                  <button
                    type="button"
                    key={item.name}
                    className={`btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 ${role === item.name ? 'btn-primary' : 'btn-outline-secondary'}`}
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

            <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3" disabled={loading}>
              <span>{loading ? 'Creating...' : 'Create Account'}</span>
              <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>

            {error && (
              <div className="alert alert-danger mt-3 mb-0" role="alert">
                {error}
              </div>
            )}

            {submitted && (
              <div className="alert alert-success mt-3 mb-0" role="status">
                User form submitted for the <strong>{role}</strong> role.
              </div>
            )}
          </form>
        </div>
        </div>
        </div>
        </div>
        </div>
    </main>
    </div>
  );
}

export default CreateUser;
