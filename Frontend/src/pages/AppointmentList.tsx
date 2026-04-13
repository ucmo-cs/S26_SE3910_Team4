import { useMemo } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, grid2 } from "../styles/layout";
import { button, buttonSecondary, muted, emptyState } from "../styles/ui";

type Appointment = {
  id: string;
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
};

function AppointmentList() {
  const isLoggedIn = useMemo(() => {
    try {
      return Boolean(localStorage.getItem("authUser"));
    } catch (e) {
      console.warn("failed to read auth state", e);
      return false;
    }
  }, []);

  const appointments = useMemo(() => {
    try {
      const raw = localStorage.getItem("appointments");
      const stored: Appointment[] = raw ? JSON.parse(raw) : [];
      return stored
        .slice()
        .sort((a: Appointment, b: Appointment) => `${a.dateLabel} ${a.timeLabel}`.localeCompare(`${b.dateLabel} ${b.timeLabel}`));
    } catch (e) {
      console.warn("failed to read appointments", e);
      return [];
    }
  }, []);

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

                <div className="mt-4">
                  <Link to={`/appointments/${a.id}`} state={a} className={`${button} ${buttonSecondary}`}>
                    View Details
                  </Link>
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
