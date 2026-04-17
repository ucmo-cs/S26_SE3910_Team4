import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Stepper from "../components/ui/Stepper";
import { page, stack, section, grid2, rowBetween, row } from "../styles/layout";
import { button, buttonPrimary, buttonGhost, buttonSecondary, divider, h2, input, label, muted } from "../styles/ui";

type Topic = { id: string; name: string; summary: string };
type Branch = { id: string; name: string; address: string; topicIds: string[] };
type Slot = { id: string; dateKey: string; dateLabel: string; timeLabel: string };
type AvailableDate = { key: string; label: string; weekday: string; dayNumber: string; isClosed: boolean };
type Appointment = {
  id: string;
  topicId: string;
  topicName: string;
  branchId: string;
  branchName: string;
  dateLabel: string;
  timeLabel: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  comments: string;
};

const topics: Topic[] = [
  {
    id: "t1",
    name: "Checking & Savings",
    summary: "Flexible account options for daily spending and long-term savings goals.",
  },
  {
    id: "t2",
    name: "Credit Cards",
    summary: "Card services with fraud monitoring, alerts, and account controls.",
  },
  {
    id: "t3",
    name: "Auto Loans",
    summary: "Competitive financing options for new and used vehicle purchases.",
  },
  {
    id: "t4",
    name: "Home Loans",
    summary: "Mortgage and refinance support with local lending specialists.",
  },
  {
    id: "t5",
    name: "Small Business",
    summary: "Business checking, payment tools, and lending support for growth.",
  },
  {
    id: "t6",
    name: "Financial Planning",
    summary: "Guidance for budgeting, saving, and milestone-based planning.",
  },
];

const branches: Branch[] = [
  { id: "b1", name: "Plaza Branch", address: "118 W 47th St", topicIds: ["t1", "t2", "t4", "t6"] },
  { id: "b2", name: "South State Line Branch", address: "8901 State Line Rd", topicIds: ["t1", "t2", "t3", "t5"] },
  { id: "b3", name: "Downtown Branch", address: "804 E 12th St", topicIds: ["t1", "t2", "t4", "t6"] },
  { id: "b4", name: "Rosedale Branch", address: "1906 W 43rd Ave", topicIds: ["t1", "t2", "t5"] },
  { id: "b5", name: "Brookside Branch", address: "6336 Brookside Plaza", topicIds: ["t1", "t2", "t3", "t4", "t6"] },
  { id: "b6", name: "Leawood Branch", address: "13441 State Line Rd", topicIds: ["t1", "t2", "t3", "t5", "t6"] },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});

const dayNumberFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function buildSlots(): Slot[] {
  const slots: Slot[] = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() + 3);

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  for (const date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const currentDate = new Date(date);

    if (currentDate.getDay() === 0) {
      continue;
    }

    const slotTimes =
      currentDate.getDay() === 6
        ? [
            { hour: 9, minute: 30 },
            { hour: 10, minute: 0 },
            { hour: 10, minute: 30 },
            { hour: 11, minute: 0 },
            { hour: 11, minute: 30 },
          ]
        : Array.from({ length: 16 }, (_, index) => ({
            hour: 9 + Math.floor(index / 2),
            minute: index % 2 === 0 ? 0 : 30,
          }));

    for (const { hour, minute } of slotTimes) {
      slots.push({
        id: `${currentDate.toISOString().slice(0, 10)}-${hour}-${minute}`,
        dateKey: currentDate.toISOString().slice(0, 10),
        dateLabel: dateFormatter.format(currentDate),
        timeLabel: timeFormatter.format(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour, minute)),
      });
    }
  }

  return slots;
}

const allSlots: Slot[] = buildSlots();

function buildAvailableDates(): AvailableDate[] {
  const dates: AvailableDate[] = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() + 3);

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  for (const date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const currentDate = new Date(date);
    dates.push({
      key: currentDate.toISOString().slice(0, 10),
      label: dateFormatter.format(currentDate),
      weekday: weekdayFormatter.format(currentDate),
      dayNumber: dayNumberFormatter.format(currentDate),
      isClosed: currentDate.getDay() === 0,
    });
  }

  return dates;
}

