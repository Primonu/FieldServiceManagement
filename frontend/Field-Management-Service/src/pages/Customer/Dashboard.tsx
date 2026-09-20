import Header from './Header';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import API from '../../services/api';

type WorkOrder ={
  id: number;
  title: string;
  status: string;
  priority: string;
  createdOn: string;
}
type DashboardData = {
  totalRequests: number;
  inProgress: number;
  completed: number;
  onHold: number;
}
type StatusLegendItem = {
  title: string;
  count: number;
  colorClass: string;
};
function CustomerDashboard(){
  const [requests, setRequests] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData>({
    totalRequests: 0,
    inProgress: 0,
    completed: 0,
    onHold: 0,
  });

  // Table Data
  useEffect(()=>{
  const fetchRequest = async () => {
    try{
      const response = await API.get("/customer/view-request");
      setRequests(response.data);
    }catch{
      setError("Error fetching request");
    }finally{
      setLoading(false);
    }
  };
  fetchRequest();
},[]);

  useEffect(() =>{
    const fetchDashboard = async () =>{
      try{
        const response = await API.get("/customer/dashboard");
        setDashboard(response.data);
      }catch{
        setError("Error fetching customer dashboard");
      }
    };
    fetchDashboard();
  },[]);
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
  const metrics = [
    { title: 'Total Requests', count: dashboard.totalRequests},
    { title: 'In Progress', count: dashboard.inProgress},
    { title: 'Completed', count: dashboard.completed},
    { title: 'On Hold', count: dashboard.onHold},
  ];
  const statusLegend = [
    { title: 'In Progress', count: dashboard.inProgress, colorClass: 'bg-primary' },
    { title: 'Completed', count: dashboard.completed, colorClass: 'bg-success' },
    { title: 'On Hold', count: dashboard.onHold, colorClass: 'bg-warning' },
  ]satisfies StatusLegendItem[];
  const statusTotal = statusLegend.reduce((total, item) => total + item.count, 0);
  const donutBackground = statusTotal === 0
    ? '#e9ecef'
    : `conic-gradient(${statusLegend.reduce((stops, item, index) => {
        const start = index === 0 ? 0 : stops.end;
        const end = start + (item.count / statusTotal) * 100;
        stops.parts.push(`${item.colorClass} ${start}% ${end}%`);
        stops.end = end;
        return stops;
      }, { parts: [] as string[], end: 0 }).parts.join(', ')})`;

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-grow-1 overflow-auto p-4">
        {/* Top Header */}
        <Header />

        {/* Top Metrics Cards */}
        <div className="row g-3 mb-4">
          {metrics.map((metric) => (
            <div className="col-12 col-sm-6 col-xl-3" key={metric.title}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <span className="text-muted small">{metric.title}</span>
                  <h2 className="fw-bold my-2">{metric.count}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Grid Details */}
        <div className="row g-4">
          {/* Recent Requests Table Section */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Recent Requests</h5>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr className="text-muted small">
                        <th>ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <tr key={req.id}>
                          <td className="fw-medium small">RQ-{req.id}</td>
                          <td className="small">{req.title}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(req.status)} rounded-pill px-2 py-1 fw-normal`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="text-muted small">{req.createdOn}</td>
                          <td className={`fw-bold badge ${getPriorityColorClass(req.priority)} rounded-pill px-2 py-1 fw-normal`}>{req.priority}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-center pt-2">
                  <a href="#view-all" className="text-primary text-decoration-none fw-medium small">
                    View all requests
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Requests Status Chart Section */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold mb-4">Requests by Status</h5>
                
                {/* Simulated Donut Chart using CSS conic-gradient */}
                <div className="d-flex justify-content-center my-3">
                  <div
                    style={{
                      width: '160px',
                      height: '160px',
                      borderRadius: '50%',
                      background: donutBackground,
                      position: 'relative'
                    }}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Donut Chart Legend */}
                <div className="mt-auto pt-3">
                  {statusLegend.map((item, index) => (
                    <div
                      className={`d-flex align-items-center justify-content-between ${index < statusLegend.length - 1 ? 'mb-2' : ''}`}
                      key={item.title}
                    >
                      <div className="d-flex align-items-center">
                        <span className={`badge ${item.colorClass} me-2`} style={{ width: '10px', height: '10px', padding: 0 }}> </span>
                        <span className="small text-muted">{item.title}</span>
                      </div>
                      <span className="small fw-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;