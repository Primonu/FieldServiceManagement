import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './Registration.css'
import API from '../../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Role = 'Manager' | 'Technician' | 'Dispatcher' | 'Customer';

const roles: Array<{ name: Role; icon: string }> = [
  { name: 'Manager', icon: 'bi-shield-lock' },
  { name: 'Technician', icon: 'bi-person-gear' },
  { name: 'Dispatcher', icon: 'bi-headset' },
  { name: 'Customer', icon: 'bi-building' },
];

function RegisterPage() {
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
    <main className="registration-page">
      <section className="brand-panel">
        <div className="brand-image" aria-hidden="true" />
        <div className="grid-overlay" aria-hidden="true" />

        <div className="brand-content">
          <div className="brand-mark">
            <span className="brand-symbol" aria-hidden="true">
              <i className="bi bi-bezier2" />
            </span>
            <span className="brand-name">KEYSTONE</span>
          </div>

          <div className="brand-copy">
            <h1>Join the Platform</h1>
            <p>
              Empower your field operations with industrial intelligence.
              Connect your workforce to real-time data and precision workflows.
            </p>
          </div>
        </div>
      </section>

      <section className="form-panel">
        <div className="form-shell">
          <header className="form-header">
            <h2>Create Your Account</h2>
            <p>Enter your details to get started with Keystone.</p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="fname" className="form-label">
                  FIRST NAME
                </label>
                <div className="input-wrap">
                  <i className="bi bi-person" aria-hidden="true" />
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
                <label htmlFor="lname" className="form-label">
                  LAST NAME
                </label>
                <div className="input-wrap">
                  <i className="bi bi-person-badge" aria-hidden="true" />
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

            <div className="field-group">
              <label htmlFor="userEmail" className="form-label">
                WORK EMAIL
              </label>
              <div className="input-wrap">
                <i className="bi bi-envelope" aria-hidden="true" />
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

            <div className="field-group">
              <label htmlFor="phone" className="form-label">
                PHONE NUMBER
              </label>
              <div className="input-wrap">
                <i className="bi bi-telephone" aria-hidden="true" />
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

            <div className="field-group">
              <label htmlFor="password" className="form-label">
                SECURE PASSWORD
              </label>
              <div className="input-wrap">
                <i className="bi bi-lock" aria-hidden="true" />
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

            <fieldset className="field-group role-field">
              <legend className="form-label">PRIMARY ROLE</legend>
              <div className="role-grid">
                {roles.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    className={`role-option ${role === item.name ? 'selected' : ''}`}
                    onClick={() => handleRoleChange(item.name)}
                    aria-pressed={role === item.name}
                  >
                    <i className={`bi ${item.icon}`} aria-hidden="true" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <button type="submit" className="register-button" disabled={loading}>
              <span>{loading ? 'Registering...' : 'Register'}</span>
              <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>

            {error && (
              <div className="alert alert-danger register-alert" role="alert">
                {error}
              </div>
            )}

            {submitted && (
              <div className="alert alert-success register-alert" role="status">
                Registration form submitted for the <strong>{role}</strong> role.
              </div>
            )}
          </form>

          <p className="signin-text">
            Already have an account?{' '}
            <button type="button" className="signin-link" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
