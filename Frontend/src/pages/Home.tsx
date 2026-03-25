import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-image.png";
import { page, stack } from "../styles/layout";
import { button, buttonPrimary, muted } from "../styles/ui";

type MenuSection = {
  id: string;
  label: string;
  headline: string;
  description: string;
  highlights: string[];
};

type Service = {
  title: string;
  summary: string;
};

type Faq = {
  q: string;
  a: string;
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

const services: Service[] = [
  { title: "Checking & Savings", summary: "Flexible account options for daily spending and long-term savings goals." },
  { title: "Credit Cards", summary: "Card services with fraud monitoring, alerts, and account controls." },
  { title: "Home Loans", summary: "Mortgage and refinance support with local lending specialists." },
  { title: "Auto Loans", summary: "Competitive financing options for new and used vehicle purchases." },
  { title: "Small Business", summary: "Business checking, payment tools, and lending support for growth." },
  { title: "Financial Planning", summary: "Guidance for budgeting, saving, and milestone-based planning." },
];

const faqs: Faq[] = [
  { q: "How do I book a branch appointment?", a: "Use Book Appointment in the hero section, select topic, branch, and available time slot." },
  { q: "Can I view my scheduled visits later?", a: "Yes. Open View Appointments to review upcoming and previously booked mock appointments." },
  { q: "What services can I discuss in branch?", a: "Account opening, card support, lending questions, and general banking assistance." },
  { q: "Is this site connected to a live backend?", a: "This prototype uses local storage and mock data for demonstration." },
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
                Banking services for everyday needs, major milestones, and
                <br />
                in-person guidance when you need it.
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
              <img src={heroImage} alt="Commerce Bank team helping customers at a branch" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-emerald-700/45" />
              <div className="absolute inset-0 bg-black/15" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-xs uppercase tracking-wide text-emerald-100">Branch Experience</div>
                <div className="text-lg font-semibold text-white">Personal support for every financial step</div>
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

        <section className="rounded-2xl bg-white px-5 py-6">
          <div className="text-xl font-semibold text-emerald-950">Featured Services</div>
          <p className={`mt-1 ${muted}`}>Explore common products and support options available across branches and digital channels.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="font-semibold text-emerald-950">{service.title}</div>
                <div className="mt-1 text-sm text-emerald-800">{service.summary}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white px-5 py-6">
          <div className="text-xl font-semibold text-emerald-950">Community Impact</div>
          <p className={`mt-2 ${muted}`}>
            We support local neighborhoods through volunteer events, education programs, and small business initiatives.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 p-4">
              <div className="text-sm font-semibold text-emerald-950">Financial literacy programs</div>
              <div className="mt-1 text-sm text-emerald-800">
                Workshops and coaching sessions for students, families, and first-time account holders.
              </div>
            </div>
            <div className="rounded-lg border border-emerald-200 p-4">
              <div className="text-sm font-semibold text-emerald-950">Small business partnerships</div>
              <div className="mt-1 text-sm text-emerald-800">
                Local sponsorships, mentoring programs, and practical business banking support.
              </div>
            </div>
            <div className="rounded-lg border border-emerald-200 p-4">
              <div className="text-sm font-semibold text-emerald-950">Community service projects</div>
              <div className="mt-1 text-sm text-emerald-800">
                Employee volunteer initiatives focused on neighborhood revitalization and outreach.
              </div>
            </div>
            <div className="rounded-lg border border-emerald-200 p-4">
              <div className="text-sm font-semibold text-emerald-950">Local impact grants</div>
              <div className="mt-1 text-sm text-emerald-800">
                Funding support for nonprofits and programs that improve education and financial wellbeing.
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-emerald-900 px-6 py-8 text-white">
          <div className="text-2xl font-semibold">Need help from a banker?</div>
          <p className="mt-2 max-w-2xl text-emerald-100">
            Schedule an in-person appointment for account support, lending questions, or service guidance.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/appointments/create" className={`${button} bg-white text-emerald-950 hover:bg-emerald-100`}>
              Start Booking
            </Link>
            <Link
              to="/appointments"
              className={`${button} border border-emerald-600 bg-emerald-800 text-white hover:bg-emerald-700`}
            >
              Manage Appointments
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-5 py-6">
          <div className="text-xl font-semibold text-emerald-950">How It Works</div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="rounded-xl bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Step 1</div>
              <div className="mt-1 font-semibold text-emerald-950">Choose a service</div>
              <div className="mt-1 text-sm text-emerald-800">Select account help, lending, card support, or planning.</div>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Step 2</div>
              <div className="mt-1 font-semibold text-emerald-950">Pick a branch</div>
              <div className="mt-1 text-sm text-emerald-800">Find the location that best fits your schedule and needs.</div>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Step 3</div>
              <div className="mt-1 font-semibold text-emerald-950">Choose a time</div>
              <div className="mt-1 text-sm text-emerald-800">Reserve an open slot and confirm your details.</div>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Step 4</div>
              <div className="mt-1 font-semibold text-emerald-950">Meet your banker</div>
              <div className="mt-1 text-sm text-emerald-800">Arrive at branch and get personalized guidance.</div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white px-5 py-6">
          <div className="text-xl font-semibold text-emerald-950">Frequently Asked Questions</div>
          <div className="mt-4 space-y-2">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
                <summary className="cursor-pointer list-none font-semibold text-emerald-950">{faq.q}</summary>
                <p className="mt-2 text-sm text-emerald-800">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Home;
