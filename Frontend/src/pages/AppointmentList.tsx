import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, grid2 } from "../styles/layout";
import { button, buttonSecondary, muted, emptyState } from "../styles/ui";

type Appointment = {
  id: number;
  topicId: string;
  topicName: string;
  branchId: string;
  branchName: string;
  dateLabel: string;
  timeLabel: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  comments?: string;
  userId?: string;
};

function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = useMemo(() => {
    try {
      return Boolean(localStorage.getItem("authUser"));
    } catch (e) {
      console.warn("failed to read auth state", e);
      return false;
    }
  }, []);

  useEffect(() => {
    async function fetchAppointments() {
      const userId = localStorage.getItem("authUser") || "guest";
      try {
        const response = await fetch(`http://localhost:8080/api/appointments?userId=${encodeURIComponent(userId)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Appointment[] = await response.json();
        setAppointments(data.sort((a, b) => `${a.dateLabel} ${a.timeLabel}`.localeCompare(`${b.dateLabel} ${b.timeLabel}`)));
      } catch (e) {
        console.warn("Failed to fetch appointments from backend, falling back to localStorage", e);
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem("appointments");
          const stored: Appointment[] = raw ? JSON.parse(raw) : [];
          setAppointments(stored
            .slice()
            .sort((a: Appointment, b: Appointment) => `${a.dateLabel} ${a.timeLabel}`.localeCompare(`${b.dateLabel} ${b.timeLabel}`)));
        } catch (localError) {
          console.warn("Failed to read from localStorage too", localError);
          setError("Failed to load appointments");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  const handleDeleteAppointment = async (appointmentId: number) => {
    const userId = localStorage.getItem("authUser") || "guest";
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
        alert("Appointment deleted successfully!");
      } else if (response.status === 403) {
        alert("You don't have permission to delete this appointment.");
      } else if (response.status === 404) {
        alert("Appointment not found.");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (e) {
      console.warn("Failed to delete appointment from backend", e);
      alert("Failed to delete appointment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className={page}>
        <div className={stack}>
          <PageHeader title="Appointments" subtitle="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Appointments"
          subtitle={isLoggedIn ? "Review your scheduled branch visits." : "Sign in to view and manage your scheduled appointments."}
          right={
            <Link to="/appointments/create" className={`${button} ${buttonSecondary}`}>
              Book New
            </Link>
          }
        />

        {!isLoggedIn ? (
          <div className={emptyState}>
            <div>You need to log in to view your appointments.</div>
            <div className="mt-4">
              <Link to="/login" className={`${button} ${buttonSecondary}`}>
                Go to Login
              </Link>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className={emptyState}>
            No appointments yet. <Link to="/appointments/create">Book one</Link>.
          </div>
        ) : (
          <div className={grid2}>
            {appointments.map((a) => (
              <Card key={a.id}>
                <div className="font-semibold">{a.topicName}</div>
                <div className={muted}>
                  {a.branchName} • {a.dateLabel} • {a.timeLabel}
                </div>
                <div className={`mt-3 ${muted}`}>Name: {a.customerName}</div>
                {a.customerPhone ? <div className={muted}>Phone: {a.customerPhone}</div> : null}

                <div className="mt-4 flex gap-2">
                  <Link to={`/appointments/${a.id}`} state={a} className={`${button} ${buttonSecondary}`}>
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDeleteAppointment(a.id)}
                    className={`${button} bg-red-600 hover:bg-red-700 text-white`}
                  >
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentList;
