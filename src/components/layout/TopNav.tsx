import { Link, NavLink } from "react-router-dom";
import { navWrap, navInner, brand, navLinks, linkBase, linkIdle, linkActive } from "../../styles/nav";
import commerceBankLogo from "../../assets/commerce-bank-logo.png";

function TopNav() {
  return (
    <div className={navWrap}>
      <div className={navInner}>
        <Link to="/" className={brand} aria-label="Go to home">
          <img src={commerceBankLogo} alt="Commerce Bank logo" className="h-8 w-auto" />
        </Link>

        <div className={navLinks}>
          <NavLink
            to="/appointments"
            className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`)}
          >
            Appointments
          </NavLink>

          <NavLink
            to="/appointments/create"
            className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`)}
          >
            Book
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
