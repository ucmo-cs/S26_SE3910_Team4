import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { page, row, stack } from "../styles/layout";
import { button, buttonPrimary, muted } from "../styles/ui";

type MenuSection = {
  id: string;
  label: string;
  headline: string;
  description: string;
  highlights: string[];
};

const menuSections: MenuSection[] = [
  {
    id: "about",
    label: "About",
    headline: "A community-first bank experience",
    description:
      "Commerce Bank supports everyday banking, long-term planning, and in-person guidance with teams that understand local needs.",
    highlights: [
      "Local branches with friendly, in-person support",
      "Digital tools for everyday banking access",
      "Clear products for personal and family goals",
    ],
  },
  {
    id: "personal",
    label: "Personal Banking",
    headline: "Accounts built for daily life",
    description:
      "Choose checking and savings options designed for simple money management, direct deposit, and online access.",
    highlights: [
      "Checking and savings account options",
      "Debit card access and account monitoring",
      "Support for account setup and questions",
    ],
  },
  {
    id: "lending",
    label: "Lending",
    headline: "Borrow with confidence",
    description:
      "From mortgages to auto loans, our lending teams help you choose terms that match your timeline and budget.",
    highlights: [
      "Mortgage and refinance guidance",
      "Auto and personal loan solutions",
      "One-on-one lending consultations",
    ],
  },
  {
    id: "support",
    label: "Branch Support",
    headline: "Schedule time with a specialist",
    description:
      "Book an appointment when you want dedicated branch support for account services, lending, or card questions.",
    highlights: [
      "Pick a topic, branch, and available time",
      "Review and confirm your branch visit",
      "Access your scheduled appointments anytime",
    ],
  },
];

function Home() {
  const [activeSectionId, setActiveSectionId] = useState("about");
  const activeSection = useMemo(
    () => menuSections.find((section) => section.id === activeSectionId) ?? menuSections[0],
    [activeSectionId],
  );

  return (
    <div className={page}>
      <div className={stack}>
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-6 py-8 text-white">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-semibold tracking-tight">Commerce Bank</h1>
              <p className="mt-3 text-emerald-50">
                Banking services for everyday needs, major milestones, and in-person guidance when you need it.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/appointments/create" className={`${button} ${buttonPrimary} border border-emerald-500`}>
                  Book Appointment
                </Link>
                <Link to="/appointments" className={`${button} bg-white text-emerald-900 hover:bg-emerald-100`}>
                  View Appointments
                </Link>
              </div>
            </div>

            <div className="relative h-48 overflow-hidden rounded-xl border border-emerald-300/40 bg-emerald-500/20 md:h-56">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 via-emerald-400/30 to-emerald-300/20" />
              <div className="absolute inset-0 bg-black/15" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-xs uppercase tracking-wide text-emerald-100">Image placeholder</div>
                <div className="text-lg font-semibold text-white">Hero image area</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative h-52 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="text-xs uppercase tracking-wide text-emerald-100">Image placeholder</div>
              <div className="text-lg font-semibold">Personal Banking</div>
            </div>
          </div>

          <div className="relative h-52 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="text-xs uppercase tracking-wide text-emerald-100">Image placeholder</div>
              <div className="text-lg font-semibold">Home & Auto Lending</div>
            </div>
          </div>

          <div className="relative h-52 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="text-xs uppercase tracking-wide text-emerald-100">Image placeholder</div>
              <div className="text-lg font-semibold">Branch Support</div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white/70 p-5">
          <div className="hidden border-b border-emerald-200 pb-2 md:flex md:gap-6">
            {menuSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`border-b-2 pb-2 text-sm font-semibold transition ${
                  section.id === activeSection.id
                    ? "border-emerald-700 text-emerald-900"
                    : "border-transparent text-emerald-700 hover:text-emerald-900"
                }`}
                onClick={() => setActiveSectionId(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <label className="mb-2 block text-sm font-semibold text-emerald-900" htmlFor="home-menu">
              Explore
            </label>
            <select
              id="home-menu"
              className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-300"
              value={activeSection.id}
              onChange={(e) => setActiveSectionId(e.target.value)}
            >
              {menuSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <h2 className="text-2xl font-semibold tracking-tight text-emerald-950">{activeSection.headline}</h2>
            <p className={`mt-2 ${muted}`}>{activeSection.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-emerald-900">
              {activeSection.highlights.map((highlight) => (
                <li key={highlight}>• {highlight}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-emerald-200 pt-4">
          <div className="text-sm font-semibold text-emerald-900">Quick links</div>
          <div className={`${row} mt-2 flex-wrap`}>
            <Link to="/appointments/create" className="text-sm font-medium text-emerald-800 hover:text-emerald-950">
              Book Branch Visit
            </Link>
            <Link to="/appointments" className="text-sm font-medium text-emerald-800 hover:text-emerald-950">
              Scheduled Appointments
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
