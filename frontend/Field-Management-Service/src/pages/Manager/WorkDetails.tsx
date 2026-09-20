import { useNavigate, useParams } from "react-router";
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
type WorkOrder = {
  id: number;
  workCode: string;
  title: string;
  companyName: string;
  email: string;
  phone: string;
  siteName: string;
  city: string;
  country: string;
  priority: string;
  status: string;
  slaDueAt: string;
  assignTechnician?: string;
  description: string;
  createdOn: string;
  history: TimelineEvent[];
};

function WorkOrderDetail(){
  // Sample data extracted from the screenshot
  const navigate = useNavigate();
  const [workOrderDetails, setWorkOrderDetails] = useState<WorkOrder | null>(
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
      const response = await API.get(`/work-orders/code/${workCode}`);
      setWorkOrderDetails(response.data);
    } catch(error) {
      console.log("Data not fetching",error);
      setError("Data not fetching");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="d-flex vh-100 bg-light">
      <Sidebar activeItem="Work Orders" />
      <main className="flex-grow-1 overflow-auto">
        <div className="bg-light min-vh-100 p-4">
      {/* Top Header & Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item text-muted">Work Orders</li>
            <li className="breadcrumb-item active text-muted" aria-current="page">
              {workOrderDetails?.workCode}
              </li>
              </ol>
            </nav>
          </div>

          <div className="row g-4">
            {/* Left Main Card - Work Order Details */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-bold m-0">
                      Work Order Details
                    </h5>
                    <span className="badge bg-warning text-dark bg-opacity-25 px-2 py-1">
                      {workOrderDetails?.status}
                    </span>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Work-ID</div>
                    <div className="col-sm-9 fw-semibold">
                      {workOrderDetails?.workCode}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Title</div>
                    <div className="col-sm-9 fw-semibold">
                      {workOrderDetails?.title}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Customer</div>
                    <div className="col-sm-9 text-primary fw-semibold">
                      {workOrderDetails?.companyName}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Location</div>
                    <div className="col-sm-9 text-secondary">
                      {workOrderDetails?.siteName},{workOrderDetails?.city},
                      {workOrderDetails?.country}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Priority</div>
                    <div className="col-sm-9">
                      <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1">
                        {workOrderDetails?.priority}
                      </span>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Due Date</div>
                    <div className="col-sm-9 text-secondary">
                      {workOrderDetails?.slaDueAt}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Technician</div>
                    <div className="col-sm-9 text-primary fw-semibold">
                      {workOrderDetails?.assignTechnician}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Description</div>
                    <div className="col-sm-9 text-secondary">
                      {workOrderDetails?.description}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-3 text-muted">Created At</div>
                    <div className="col-sm-9 text-secondary">
                      {workOrderDetails?.createdOn}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar Cards */}
            <div className="col-lg-4">
              {/* Timeline Card */}
              <div className="card border-0 shadow-sm p-3 mb-4">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-4">Timeline</h5>
                  <div className="position-relative ps-3 border-start">
                    {workOrderDetails?.history && workOrderDetails.history.length > 0 ? (
              <div className="position-relative ps-3 border-start ms-2">
                {(workOrderDetails?.history).map((event, index) => (
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

              {/* Customer Card */}
              <div className="card border-0 shadow-sm p-3">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">Customer</h5>
                  <div className="mb-2">
                    <span className="badge bg-light text-secondary px-2 py-1 me-2">
                      {workOrderDetails?.companyName}
                    </span>
                  </div>
                  <div className="text-muted small mb-1">
                    {workOrderDetails?.email}
                  </div>
                  <div className="text-muted small">
                    {workOrderDetails?.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WorkOrderDetail;