import { use, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import API from "../../services/api";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import WorkOrderDetail from "./WorkDetails";

type WorkOrderDetails = {
  id: number;
  workCode: string;
  title: string;
  companyName?: string;
  siteName: string;
  city: string;
  country: string;
  priority: string;
  description: string;
  createdOn: string;
};
type TechnicianDetails ={
  id: number;
  fname: string;
  lname: string;
}

function CreateWorkOrder() {
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState<WorkOrderDetails | null>(null);
  const [technicians, setTechnicians] = useState<TechnicianDetails[]>([]);
  const [formData, setFormData] = useState({technician: "",slaDueAt:"",});
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState("");
  const { workCode } = useParams<{ workCode: string }>();

  useEffect(() => {
    if(workCode){
     fetchWorkOrder(workCode);
    }
    fetchTechnician();
  }, [workCode]);

  const fetchWorkOrder = async (workOrder: string) => {
    try {
      setLoading(true);
      const response = await API.get(`/work-orders/code/${workCode}`);
      setWorkOrder(response.data);
    } catch {
      setError("Data not fetching");
    } finally {
      setLoading(false);
    }
  };
  const fetchTechnician = async () =>{
    try{
      const responseTechnician = await API.get("/user_auth/role",{
        params: {
          role: "TECHNICIAN",
        }
      });
      console.log("Technicians Response: ",responseTechnician.data);
      setTechnicians(responseTechnician.data);
    }catch(error){
      setError("Unable to load technician");
    }
  }

  const handleAssignTechnician = async () =>{
    if(!formData.technician){
      alert("Please select a technician");
      return;
    }
    const technicianId = Number(formData.technician);
    if(!Number.isInteger(technicianId) || technicianId <= 0){
      console.log("Technician id is: ",technicianId);
      alert("Invalid technician selected");
      return;
    }
    if(!workOrder?.id){
      alert("Work order not found");
      return;
    }
    try{
      await API.post(`/work-orders/${workOrder.id}/assign`,null,
         {
          params: {
            technicianId: technicianId
          }
      });
      alert("Technician assigned successfully");
    }catch(error){
      alert("Failed to assign technician");
    }
  }

  return (
    <div className="d-flex vh-100 bg-light">
      <Sidebar activeItem="WorkOrder" />
      <main className="flex-grow-1 overflow-auto">
        <div className="bg-light min-vh-100 p-4">
          {/* Page Header & Breadcrumb */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item text-muted">Work Orders</li>
                <li
                  className="breadcrumb-item active text-muted"
                  aria-current="page"
                >
                  {workOrder?.workCode}
                </li>
              </ol>
            </nav>
          </div>
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-bold m-0">
                      Work Order Details
                    </h5>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Work-ID</div>
                    <div className="col-sm-9 fw-semibold">
                      {workOrder?.workCode}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Title</div>
                    <div className="col-sm-9 fw-semibold">
                      {workOrder?.title}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Customer</div>
                    <div className="col-sm-9 text-primary fw-semibold">
                      {workOrder?.companyName}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Location</div>
                    <div className="col-sm-9 text-secondary">
                      {workOrder?.siteName},{workOrder?.city},
                      {workOrder?.country}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Priority</div>
                    <div className="col-sm-9">
                      <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1">
                        {workOrder?.priority}
                      </span>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3 text-muted">Description</div>
                    <div className="col-sm-9 text-secondary">
                      {workOrder?.description}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 text-muted">Created At</div>
                    <div className="col-sm-9 text-secondary">
                      {workOrder?.createdOn}
                    </div>
                  </div>
                </div>
              </div>
              {/* Section 3: Assign Technician */}
              <div className="row-g-4">
                <div className="card border-0 shadow-sm h-100 p-3">
                  <div className="card-body">
                    <h6 className="card-title fw-bold text-dark mb-4">
                      Assign Technician
                    </h6>
                    <div className="mb-3">
                      <label className="form-label small text-secondary">
                        Technician <span className="text-danger">*</span>
                      </label>
                      <select className="form-select" value={formData.technician} onChange={(e) => setFormData({...formData,technician: e.target.value,})
                      }>
                        <option value="">Select technician</option>
                        {technicians?.map((technician,index) => (
                          <option key={`${technician.id}-${index}`} value={technician.id}>
                            {technician.fname} {technician.lname}
                          </option>
                          ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small text-secondary">
                        Due Date <span className="text-danger">*</span>
                      </label>
                      <input type="datetime-local"className="form-control"value={formData.slaDueAt || ""}
                       onChange={(e) => setFormData({
                         ...formData,slaDueAt: e.target.value,
                       })
                    }
                      />
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button type="button"className="btn btn-outline-secondary"onClick={()=> navigate(-1)}>Cancel</button>
                      <button type="button"className="btn btn-dark"style={{backgroundColor: "#0B192C"}}
                      onClick={handleAssignTechnician}>
                        Assign Technician
                      </button>
                    </div>
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

export default CreateWorkOrder;
