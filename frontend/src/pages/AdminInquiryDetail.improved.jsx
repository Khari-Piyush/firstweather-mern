import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaFilePdf, FaFileExcel, FaPrint } from "react-icons/fa";
import api from "../api.improved";
import "../components/LazySection.improved.css";
import "./AdminInquiryDetail.improved.css";

const STATUS_OPTIONS = ["New", "Contacted", "Quotation Sent", "Negotiation", "Confirmed", "Closed"];

const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const AdminInquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/inquiries/${id}`);
        setInquiry(res.data);
      } catch {
        setError("Failed to load inquiry.");
      } finally {
        setLoading(false);
      }
    };
    fetchInquiry();
  }, [id]);

  const handleStatusChange = async (e) => {
    const status = e.target.value;
    const prevStatus = inquiry.status;
    setInquiry((cur) => ({ ...cur, status }));
    setStatusSaving(true);
    try {
      const res = await api.patch(`/inquiries/${id}/status`, { status });
      setInquiry(res.data);
      toast.success("Status updated");
    } catch {
      setInquiry((cur) => ({ ...cur, status: prevStatus }));
      toast.error("Failed to update status");
    } finally {
      setStatusSaving(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    const text = noteText.trim();
    if (!text) return;
    setNoteSaving(true);
    try {
      const res = await api.post(`/inquiries/${id}/notes`, { text });
      setInquiry(res.data);
      setNoteText("");
      toast.success("Note added");
    } catch {
      toast.error("Failed to add note");
    } finally {
      setNoteSaving(false);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const { default: ExcelJS } = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Inquiry");
      sheet.columns = [
        { header: "Field", key: "field", width: 22 },
        { header: "Value", key: "value", width: 50 },
      ];
      sheet.getRow(1).font = { bold: true };

      sheet.addRows([
        { field: "Inquiry ID", value: inquiry.inquiryId },
        { field: "Date", value: formatDateTime(inquiry.createdAt) },
        { field: "Status", value: inquiry.status },
        { field: "Customer Name", value: inquiry.customerName },
        { field: "Company", value: inquiry.company || "-" },
        { field: "Email", value: inquiry.customerEmail },
        { field: "Phone", value: inquiry.customerPhone },
        { field: "City", value: inquiry.city || "-" },
        { field: "Country", value: inquiry.country || "-" },
        { field: "Customer Notes", value: inquiry.notes || "-" },
      ]);

      sheet.addRow([]);
      const itemsHeaderRow = sheet.addRow(["Product Code", "Product Name", "Quantity"]);
      itemsHeaderRow.font = { bold: true };

      inquiry.items.forEach((item) => {
        sheet.addRow([item.productCode || "-", item.productName, item.qty]);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${inquiry.inquiryId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to export Excel file");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="fw-admin-inq-detail">
        <div className="fw-admin-inq-detail__skeleton">
          <div className="fw-lazy-skeleton" style={{ height: 32, width: "240px" }} />
          <div className="fw-lazy-skeleton" style={{ height: 120 }} />
          <div className="fw-lazy-skeleton" style={{ height: 200 }} />
        </div>
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="fw-admin-inq-detail">
        <p className="fw-admin-inq-detail__error">{error || "Inquiry not found."}</p>
        <button onClick={() => navigate("/admin/inquiries")} className="fw-admin-inq-detail__back">
          <FaArrowLeft aria-hidden="true" /> Back to Inquiries
        </button>
      </div>
    );
  }

  return (
    <div className="fw-admin-inq-detail">
      <div className="fw-admin-inq-detail__toolbar fw-no-print">
        <Link to="/admin/inquiries" className="fw-admin-inq-detail__back">
          <FaArrowLeft aria-hidden="true" /> Back to Inquiries
        </Link>

        <div className="fw-admin-inq-detail__actions">
          {inquiry.pdfUrl && (
            <a
              href={inquiry.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="fw-admin-inq-detail__btn"
            >
              <FaFilePdf aria-hidden="true" /> Download PDF
            </a>
          )}
          <button onClick={handleExportExcel} disabled={exporting} className="fw-admin-inq-detail__btn">
            <FaFileExcel aria-hidden="true" /> {exporting ? "Exporting…" : "Export to Excel"}
          </button>
          <button onClick={() => window.print()} className="fw-admin-inq-detail__btn">
            <FaPrint aria-hidden="true" /> Print
          </button>
        </div>
      </div>

      <div className="fw-admin-inq-detail__header">
        <div>
          <h1 className="fw-admin-inq-detail__title">{inquiry.inquiryId}</h1>
          <p className="fw-admin-inq-detail__date">Submitted {formatDateTime(inquiry.createdAt)}</p>
        </div>

        <div className="fw-admin-inq-detail__status fw-no-print">
          <label htmlFor="fw-status-select">Status</label>
          <select
            id="fw-status-select"
            value={inquiry.status}
            onChange={handleStatusChange}
            disabled={statusSaving}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <p className="fw-admin-inq-detail__status-print fw-print-only">Status: {inquiry.status}</p>
      </div>

      <div className="fw-admin-inq-detail__grid">
        <section className="fw-admin-inq-detail__card">
          <h2>Customer Details</h2>
          <dl>
            <div>
              <dt>Name</dt>
              <dd>{inquiry.customerName}</dd>
            </div>
            {inquiry.company && (
              <div>
                <dt>Company</dt>
                <dd>{inquiry.company}</dd>
              </div>
            )}
            <div>
              <dt>Email</dt>
              <dd>{inquiry.customerEmail}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{inquiry.customerPhone}</dd>
            </div>
            {inquiry.city && (
              <div>
                <dt>City</dt>
                <dd>{inquiry.city}</dd>
              </div>
            )}
            {inquiry.country && (
              <div>
                <dt>Country</dt>
                <dd>{inquiry.country}</dd>
              </div>
            )}
          </dl>
        </section>

        {inquiry.notes && (
          <section className="fw-admin-inq-detail__card">
            <h2>Customer Notes</h2>
            <p className="fw-admin-inq-detail__notes-text">{inquiry.notes}</p>
          </section>
        )}
      </div>

      <section className="fw-admin-inq-detail__card">
        <h2>Requested Products ({inquiry.items.length})</h2>
        <div className="fw-admin-inq-detail__table-wrap">
          <table className="fw-admin-inq-detail__table">
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {inquiry.items.map((item, i) => (
                <tr key={i}>
                  <td data-label="Product Code">{item.productCode || "-"}</td>
                  <td data-label="Product Name">{item.productName}</td>
                  <td data-label="Quantity">{item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="fw-admin-inq-detail__card fw-no-print">
        <h2>Internal Notes</h2>
        <p className="fw-admin-inq-detail__hint">
          Visible to admins only. Notes can&apos;t be edited or removed once added.
        </p>

        {inquiry.internalNotes?.length > 0 ? (
          <ul className="fw-admin-inq-detail__notes-list">
            {inquiry.internalNotes.map((note, i) => (
              <li key={i}>
                <span className="fw-admin-inq-detail__note-date">{formatDateTime(note.createdAt)}</span>
                <p>{note.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="fw-admin-inq-detail__hint">No internal notes yet.</p>
        )}

        <form onSubmit={handleAddNote} className="fw-admin-inq-detail__note-form">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add an internal note…"
            rows={3}
            required
          />
          <button type="submit" disabled={noteSaving || !noteText.trim()}>
            {noteSaving ? "Adding…" : "Add Note"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminInquiryDetail;
