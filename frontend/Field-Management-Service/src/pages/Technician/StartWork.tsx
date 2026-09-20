import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

type jobSummary = {
  id: number;
  workCode: string;
  companyName: string;
  siteName: string;
  floorNo: string;
  appartmentName: string;
  addressDetails: string;
  city: string;
  country: string;
  priority: string;
  status: string;
  startedAt?: string;
}
function StartWorkForm(){
  const navigate = useNavigate();
  const { workCode } = useParams<{ workCode: string }>();
  const [workOrder, setWorkOrder ] = useState<jobSummary | null>(null,);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  useEffect(()=>{
    if(workCode){
      fetchWorkOrder();
    }
  },[workCode]);
  const fetchWorkOrder = async () =>{
    try{
      const response = await API.get<jobSummary>(`/work-orders/code/${workCode}`);
      setWorkOrder(response.data);
    }catch{
      setError("Failed to fetch work order:");
    }finally{
      setLoading(false);
    }
  };

  const handleStartWork = async () =>{
    if(!workOrder?.workCode){
      setError("Work order not found");
      return;
    }
    try{
      setStarting(true);
      setError("");
      setSuccess("");
      const response = await API.put<jobSummary>(`/work-orders/${workOrder.id}/start`,null,);
      setWorkOrder(response.data);
      setSuccess("Work started successfully");
    }catch{
      setError("Failed to start work.");
    }
  };
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

  return (
    <div className="bg-light min-vh-100 p-4 d-flex justify-content-center">
      <div style={{ maxWidth: "600px", width: "100%" }}>
        {/* Navigation & Header */}
        <div className="d-flex align-items-center mb-4 position-relative">
          <button className="btn btn-link text-dark text-decoration-none fw-semibold p-0 position-absolute start-0">
            <i className="bi bi-chevron-left me-1"></i> Back
          </button>
          <h5 className="fw-bold text-dark mx-auto m-0">
            {workOrder?.workCode}
          </h5>
        </div>

        {/* Main Content Card */}
        <div className="card border-0 shadow-sm p-3">
          <div className="card-body">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="alert">{success}</div>}
              {/* Job Summary Section */}
              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-3">Job Summary</h6>
                <div className="fw-semibold text-dark">
                  {workOrder?.companyName} - {workOrder?.siteName}
                </div>
                <div className="text-secondary small mb-3">
                  {workOrder?.appartmentName},{workOrder?.floorNo},{workOrder?.addressDetails},{workOrder?.city},{workOrder?.country}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">Priority</span>
                  <span className={`badge fw-bold ${getPriorityColorClass(workOrder?.priority ?? "")} rounded-pill px-4 py-1 `}>
                    {workOrder?.priority}
                  </span>
                </div>
              </div>

              <hr className="my-4 text-muted opacity-25" />
              
              {/* Notes Section */}

              {/* Log Time Section */}
              <div className="mb-4">
                {workOrder?.startedAt && (
                  <div className="mt-3">
                    <small className="text-muted">
                      Started At
                    </small>
                    <div>
                      {new Date(workOrder.startedAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              {workOrder?.status === "ASSIGNED" &&(
                <button type="button"className="btn btn-success w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"onClick={handleStartWork}disabled={starting}>
                  {starting ? "Starting..." : "Start Work"}
                </button>
              )}
              {workOrder?.status === "IN_PROGRESS" &&(
                <span className="badge bg-success fs-6">Work In Progress</span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartWorkForm;