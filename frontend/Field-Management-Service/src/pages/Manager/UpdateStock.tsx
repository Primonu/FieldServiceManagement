import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import API from '../../services/api';

const inventoryCacheKey = 'manager-inventory-parts';

type Part = {
  id: number;
  sku: string;
  name?: string;
  partName?: string;
  unitCost?: number | string;
  stock?: number;
  stockQty?: number;
};

function UpdateStock(){
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedSku = searchParams.get('sku') ?? '';
  const [submitted, setSubmitted] = useState(false);
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState(selectedSku);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'reduce'>('add');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await API.get('parts', { params: { page: 0, size: 100 } });
        const pageData = response.data?.data ?? response.data;
        const fetchedParts = Array.isArray(pageData) ? pageData : pageData?.content ?? [];
        setParts(fetchedParts);
        if (selectedSku) {
          const matchingPart = fetchedParts.find((part: Part) => part.sku === selectedSku);
          if (matchingPart) {
            setSelectedPart(String(matchingPart.id));
            setUnitCost(String(matchingPart.unitCost ?? ''));
          }
        }
      } catch (requestError: unknown) {
        if (axios.isAxiosError(requestError) && requestError.response?.status === 403) {
          setError('You do not have the VIEW_PARTS permission.');
        } else {
          setError('Unable to load parts. Check that the backend is running.');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchParts();
  }, [selectedSku]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const part = parts.find((item) => String(item.id) === selectedPart);
    const amount = Number(quantity);
    if (!part || !amount) return;

    const currentStock = Number(part.stockQty ?? part.stock ?? 0);
    const updatedUnitCost = Number(unitCost);
    if (!Number.isFinite(updatedUnitCost) || updatedUnitCost < 0) {
      setError('Enter a valid unit cost.');
      return;
    }
    const updatedStock = adjustmentType === 'add' ? currentStock + amount : currentStock - amount;
    if (updatedStock < 0) {
      setError('Stock quantity cannot be negative.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await API.put(`parts/${part.id}`, {
        sku: part.sku,
        name: part.name ?? part.partName,
        unitCost: updatedUnitCost,
        stockQty: updatedStock,
      });
      const updatedPart = response.data?.data ?? response.data;
      try {
        const cachedParts = JSON.parse(sessionStorage.getItem(inventoryCacheKey) ?? '[]') as Array<{
          sku: string;
          name: string;
          unitCost: string;
          stock: number;
          status: string;
        }>;
        const updatedCache = cachedParts.map((cachedPart) => {
          if (cachedPart.sku !== part.sku) return cachedPart;
          const stock = Number(updatedPart?.stockQty ?? updatedPart?.stock ?? updatedStock);
          return {
            ...cachedPart,
            name: updatedPart?.name ?? updatedPart?.partName ?? cachedPart.name,
            unitCost: `$${Number(updatedPart?.unitCost ?? updatedUnitCost).toFixed(2)}`,
            stock,
            status: stock === 0 ? 'Out of Stock' : stock <= 3 ? 'Low Stock' : 'In Stock',
          };
        });
        sessionStorage.setItem(inventoryCacheKey, JSON.stringify(updatedCache));
      } catch {
        // The next inventory fetch will restore the cache if storage is unavailable.
      }
      setSubmitted(true);
      setQuantity('');
      window.setTimeout(() => navigate('/Manager/Inventory'), 500);
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 403) {
        setError('You do not have the UPDATE_PARTS permission.');
      } else if (axios.isAxiosError(requestError) && requestError.response?.data?.message) {
        setError(requestError.response.data.message);
      } else {
        setError('Unable to update stock. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell d-flex bg-light min-vh-100">
      <Sidebar activeItem='Parts & Inventory'/>
      <main className="main d-flex justify-content-center align-items-start py-4" style={{minWidth:0}}>
        <div className="card border-0 shadow-sm w-100" style={{ maxWidth: 560 }}>
          <div className="card-body p-4">
            <div className="mb-4">
              <h1 className="h4 fw-bold mb-1">Update Stock Quantity</h1>
              <p className="text-muted small mb-0">Restock or manually adjust inventory levels.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Select Part</label>
                <select className="form-select" value={selectedPart} onChange={(event) => { const value = event.target.value; const part = parts.find((item) => String(item.id) === value); setSelectedPart(value); setUnitCost(String(part?.unitCost ?? '')); }} required disabled={loading || Boolean(error)}>
                  <option value="">{loading ? 'Loading parts...' : 'Choose a part'}</option>
                  {parts.map((part) => {
                    const stock = Number(part.stockQty ?? part.stock ?? 0);
                    return <option key={part.id} value={part.id}>{part.sku} - {part.name ?? part.partName ?? 'Unnamed part'} (Current: {stock})</option>;
                  })}
                </select>
                {error && <div className="text-danger small mt-2">{error}</div>}
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Unit Cost ($)</label>
                  <input type="number" min="0" step="0.01" placeholder="0.00" className="form-control" value={unitCost} onChange={(event) => setUnitCost(event.target.value)} required disabled={loading || Boolean(error)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Adjustment Type</label>
                  <select className="form-select" value={adjustmentType} onChange={(event) => setAdjustmentType(event.target.value as 'add' | 'reduce')} required>
                    <option value="add">+ Add Stock (Restock)</option>
                    <option value="reduce">- Reduce Stock (Correction)</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Quantity</label>
                  <input type="number" min="1" placeholder="0" className="form-control" value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
                </div>
              </div>

              {submitted && <div className="alert alert-success mt-4 mb-0">Stock update recorded. Refreshing inventory...</div>}
              <div className="d-flex justify-content-end gap-2 border-top mt-4 pt-3">
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/Manager/Inventory')}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || loading}>{saving ? 'Updating...' : 'Update Stock'}</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
export default UpdateStock;