const DAYS_PER_WEEK_VIEW = 7;
const availableDates: AvailableDate[] = buildAvailableDates();

type StepId = "topic" | "branch" | "time" | "details" | "confirm";

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhoneNumber(value: string) {
  return /^\d{3}-\d{3}-\d{4}$/.test(value.trim());
}

function AppointmentCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedServiceId = searchParams.get("service");
  const initialTopicId = topics.some((topic) => topic.id === requestedServiceId) ? requestedServiceId ?? "" : "";

  const steps = ["Topic", "Branch", "Time", "Details", "Confirm"];
  const [step, setStep] = useState<StepId>(initialTopicId ? "branch" : "topic");

  const [topicId, setTopicId] = useState(initialTopicId);
  const [branchId, setBranchId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [selectedDateKey, setSelectedDateKey] = useState(availableDates.find((date) => !date.isClosed)?.key ?? "");

  const [customerName, setCustomerName] = useState(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (!userProfile) return "";
    try {
      const profile = JSON.parse(userProfile);
      return profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : "";
    } catch (e) {
      return "";
    }
  });
  const [customerEmail, setCustomerEmail] = useState(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (!userProfile) return "";
    try {
      const profile = JSON.parse(userProfile);
      return profile.email || "";
    } catch (e) {
      return "";
    }
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (!userProfile) return "";
    try {
      const profile = JSON.parse(userProfile);
      return profile.phone || "";
    } catch (e) {
      return "";
    }
  });
  const [comments, setComments] = useState("");
  const [weekStartIndex, setWeekStartIndex] = useState(0);

  const currentIndex = useMemo(() => {
    if (step === "topic") return 0;
    if (step === "branch") return 1;
    if (step === "time") return 2;
    if (step === "details") return 3;
    return 4;
  }, [step]);

  const selectedTopic = useMemo(() => topics.find((t) => t.id === topicId) ?? null, [topicId]);
  const availableBranches = useMemo(() => {
    if (!topicId) return [];
    return branches.filter((b) => b.topicIds.includes(topicId));
  }, [topicId]);

  const selectedBranch = useMemo(() => branches.find((b) => b.id === branchId) ?? null, [branchId]);
  const availableSlots = useMemo(
    () => allSlots.filter((slot) => slot.dateKey === selectedDateKey),
    [selectedDateKey],
  );
  const selectedSlot = useMemo(() => allSlots.find((s) => s.id === slotId) ?? null, [slotId]);
  const selectedDateIndex = useMemo(
    () => availableDates.findIndex((date) => date.key === selectedDateKey),
    [availableDates, selectedDateKey],
  );
  const visibleDates = useMemo(
    () => availableDates.slice(weekStartIndex, weekStartIndex + DAYS_PER_WEEK_VIEW),
    [availableDates, weekStartIndex],
  );

  useEffect(() => {
    if (!initialTopicId) return;

    setTopicId(initialTopicId);
    setBranchId("");
    setSlotId("");
    setSelectedDateKey(availableDates.find((date) => !date.isClosed)?.key ?? "");
    setWeekStartIndex(0);
    setStep("branch");
  }, [initialTopicId]);

  function goNext() {
    if (step === "topic") setStep("branch");
    else if (step === "branch") setStep("time");
    else if (step === "time") setStep("details");
    else if (step === "details") setStep("confirm");
  }

  function goBack() {
    if (step === "confirm") setStep("details");
    else if (step === "details") setStep("time");
    else if (step === "time") setStep("branch");
    else if (step === "branch") setStep("topic");
  }

  const canNext =
    (step === "topic" && !!topicId) ||
    (step === "branch" && !!branchId) ||
    (step === "time" && !!slotId) ||
    (step === "details" &&
      customerName.trim().length > 0 &&
      isValidEmail(customerEmail) &&
      isValidPhoneNumber(customerPhone)) ||
    step === "confirm";
  const showEmailError = step === "details" && customerEmail.trim().length > 0 && !isValidEmail(customerEmail);
  const showPhoneError = step === "details" && customerPhone.trim().length > 0 && !isValidPhoneNumber(customerPhone);

  function saveAppointment(appointment: Appointment) {
    try {
      const raw = localStorage.getItem("appointments");
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(appointment);
      localStorage.setItem("appointments", JSON.stringify(arr));
      console.debug("saveAppointment: success", appointment);
      return true;
    } catch (e) {
      console.warn("failed to persist appointment", e);
      return false;
    }
  }

  async function saveAppointmentToBackend(appointment: Omit<Appointment, 'id'>) {
    try {
      const response = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedAppointment = await response.json();
      console.debug("saveAppointmentToBackend: success", savedAppointment);
      return savedAppointment;
    } catch (e) {
      console.warn("failed to save appointment to backend", e);
      return null;
    }
  }

  async function submitMock() {
    const userId = localStorage.getItem("authUser") || "guest";
    const appointmentData = {
      topicId: selectedTopic?.id ?? "",
      topicName: selectedTopic?.name ?? "",
      branchId: selectedBranch?.id ?? "",
      branchName: selectedBranch?.name ?? "",
      dateLabel: selectedSlot?.dateLabel ?? "",
      timeLabel: selectedSlot?.timeLabel ?? "",
      customerName: customerName || "Guest",
      customerEmail: customerEmail || "",
      customerPhone: customerPhone || "",
      comments: comments.trim(),
      userId: userId,
    };

    console.debug("submitMock: attempting to save to backend", appointmentData);

    // Try to save to backend first
    const savedAppointment = await saveAppointmentToBackend(appointmentData);

    if (savedAppointment) {
      // Success - navigate with the saved appointment
      navigate(`/appointments/${savedAppointment.id}`, { state: savedAppointment });
    } else {
      // Fallback to localStorage
      console.warn("Backend save failed, falling back to localStorage");
      const id = `a-${Date.now()}`;
      const localAppointment = { id, ...appointmentData };
      const ok = saveAppointment(localAppointment);
      if (!ok) {
        alert("Failed to save appointment to localStorage (see console).");
        return;
      }
      navigate(`/appointments/${id}`, { state: localAppointment });
    }
  }

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Book an Appointment"
          subtitle="Select a topic, branch, time, then confirm."
          right={
            <Link to="/appointments" className={`${button} ${buttonSecondary}`}>
              View Appointments
            </Link>
          }
        />

        <Stepper steps={steps} currentIndex={currentIndex} />

        {step === "topic" ? (
          <Card>
            <div className={section}>
              <div className={h2}>1) What can we help you with?</div>
              <div className={muted}>Choose a service. Branches will filter based on support.</div>

              <div className={grid2}>
                {topics.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                      t.id === topicId
                        ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                        : "border-emerald-200 bg-emerald-50/50 text-emerald-950 hover:border-emerald-400 hover:bg-white"
                    }`}
                    onClick={() => {
                      setTopicId(t.id);
                      setBranchId("");
                      setSlotId("");
                      setSelectedDateKey(availableDates.find((date) => !date.isClosed)?.key ?? "");
                      setWeekStartIndex(0);
                    }}
                  >
                    <div className="font-semibold">{t.name}</div>
                    <div className={`mt-1 text-sm ${t.id === topicId ? "text-emerald-50" : "text-emerald-800"}`}>{t.summary}</div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ) : null}

        {step === "branch" ? (
          <Card>
            <div className={section}>
              <div className={h2}>2) Choose a branch</div>
              <div className={muted}>
                Topic: <span className="font-semibold">{selectedTopic ? selectedTopic.name : "None"}</span>
              </div>

              <div className={grid2}>
                {branches.map((b) => {
                  const supportsTopic = b.topicIds.includes(topicId);

                  return (
                    <div key={b.id} className="group relative">
                      <button
                        type="button"
                        disabled={!supportsTopic}
                        className={`w-full rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                          !supportsTopic
                            ? "cursor-not-allowed border-emerald-200 bg-slate-100 text-slate-400"
                            : b.id === branchId
                              ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                              : "border-emerald-200 bg-white text-emerald-950 hover:border-emerald-400 hover:bg-emerald-50/50"
                        }`}
                        onClick={() => {
                        if (!supportsTopic) return;
                        setBranchId(b.id);
                        setSlotId("");
                        setSelectedDateKey(availableDates.find((date) => !date.isClosed)?.key ?? "");
                        setWeekStartIndex(0);
                      }}
                    >
                        <div className="font-semibold">{b.name}</div>
                        <div className={`mt-1 text-sm ${!supportsTopic ? "text-slate-500" : b.id === branchId ? "text-emerald-100" : "text-emerald-700"}`}>
                          {b.address}
                        </div>
                      </button>

                      {!supportsTopic && selectedTopic ? (
                        <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-max max-w-64 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg group-hover:block">
                          This branch doesn't offer {selectedTopic.name}.
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {availableBranches.length === 0 ? (
                <div className={muted}>No branches support that topic (mock scenario).</div>
              ) : null}
            </div>
          </Card>
        ) : null}

        {step === "time" ? (
          <Card>
            <div className={section}>
              <div className={h2}>3) Select date & time (30 min slots)</div>
              <div className={muted}>
                Branch: <span className="font-semibold">{selectedBranch ? selectedBranch.name : "None"}</span>
              </div>

              <div className="relative py-1">
                <button
                  type="button"
                  className={`${button} ${buttonGhost} absolute left-0 top-1/2 z-10 -translate-y-1/2`}
                  disabled={weekStartIndex === 0}
                  onClick={() => {
                    if (weekStartIndex > 0) {
                      const nextWeekStart = Math.max(0, weekStartIndex - DAYS_PER_WEEK_VIEW);
                      setWeekStartIndex(nextWeekStart);
                      if (selectedDateIndex < nextWeekStart || selectedDateIndex >= weekStartIndex) {
                        setSelectedDateKey(availableDates[nextWeekStart].key);
                      }
                      setSlotId("");
                    }
                  }}
                >
                  Previous Week
                </button>

                <div className="overflow-x-auto px-28 pb-1">
                  <div className="flex min-w-max justify-center gap-4 px-1">
                  {visibleDates.map((date) => (
                    <button
                      key={date.key}
                      type="button"
                      disabled={date.isClosed}
                      className={`flex min-w-20 flex-col items-center rounded-xl border px-4 py-3 text-center transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                        date.isClosed
                          ? "cursor-not-allowed border-emerald-200 bg-slate-100 text-slate-400"
                          : date.key === selectedDateKey
                          ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                          : "border-emerald-200 bg-white text-emerald-900 hover:border-emerald-400 hover:bg-emerald-50"
                      }`}
                      onClick={() => {
                        if (date.isClosed) return;
                        setSelectedDateKey(date.key);
                        setSlotId("");
                      }}
                    >
                      <span className={`text-xs font-semibold uppercase tracking-wide ${date.isClosed ? "text-slate-500" : date.key === selectedDateKey ? "text-emerald-100" : "text-emerald-600"}`}>
                        {date.weekday}
                      </span>
                      <span className="mt-1 text-2xl font-semibold leading-none">{date.dayNumber}</span>
                      <span className={`mt-1 text-xs ${date.isClosed ? "text-slate-500" : date.key === selectedDateKey ? "text-emerald-100" : "text-emerald-700"}`}>
                        {date.label.replace(` ${date.dayNumber}`, "")}
                      </span>
                      {date.isClosed ? <span className="mt-1 text-xs font-medium text-slate-500">Closed</span> : null}
                    </button>
                  ))}
                  </div>
                </div>

                <button
                  type="button"
                  className={`${button} ${buttonGhost} absolute right-0 top-1/2 z-10 -translate-y-1/2`}
                  disabled={weekStartIndex + DAYS_PER_WEEK_VIEW >= availableDates.length}
                  onClick={() => {
                    if (weekStartIndex + DAYS_PER_WEEK_VIEW < availableDates.length) {
                      const nextWeekStart = weekStartIndex + DAYS_PER_WEEK_VIEW;
                      setWeekStartIndex(nextWeekStart);
                      if (selectedDateIndex < nextWeekStart || selectedDateIndex >= nextWeekStart + DAYS_PER_WEEK_VIEW) {
                        setSelectedDateKey(availableDates[nextWeekStart].key);
                      }
                      setSlotId("");
                    }
                  }}
                >
                  Next Week
                </button>
              </div>

              <div className={grid2}>
                {availableSlots.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`min-h-11 py-1.5 ${
                      s.id === slotId ? "bg-emerald-700 text-white" : "bg-white border border-emerald-300"
                    } ${button}`}
                    onClick={() => setSlotId(s.id)}
                  >
                    <span className="text-sm font-semibold">{s.timeLabel}</span>
                  </button>
                ))}
              </div>

              {availableSlots.length === 0 ? (
                <div className={muted}>This branch is closed on Sundays. Please choose another day.</div>
              ) : null}

            </div>
          </Card>
        ) : null}

        {step === "details" ? (
          <Card>
            <div className={section}>
              <div className={h2}>4) Your details</div>
              <div className={muted}>Enter your contact details for this appointment.</div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className={section}>
                  <div className={section}>
                    <div className={label}>Name</div>
                    <input
                      className={input}
                      placeholder="John Smith"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className={section}>
                    <div className={label}>Email</div>
                    <input
                      className={`${input} ${showEmailError ? "border-red-500 focus:ring-red-200" : ""}`}
                      type="email"
                      inputMode="email"
                      placeholder="name@example.com"
                      aria-invalid={showEmailError}
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                    {showEmailError ? <div className="mt-2 text-sm text-red-700">Enter a valid email address.</div> : null}
                  </div>

                  <div className={section}>
                    <div className={label}>Phone Number</div>
                    <input
                      className={`${input} ${showPhoneError ? "border-red-500 focus:ring-red-200" : ""}`}
                      inputMode="numeric"
                      placeholder="555-555-5555"
                      aria-invalid={showPhoneError}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(formatPhoneNumber(e.target.value))}
                    />
                    {showPhoneError ? <div className="mt-2 text-sm text-red-700">Enter a valid 10-digit phone number.</div> : null}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className={label}>Comments</div>
                  <textarea
                    className={`${input} h-full min-h-0 resize-none`}
                    placeholder="Add anything you'd like the branch to know before your appointment."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        {step === "confirm" ? (
          <Card>
            <div className={section}>
              <div className={h2}>5) Confirm Your Appointment</div>
              <div className={muted}>Review all details before completing your reservation.</div>

              <div className="mt-8 space-y-6">
                {/* Appointment Details Section */}
                <div className="rounded-lg bg-emerald-50 p-6 border border-emerald-200">
                  <div className="font-semibold text-emerald-950 mb-4">Appointment Details</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700">Topic:</span>
                      <span className="font-medium text-emerald-950">{selectedTopic ? selectedTopic.name : "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700">Branch:</span>
                      <span className="font-medium text-emerald-950">{selectedBranch ? selectedBranch.name : "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700">Date & Time:</span>
                      <span className="font-medium text-emerald-950">{selectedSlot ? `${selectedSlot.dateLabel} at ${selectedSlot.timeLabel}` : "-"}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="rounded-lg bg-blue-50 p-6 border border-blue-200">
                  <div className="font-semibold text-blue-950 mb-4">Your Information</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Name:</span>
                      <span className="font-medium text-blue-950">{customerName || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Email:</span>
                      <span className="font-medium text-blue-950 break-words text-right">{customerEmail || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700">Phone:</span>
                      <span className="font-medium text-blue-950">{customerPhone || "-"}</span>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {comments && (
                  <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
                    <div className="font-semibold text-gray-950 mb-2">Additional Notes</div>
                    <p className="text-gray-700">{comments}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button type="button" className={`${button} ${buttonPrimary} flex-1`} onClick={submitMock}>
                  ✓ Confirm & Reserve
                </button>
                <button type="button" className={`${button} ${buttonGhost}`} onClick={() => setStep("topic")}>
                  Start Over
                </button>
              </div>
            </div>
          </Card>
        ) : null}

        <Card>
          <div className={rowBetween}>
            <button type="button" className={`${button} ${buttonGhost}`} onClick={goBack} disabled={step === "topic"}>
              Back
            </button>

            <button
              type="button"
              className={`${button} ${buttonPrimary}`}
              onClick={goNext}
              disabled={!canNext || step === "confirm"}
            >
              Next
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AppointmentCreate;
