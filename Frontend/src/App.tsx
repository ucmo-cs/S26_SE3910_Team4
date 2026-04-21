import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import { GuestOnly, RequireAuth } from "./components/auth/RouteGuards";

import Home from "./pages/Home";
import AppointmentList from "./pages/AppointmentList";
import AppointmentCreate from "./pages/AppointmentCreate";
import AppointmentDetail from "./pages/AppointmentDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/appointments/create" element={<AppointmentCreate />} />
            <Route path="/appointments/:appointmentId" element={<AppointmentDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<AppShell />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
