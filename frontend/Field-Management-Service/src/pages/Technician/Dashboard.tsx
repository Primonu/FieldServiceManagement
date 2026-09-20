import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import API from "../../services/api";

type UserProfile = {
  fname?: string;
  lname?: string;
}
function getNameFromProfile(profile: UserProfile) {
  if (!profile) return '';

  return `${profile.fname || ''} ${profile.lname || ''}`.trim();
}

type WorkOrder ={
  workCode: string;
  title: string;
  companyName: string;
  siteName:string;
  city:string;
  country:string;
  status: string;
  priority: string;
  assignTechnician: string;
  slaDueAt: string;
}

type Dashboard = {
  assignedWorkOrders: number;
  inProgressWorkOrders: number;
  onHoldWorkOrders: number;
  completedWorkOrders: number;
}
function TechnicianDashboard(){
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin User');
  const [requests, setRequests] = useState<WorkOrder[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(()=>{
      try{
        const storedUser = localStorage.getItem('user');
        if(storedUser){
          const storedName = getNameFromProfile(JSON.parse(storedUser) as UserProfile);
          if(storedName) setAdminName(storedName);
        }
      }catch{
          console.log("User not fetch");
      }
    },[]);
    useEffect(()=>{
      fetchRequest();
      fetchDashboard();
    },[])

    const fetchRequest = async () => {
    try{
      const response = await API.get("/work-orders/technician/my-orders",{
        params:{
          page:0,
          size:10
        }
      });
      setRequests(response.data.content);
    }catch{
      setError("Error fetching request");
    }finally{
      setLoading(false);
    }
  };
  // fetch dashboard
  const fetchDashboard = async () =>{
    try{
      const response = await API.get("/dashboard/technician");
      setDashboard(response.data);
    }catch{
      setError("Error to fetching data");
    }finally{
      setLoading(false);
    }
  };

  const kpiData = [
    { title: 'Assigned', count: dashboard?.assignedWorkOrders,bg:"bg-primary",color:"bg-primary"},
    { title: 'In Progress', count: dashboard?.inProgressWorkOrders,bg:"bg-warning",color:"bg-warning"},
    { title: 'On Hold', count: dashboard?.onHoldWorkOrders,bg:"bg-secondary",color:"bg-secondary"},
    { title: 'Completed', count: dashboard?.completedWorkOrders,bg:"success",color:"bg-success"},
  ];
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
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar Section */}
      <Sidebar activeItem="My Jobs" />

      {/* Main Content Dashboard */}
      <main className="flex-grow-1" style={{ flex: "1 1 auto", width: "auto", minWidth: 0, marginLeft: 0 }}>
        {/* Top Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold text-dark m-0">
              Good Morning, {adminName} 👋
            </h4>
            <small className="text-muted">Here's your overview for today.</small>
          </div>
          <div className="bg-white border rounded px-3 py-1 text-muted small shadow-sm">
            <span>{new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            })}
          </span>
          <i className="bi bi-calendar3"></i>
          </div>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading && !dashboard ? (
          <div className="d-flex justify-content-center py-5" role="status">
            <span className="spinner-border text-primary" aria-label="Loading dashboard" />
          </div>
        ) : (
        <>
        {/* Metrics Row */}
        <div className="row g-3 mb-4">
          {kpiData.map((metric, idx) => (
            <div className="col-md-3" key={idx}>
              <div className="card border-0 shadow-sm p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold m-0">{metric.count}</h3>
                    <span className="text-muted small">
                      {metric.title}{" "}
                    </span>
                  </div>
                  <div className={`p-2 rounded-circle ${metric.bg}`}>
                    <i className={`bi bi-circle-fill ${metric.color} fs-6`}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Jobs Card */}
        <div className="card border-0 shadow-sm p-3">
          <div className="card-body p-0">
            {/* Nav Tabs */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-dark mb-0">Latest Job</h6>
              <a href="#view-all" className="text-primary text-decoration-none small">View all</a>
            </div>

            {/* Jobs List */}
            <div className="d-flex flex-column gap-3">
              {requests.map((job) => (
                <div
                  key={job.workCode}
                  className="card border-0 shadow-sm p-3 bg-white"
                  onClick={() => navigate(`/Technician/JobDetails/${encodeURIComponent(job.workCode)}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      navigate(`/Technician/JobDetails/${encodeURIComponent(job.workCode)}`);
                    }
                  }}
                  style={{ borderLeft: `4px solid rgb(13,110,253)`, cursor: "pointer" }}
                >
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <div className="fw-bold text-dark small">{job.workCode}</div>
                      <span className={`badge  ${getPriorityColorClass(job.priority)} mt-1`}>
                        {job.priority}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold text-dark mb-1">{job.title}</h6>
                      <div className="text-muted small">{job.companyName}</div>
                      <div className="text-secondary small">{job.siteName},{job.city},{job.country}</div>
                    </div>
                    <div className="col-md-4 text-end">
                      <div className="d-flex align-items-center justify-content-end gap-2 mb-2">
                        <span className={`badge ${getStatusBadgeClass(job.status)} px-2 py-1`}>
                          {job.status}
                        </span>
                        <i className="bi bi-chevron-right text-muted"></i>
                      </div>
                      <small className="text-muted fw-semibold">{job.slaDueAt}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Link */}
            <div className="text-center mt-3 pt-2">
              <a href="#!" className="text-primary text-decoration-none fw-semibold small">
                View All Jobs
              </a>
            </div>
          </div>
        </div>
      </>
        )}
      </main>
    </div>
  );
};

export default TechnicianDashboard;