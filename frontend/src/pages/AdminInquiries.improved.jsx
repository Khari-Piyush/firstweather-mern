import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaClipboardList } from "react-icons/fa";
import api from "../api.improved";
import "../components/LazySection.improved.css";
import "./AdminInquiries.improved.css";

const STATUS_OPTIONS = ["New", "Contacted", "Quotation Sent", "Negotiation", "Confirmed", "Closed"];

const STATUS_CLASS = {
  New: "fw-status--new",
  Contacted: "fw-status--contacted",
  "Quotation Sent": "fw-status--quotation",
  Negotiation: "fw-status--negotiation",
  Confirmed: "fw-status--confirmed",
  Closed: "fw-status--closed",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const SortIcon = ({ column, sort }) => {
  if (sort.key !== column) {
    return <FaSort aria-hidden="true" className="fw-admin-inq__sort-icon" />;
  }
  return sort.dir === "asc" ? (
    <FaSortUp aria-hidden="true" className="fw-admin-inq__sort-icon fw-admin-inq__sort-icon--active" />
  ) : (
    <FaSortDown aria-hidden="true" className="fw-admin-inq__sort-icon fw-admin-inq__sort-icon--active" />
  );
};

const AdminInquiries = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState({ key: "createdAt", dir: "desc" });

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/inquiries");
        setInquiries(res.data);
      } catch {
        setError("Failed to load inquiries. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    let rows = inquiries.filter((inq) => {
      if (statusFilter && inq.status !== statusFilter) return false;
      if (!q) return true;
      return (
        inq.inquiryId?.toLowerCase().includes(q) ||
        inq.customerName?.toLowerCase().includes(q) ||
        inq.customerEmail?.toLowerCase().includes(q) ||
        inq.customerPhone?.toLowerCase().includes(q)
      );
    });

    rows = [...rows].sort((a, b) => {
      let av;
      let bv;
      switch (sort.key) {
        case "inquiryId":
          av = a.inquiryId;
          bv = b.inquiryId;
          break;
        case "customerName":
          av = a.customerName;
          bv = b.customerName;
          break;
        case "products":
          av = a.items?.length || 0;
          bv = b.items?.length || 0;
          break;
        case "status":
          av = a.status;
          bv = b.status;
          break;
        default:
          av = new Date(a.createdAt).getTime();
          bv = new Date(b.createdAt).getTime();
      }
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [inquiries, search, statusFilter, sort]);

  return (
    <div className="fw-admin-inq">
      <div className="fw-admin-inq__header">
        <h1 className="fw-admin-inq__title">Inquiries</h1>
        <p className="fw-admin-inq__subtitle">
          {loading
            ? "Loading…"
            : `${filtered.length} of ${inquiries.length} inquir${inquiries.length === 1 ? "y" : "ies"}`}
        </p>
      </div>

      <div className="fw-admin-inq__toolbar">
        <div className="fw-admin-inq__search">
          <FaSearch aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by Inquiry ID, name, email or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search inquiries"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="fw-admin-inq__filter"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="fw-admin-inq__error">{error}</p>}

      <div className="fw-admin-inq__table-wrap">
        <table className="fw-admin-inq__table">
          <thead>
            <tr>
              <th onClick={() => handleSort("inquiryId")}>
                Inquiry ID <SortIcon column="inquiryId" sort={sort} />
              </th>
              <th onClick={() => handleSort("customerName")}>
                Customer <SortIcon column="customerName" sort={sort} />
              </th>
              <th>Phone</th>
              <th>Email</th>
              <th onClick={() => handleSort("products")}>
                Total Products <SortIcon column="products" sort={sort} />
              </th>
              <th onClick={() => handleSort("createdAt")}>
                Date <SortIcon column="createdAt" sort={sort} />
              </th>
              <th onClick={() => handleSort("status")}>
                Status <SortIcon column="status" sort={sort} />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="fw-admin-inq__skeleton-row">
                  <td colSpan={7}>
                    <div className="fw-lazy-skeleton" style={{ height: 20, borderRadius: "var(--fw-radius-sm)" }} />
                  </td>
                </tr>
              ))}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="fw-admin-inq__empty">
                  <FaClipboardList aria-hidden="true" />
                  <p>No inquiries found{search || statusFilter ? " for the current filters." : "."}</p>
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((inq) => (
                <tr key={inq._id} onClick={() => navigate(`/admin/inquiries/${inq._id}`)}>
                  <td data-label="Inquiry ID" className="fw-admin-inq__id">
                    {inq.inquiryId}
                  </td>
                  <td data-label="Customer">
                    {inq.customerName}
                    {inq.company ? ` (${inq.company})` : ""}
                  </td>
                  <td data-label="Phone">{inq.customerPhone}</td>
                  <td data-label="Email">{inq.customerEmail}</td>
                  <td data-label="Total Products">{inq.items?.length || 0}</td>
                  <td data-label="Date">{formatDate(inq.createdAt)}</td>
                  <td data-label="Status">
                    <span className={`fw-status-badge ${STATUS_CLASS[inq.status] || ""}`}>{inq.status}</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInquiries;
