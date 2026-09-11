import { useEffect, useState } from "react";
import "./App.css";
import TicketDetail from "./TicketDetail";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tickets, setTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    subject: "",
    description: "",
  });

  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  /*
   * Fetch tickets using the current search and status filters.
   */
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (status) {
        params.append("status", status);
      }

      const url = params.toString()
        ? `${API_URL}?${params.toString()}`
        : API_URL;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to load tickets");
      }

      const data = await response.json();

      setTickets(data);
    } catch (err) {
      setError(err.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  /*
   * Fetch all tickets separately for dashboard statistics.
   * This makes the statistics independent of search/filter results.
   */
  const fetchAllTickets = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load ticket statistics");
      }

      const data = await response.json();

      setAllTickets(data);
    } catch (err) {
      console.error("Statistics error:", err);
    }
  };

  /*
   * Load filtered tickets whenever search or status changes.
   */
  useEffect(() => {
    fetchTickets();
  }, [search, status]);

  /*
   * Load all tickets once for statistics.
   */
  useEffect(() => {
    fetchAllTickets();
  }, []);

  /*
   * Clear search and status filters.
   */
  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
  };

  /*
   * Handle create-ticket form fields.
   */
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * Create a new ticket.
   */
  const handleCreateTicket = async (event) => {
    event.preventDefault();

    try {
      setCreating(true);
      setFormError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const messages = Object.values(data.errors);
          throw new Error(messages.join(". "));
        }

        throw new Error(data.message || "Failed to create ticket");
      }

      /*
       * Reset form after successful creation.
       */
      setFormData({
        customerName: "",
        customerEmail: "",
        subject: "",
        description: "",
      });

      setShowCreateForm(false);

      /*
       * Refresh both the ticket list and dashboard statistics.
       */
      await fetchTickets();
      await fetchAllTickets();
    } catch (err) {
      setFormError(err.message || "Failed to create ticket");
    } finally {
      setCreating(false);
    }
  };

  /*
   * Dashboard statistics.
   * These are calculated from ALL tickets, not filtered tickets.
   */
  const totalTickets = allTickets.length;

  const openTickets = allTickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = allTickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const closedTickets = allTickets.filter(
    (ticket) => ticket.status === "Closed"
  ).length;

  /*
   * If a ticket is selected, show the ticket detail page.
   */
  if (selectedTicketId) {
    return (
      <div className="app">

        <header className="topbar">
          <div>
            <h1>Support CRM</h1>
            <p>Customer support ticket management</p>
          </div>
        </header>

        <TicketDetail
          ticketId={selectedTicketId}
          onBack={() => setSelectedTicketId(null)}
        />

      </div>
    );
  }

  return (
    <div className="app">

      {/* Header */}
      <header className="topbar">

        <div>
          <h1>Support CRM</h1>
          <p>Customer support ticket management</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setShowCreateForm(true);
            setFormError("");
          }}
        >
          + New Ticket
        </button>

      </header>

      <main className="container">

        {/* Dashboard Statistics */}
        <section className="stats">

          <div className="stat-card">
            <span>Total Tickets</span>
            <strong>{totalTickets}</strong>
          </div>

          <div className="stat-card">
            <span>Open</span>
            <strong>{openTickets}</strong>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>{inProgressTickets}</strong>
          </div>

          <div className="stat-card">
            <span>Closed</span>
            <strong>{closedTickets}</strong>
          </div>

        </section>

        {/* Search and Filter */}
        <section className="toolbar">

          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by customer, ticket ID, email or description..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>

          {(search || status) && (
            <button
              type="button"
              className="secondary-button"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          )}

        </section>

        {/* Loading */}
        {loading && (
          <div className="message">
            Loading tickets...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Ticket List */}
        {!loading && !error && (
          <section className="ticket-section">

            <div className="section-header">

              <div>
                <h2>Tickets</h2>

                <p>
                  {search || status
                    ? `${tickets.length} matching tickets`
                    : `${tickets.length} tickets found`}
                </p>
              </div>

            </div>

            {tickets.length === 0 ? (

              <div className="empty-state">

                <h3>No tickets found</h3>

                <p>
                  {search || status
                    ? "Try changing your search or filter."
                    : "Create your first support ticket to get started."}
                </p>

                {(search || status) && (
                  <button
                    className="secondary-button"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                )}

              </div>

            ) : (

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>
                      <th>Ticket ID</th>
                      <th>Customer</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>

                  </thead>

                  <tbody>

                    {tickets.map((ticket) => (

                      <tr
                        key={ticket.ticket_id}
                        className="ticket-row"
                        onClick={() => {
                          setSelectedTicketId(
                            ticket.ticket_id
                          );
                        }}
                      >

                        <td>
                          <span className="ticket-link">
                            {ticket.ticket_id}
                          </span>
                        </td>

                        <td>
                          {ticket.customer_name}
                        </td>

                        <td>
                          {ticket.subject}
                        </td>

                        <td>

                          <span
                            className={`status-badge ${ticket.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {ticket.status}
                          </span>

                        </td>

                        <td>
                          {new Date(
                            ticket.created_at
                          ).toLocaleDateString()}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>
        )}

      </main>

      {/* Create Ticket Modal */}
      {showCreateForm && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>Create New Ticket</h2>

                <p>
                  Add a new customer support ticket
                </p>
              </div>

              <button
                className="close-button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormError("");
                }}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleCreateTicket}>

              {/* Form Error */}
              {formError && (
                <div className="form-error">
                  {formError}
                </div>
              )}

              {/* Customer Name */}
              <div className="form-group">

                <label htmlFor="customerName">
                  Customer Name
                </label>

                <input
                  id="customerName"
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleFormChange}
                  placeholder="Enter customer name"
                  required
                />

              </div>

              {/* Customer Email */}
              <div className="form-group">

                <label htmlFor="customerEmail">
                  Customer Email
                </label>

                <input
                  id="customerEmail"
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleFormChange}
                  placeholder="customer@example.com"
                  required
                />

              </div>

              {/* Subject */}
              <div className="form-group">

                <label htmlFor="subject">
                  Issue Title
                </label>

                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  placeholder="Briefly describe the issue"
                  required
                />

              </div>

              {/* Description */}
              <div className="form-group">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe the customer's issue..."
                  rows="5"
                  required
                />

              </div>

              {/* Form Actions */}
              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={creating}
                >
                  {creating
                    ? "Creating..."
                    : "Create Ticket"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;