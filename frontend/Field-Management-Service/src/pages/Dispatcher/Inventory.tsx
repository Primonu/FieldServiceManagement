import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import API from '../../services/api';

type Part = {
  sku: string;
  name: string;
  unitCost: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

const inventoryCacheKey = 'manager-inventory-parts';

function getCachedParts(): Part[] {
  try {
    const cachedParts = sessionStorage.getItem(inventoryCacheKey);
    return cachedParts ? JSON.parse(cachedParts) as Part[] : [];
  } catch {
    return [];
  }
}

function InventoryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [menuSku, setMenuSku] = useState<string | null>(null);
  const [parts, setParts] = useState<Part[]>(getCachedParts);
  const [loading, setLoading] = useState(() => getCachedParts().length === 0);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    const fetchParts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await API.get('parts', { params: { page: page - 1, size: pageSize } });
        const pageData = response.data?.data ?? response.data;
        const responseParts = Array.isArray(pageData) ? pageData : pageData?.content ?? [];
        setTotalPages(Math.max(1, pageData?.totalPages ?? 1));
        setTotalElements(pageData?.totalElements ?? responseParts.length);
        const normalizedParts = responseParts.map((part: { sku?: string; name?: string; partName?: string; unitCost?: number | string; stock?: number; stockQty?: number; status?: Part['status'] }) => {
          const stock = Number(part.stockQty ?? part.stock ?? 0);
          return {
            sku: part.sku ?? '',
            name: part.name ?? part.partName ?? '',
            unitCost: `$${Number(part.unitCost ?? 0).toFixed(2)}`,
            stock,
            status: part.status ?? (stock === 0 ? 'Out of Stock' : stock <= 3 ? 'Low Stock' : 'In Stock'),
          };
        });
        setParts(normalizedParts);
        sessionStorage.setItem(inventoryCacheKey, JSON.stringify(normalizedParts));
      } catch (requestError: unknown) {
        if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
          setError('Your session has expired. Please sign in again.');
        } else if (axios.isAxiosError(requestError) && requestError.response?.status === 403) {
          setError('You do not have the VIEW_PARTS permission.');
        } else if (axios.isAxiosError(requestError) && requestError.response?.data?.message) {
          setError(requestError.response.data.message);
        } else {
          setError('Unable to load inventory parts. Check that the backend is running.');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchParts();

    const refreshWhenActive = () => {
      if (document.visibilityState === 'visible') {
        void fetchParts();
      }
    };

    window.addEventListener('focus', refreshWhenActive);
    document.addEventListener('visibilitychange', refreshWhenActive);

    return () => {
      window.removeEventListener('focus', refreshWhenActive);
      document.removeEventListener('visibilitychange', refreshWhenActive);
    };
  }, [page]);

  const filteredParts = useMemo(() => {
    const term = search.toLowerCase().trim();
    return parts.filter((part) => {
      const matchesSearch = !term || `${part.sku} ${part.name}`.toLowerCase().includes(term);
      return matchesSearch && (status === 'All' || part.status === status);
    });
  }, [parts, search, status]);

  const safePage = Math.min(page, totalPages);
  const visibleParts = filteredParts;
  const changeFilter = (setter: (value: string) => void, value: string) => { setter(value); setPage(1); };
  const updateStock = (sku: string) => navigate(`/Dispatcher/Inventory/UpdateStock?sku=${encodeURIComponent(sku)}`);

  return (
    <div className="d-flex min-vh-100 bg-light" onClick={() => setMenuSku(null)}>
      <Sidebar activeItem="Inventory" />
      <main
        className="flex-grow-1 min-vh-100 overflow-auto p-3 p-md-4"
        style={{ minWidth: 0 }}
      >
        <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Parts &amp; Inventory</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 small"><li className="breadcrumb-item text-secondary">Home</li><li className="breadcrumb-item active" aria-current="page">Inventory</li></ol>
            </nav>
          </div>
        </header>

        <section className="card border-0 shadow-sm">
          <div className="card-body border-bottom">
            <div className="row g-2">
              <div className="col-12 col-lg-6"><div className="input-group"><span className="input-group-text bg-white"><i className="bi bi-search" /></span><input className="form-control" value={search} onChange={(event) => changeFilter(setSearch, event.target.value)} placeholder="Search parts by SKU or name..." /></div></div>
              <div className="col-12 col-sm-6 col-lg-3"><select className="form-select" value={status} onChange={(event) => changeFilter(setStatus, event.target.value)}><option value="All">Status: All</option><option value="In Stock">Status: In Stock</option><option value="Low Stock">Status: Low Stock</option><option value="Out of Stock">Status: Out of Stock</option></select></div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light"><tr><th className="text-uppercase small">SKU</th><th className="text-uppercase small">Part Name</th><th className="text-uppercase small">Unit Cost</th><th className="text-uppercase small">Stock Qty</th><th className="text-uppercase small">Status</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={6} className="text-center text-secondary py-5"><span className="spinner-border spinner-border-sm me-2" />Loading inventory...</td></tr> : error ? <tr><td colSpan={6} className="text-center text-danger py-5">{error}</td></tr> : visibleParts.length ? visibleParts.map((part) => (
                  <tr key={part.sku}>
                    <td className="font-monospace small text-secondary">{part.sku}</td><td className="fw-semibold">{part.name}</td><td>{part.unitCost}</td><td className="fw-semibold">{part.stock}</td>
                    <td><span className={`badge rounded-pill ${part.status === 'In Stock' ? 'text-bg-success' : part.status === 'Low Stock' ? 'text-bg-warning' : 'text-bg-danger'}`}>{part.status}</span></td>
                  </tr>
                )) : <tr><td colSpan={6} className="text-center text-secondary py-5">No inventory parts found.</td></tr>}
              </tbody>
            </table>
          </div>

          <footer className="card-footer bg-white d-flex flex-wrap justify-content-between align-items-center gap-2 text-secondary small">
            <span>Showing {totalElements === 0 ? 0 : (safePage - 1) * pageSize + 1} to {Math.min(safePage * pageSize, totalElements)} of {totalElements} entries</span>
            <nav aria-label="Inventory pagination"><ul className="pagination pagination-sm mb-0"><li className={`page-item ${safePage === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage((current) => Math.max(1, current - 1))} aria-label="Previous page"><i className="bi bi-chevron-left" /></button></li>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <li className={`page-item ${safePage === number ? 'active' : ''}`} key={number}><button className="page-link" onClick={() => setPage(number)}>{number}</button></li>)}<li className={`page-item ${safePage === totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} aria-label="Next page"><i className="bi bi-chevron-right" /></button></li></ul></nav>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default InventoryPage;