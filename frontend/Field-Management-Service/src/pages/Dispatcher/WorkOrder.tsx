import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../Manager/css/workorder.css";
import API from "../../services/api";
import WorkOrderDetail from "./WorkDetails";


type WorkOrder = {
  id: string | number;
  workCode: string;
  title: string;
  companyName: string;
  assignTechnician: string;
  status: string;
  priority: string;
  slaDueAt: string;
};
function Workorder(){
  const navigate = useNavigate();
  const [requests, setRequests] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState("All");
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState<string | null>(null);

  const pageSize = 7;
  
  //fetch data of workOrder
  useEffect(() =>{
    fetchRequest();
  },[]);
  const fetchRequest = async () =>{
    try{
      const response = await API.get("/work-orders");
      setRequests(response.data.content);
    }catch{
      setError("Error not fetching ");
    }finally{
      setLoading(false);
    }
  }
  const filteredOrders = useMemo(() => {
    const term = search.toLowerCase().trim();
    return requests.filter((item: WorkOrder) => {
      const matchesSearch =
        !term ||
        (item.workCode ?? "").toLowerCase().includes(term) ||
        (item.title ?? "").toLowerCase().includes(term) ||
        (item.companyName ?? "").toLowerCase().includes(term) ||
        (item.assignTechnician ?? "").toLowerCase().includes(term);

      return (
        matchesSearch &&
        (status === "All" || item.status === status) &&
        (priority === "All" || item.priority === priority)
      );
    });
  }, [search, status, priority]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleOrders = filteredOrders.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const changeFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };
  const handleCancelWorkOrder = async (workOrder: WorkOrder) =>{
    if(!workOrder.id){
      alert("Work order not found");
      return;
    }
    if(workOrder.status === "CANCELLED"){
      alert("Work order is already cancelled");
      return;
    }
    if(!window.confirm(`Cancel work order ${workOrder.workCode}?`)){
      return;
    }
    try{
      const response = await API.put(`/work-orders/${(workOrder.id)}/cancel`,null);
      setRequests(response.data);
      setMenuId(null);
      alert("Work order cancelled successfully");
    }catch{
      alert("Failed to cancel work order");
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

    return(
        <div className="app-shell" style={{ display: "flex", minHeight: "100vh" }} onClick={() => setMenuId(null)}>
            <Sidebar activeItem="Work Orders" />
        <main className="main" style={{ flex: "1 1 auto", width: "auto", minWidth: 0, marginLeft: 0 }}>
        <header className="page-header">
          <div>
            <h1>Work Orders</h1>
            <div className="breadcrumb">
              <span>Home</span>
              <i className="bi bi-chevron-right" />
              <strong>Work Orders</strong>
            </div>
          </div>

          <button
            className="create-btn"
            onClick={() => navigate("/Dispatcher/CreateWorkOrder")}
          >
            <i className="bi bi-plus-lg" />
            Create Work Order
          </button>
        </header>

        <section className="orders-card">
          <div className="filter-bar">
            <div className="search-box">
              <i className="bi bi-search" />
              <input
                value={search}
                onChange={(e) => changeFilter(setSearch, e.target.value)}
                placeholder="Search work orders..."
              />
            </div>

            <select
              value={status}
              onChange={(e) => changeFilter(setStatus, e.target.value)}
            >
              <option value="All">Status: All</option>
              <option value="NEW">Status: Open</option>
              <option value="IN_PROGRESS">Status: In Progress</option>
              <option value="ON_HOLD">Status: On Hold</option>
              <option value="COMPLETED">Status: Completed</option>
            </select>

            <select
              value={priority}
              onChange={(e) => changeFilter(setPriority, e.target.value)}
            >
              <option value="All">Priority: All</option>
              <option value="HIGH">Priority: High</option>
              <option value="MEDIUM">Priority: Medium</option>
              <option value="LOW">Priority: Low</option>
              <option value="CRITICAL">Priority: Critical</option>
            </select>
          </div>

          <div className="table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title <i className="bi bi-arrow-down-up" /></th>
                  <th>Customer</th>
                  <th>Technician</th>
                  <th>Status <i className="bi bi-arrow-down-up" /></th>
                  <th>Priority <i className="bi bi-arrow-down-up" /></th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length ? (
                  requests.map((wo) => (
                    <tr key={wo.workCode}>
                      <td>{wo.workCode}</td>
                      <td className="title-cell">{wo.title}</td>
                      <td>{wo.companyName}</td>
                      <td>{wo.assignTechnician}</td>
                      <td>
                        <span className={`badge fw-bold ${getStatusBadgeClass(wo.status)} rounded-pill px-2 py-1`}>
                          {wo.status}
                        </span>
                      </td>
                      <td>
                        <span className={`fw-bold badge ${getPriorityColorClass(wo.priority)} rounded-pill px-2 py-1`}>
                          {wo.priority}
                        </span>
                      </td>
                      <td>{wo.slaDueAt}</td>
                      <td className="action-cell position-relative">
                        <button
                          className="more-btn btn btn-dark btn-sm rounded-circle"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuId(menuId === wo.workCode? null : wo.workCode);
                          }}
                          aria-label={`Actions for ${wo.workCode}`}
                        >
                          <i className="bi bi-three-dots" />
                        </button>
                        {menuId === wo.workCode && (
                          <div className="action-menu show position-absolute end-0 mt-1 dropdown-menu shadow-sm" onClick={(e) => e.stopPropagation()}
                          style={{zIndex:9999,display:"block",top:"100%"}}>
                            <button type="button" className="dropdown-item" onClick={() => navigate(`/Dispatcher/WorkDetails/${encodeURIComponent(wo.workCode)}`)} aria-label={`View details for ${wo.workCode}`}><i className="bi bi-eye" /> View</button>
                            <button type="button" className="dropdown-item" onClick={() => navigate(`/Dispatcher/AssignWorkOrder/${encodeURIComponent(wo.workCode)}`)} aria-label={`Assign work order ${wo.workCode}`}><i className="bi bi-briefcase" /> Assign</button>
                            <button type="button" className="dropdown-item" onClick={() => handleCancelWorkOrder(wo)}><i className="bi bi-cancel" /> Cancel</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="empty-state">
                      No work orders found.
                    </td>
                  </tr>
                )}
            
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <span>
              Showing{" "}
              {filteredOrders.length === 0 ? 0 : (safePage - 1) * pageSize + 1}
              {" "}to{" "}
              {Math.min(safePage * pageSize, filteredOrders.length)}
              {" "}of {filteredOrders.length} entries
            </span>

            <div className="pagination">
              <button
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <i className="bi bi-chevron-left" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  className={safePage === number ? "selected" : ""}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ))}

              <button
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          </footer>
        </section>
      </main>
        </div>

    )
}
export default Workorder;