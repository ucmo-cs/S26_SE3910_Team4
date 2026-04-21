import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, section, grid2 } from "../styles/layout";
import { button, buttonPrimary, divider, h2, input, label, muted } from "../styles/ui";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

function sanitizePhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function formatPhone(value: string) {
  const digits = sanitizePhone(value);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("authUser");
    if (!username) {
      navigate("/login");
      return;
    }

    // Load profile from localStorage first
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        setFormData({
          email: parsedProfile.email || "",
          firstName: parsedProfile.firstName || "",
          lastName: parsedProfile.lastName || "",
          phone: sanitizePhone(parsedProfile.phone || ""),
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (e) {
        console.error("Failed to parse stored profile:", e);
      }
    } else {
      // If no stored profile but we have username, create a placeholder
      setProfile({
        id: 0,
        username: username,
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
      });
    }

    // Fetch fresh profile from server
    fetchProfile(username);
  }, [navigate]);

  const fetchProfile = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/profile?username=${encodeURIComponent(username)}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        localStorage.setItem("userProfile", JSON.stringify(data));
        setFormData(prev => ({
          ...prev,
          email: data.email || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: sanitizePhone(data.phone || ""),
        }));
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValue = name === "phone" ? sanitizePhone(value) : value;

    setFormData({
      ...formData,
      [name]: nextValue,
    });

    if (name === "phone") {
      setPhoneError(nextValue.length === 0 || nextValue.length === 10 ? "" : "Phone number must be 10 digits");
    }

    if (name === "email") {
      setEmailError(nextValue.trim() === "" || isValidEmail(nextValue) ? "" : "Enter a valid email address");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const username = localStorage.getItem("authUser");
    if (!username) {
      navigate("/login");
      return;
    }

    // Validate password change
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match");
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters long");
        setLoading(false);
        return;
      }
    }

    if (formData.phone.length > 0 && formData.phone.length !== 10) {
      setPhoneError("Phone number must be 10 digits");
      setError("Phone number must be 10 digits");
      setLoading(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      setEmailError("Enter a valid email address");
      setError("Enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const updateData: any = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await fetch(`http://localhost:8080/api/users/profile?username=${encodeURIComponent(username)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setProfile(data);
        localStorage.setItem("userProfile", JSON.stringify(data));
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("userProfile");
    navigate("/login");
  };

  if (!profile) {
    return (
      <div className={page}>
        <div className={stack}>
          <PageHeader title="Profile" subtitle="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="My Profile"
          subtitle={`Manage your account information`}
          right={
            <button onClick={handleLogout} className={`${button} bg-red-600 hover:bg-red-700 text-white`}>
              Logout
            </button>
          }
        />

        <Card>
          <div className={section}>
            <div className={h2}>Account Information</div>

            <form onSubmit={handleSubmit} className={stack} noValidate>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              <div className={grid2}>
                <div>
                  <label className={label}>First Name <span className="text-red-600" title="Required field" aria-label="Required field">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={input}
                    required
                  />
                </div>
                <div>
                  <label className={label}>Last Name <span className="text-red-600" title="Required field" aria-label="Required field">*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={input}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={label}>Email <span className="text-red-600" title="Required field" aria-label="Required field">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => {
                    setEmailError(
                      formData.email.trim() === "" || isValidEmail(formData.email) ? "" : "Enter a valid email address",
                    );
                  }}
                  className={input}
                  inputMode="email"
                  placeholder="name@example.com"
                  aria-invalid={emailError ? "true" : "false"}
                  required
                />
                {emailError ? <div className="mt-2 text-sm text-red-700">{emailError}</div> : null}
              </div>

              <div>
                <label className={label}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formatPhone(formData.phone)}
                  onChange={handleChange}
                  onBlur={() => {
                    setPhoneError(
                      formData.phone.length === 0 || formData.phone.length === 10 ? "" : "Phone number must be 10 digits",
                    );
                  }}
                  className={input}
                  placeholder="555-555-5555"
                  inputMode="numeric"
                  maxLength={12}
                  aria-invalid={phoneError ? "true" : "false"}
                />
                {phoneError ? <div className="mt-2 text-sm text-red-700">{phoneError}</div> : null}
              </div>

              <div>
                <label className={label}>Username</label>
                <input
                  type="text"
                  value={profile.username}
                  className={`${input} bg-gray-50`}
                  disabled
                />
                <div className={`${muted} mt-1`}>Username cannot be changed</div>
              </div>

              <div className={divider} />

              <div className={h2}>Change Password (Optional)</div>

              <div>
                <label className={label}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={input}
                  placeholder="Leave blank to keep current password"
                  minLength={6}
                />
              </div>

              <div>
                <label className={label}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={input}
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                className={`${button} ${buttonPrimary}`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
