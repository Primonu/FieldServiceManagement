import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Sidebar from './Sidebar';

export interface Customer {
  id: number;
  name: string;
}

export interface Site {
  id: number;
  siteName: string;
  addressDetails: string;
}

export interface Technician {
  id: number;
  name?: string;
  fname?: string;
  lname?: string;
  specialization?: string;
}

export interface WorkOrderFormData {
  id: string;
  customerId: number | '';
  siteId: number | '';
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | '';
  status: 'Unassigned' | 'In Progress' | 'Completed' | 'On Hold';
  dueDate: string;
  technician: number | '';
}

function UpdateWorkOrder() {
  // Mock reference data lists
  const [customers] = useState<Customer[]>([
    { id: 101, name: 'ABC Corp' },
    { id: 102, name: 'XYZ Ltd' },
  ]);

  const [sites] = useState<Site[]>([
    { id: 1, siteName: 'Main Office', addressDetails: '123 Business Parkway' },
    { id: 2, siteName: 'West Warehouse', addressDetails: '456 Industrial Blvd' },
  ]);

  const [technicians] = useState<Technician[]>([
    { id: 201, fname: 'John', lname: 'Doe', specialization: 'HVAC' },
    { id: 202, fname: 'Sarah', lname: 'Smith', specialization: 'Electrical' },
    { id: 203, fname: 'Mike', lname: 'Johnson', specialization: 'Plumbing' },
  ]);

  // Initial State pre-populated with existing Work Order details
  const [formData, setFormData] = useState<WorkOrderFormData>({
    id: 'WO-1001',
    customerId: 101,
    siteId: 1,
    title: 'AC Unit Malfunction',
    description: 'Compressor is making loud noise and not cooling properly in room 302.',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-09-20',
    technician: 201,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'customerId' || name === 'siteId' || name === 'technician'
        ? value === '' ? '' : Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Updated Work Order Assignment:', formData);
    // Execute API PUT request here
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar activeItem="Work Orders" />
      <main className="flex-grow-1 overflow-auto p-3 p-md-4" style={{ minWidth: 0 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-xl-11">
            
            {/* Header section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold text-dark mb-1">Update Assigned Work</h3>
                <p className="text-muted small mb-0">
                  Modify details, adjust schedule priority, or reassign technician for order #{formData.id}
                </p>
              </div>
              <button 
                onClick={() => window.history.back()} 
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              >
                <i className="bi bi-arrow-left"></i> Back
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                
                {/* Section 1: Customer & Location */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm h-100 p-3">
                    <div className="card-body">
                      <h6 className="card-title fw-bold text-dark mb-4">
                        Customer & Location
                      </h6>

                      <div className="mb-3">
                        <label className="form-label small text-secondary">
                          Customer <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select text-muted"
                          name="customerId"
                          value={formData.customerId}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select customer</option>
                          {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small text-secondary">
                          Site Location <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select text-muted"
                          name="siteId"
                          value={formData.siteId}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select site</option>
                          {sites.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.siteName} ({s.addressDetails})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small text-secondary">
                          Status <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select text-muted"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          required
                        >
                          <option value="Unassigned">Unassigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Work Order Information */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm h-100 p-3">
                    <div className="card-body">
                      <h6 className="card-title fw-bold text-dark mb-4">
                        Work Order Information
                      </h6>

                      <div className="mb-3">
                        <label className="form-label small text-secondary">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small text-secondary">
                          Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Enter description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>

                      <div className="row">
                        <div className="col-6 mb-3">
                          <label className="form-label small text-secondary">
                            Priority <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select text-muted"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>

                        <div className="col-6 mb-3">
                          <label className="form-label small text-secondary">
                            Due Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control text-muted"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Assign Technician */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm h-100 p-3">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <div>
                        <h6 className="card-title fw-bold text-dark mb-4">
                          Assign Technician
                        </h6>

                        <div className="mb-3">
                          <label className="form-label small text-secondary">
                            Technician <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select text-muted"
                            name="technician"
                            value={formData.technician}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select technician</option>
                            {technicians.map((technician) => (
                              <option key={technician.id} value={technician.id}>
                                {technician.name || `${technician.fname || ''} ${technician.lname || ''}`.trim() || `Technician ${technician.id}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Action buttons embedded in the 3rd section */}
                      <div className="pt-4 border-top mt-auto d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          onClick={() => window.history.back()}
                          className="btn btn-outline-secondary px-3"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary px-4">
                          Update Work
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </form>

          </div>
        </div>
      </main>
    </div>
  );
}

export default UpdateWorkOrder;