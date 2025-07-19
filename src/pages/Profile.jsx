import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaSignOutAlt, FaGift, FaQuestionCircle, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  
  const [status, setStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form with user data when user changes
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setStatus("");
    const result = await updateUser(form);
    
    if (result.success) {
      setStatus("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setStatus(""), 3000);
    } else {
      setStatus(result.error || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Get profile image with fallback
  const getProfileImage = () => {
    if (user?.profilePic) {
      return user.profilePic;
    }
    // Use your downloaded image from Google
    return "/default-avatar.png";
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-100 py-8 font-[Poppins]">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:flex">
        {/* LEFT SIDE */}
        <div className="md:w-1/3 p-6 bg-gray-50 flex flex-col items-center text-center">
          <img
            src={getProfileImage()}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
            style={{
              objectPosition: 'center',
              backgroundColor: '#f3f4f6'
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150/cccccc/666666?text=User";
            }}
          />
          <h2 className="text-xl font-bold mt-4">{user.firstName} {user.lastName}</h2>
          <p className="text-sm text-gray-600 flex items-center justify-center">
            <FaPhone className="mr-1" />
            {user.phone || "No phone number"}
          </p>
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <FaEnvelope className="mr-1" />
            {user.email}
          </p>

          <div className="mt-6 space-y-3 text-left w-full">
            <button className="flex items-center text-gray-700 hover:text-red-500 space-x-2">
              <FaQuestionCircle /> <span>Help & Support</span>
            </button>
            <button className="flex items-center text-gray-700 hover:text-red-500 space-x-2">
              <FaGift /> <span>Rewards</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-red-500 space-x-2"
            >
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Edit Profile</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
          
          {status && (
            <div className={`mb-4 p-3 rounded ${status.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${
                  !isEditing ? 'bg-gray-100' : 'bg-white'
                }`}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${
                  !isEditing ? 'bg-gray-100' : 'bg-white'
                }`}
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${
                  !isEditing ? 'bg-gray-100' : 'bg-white'
                }`}
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${
                  !isEditing ? 'bg-gray-100' : 'bg-white'
                }`}
                placeholder="Enter phone number"
              />
            </div>
            {isEditing && (
              <button
                onClick={handleUpdate}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Update Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
