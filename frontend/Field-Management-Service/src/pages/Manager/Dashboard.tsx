import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/dashboard.css'
import Sidebar from "./Sidebar";
import Header from "./Header";
import API from "../../services/api";

type WorkOrder ={
  workCode: string;
  title: string;
  companyName: string;
  status: string;
  priority: string;
  assignTechnician: string;
  slaDueAt: string;
}
type DashboardDTO = {
  totalWorkOrders: number;
  newWorkOrders: number;
  assignedWorkOrders: number;
  inProgressWorkOrders: number;
  onHoldWorkOrders: number;
  completedWorkOrders: number;
  cancelledWorkOrders: number;
}
type StatusLegendItem = {
  title: string;
  count: number;
  color: string;
};

function Dashboard() {
  const [requests, setRequests] = useState<WorkOrder[]>([]);
  const [dashboard, setDashboard] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(()=>{
    fetchRequest();
    fetchDashboard();
  },[]);

  const fetchRequest = async () => {
    try{
      const response = await API.get("/work-orders");
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
      const response = await API.get("/dashboard");
      setDashboard(response.data);
    }catch{
      setError("Error to fetching data");
    }finally{
      setLoading(false);
    }
  };
  // { title: 'Unassigned', count: 7, change: '3%', isUp: true, text: 'from yesterday' },
  const kpiData = [
    { title: 'Total Work Orders', count: dashboard?.totalWorkOrders},
    { title: 'New Work Orders', count: dashboard?.newWorkOrders},
    { title: 'Assigned', count: dashboard?.assignedWorkOrders},
    { title: 'In Progress', count: dashboard?.inProgressWorkOrders},
    { title: 'On Hold', count: dashboard?.onHoldWorkOrders},
    { title: 'Cancelled', count: dashboard?.cancelledWorkOrders},
    { title: 'Completed', count: dashboard?.completedWorkOrders},
  ];
  const statusLegend = [
    { title: 'New Work Order', count: dashboard?.newWorkOrders ?? 0, color: '#0d6efd' },
    { title: 'Assigned', count: dashboard?.assignedWorkOrders ?? 0, color: '#0dcaf0' },
    { title: 'In Progress', count: dashboard?.inProgressWorkOrders ?? 0, color: '#ffc107' },
    { title: 'On Hold', count: dashboard?.onHoldWorkOrders ?? 0, color: '#6c757d' },
    { title: 'Completed', count: dashboard?.completedWorkOrders ?? 0, color: '#198754' },
    { title: 'Cancelled', count: dashboard?.cancelledWorkOrders ?? 0, color: '#dc3545' },
  ] satisfies StatusLegendItem[];
  const statusTotal = statusLegend.reduce((total, item) => total + item.count, 0);
  const donutBackground = statusTotal === 0
    ? '#e9ecef'
    : `conic-gradient(${statusLegend.reduce((stops, item, index) => {
        const start = index === 0 ? 0 : stops.end;
        const end = start + (item.count / statusTotal) * 100;
        stops.parts.push(`${item.color} ${start}% ${end}%`);
        stops.end = end;
        return stops;
      }, { parts: [] as string[], end: 0 }).parts.join(', ')})`;
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
    <div className="dashboard-app">
      <Sidebar />
      <main className="flex-grow-1 overflow-auto p-4">
        <Header/>
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
        {/* Top KPI Cards Row */}
        <div className="row g-3 mb-4">
          {kpiData.map((kpi, idx) => (
            <div className="col-12 col-sm-6 col-md-4 col-xl" key={idx}>
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-body p-3">
                  <span className="text-muted small d-block mb-1">{kpi.title}</span>
                  <h3 className="fw-bold text-dark mb-2">{kpi.count}</h3>
                  {/*
                  <div className="d-flex align-items-center small" style={{ fontSize: '0.75rem' }}>
                    <span className={`fw-semibold me-1 ${kpi.isUp ? 'text-success' : 'text-danger'}`}>
                      {kpi.isUp ? '▲' : '▼'} {kpi.change}
                    </span>
                    <span className="text-muted">{kpi.text}</span>
                  </div>
                  */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Breakdown & Today's Schedule Row */}
          {/* Work Orders by Status (Donut Chart) */}
          <div className="col-12 ">
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-4">Work Orders by Status</h6>
                
                <div className="row align-items-center">
                  
                  <div className="col-12 col-sm-8 d-flex justify-content-center mb-3 mb-sm-0">
                    {/* CSS Conic-Gradient Donut Chart */}
                    <div
                      style={{
                        width: '150px',
                        height: '150px',
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
                  {/*Donut chart legend */}
                  <div className="col-12 col-sm-4">
                    {statusLegend.map((item, index) => (
                    <div
                      className={`d-flex align-items-center justify-content-between ${index < statusLegend.length - 1 ? 'mb-2' : ''}`}
                      key={item.title}
                    >
                      <div className="d-flex align-items-center">
                        <span className="badge me-2" style={{ width: '10px', height: '10px', padding: 0, backgroundColor: item.color }}> </span>
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

          {/* Today's Schedule */}
          {/* <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-body p-4 d-flex flex-column">
                <h6 className="fw-bold text-dark mb-3">Today's Schedule</h6>

                <div className="flex-grow-1">
                  {scheduleData.map((item, idx) => (
                    <div className="d-flex align-items-center py-2" key={idx}>
                      <span className="text-muted fw-medium small me-3" style={{ minWidth: '70px' }}>
                        {item.time}
                      </span>
                      <span className="small text-dark">{item.event}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-3 border-top mt-2">
                  <a href="#full-schedule" className="text-primary text-decoration-none small fw-medium">
                    View full schedule
                  </a>
                </div>
              </div>
            </div>
          </div> */}
        

        {/* Recent Work Orders Section */}
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-dark mb-0">Recent Work Orders</h6>
              <a href="#view-all" className="text-primary text-decoration-none small">View all</a>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="text-muted small border-bottom">
                    <th>ID</th>
                    <th>Title</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Technician</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((wo) => (
                    <tr key={wo.workCode}>
                      <td className="fw-medium small">{wo.workCode}</td>
                      <td className="small">{wo.title}</td>
                      <td className="small text-muted">{wo.companyName}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(wo.status)} rounded-pill px-2 py-1`}>
                          {wo.status}
                        </span>
                      </td>
                      <td className={`fw-bold badge ${getPriorityColorClass(wo.priority)}rounded-pill px-2 py-1`}>{wo.priority}</td>
                      <td className="small text-muted">{wo.assignTechnician}</td>
                      <td className="small text-muted">{wo.slaDueAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
        </>
        )}
      </main>
    </div>
  );
};
export default Dashboard;
