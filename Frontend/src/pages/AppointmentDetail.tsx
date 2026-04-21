import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, section } from "../styles/layout";
import { button, muted, divider } from "../styles/ui";

type Appointment = {
  id: number;
  topicId?: string;
  topicName?: string;
  branchId?: string;
  branchName?: string;
  dateLabel?: string;
  timeLabel?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  comments?: string;
  userId?: string;
};

function AppointmentDetail() {
  const params = useParams();
  const location = useLocation();
  const appointmentId = params.appointmentId ?? "unknown";
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointment() {
      // First check if we have it from route state
      const routeState = location.state as Appointment | null;
      if (routeState) {
        setAppointment(routeState);
        setLoading(false);
        return;
      }

      // Try to fetch from backend
      try {
        const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Appointment = await response.json();
        setAppointment(data);
      } catch (e) {
        console.warn("Failed to fetch appointment from backend, falling back to localStorage", e);
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem("appointments");
          const arr: Appointment[] = raw ? JSON.parse(raw) : [];
          const found = arr.find((a) => a.id.toString() === appointmentId) ?? null;
          setAppointment(found);
        } catch (localError) {
          console.warn("Failed to read from localStorage too", localError);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAppointment();
  }, [appointmentId, location.state]);

  if (loading) {
    return (
      <div className={page}>
        <div className={stack}>
          <PageHeader title="Appointment" subtitle="Loading..." />
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className={page}>
        <div className={stack}>
          <PageHeader
            title="Appointment"
            subtitle="Appointment not found"
            right={
              <Link to="/appointments" className={button}>
                Back to List
              </Link>
            }
          />

          <Card>
            <div className={section}>
              <div className="font-semibold">Appointment ID</div>
              <div className={muted}>{appointmentId}</div>

              <div className={divider} />

              <div>Appointment not found.</div>
            </div>
          </Card>

          <Link to="/appointments/create" className={button}>
            Book Another Appointment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Appointment Confirmation"
          subtitle="Reservation details"
          right={
            <Link to="/appointments" className={button}>
              Back to List
            </Link>
          }
        />

        <Card>
          <div className={section}>
            <div className="font-semibold">Appointment ID</div>
            <div className={muted}>{appointment.id}</div>

            <div className={divider} />

            <div className="font-semibold">Summary</div>
            <div className={muted}>Topic: {appointment.topicName ?? "-"}</div>
            <div className={muted}>Branch: {appointment.branchName ?? "-"}</div>
            <div className={muted}>
              Time: {appointment.dateLabel ?? "-"}
              {appointment.dateLabel && appointment.timeLabel ? " • " : ""}
              {appointment.timeLabel ?? ""}
            </div>
            <div className={muted}>Name: {appointment.customerName ?? "-"}</div>
            <div className={muted}>Email: {appointment.customerEmail ?? "-"}</div>
            <div className={muted}>Phone: {appointment.customerPhone ?? "-"}</div>
            <div className={muted}>Comments: {appointment.comments ?? "-"}</div>

            <div className={divider} />
          </div>
        </Card>

        <Link to="/appointments/create" className={button}>
          Book Another Appointment
        </Link>
      </div>
    </div>
  );
}

export default AppointmentDetail;
