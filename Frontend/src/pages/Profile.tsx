import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, section, grid2 } from "../styles/layout";
import { button, buttonPrimary, buttonGhost, divider, h2, input, label, muted } from "../styles/ui";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
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
          phone: parsedProfile.phone || "",
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
          phone: data.phone || "",
        }));
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

            <form onSubmit={handleSubmit} className={stack}>
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
                  <label className={label}>First Name</label>
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
                  <label className={label}>Last Name</label>
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
                <label className={label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={input}
                  required
                />
              </div>

              <div>
                <label className={label}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={input}
                  placeholder="(123) 456-7890"
                />
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