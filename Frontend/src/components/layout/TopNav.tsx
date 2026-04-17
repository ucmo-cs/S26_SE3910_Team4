import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { navWrap, navInner, brand, navLinks, linkBase, linkIdle, linkActive } from "../../styles/nav";
import commerceBankLogo from "../../assets/commerce-bank-logo.png";

function TopNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authUser = localStorage.getItem("authUser");
      const profile = localStorage.getItem("userProfile");
      setIsLoggedIn(!!authUser);
      if (profile) {
        setUserProfile(JSON.parse(profile));
      }
    };

    checkAuth();
    // Listen for storage changes (login/logout)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <div className={navWrap}>
      <div className={navInner}>
        <Link to="/" className={brand} aria-label="Go to home">
          <img src={commerceBankLogo} alt="Commerce Bank logo" className="h-8 w-auto" />
        </Link>

        <div className={navLinks}>
          <NavLink
            to="/appointments"
            end
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

          {isLoggedIn ? (
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`)}
            >
              {userProfile ? `${userProfile.firstName}` : 'Profile'}
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? `${linkBase} ${linkActive}` : `${linkBase} ${linkIdle}`)}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopNav;
