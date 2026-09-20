import { useState, type FormEvent } from "react";

function HoldJobForm(){
  const [reason, setReason] = useState("Waiting for Parts");
  const [notes, setNotes] = useState(
    "Waiting for compatible capacitor from store."
  );
  const [resumeDate, setResumeDate] = useState("2024-05-19");
  const [resumeTime, setResumeTime] = useState("10:00");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Job Held:", {
      reason,
      notes,
      resumeDate,
      resumeTime,
    });
  };

  return (
    <div className="bg-light min-vh-100 p-4 d-flex justify-content-center">
      <div style={{ maxWidth: "550px", width: "100%" }}>
        {/* Top Header Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-link text-dark text-decoration-none fw-semibold p-0">
            <i className="bi bi-chevron-left me-1"></i> Back
          </button>
          <div className="fw-bold fs-5 text-dark">WO-1001</div>
          <span className="badge bg-warning text-dark bg-opacity-25 px-3 py-2 rounded-pill">
            On Hold
          </span>
        </div>

        {/* Form Card */}
        <div className="card border-0 shadow-sm p-3">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Reason for Hold Dropdown */}
              <div className="mb-4">
                <label className="form-label fw-bold text-dark mb-2">
                  Reason for Hold
                </label>
                <select
                  className="form-select text-dark"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                >
                  <option value="Waiting for Parts">Waiting for Parts</option>
                  <option value="Customer Unavailable">
                    Customer Unavailable
                  </option>
                  <option value="Weather Conditions">Weather Conditions</option>
                  <option value="Specialized Equipment Needed">
                    Specialized Equipment Needed
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Notes Textarea */}
              <div className="mb-4">
                <label className="form-label fw-bold text-dark mb-2">
                  Notes
                </label>
                <textarea
                  className="form-control text-dark"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter details about why the job is on hold..."
                ></textarea>
              </div>

              {/* Expected Resume Fields */}
              <div className="mb-4">
                <label className="form-label fw-bold text-dark mb-2">
                  Expected Resume
                </label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="date"
                      className="form-control text-dark"
                      value={resumeDate}
                      onChange={(e) => setResumeDate(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <div className="input-group">
                      <input
                        type="time"
                        className="form-control text-dark border-end-0"
                        value={resumeTime}
                        onChange={(e) => setResumeTime(e.target.value)}
                      />
                      <span className="input-group-text bg-white border-start-0 text-muted">
                        <i className="bi bi-calendar3"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hold Job Action Button */}
              <button
                type="submit"
                className="btn btn-warning w-100 py-2 text-white fw-semibold d-flex align-items-center justify-content-center gap-2 mt-4"
                style={{ backgroundColor: "#e65100", borderColor: "#e65100" }}
              >
                <i className="bi bi-pause-fill fs-5"></i> Hold Job
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldJobForm;