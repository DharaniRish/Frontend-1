import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const defaultAddress = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India"
};

const getProfileForm = (user) => ({
  name: user?.name || "",
  avatar: user?.avatar || "",
  address: {
    ...defaultAddress,
    ...(user?.address || {})
  }
});

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [form, setForm] = useState(() => getProfileForm(user));
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setProfile(user);
    setForm(getProfileForm(user));
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const stored = localStorage.getItem("user");
      const token = stored ? JSON.parse(stored).token : "";
      const { data } = await axios.put(`${API_URL}/auth/profile`, form, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      localStorage.setItem("user", JSON.stringify(data));
      setProfile(data);
      setForm(getProfileForm(data));
      setSuccessMessage("Profile updated successfully");
      alert("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      setErrorMessage("Failed to update profile. Please try again.");
      alert("Failed to update profile");
    }
  };

  const openEditor = () => {
    setForm(getProfileForm(profile));
    setSuccessMessage("");
    setErrorMessage("");
    setIsEditing(true);
  };

  const profileAddress = {
    ...defaultAddress,
    ...(profile?.address || {})
  };

  return (
    <main className="container-page py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="section-title">Profile</h1>
        {!isEditing && (
          <button className="btn-primary w-full sm:w-auto" onClick={openEditor}>
            Edit Profile
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mt-6 max-w-3xl rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-6 max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={submit} className="mt-8 max-w-3xl rounded-lg border border-black/10 bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold">
              Name
              <input className="input mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="text-sm font-semibold">
              Email
              <input className="input mt-2" value={profile?.email || ""} disabled />
            </label>
            {Object.keys(form.address).map((key) => (
              <label className="text-sm font-semibold" key={key}>
                {key.replace(/([A-Z])/g, " $1")}
                <input className="input mt-2" value={form.address[key] || ""} onChange={(e) => setForm({ ...form, address: { ...form.address, [key]: e.target.value } })} />
              </label>
            ))}
          </div>
          <button className="btn-primary mt-6 w-full sm:w-auto">Save profile</button>
        </form>
      ) : (
        <section className="mt-8 max-w-3xl rounded-lg border border-black/10 bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile?.name || "Profile"} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pearl text-2xl font-bold text-ink">
                {(profile?.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-ink">{profile?.name || "Customer"}</h2>
              <p className="mt-1 text-sm text-ink/60">{profile?.email || "No email available"}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Full name</p>
              <p className="mt-1 font-semibold text-ink">{profileAddress.fullName || profile?.name || "Not added"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Phone</p>
              <p className="mt-1 font-semibold text-ink">{profileAddress.phone || "Not added"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Street</p>
              <p className="mt-1 font-semibold text-ink">{profileAddress.street || "Not added"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">City</p>
              <p className="mt-1 font-semibold text-ink">{profileAddress.city || "Not added"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">State</p>
              <p className="mt-1 font-semibold text-ink">{profileAddress.state || "Not added"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Postal code</p>
              <p className="mt-1 font-semibold text-ink">{profileAddress.postalCode || "Not added"}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Country</p>
              <p className="mt-1 font-semibold text-ink">{profileAddress.country || "Not added"}</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Profile;
