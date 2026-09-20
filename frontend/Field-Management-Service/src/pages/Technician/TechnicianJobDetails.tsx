import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import API from "../../services/api";
import './css/timeline.css'

type TimelineEvent = {
  date: string;
  status: string;
  title: string;
  author: string;
  note?: string;
};
type JobOrder = {
  id: number;
  workCode: string;
  title: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  siteName: string;
  floorNo: string;
  appartmentName: string;
  addressDetails: string;
  city: string;
  country: string;
  priority: string;
  status: string;
  slaDueAt: string;
  description: string;
  createdOn: string;
  history?: TimelineEvent[];
};
function TechnicianJobDetails(){
  const navigate = useNavigate();
  const [jobDetails, setWorkOrderDetails] = useState<JobOrder | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { workCode } = useParams<{ workCode: string }>();

  useEffect(() => {
    if (workCode) {
      fetchWorkOrder(workCode);
    }
  }, [workCode]);

  const fetchWorkOrder = async (workOrder: string) => {
    try {
      setLoading(true);
      const response = await API.get(`/work-orders/code/${workOrder}`);
      setWorkOrderDetails(response.data);
      console.log("WORK ORDER RESPONSE:", response.data);
      console.log("TIMELINE:", response.data.history);
    } catch {
      setError("Data not fetching");
    } finally {
      setLoading(false);
    }
  };
  const handleHoldWork = async () =>{
    if(!jobDetails?.id) return;
    try{
      const response = await API.put(`/work-orders/${jobDetails.id}/hold`,null,);
      setWorkOrderDetails(response.data);
    }catch{
      setError("Failed to put work on hold");
    }
  }
  const handleResumeWork = async () =>{
    if(!jobDetails?.id) return;
    try{
      const response = await API.put(`/work-orders/${jobDetails.id}/resume`,null,);
      setWorkOrderDetails(response.data);
    }catch{
      setError("Failed to resume work");
    }
  }
  const handleCompleteWork = async () =>{
    if(!jobDetails?.id) return;
    const confirmed = window.confirm("Are you sure you want to complete this work order?");
    if(!confirmed) return;
    try{
      const response = await API.put(`/work-orders/${jobDetails.id}/complete`,null,);
      setWorkOrderDetails(response.data);
    }catch{
      setError("Failed to complete work");
    }
  }
  //status colour
  const getStatusBadgeClass = (status: string): string =>{
     switch(status){
      case "NEW":
        return "bg-primary";
      case "ASSIGNED":
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
  //priority colour
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

  if (loading) {
    return <div className="p-4 text-muted">Loading job details...</div>;
  }

  if (error || !jobDetails) {
    return <div className="p-4 text-danger">{error || "Job details not found"}</div>;
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar activeItem="My Jobs" />
      <main className="flex-grow-1 overflow-auto p-3 p-md-4" style={{ minWidth: 0 }}>
      {/* Top Navigation & Status Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button type="button" onClick={() => navigate('/Technician/Dashboard')} className="btn btn-link text-dark text-decoration-none fw-semibold p-0">
          <i className="bi bi-chevron-left me-1"></i> Back
        </button>
        <div className="fw-bold fs-5 text-dark">{jobDetails?.workCode}</div>
        <div className="d-flex align-items-center gap-2">
          <span className={`badge fw-medium ${getStatusBadgeClass(jobDetails?.status ?? "")} rounded-pill px-2 py-1`}>
            {jobDetails?.status}
          </span>
          <button className="btn btn-light border p-1 px-2">
            <i className="bi bi-three-dots"></i>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="row g-4 mb-4">
        {/* Left Card: Job Information */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="card-body">
              <h6 className="card-title fw-bold text-dark mb-4">
                Job Information
              </h6>

              <div className="mb-3">
                <small className="text-muted d-block">Title</small>
                <span className="fw-semibold text-dark">{jobDetails?.title}</span>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Customer</small>
                <span className="text-dark">{jobDetails?.companyName}</span>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Location</small>
                <span className="text-secondary">{jobDetails?.siteName}-{jobDetails?.appartmentName},{jobDetails?.floorNo},{jobDetails?.addressDetails},{jobDetails?.city},{jobDetails?.country}</span>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Priority</small>
                <span className={`badge fw-bold ${getPriorityColorClass(jobDetails?.priority ?? "")} rounded-pill px-2 py-1`}>
                  {jobDetails?.priority}
                </span>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Due Date & Time</small>
                <span className="text-secondary">{jobDetails?.slaDueAt}</span>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Status</small>
                <span className={`fw-medium ${getStatusBadgeClass(jobDetails?.status ?? "")} rounded-pill px-2 py-1 ` }>{jobDetails?.status}</span>
              </div>

              <hr className="my-3 text-muted opacity-25" />

              <div>
                <small className="text-muted d-block">Description</small>
                <span className="text-secondary small">
                  {jobDetails?.description}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Card: Timeline */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="card-body">
              <h6 className="card-title fw-bold text-dark mb-4">Timeline</h6>
              {jobDetails.history && jobDetails.history.length > 0 ? (
              <div className="position-relative ps-3 border-start ms-2">
                {(jobDetails?.history).map((event, index) => (
                  <div className="timeline-item"key={`${event.status}-${event.date}-${index}`}>
                    <div className="timeline-icon">✓</div>
                    <div className="timeline-content">
                      <h6 className="mb-1">{event.title}</h6>
                      <div className="text-muted small">{new Date(event.date).toLocaleString()}</div>
                      <div className="small mt-1">By: <strong>{event.author}</strong></div>
                      {event.note && (
                        <p className="text-muted small mt-2 mb-0">{event.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              ):(
                <p className="text-muted mb-0">No status history avilable.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Card: Customer Contact */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="card-body">
              <h6 className="card-title fw-bold text-dark mb-4">
                Customer Contact
              </h6>

              <div className="mb-3">
                <small className="text-muted d-block">Name</small>
                <span className="fw-semibold text-muted">
                  {jobDetails?.contactPerson}
                </span>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Phone</small>
                <span className="text-secondary">{jobDetails?.phone}</span>
              </div>

              <div>
                <small className="text-muted d-block">Email</small>
                <span className="text-secondary">{jobDetails?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Action Bar */}
      <div className="bg-white p-3 rounded shadow-sm d-flex flex-wrap gap-3 justify-content-start">
        <button
          className="btn btn-primary px-4 d-flex align-items-center gap-2"
          onClick={() => navigate(`/Technician/StartWork/${(jobDetails?.workCode)}`)}
        >
          <i className="bi bi-play-fill"></i> Start Work
        </button>
        {jobDetails.status === "IN_PROGRESS" &&(
          <>
          <button
          className="btn btn-outline-warning text-dark px-4 d-flex align-items-center gap-2"
          onClick={handleHoldWork}
        >
          <i className="bi bi-pause-fill text-warning"></i> Hold
        </button>
        <button
          className="btn btn-outline-success px-4 d-flex align-items-center gap-2"
           onClick={() => navigate(`/Technician/CompleteWork/${(jobDetails?.workCode)}`)}
        >
          <i className="bi bi-check-lg"></i> Complete
        </button>
        </>
        )}
        
        {jobDetails.status === "ON_HOLD" &&(
          <button className="btn btn-outline-secondary px-4 d-flex align-items-center gap-2"
          onClick={handleResumeWork}>
          <i className="bi bi-three-dots"></i> Resume
        </button>
        )}
        
      </div>
      </main>
    </div>
  );
};

export default TechnicianJobDetails;