import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api.js";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Preferences state
  const [theme, setTheme] = useState("dark");
  const [aiModel, setAiModel] = useState("default");
  const [preferencesError, setPreferencesError] = useState("");
  const [preferencesSuccess, setPreferencesSuccess] = useState("");
  const [preferencesLoading, setPreferencesLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("ld_token");
        if (!token) {
          navigate("/login");
          return;
        }
        // Get user data from token payload (simplified)
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: payload.userId });
        setTheme(localStorage.getItem("ld_theme") || "dark");
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const response = await api.put("/auth/profile", { name, email });
      setProfileSuccess(response.data.message);
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);

    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      setPasswordSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePreferencesUpdate = async (e) => {
    e.preventDefault();
    setPreferencesError("");
    setPreferencesSuccess("");
    setPreferencesLoading(true);

    try {
      const response = await api.put("/auth/preferences", { theme, aiModel });
      localStorage.setItem("ld_theme", theme);
      setPreferencesSuccess(response.data.message);
      
      // Apply theme immediately
      document.documentElement.classList.toggle("light", theme === "light");
    } catch (err) {
      setPreferencesError(err.response?.data?.message || "Failed to update preferences");
    } finally {
      setPreferencesLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete("/auth/account");
      localStorage.removeItem("ld_token");
      localStorage.removeItem("ld_theme");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ld_token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8 flex items-center gap-3">
          <img 
            src="https://static.vecteezy.com/system/resources/previews/027/247/135/non_2x/green-june-beetle-bug-isolated-on-transparent-background-ai-generated-png.png"
            alt="Life Debugger Logo"
            className="w-10 h-10 object-contain"
          />
          Settings
        </h1>

        <div className="flex gap-4 mb-8 border-b border-slate-800 pb-4">
          {["profile", "security", "preferences"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-6">Profile Information</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your email"
                />
              </div>
              {profileError && (
                <p className="text-sm text-red-400">{profileError}</p>
              )}
              {profileSuccess && (
                <p className="text-sm text-green-400">{profileSuccess}</p>
              )}
              <button
                type="submit"
                disabled={profileLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-sm font-medium text-slate-950 transition-colors"
              >
                {profileLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-medium mb-6">Change Password</h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                {passwordError && (
                  <p className="text-sm text-red-400">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-sm text-green-400">{passwordSuccess}</p>
                )}
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-sm font-medium text-slate-950 transition-colors"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>

            <div className="bg-slate-900/60 border border-red-900/50 rounded-2xl p-6">
              <h2 className="text-lg font-medium mb-2 text-red-400">Danger Zone</h2>
              <p className="text-sm text-slate-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-medium text-white transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-6">Preferences</h2>
            <form onSubmit={handlePreferencesUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-3">
                  Theme
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                      theme === "dark"
                        ? "border-emerald-500 bg-slate-800"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                      <span className="text-sm font-medium">Dark</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                      theme === "light"
                        ? "border-emerald-500 bg-slate-800"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">Light</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-3">
                  AI Model
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="default">Default (GPT-4)</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude">Claude</option>
                  <option value="gemini">Gemini</option>
                </select>
                <p className="mt-2 text-xs text-slate-500">
                  Select the AI model to use for problem analysis
                </p>
              </div>

              {preferencesError && (
                <p className="text-sm text-red-400">{preferencesError}</p>
              )}
              {preferencesSuccess && (
                <p className="text-sm text-green-400">{preferencesSuccess}</p>
              )}
              <button
                type="submit"
                disabled={preferencesLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-sm font-medium text-slate-950 transition-colors"
              >
                {preferencesLoading ? "Saving..." : "Save Preferences"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;

