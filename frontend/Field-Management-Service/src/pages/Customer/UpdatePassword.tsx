import { useState, type ChangeEvent, type FormEvent } from 'react';
import Sidebar from './Sidebar';

type Passwords = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordVisibilityField = 'current' | 'new' | 'confirm';

function ChangePassword() {
  const [passwords, setPasswords] = useState<Passwords>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Toggle state for password visibility
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name as keyof Passwords]: value }));
  };

  const toggleVisibility = (field: PasswordVisibilityField) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Password updated successfully');
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar Navigation */}
      <Sidebar activeItem="Change Password" />

      {/* Main Content Area */}
      <main className="flex-grow-1 overflow-auto p-4">
        {/* Breadcrumb Header */}
        <div className="mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item"><a href="#home" className="text-decoration-none text-muted small">Home</a></li>
              <li className="breadcrumb-item"><a href="#profile" className="text-decoration-none text-muted small">My Profile</a></li>
              <li className="breadcrumb-item active small text-muted" aria-current="page">Change Password</li>
            </ol>
          </nav>
          <h3 className="fw-bold text-dark">Change Password</h3>
        </div>

        {/* Change Password Card */}
        <div className="card border-0 shadow-sm rounded-3 p-3" style={{ maxWidth: '650px' }}>
          <div className="card-body">
            <form onSubmit={handleSubmit}>

              {/* Current Password Input */}
              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label fw-medium small text-dark">
                  Current Password
                </label>
                <div className="input-group">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    className="form-control border-end-0"
                    placeholder="Enter current password"
                    value={passwords.currentPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0 text-muted"
                    onClick={() => toggleVisibility('current')}
                  >
                    <i className={`bi ${showPasswords.current ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* New Password Input */}
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label fw-medium small text-dark">
                  New Password
                </label>
                <div className="input-group">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    className="form-control border-end-0"
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0 text-muted"
                    onClick={() => toggleVisibility('new')}
                  >
                    <i className={`bi ${showPasswords.new ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Confirm New Password Input */}
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label fw-medium small text-dark">
                  Confirm New Password
                </label>
                <div className="input-group">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control border-end-0"
                    placeholder="Confirm new password"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0 text-muted"
                    onClick={() => toggleVisibility('confirm')}
                  >
                    <i className={`bi ${showPasswords.confirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button type="submit" className="btn btn-primary w-100 fw-medium py-2 rounded-2">
                  Update Password
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;