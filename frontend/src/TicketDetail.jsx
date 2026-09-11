import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function TicketDetail({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);

  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/${ticketId}`);

      if (!response.ok) {
        throw new Error("Failed to load ticket");
      }

      const data = await response.json();

      setTicket(data);
      setStatus(data.status);
    } catch (err) {
      setError(err.message || "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
          notes: note,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update ticket"
        );
      }

      setNote("");
      setSuccess("Ticket updated successfully.");

      await fetchTicket();
    } catch (err) {
      setError(err.message || "Failed to update ticket");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="container">
        <div className="message">
          Loading ticket...
        </div>
      </main>
    );
  }

  if (error && !ticket) {
    return (
      <main className="container">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Tickets
        </button>

        <div className="error-message">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="container">

      {/* Back navigation */}
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Tickets
      </button>

      <section className="detail-section">

        {/* Ticket Header */}
        <div className="detail-header">

          <div>
            <p className="detail-label">
              Support Ticket
            </p>

            <h2>{ticket.ticket_id}</h2>
          </div>

          <span
            className={`status-badge ${ticket.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {ticket.status}
          </span>

        </div>


        {/* Customer and Subject */}
        <div className="detail-grid">

          <div className="detail-card">

            <p className="detail-label">
              Customer
            </p>

            <h3>
              {ticket.customer_name}
            </h3>

            <p className="detail-value">
              {ticket.customer_email}
            </p>

          </div>


          <div className="detail-card">

            <p className="detail-label">
              Issue
            </p>

            <h3>
              {ticket.subject}
            </h3>

          </div>

        </div>


        {/* Description */}
        <div className="detail-block">

          <p className="detail-label">
            Customer Description
          </p>

          <div className="description-box">
            {ticket.description}
          </div>

        </div>


        {/* Notes */}
        <div className="detail-block">

          <div className="notes-heading">

            <div>
              <p className="detail-label">
                Activity
              </p>

              <h3>
                Notes & Comments
              </h3>
            </div>

            <span className="notes-count">
              {ticket.notes?.length || 0}
              {" "}
              {ticket.notes?.length === 1
                ? "note"
                : "notes"}
            </span>

          </div>


          {ticket.notes &&
          ticket.notes.length > 0 ? (

            <div className="notes-list">

              {ticket.notes.map((item, index) => (

                <div
                  className="note-card"
                  key={`${item.created_at}-${index}`}
                >

                  <div className="note-icon">
                    ✓
                  </div>

                  <div className="note-content">

                    <p>
                      {item.note_text}
                    </p>

                    <span>
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="no-notes">
              No notes have been added yet.
            </div>

          )}

        </div>


        {/* Update Ticket */}
        <form
          className="update-section"
          onSubmit={handleUpdate}
        >

          <div className="update-header">

            <p className="detail-label">
              Manage Ticket
            </p>

            <h3>
              Update Ticket
            </h3>

            <p className="update-description">
              Change the ticket status or add an internal
              note about this issue.
            </p>

          </div>


          {/* Error */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}


          {/* Success */}
          {success && (
            <div className="success-message">
              ✓ {success}
            </div>
          )}


          {/* Status */}
          <div className="form-group">

            <label htmlFor="ticket-status">
              Status
            </label>

            <select
              id="ticket-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="Open">
                Open
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>

          </div>


          {/* Note */}
          <div className="form-group">

            <label htmlFor="ticket-note">
              Add Note / Comment
            </label>

            <textarea
              id="ticket-note"
              value={note}
              onChange={(event) =>
                setNote(event.target.value)
              }
              placeholder="Add an update or comment..."
              rows="4"
            />

          </div>


          {/* Action */}
          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={updating}
            >
              {updating
                ? "Updating..."
                : "Update Ticket"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}

export default TicketDetail;