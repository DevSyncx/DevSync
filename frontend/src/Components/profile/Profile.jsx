import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { Camera, RefreshCw } from "lucide-react";
import { FaGithub, FaGitlab, FaLinkedin, FaGlobe } from "react-icons/fa";
import { SiLeetcode, SiCodechef, SiHackerrank, SiHackerearth, SiCodeforces, SiLinkedin, SiGitlab, SiGithub } from "react-icons/si";
import { Button } from "../ui/button";


const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    avatar: "/uploads/avatars/default-avatar.png",
    socialLinks: {
      github: "",
      gitlab: "",
      linkedin: "",
      website: "",
      codechef: "",
      hackerrank: "",
      leetcode: "",
      codeforces: "",
      hackerearth: ""
    },
    skills: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profileData });
  const [isSaving, setIsSaving] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data from the backend
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data);
        setEditData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form data
      setEditData({ ...profileData });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() !== "" && !editData.skills.includes(currentSkill.trim())) {
      setEditData({
        ...editData,
        skills: [...editData.skills, currentSkill.trim()]
      });
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditData({
      ...editData,
      skills: editData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleGenerateAvatar = async () => {
    if (isEditing) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/generate-avatar`, {
          method: 'POST',
          headers: {
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to generate avatar');
        }

        const data = await response.json();
        setAvatarPreview(data.avatar);
        setAvatarFile(null);
      } catch (error) {
        console.error('Error generating avatar:', error);
        alert('Failed to generate new avatar');
      }
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      let updatedProfile;

      // Handle avatar upload first if there's a new avatar
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const avatarResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/avatar`, {
          method: 'POST',
          headers: {
            'x-auth-token': token
          },
          body: formData
        });

        if (!avatarResponse.ok) {
          const errorData = await avatarResponse.json();
          throw new Error(errorData.msg || 'Failed to upload avatar');
        }

        const avatarData = await avatarResponse.json();
        // Update avatar in editData
        editData.avatar = avatarData.avatar;
      }

      // Build the request body
      const requestBody = {
        name: editData.name,
        bio: editData.bio,
        location: editData.location,
        skills: editData.skills,
        github: editData.socialLinks?.github,
        gitlab: editData.socialLinks?.gitlab,
        linkedin: editData.socialLinks?.linkedin,
        twitter: editData.socialLinks?.twitter,
        website: editData.socialLinks?.website,
        codechef: editData.socialLinks?.codechef,
        hackerrank: editData.socialLinks?.hackerrank,
        leetcode: editData.socialLinks?.leetcode,
        codeforces: editData.socialLinks?.codeforces,
        hackerearth: editData.socialLinks?.hackerearth
      };

      // Send update request to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update profile');
      }

      updatedProfile = await response.json();

      // Reset avatar state
      setAvatarFile(null);
      setAvatarPreview(null);

      // Update profile data
      setProfileData(updatedProfile);
      setIsEditing(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    // Clear auth token and redirect to login
    localStorage.removeItem("token");
    navigate("/login");
    // window.location.href = "/login";
  };

  const notIsEditingButton = (icon, buttonUrl, buttonName) => {
    return <button
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md transition duration-200
    ${buttonUrl ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      onClick={() => {
        if (buttonUrl) {
          window.open(buttonUrl, "_blank", "noopener,noreferrer");
        }
      }}
      title={buttonUrl ? `Go to ${buttonName} Profile` : "Not Linked"}
      disabled={!buttonUrl}
    >
      {icon}
      <span>{buttonName}</span>
    </button>
  }

  const editingButton = (labelName, icon, name, linkName) => {
    return <>
      <label className="text-md font-semibold text-[#1D3557] ">{labelName}</label>
      <div className="flex">

        <span className="bg-gray-100 px-2 py-2 rounded-l-lg border border-r-0 border-[#C5D7E5]">
          {icon}</span> 
        <input
          type="text"
          name={name}
          value={editData.socialLinks?.[linkName] || ""}
          onChange={(e) => {
            setEditData({
              ...editData,
              socialLinks: {
                ...editData.socialLinks,
                [linkName]: e.target.value
              }
            });
          }}
          className="w-full px-3 py-2 bg-white/70 border border-[#C5D7E5] rounded-r-lg"
        />
      </div>
    </>
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#E4ECF1] to-[#D2DEE7]">
      {/* Navbar */}
      <Navbar />

      {/* Hero section with wave pattern */}
      <div className="bg-[#1d3557] text-white py-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 z-10 relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Developer Profile</h1>
          <p className="text-blue-200 max-w-2xl">Manage your profile, showcase your skills, and connect with other developers.</p>
        </div>

        {/* Wave pattern */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#E4ECF1" fillOpacity="1" d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,197.3C672,213,768,203,864,181.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <section className="w-full px-6 py-12 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-4xl"
        >
          <div className="bg-gradient-to-br from-[#A4C7E6] to-[#d4e8fb] backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-[#1D3557] flex items-center">
                  <span className="bg-[#1D3557] text-white p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </span>
                  Developer Profile
                </h1>

                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleEditToggle}
                    className={`px-4 py-2 ${isEditing ? 'bg-gray-500' : 'bg-[#457B9D]'} text-white rounded-lg hover:opacity-90 transition duration-300 flex items-center gap-2 shadow-md`}
                  >
                    {isEditing ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        Cancel
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit Profile
                      </>
                    )}
                  </button>

                  {isEditing && (
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-4 py-2 bg-[#1D3557] text-white rounded-lg hover:opacity-90 transition duration-300 flex items-center gap-2 shadow-md"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 flex items-center gap-2 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column - Avatar */}
                <div className="text-center">
                  <div className="relative mx-auto mb-6">
                    <div
                      className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-100 to-white mx-auto"
                      onClick={handleAvatarClick}
                    >
                      <img
                        src={avatarPreview || (profileData.avatar.startsWith('http') ? profileData.avatar : `${import.meta.env.VITE_API_URL}${profileData.avatar}`)}
                        alt={profileData.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to default avatar if image fails to load
                          e.target.src = "https://api.dicebear.com/6.x/micah/svg?seed=fallback";
                        }}
                      />
                      {isEditing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white cursor-pointer hover:bg-black/60 transition duration-300">
                          <Camera className="h-6 w-6 mb-1" />
                          <div className="text-sm font-medium">Upload Photo</div>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex justify-center mt-4 space-x-2">
                        <button
                          onClick={handleGenerateAvatar}
                          className="p-2 bg-[#457B9D] text-white rounded-lg hover:bg-[#2E5E82] transition duration-300 flex items-center gap-1"
                          title="Generate random avatar"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span className="text-xs">New Avatar</span>
                        </button>
                      </div>
                    )}
                  </div>
                  {!isEditing ? (
                    <h2 className="text-2xl font-bold text-[#1D3557]">{profileData.name}</h2>
                  ) : (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      className="text-2xl font-bold text-center bg-white/70 border border-[#C5D7E5] rounded-lg px-2 py-1 w-full"
                    />
                  )}
                  {!isEditing && (
                    <p className="text-[#1D3557]/80">{profileData.email}</p>
                  )}
                </div>

                {/* Right Column - Details */}
                <div className="md:col-span-2">
                  <div className="space-y-6">
                    {/* Bio Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#1D3557] mb-2">Bio</h3>
                      {!isEditing ? (
                        <p className="text-[#1D3557]/90">{profileData.bio}</p>
                      ) : (
                        <textarea
                          name="bio"
                          value={editData.bio}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/70 border border-[#C5D7E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457B9D]"
                        />
                      )}
                    </div>

                    {/* Details Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#1D3557] mb-2">Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-[#1D3557]/80">Location</label>
                          {!isEditing ? (
                            <p className="text-[#1D3557]">{profileData.location || "Not specified"}</p>
                          ) : (
                            <input
                              type="text"
                              name="location"
                              value={editData.location}
                              onChange={handleChange}
                              className="w-full px-3 py-2 bg-white/70 border border-[#C5D7E5] rounded-lg"
                            />
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-[#1D3557]/80">Email</label>
                          {!isEditing ? (
                            <p className="text-[#1D3557]">{profileData.email}</p>
                          ) : (
                            <input
                              type="email"
                              name="email"
                              value={editData.email}
                              onChange={handleChange}
                              className="w-full px-3 py-2 bg-white/70 border border-[#C5D7E5] rounded-lg"
                            />
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-[#1D3557]/80">Website</label>
                          {!isEditing ? (
                            <p className="text-[#1D3557]">{profileData.website || "Not specified"}</p>
                          ) : (
                            <input
                              type="text"
                              name="website"
                              value={editData.website}
                              onChange={handleChange}
                              className="w-full px-3 py-2 bg-white/70 border border-[#C5D7E5] rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#1D3557] mb-2">Social Links</h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>

                          {!isEditing ? (
                            notIsEditingButton(<SiGithub className="text-xl" />, profileData.socialLinks?.github, "Github")

                          ) : (
                            editingButton("Github", <SiGithub className="w-5 h-5" />, "socialLinks.github", "github")
                          )}
                        </div>
                        <div>
                          {!isEditing ? (

                            notIsEditingButton(<SiGitlab className="text-xl" />, profileData.socialLinks?.gitlab, "Gitlab")) : 
                            (
                           
                            editingButton("Gitlab", <SiGitlab className="w-5 h-5" />, "socialLinks.gitlab", "gitlab")
                          )}
                        </div>
                        <div>
                          {!isEditing ? (

                            notIsEditingButton(<SiLinkedin className="text-xl" />, profileData.socialLinks?.linkedin,"Linkedin")
                          ) : (
                            editingButton("Linkedin", <SiLinkedin className="w-5 h-5" />, "socialLinks.linkedin", "linkedin")
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-[#1D3557] mt-6 mb-2">Competitive Coding Profiles</h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>

                          {!isEditing ? (

                            notIsEditingButton(<SiLeetcode className="text-xl" />, profileData.socialLinks?.leetcode, "Leetcode")
                          ) : (
                            editingButton("Leetcode", <SiLeetcode className="w-5 h-5" />, "socialLinks.leetcode", "leetcode")
                          )}
                        </div>
                        <div>

                          {!isEditing ? (

                            notIsEditingButton(<SiCodechef className="text-xl" />, profileData.socialLinks?.codechef, "CodeChef")
                          ) : (
                            editingButton("CodeChef", <SiCodechef className="w-5 h-5" />, "socialLinks.codechef", "codechef")
                          )}
                        </div>
                        <div>

                          {!isEditing ? (

                            notIsEditingButton(<SiHackerrank className="text-xl" />, profileData.socialLinks?.hackerrank, "Hackerrank")
                          ) : (
                            editingButton("Hackerrank", <SiHackerrank className="w-5 h-5" />, "socialLinks.hackerrank", "hackerrank")
                          )}
                        </div>
                        <div>

                          {!isEditing ? (

                            notIsEditingButton(<SiCodeforces className="text-xl" />, profileData.socialLinks?.codeforces, "Codeforces")
                          ) : (
                            editingButton("Codeforces", <SiCodeforces className="w-5 h-5" />, "socialLinks.codeforces", "codeforces")
                          )}
                        </div>
                        <div>

                          {!isEditing ? (

                            notIsEditingButton(<SiHackerearth className="text-xl" />, profileData.socialLinks?.hackerearth, "HackerEarth")

                          ) : (
                            editingButton("HackerEarth", <SiHackerearth className="w-5 h-5" />, "socialLinks.hackerearth", "hackerearth")
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="bg-white/60 p-6 rounded-xl shadow-md border border-blue-100">
                      <h3 className="text-lg font-semibold text-[#1D3557] mb-4 flex items-center">
                        <span className="bg-[#457B9D] text-white p-1 rounded mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        </span>
                        Skills
                      </h3>

                      {isEditing ? (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Add your technical skills and technologies you're proficient in</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={currentSkill}
                              onChange={(e) => setCurrentSkill(e.target.value)}
                              placeholder="Add a skill (e.g. React, TypeScript, Node.js)"
                              className="flex-grow px-3 py-2 bg-white border border-[#C5D7E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457B9D] focus:border-transparent"
                              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                            />
                            <button
                              onClick={handleAddSkill}
                              type="button"
                              className="px-4 py-2 bg-[#457B9D] text-white rounded-lg hover:bg-[#2E5E82] transition-all flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                              Add
                            </button>
                          </div>
                        </div>
                      ) : (
                        profileData.skills.length === 0 && <p className="text-gray-500 italic mb-4">No skills added yet</p>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {(isEditing ? editData.skills : profileData.skills).map((skill, index) => (
                          <div
                            key={index}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isEditing
                              ? "bg-gradient-to-r from-[#457B9D] to-[#1D3557] text-white shadow-md"
                              : "bg-[#457B9D]/10 text-[#1D3557] border border-[#457B9D]/30 hover:bg-[#457B9D]/20"
                              } flex items-center`}
                          >
                            {isEditing ? (
                              <>
                                <span className="mr-1">{skill}</span>
                                <button
                                  onClick={() => handleRemoveSkill(skill)}
                                  className="ml-1 hover:text-red-200 transition-colors focus:outline-none"
                                  aria-label="Remove skill"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                {skill}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Hidden file input for avatar upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default Profile;
