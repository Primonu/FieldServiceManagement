import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import './css/timeline.css'

type TimelineEvent = {
  // id: number;
  // fromStatus?: string;
  // toStatus: string;
  // user?: {
  //   firstName: string;
  //   lastName: string;
  // };
  // note?: string;
  // createdAt: string;
  id: number;
  date: string;
  status: string;
  title: string;
  author: string;
  note: string;
}
type RequestInfo = {
  id: number;
  workCode: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdOn: string;

  customerId: string;
  companyName:string;

  siteId: number;
  siteName: string;
  city?: string;
  country?: string;

  assignedTechnicianID?: number;
  slaDueAt?: string;
  startedAt?: string;
  completedAt?: string;
  totalPartsCost: number;
  history?: TimelineEvent[];

}
const RequestDetails = () => {
  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
  const {id} = useParams<{id: string}>();

  useEffect(()=>{
    const fetchRequest = async ()=>{
      try{
        const response = await API.get(`customer/${id}`)
        setRequestInfo(response.data);
      }catch{
        setRequestInfo(null);
      }
    }
    fetchRequest();
  }, [id]);

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
        {requestInfo &&(
          <>
          {/* Breadcrumbs Navigation */}
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item"><a href="#home" className="text-decoration-none text-muted small">Home</a></li>
              <li className="breadcrumb-item"><a href="#requests" className="text-decoration-none text-muted small">My Requests</a></li>
              <li className="breadcrumb-item active small text-muted" aria-current="page">RQ-{requestInfo.id}</li>
            </ol>
          </nav>

          {/* Top Title & Status Badge */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold text-dark mb-0">Request Details</h3>
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-medium fs-6">
              {requestInfo.status}
            </span>
          </div>
          </>
        )}
          <div className="row g-4">
            {/* Left Column: Request Information */}
            {requestInfo &&(
              <>
            <div className="col-12 col-lg-7">
              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body p-4">
                  <h5 className="fw-bold text-dark mb-4">Request Information</h5>

                  <div className="row mb-3">
                    <div className="col-4 text-muted small">Request ID</div>
                    <div className="col-8 fw-semibold text-dark small">RQ-{requestInfo.id}</div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-4 text-muted small">Title</div>
                    <div className="col-8 text-dark small">{requestInfo.title}</div>
                  </div>

                  {/* <div className="row mb-3">
                    <div className="col-4 text-muted small">Category</div>
                    <div className="col-8 text-dark small">{requestInfo.category}</div>
                  </div> */}

                  <div className="row mb-3">
                    <div className="col-4 text-muted small">Location</div>
                    <div className="col-8 text-dark small">{requestInfo.siteName},{requestInfo.city},{requestInfo.country}</div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-4 text-muted small">Priority</div>
                    <div className="col-8 text-danger fw-semibold small">{requestInfo.priority}</div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-4 text-muted small">Created On</div>
                    <div className="col-8 text-dark small">{requestInfo.createdOn}</div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-4 text-muted small">Created By</div>
                    <div className="col-8 text-dark small">{requestInfo.companyName}</div>
                  </div>

                  <div className="mb-4 pt-2 border-top">
                    <h6 className="fw-bold text-dark small mb-2 mt-3">Description</h6>
                    <p className="text-secondary small mb-0 lh-base">
                      {requestInfo.description}
                    </p>
                  </div>

                  {/* <div className="pt-2 border-top">
                     <h6 className="fw-bold text-dark small mb-2 mt-3">Attachments</h6>
                     {requestInfo.attachments.map((file, idx) => (
                       <div key={idx} className="d-flex align-items-center gap-2 p-2 border rounded-2 bg-light" style={{ maxWidth: '300px' }}>
                         <i className="bi bi-file-earmark-image text-primary fs-5"></i>
                         <div className="overflow-hidden">
                           <span className="d-block text-truncate small fw-medium">{file.name}</span>
                           <small className="text-muted" style={{ fontSize: '0.75rem' }}>{file.size}</small>
                         </div>
                       </div>
                     ))}
                   </div> */}
                </div>
              </div>
            </div>
            </>)}
  
            {/* Right Column: Status Timeline */}
            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-body p-4">
                  <h5 className="fw-bold text-dark mb-4">Status Timeline</h5>
                  {requestInfo?.history && requestInfo.history.length > 0 ? (
              <div className="position-relative ps-3 border-start ms-2">
                {(requestInfo?.history).map((event, index) => (
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

          </div>
        </div>
      </div>
    </div>
    
                  
  );
};

export default RequestDetails;