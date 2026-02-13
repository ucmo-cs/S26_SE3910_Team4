import { useMemo } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, section } from "../styles/layout";
import { button, muted, divider } from "../styles/ui";

type Appointment = {
  id: string;
  topicId?: string;
  topicName?: string;
  branchId?: string;
  branchName?: string;
  dateLabel?: string;
  timeLabel?: string;
  customerName?: string;
  customerEmail?: string;
};

function AppointmentDetail() {
  const params = useParams();
  const location = useLocation();
  const appointmentId = params.appointmentId ?? "unknown";
  const appointment = useMemo(() => {
    const routeState = location.state as Appointment | null;
    if (routeState) return routeState;
    try {
      const raw = localStorage.getItem("appointments");
      const arr: Appointment[] = raw ? JSON.parse(raw) : [];
      return arr.find((a) => a.id === appointmentId) ?? null;
    } catch (e) {
      console.warn("failed to read appointments", e);
      return null;
    }
  }, [appointmentId, location.state]);

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
