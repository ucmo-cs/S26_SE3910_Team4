import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import heroImage from "../assets/hero-image.png";
import { page, stack } from "../styles/layout";
import { button, buttonPrimary, muted } from "../styles/ui";

type Service = {
  id: string;
  title: string;
  summary: string;
};

const services: Service[] = [
  { id: "t1", title: "Checking & Savings", summary: "Flexible account options for daily spending and long-term savings goals." },
  { id: "t2", title: "Credit Cards", summary: "Card services with fraud monitoring, alerts, and account controls." },
  { id: "t4", title: "Home Loans", summary: "Mortgage and refinance support with local lending specialists." },
  { id: "t3", title: "Auto Loans", summary: "Competitive financing options for new and used vehicle purchases." },
  { id: "t5", title: "Small Business", summary: "Business checking, payment tools, and lending support for growth." },
  { id: "t6", title: "Financial Planning", summary: "Guidance for budgeting, saving, and milestone-based planning." },
];

function Home() {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  return (
    <div className={page}>
      <div className={stack}>
        {userProfile && (
          <section className="rounded-xl bg-emerald-50 border border-emerald-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-emerald-900">
                  Welcome back, {userProfile.firstName} {userProfile.lastName}!
                </h2>
                <p className="text-sm text-emerald-700 mt-1">
                  Ready to manage your appointments or explore our services?
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/profile" className={`${button} bg-emerald-600 hover:bg-emerald-700 text-white`}>
                  My Profile
                </Link>
                <Link to="/appointments" className={`${button} ${buttonPrimary}`}>
                  My Appointments
                </Link>
              </div>
            </div>
          </section>
        )}

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

        <section className="px-2 py-4">
          <div className="flex items-center gap-5">
            <div className="h-px flex-1 bg-emerald-200" />
            <div className="shrink-0 text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">How It Works</div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-base font-semibold text-emerald-900">
                <span>Choose Service</span>
                <span className="text-emerald-400">/</span>
                <span>Select Branch</span>
                <span className="text-emerald-400">/</span>
                <span>Pick Time</span>
                <span className="text-emerald-400">/</span>
                <span>Confirm</span>
              </div>
            </div>
            <div className="h-px flex-1 bg-emerald-200" />
          </div>
        </section>

        <section className="rounded-2xl bg-white px-5 py-6">
          <div className="text-xl font-semibold text-emerald-950">Featured Services</div>
          <p className={`mt-1 ${muted}`}>Explore common products and support options available across branches and digital channels.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/appointments/create?service=${service.id}`}
                className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 transition hover:border-emerald-400 hover:bg-white"
              >
                <div className="font-semibold text-emerald-950">{service.title}</div>
                <div className="mt-1 text-sm text-emerald-800">{service.summary}</div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Home;
