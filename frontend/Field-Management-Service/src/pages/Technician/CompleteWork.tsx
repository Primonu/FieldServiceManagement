import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
type Part ={
  id: number;
  name: string;
  sku: string;
  unitCost: number;
  stock: number;
}
type PartUsage = {
  id: number;
  partName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  workOrderId: number;
  technicianId: number;
}
type WorkOrder = {
  id: number;
  workCode: string;
  title: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  siteName: string;
  appartmentName?: string;
  floorNo?: string;
  city?: string;
  State?: string;
  country?: string;
  assignedTechnicianId: number;
}

function CompleteJobForm(){
  const navigate = useNavigate();
  const {workCode} = useParams<{workCode: string }>();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [avilableParts, setAvailableParts] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [partQuantity, setPartQuantity] = useState<number>(1);
  const [partUsed, setPartUsed] = useState<PartUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // const [photos, setPhotos] = useState([
  //   "https://via.placeholder.com/100?text=Photo+1",
  //   "https://via.placeholder.com/100?text=Photo+2",
  //   "https://via.placeholder.com/100?text=Photo+3",
  // ]);

  
  // const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files ? Array.from(e.target.files) : [];
  //   if (files.length > 0) {
  //     const newPhotoUrls = files.map((file) => URL.createObjectURL(file));
  //     setPhotos((prev) => [...prev, ...newPhotoUrls]);
  //   }
  // };
  useEffect(()=>{
    if(workCode){
      loadCompletionData(workCode);
    }
  },[workCode]);
  const loadCompletionData = async (workCode: string) =>{
    try{
      setLoading(true);
      const response = await API.get(`/work-orders/code/${workCode}`);
      setWorkOrder(response.data);

      if(response.data.partUsages){
        setPartUsed(response.data.partUsages);
      }
    }catch{
      alert("Failed to load completion summary");
    }finally{
      setLoading(false);
    }
  };
  //fetch part
  useEffect(()=>{
    const fetchtParts = async () =>{
      try{
        const response = await API.get('/parts');
        console.log("Part API Response : ",response.data);
        const pageData = response.data?.data ?? response.data;
        const responseParts = Array.isArray(pageData) ? pageData : pageData?.content ?? [];
        setAvailableParts(responseParts);
        if(responseParts.length > 0){
          setSelectedPart(String(responseParts[0].id));
        }
      }catch{
        alert("Failed to fetch parts");
      }
    };
    void fetchtParts();
  },[]);
  const addPart = () =>{
    if(!workOrder){
      alert("Work order is not loaded");
      return;
    }
    const part = avilableParts.find((p) => String(p.id) === selectedPart);
    if(!part){
      alert("Please select a part");
      return;
    }
    if(partQuantity > part.stock){
      alert(`Only ${part.stock} ${part.name} availabe in stock`);
      return;
    }
    const existingPart = partUsed.find((p) => p.id === part.id);
    if(existingPart){
      const newQuantity = existingPart.quantity + partQuantity;
      if(newQuantity > part.stock){
        alert(`Only ${part.stock} ${part.name} available in stock`);
        return;
      }
      setPartUsed((parts) =>
      parts.map((p) =>
      p.id === part.id ? {
        ...p, quantity: newQuantity,
        totalCost: newQuantity * p.unitCost,
      }:p
    ));
    }else{
      setPartUsed((parts) => [
        ...parts,
        {
          id: part.id,
          workOrderId: workOrder.id,
          technicianId: workOrder.assignedTechnicianId,
          partName: part.name,
          quantity: partQuantity,
          unitCost: part.unitCost,
          totalCost: part.unitCost * partQuantity,
        },
      ]);
    }
    setPartQuantity(1);
  }
  const totalPartCost = partUsed.reduce(
  (total, part) => total + part.totalCost,
  0
);
const saveUsedParts = async () =>{
  try{
    for (const part of partUsed){
      await API.post("/parts/use",null,{
        params: {
        workOrderId: workOrder?.id,
        partId: part.id,
        quantity: part.quantity,
        technicianId: workOrder?.assignedTechnicianId
        }
      });
    }
    alert("Parts used successfully");
  }catch(error){
    console.error("Error using parts:", error);
    alert("Failed to save part usage");
  }
}

  // const getTotalPartsCost = () =>{
  //   return partUsed.reduce((total,item) => 
  //      total + item.part.unitCost * item.quantity, 0
  //   );
  // };
  const handleSubmitCompletion = async () =>{
    if(!workOrder) return;
    const confirmed = window.confirm("Are you sure you want to complete this work order?");
    if(!confirmed) return;
    try{
      setSubmitting(true);
      const response = await API.put(`/work-orders/${workOrder.id}/complete`,null,);
      alert("Work order competed successfully.");
    }catch{
      alert("Failed to completed work order");
    }finally{
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-light min-vh-100 p-4 d-flex justify-content-center">
      <div style={{ maxWidth: "550px", width: "100%" }}>
        {/* Top Header Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-link text-dark text-decoration-none fw-semibold p-0">
            <i className="bi bi-chevron-left me-1"></i> Back
          </button>
          <div className="fw-bold fs-5 text-dark">{workOrder?.workCode}</div>
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
            Completed
          </span>
        </div>
        <div className="card border-0 shadow-sm p-3">
          <div className="card-body">
            <div className="mb-3">
              <small className="text-muted d-block">Title</small>
              <span className="fw-semibold text-dark">{workOrder?.title}</span>
            </div>
            <div className="mb-3">
              <small className="text-muted d-block">Customer</small>
              <span className="fw-semibold text-dark">{workOrder?.companyName}</span><br />
              <span className="fw-semibold text-dark">{workOrder?.contactPerson},{workOrder?.email},{workOrder?.phone}</span>
            </div>
            <div className="mb-3">
              <small className="text-muted d-block">Location</small>
              <span className="fw-semibold text-dark">{workOrder?.siteName}-{workOrder?.floorNo},{workOrder?.appartmentName},{workOrder?.city},{workOrder?.State},{workOrder?.country}</span>
            </div>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-header  text-white d-flex justify-content-between align-item-center">
            <label className="form-label small text-muted fw-semibold">
              Parts Used
            </label>
          </div>
          <div className="row g-2 align-content-end">
            <div className="col-md-7">
              <label className="form-label small">Select Part</label>
              <select className="form-select"value={selectedPart}onChange={(event)=>setSelectedPart(event.target.value)}>
                {/* {avilableParts.length === 0 ? ( */}
                  <option value={""}>Select Part</option>
                
                  {avilableParts.map((part) => (
                    <option key={part.id} value={part.id}disabled={part.stock ===0}>
                      {part.name}
                    </option>
                  ))}
                
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label small">Quantity</label>
              <input type="number"min={1}className="form-control"value={partQuantity}onChange={(event) => setPartQuantity(Math.max(1, Number(event.target.value)))} />
            </div>

            <div className="col-md-2 mb-3">
              <button type = "button"className="btn btn-outline-primary w-100"onClick={addPart}>
                <i className="bi bi-plus-lg me-1"></i>Add
              </button>
            </div>
          </div>
          {partUsed.length > 0 &&(
            <div className="list-group mt-3">
              {partUsed.map((part) =>(
                <div key={part.id} className="list-group-item px-3 py-3">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="fw-semibold">
                       {part.partName}
                      </div>
                      <small className="text-muted"> ₹{part.unitCost.toFixed(2)} / unit
                      </small>
                    </div>
                    <div className="col-md-2">
                      <span className="small">Qty: <strong>{part.quantity}</strong>
                      </span>
                    </div>
                    <div className="col-md-4 text-md-end">
                      <span className="fw-semibold"> ₹{part.totalCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="col-md-2 text-end">
                      <button type="button"className="btn btn-sm btn-link text-danger"onClick={() =>setPartUsed((parts) =>
                        parts.filter((item) => item.id !== part.id
                        ))}><i className="bi bi-trash"></i>
                      </button>
                      <button type="button" className="btn btn-primary"onClick={saveUsedParts}>Save Used Parts
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {partUsed.length > 0 && (
            <div className="d-flex justify-content-end mt-3">
              <div className="border rounded p-3 bg-light">
                <span className="text-muted me-3"> Total Parts Cost:
                </span>
               <strong className="fs-5">₹{totalPartCost.toFixed(2)}</strong>

              </div>
            </div>
           )}
        </div>

              {/* Submit Action Button */}
              <button className="btn btn-success px-4" onClick={handleSubmitCompletion}disabled={submitting}>
                {submitting ?(
                  <>
                  <span className="spinner-border spinner-border-sm me-2" />Completing...
                  </>
                ):(
                  "Submit Completion"
                )}
              </button>
          </div>
        </div>
  );
};

export default CompleteJobForm;