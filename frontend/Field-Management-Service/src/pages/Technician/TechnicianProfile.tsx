import { useState, type ChangeEvent, type FormEvent } from "react";

function TechnicianProfile(){
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@keystone.com",
    phone: "+1 212 555 0100",
    skills: "HVAC, Electrical, Plumbing",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updated Profile Data:", formData);
  };

  return (
    <div className="bg-light min-vh-100 p-4 d-flex justify-content-center">
      <div style={{ maxWidth: "750px", width: "100%" }}>
        {/* Header */}
        <div className="mb-4">
          <h4 className="fw-bold text-dark m-0">Profile</h4>
        </div>

        {/* Profile Card Container */}
        <div className="card border-0 shadow-sm p-4">
          <div className="card-body">
            <div className="row g-4 align-items-start">
              {/* Left Column: Avatar & Quick Info */}
              <div className="col-md-4 text-center border-end-md pe-md-4">
                <div className="position-relative d-inline-block mb-3">
                  <img
                    src="https://via.placeholder.com/120"
                    alt="John Doe"
                    className="rounded-circle object-fit-cover shadow-sm"
                    style={{ width: "120px", height: "120px" }}
                  />
                </div>
                <h5 className="fw-bold text-dark mb-1">{formData.fullName}</h5>
                <p className="text-muted small mb-3">Technician</p>

                <div className="d-flex flex-column gap-2 text-start pt-2 border-top">
                  <div className="d-flex align-items-center text-muted small">
                    <i className="bi bi-person me-2 text-secondary"></i>
                    <span className="text-truncate">{formData.email}</span>
                  </div>
                  <div className="d-flex align-items-center text-muted small">
                    <i className="bi bi-telephone me-2 text-secondary"></i>
                    <span>{formData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Editable Profile Details */}
              <div className="col-md-8 ps-md-4">
                <form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-semibold mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control text-dark bg-light border-light-subtle"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-semibold mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control text-dark bg-light border-light-subtle"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label small text-muted fw-semibold mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control text-dark bg-light border-light-subtle"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <label className="form-label small text-muted fw-semibold mb-1">
                      Skills
                    </label>
                    <input
                      type="text"
                      className="form-control text-dark bg-light border-light-subtle"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    style={{ backgroundColor: "#004085", borderColor: "#004085" }}
                  >
                    Edit Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfile;