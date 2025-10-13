import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  RefreshCw,
  User,
  MapPin,
  Mail,
  Globe,
  Edit2,
  Save,
  X,
  Plus,
  Check,
  LogOut,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  SiLeetcode,
  SiCodechef,
  SiHackerrank,
  SiHackerearth,
  SiCodeforces,
  SiLinkedin,
  SiGitlab,
  SiGithub,
} from "react-icons/si";
import BackButton from "../ui/backbutton";

// --- START: Helper Components for Modern UI (Including the new SuccessPopup) ---

/**
 * A themed button for displaying social links in view mode.
 */
const SocialButton = ({ icon, buttonUrl, buttonName, leetcodeUrl }) => {
  const isLinked = !!buttonUrl;

  return (
    <motion.button
      whileHover={{ scale: isLinked ? 1.05 : 1 }}
      whileTap={{ scale: isLinked ? 0.95 : 1 }}
      className={`group relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
        isLinked
          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
          : "bg-muted/50 text-muted-foreground cursor-not-allowed border border-border"
      } w-full`}
      onClick={() => {
        if (buttonUrl) {
          const url =
            buttonName === "Leetcode" ? leetcodeUrl(buttonUrl) : buttonUrl;
          if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
          }
        }
      }}
      disabled={!buttonUrl}
    >
      <div
        className={`text-xl ${
          isLinked ? "group-hover:scale-110 transition-transform" : ""
        }`}
      >
        {icon}
      </div>
      <span className="font-medium truncate">{buttonName}</span>
      {isLinked && (
        <svg
          className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </motion.button>
  );
};

/**
 * A themed input wrapper for editing social links.
 */
const SocialInput = ({
  labelName,
  icon,
  linkName,
  editData,
  setEditData,
  error,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <div className="text-primary">{icon}</div>
        {labelName} URL
      </label>
      <input
        type="text"
        value={editData.socialLinks?.[linkName] || ""}
        onChange={(e) => {
          setEditData((prev) => ({
            ...prev,
            socialLinks: {
              ...prev.socialLinks,
              [linkName]: e.target.value,
            },
          }));
        }}
        placeholder={`Enter ${labelName} URL`}
        className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
      />
      {linkName === "leetcode" && error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * The Modern Success Popup Component
 */
const SuccessPopup = ({ isVisible, onClose, userName }) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-card text-foreground rounded-3xl p-8 shadow-2xl w-full max-w-md border border-primary/20"
          initial={{ y: -50, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
                delay: 0.1,
              }}
              className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg"
            >
              <Zap className="w-8 h-8" />
            </motion.div>

            <h3 className="text-3xl font-bold text-primary">Success!</h3>
            <p className="text-lg text-foreground/90">
              **{userName || "Your profile"}** has been **updated
              successfully**.
            </p>
            <p className="text-muted-foreground text-sm">
              Your changes are now live and visible to the community.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="mt-6 w-full py-3 bg-accent text-accent-foreground rounded-xl font-semibold shadow-md hover:bg-accent/90 transition-all"
            >
              Awesome! Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- END: Helper Components for Modern UI (Including the new SuccessPopup) ---

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    avatar: "/uploads/avatars/default-avatar.png",
    website: "",
    socialLinks: {
      github: "",
      gitlab: "",
      linkedin: "",
      website: "",
      codechef: "",
      hackerrank: "",
      leetcode: "",
      codeforces: "",
      hackerearth: "",
    },
    skills: [],
  });

  // NEW STATE FOR POPUP
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // State initialization remains UNCHANGED
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

  // --- START: ORIGINAL LOGIC (STRICTLY UNCHANGED FOR FUNCTIONALITY) ---

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();

        // Ensure socialLinks exists
        const normalizedData = {
          ...data,
          socialLinks: data.socialLinks || {
            github: "",
            gitlab: "",
            linkedin: "",
            website: "",
            codechef: "",
            hackerrank: "",
            leetcode: "",
            codeforces: "",
            hackerearth: "",
          },
          skills: data.skills || [],
        };

        setProfileData(normalizedData);
        setEditData(normalizedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data");
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({ ...profileData });
      setAvatarFile(null); // Reset avatar state on cancel
      setAvatarPreview(null);
      setError(null); // Clear error on cancel
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleWebsiteChange = (e) => {
    const value = e.target.value;
    setEditData((prev) => ({
      ...prev,
      website: value,
      socialLinks: {
        ...prev.socialLinks,
        website: value,
      },
    }));
  };

  const handleAddSkill = () => {
    if (
      currentSkill.trim() !== "" &&
      !editData.skills.includes(currentSkill.trim())
    ) {
      setEditData({
        ...editData,
        skills: [...editData.skills, currentSkill.trim()],
      });
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditData({
      ...editData,
      skills: editData.skills.filter((skill) => skill !== skillToRemove),
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
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/generate-avatar`,
          {
            method: "POST",
            headers: {
              "x-auth-token": token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to generate avatar");
        }

        const data = await response.json();
        setAvatarPreview(`${import.meta.env.VITE_API_URL}${data.avatar}`);
        setAvatarFile(null);
        setEditData((prev) => ({ ...prev, avatar: data.avatar }));
      } catch (error) {
        console.error("Error generating avatar:", error);
        alert("Failed to generate new avatar");
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

  function normalizeLeetcodeURL(url) {
    if (!url || url.trim() === "") return null;
    const leetcodeRegex =
      /^https?:\/\/(www\.)?leetcode\.com\/(u\/)?[a-zA-Z0-9_-]+\/?$/;
    if (!leetcodeRegex.test(url)) return null;
    return url.replace(/\/$/, "");
  }

  function normalizeGitHubURL(url) {
    if (!url || url.trim() === "") return null;
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
    if (!githubRegex.test(url)) return null;

    const username = url.replace(/\/$/, "").split("/").pop();
    return username;
  }

  const getLeetcodeUrl = (url) => {
    const normalized = normalizeLeetcodeURL(url);
    if (!normalized) return null;
    const username = normalized.split("/").pop();
    return `${import.meta.env.VITE_API_URL}/leetcode/${username}`;
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    // GitHub validation
    let githubUrlValue = editData.socialLinks?.github?.trim();
    let normalizedGithub = githubUrlValue
      ? normalizeGitHubURL(githubUrlValue)
      : "";
    if (githubUrlValue && !normalizedGithub) {
      setError("GitHub Profile URL must be valid");
      setIsSaving(false);
      return;
    }

    // LeetCode validation
    let leetcodeUrlValue = editData.socialLinks?.leetcode?.trim();
    if (leetcodeUrlValue && leetcodeUrlValue !== "") {
      let res = normalizeLeetcodeURL(leetcodeUrlValue);
      if (!res) {
        setError("Leetcode Profile URL must be valid");
        setIsSaving(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      let finalAvatarPath = editData.avatar;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const avatarResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/avatar`,
          {
            method: "POST",
            headers: { "x-auth-token": token },
            body: formData,
          }
        );

        if (!avatarResponse.ok) {
          const errorData = await avatarResponse.json();
          throw new Error(errorData.msg || "Failed to upload avatar");
        }

        const avatarData = await avatarResponse.json();
        finalAvatarPath = avatarData.avatar;
      }

      const requestBody = {
        name: editData.name,
        bio: editData.bio,
        location: editData.location,
        skills: editData.skills,
        github: githubUrlValue,
        gitlab: editData.socialLinks?.gitlab || "",
        linkedin: editData.socialLinks?.linkedin || "",
        twitter: editData.socialLinks?.twitter || "",
        website: editData.website || editData.socialLinks?.website || "",
        codechef: editData.socialLinks?.codechef || "",
        hackerrank: editData.socialLinks?.hackerrank || "",
        leetcode: editData.socialLinks?.leetcode || "",
        codeforces: editData.socialLinks?.codeforces || "",
        hackerearth: editData.socialLinks?.hackerearth || "",
      };

      if (avatarFile || (avatarPreview && !avatarPreview.startsWith("data:"))) {
        requestBody.avatar = finalAvatarPath;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update profile");
      }

      const rawUpdatedProfile = await response.json();

      const updatedProfile = {
        ...rawUpdatedProfile,
        socialLinks: rawUpdatedProfile.socialLinks || {
          github: "",
          gitlab: "",
          linkedin: "",
          website: "",
          codechef: "",
          hackerrank: "",
          leetcode: "",
          codeforces: "",
          hackerearth: "",
        },
      };

      setAvatarFile(null);
      setAvatarPreview(null);

      setProfileData(updatedProfile);
      setEditData(updatedProfile);
      setIsEditing(false);

      // --- POPUP INTEGRATION ---
      setShowSuccessPopup(true); // Show the success popup instead of alert
      // alert("Profile updated successfully!"); // REMOVE ORIGINAL ALERT
      // --- END POPUP INTEGRATION ---
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
      setError(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --- END: ORIGINAL LOGIC (STRICTLY UNCHANGED FOR FUNCTIONALITY) ---

  const connectedPlatformsCount = profileData.socialLinks
    ? Object.values(profileData.socialLinks).filter(
        (link) => link && link.trim() !== ""
      ).length
    : 0;

  const currentAvatarSrc = avatarPreview
    ? avatarPreview
    : profileData.avatar?.startsWith("http")
    ? profileData.avatar
    : `${import.meta.env.VITE_API_URL}${profileData.avatar}`;

  // ... (Loading and Error screens remain the same) ...

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-foreground font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-destructive text-xl">⚠️</div>
          <p className="text-foreground font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    // Outer Container: Full Viewport Height
    <div className="h-screen w-full bg-background flex flex-col">
      <BackButton />
      {/* Success Popup */}
      <SuccessPopup
        isVisible={showSuccessPopup}
        onClose={handleClosePopup}
        userName={profileData.name}
      />

      {/* Content Wrapper: Flex-grow to fill space below Navbar, using full width */}
      <div className="flex-grow overflow-y-auto mt-[72px] pb-12 pt-6 px-4 md:px-12">
        {/* Header Section: Removed max-w-6xl mx-auto */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Developer Profile
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Showcase your skills and connect with the developer community
          </p>
        </motion.div>

        {/* Main Profile Content Container (Removed Card Styling and max-w-6xl) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full" // Use full width
        >
          {/* Main Content Div (Kept overflow-hidden for safety) */}
          <div className="overflow-hidden">
            {/* Header Strip with Actions (Full Width) */}
            <div className="bg-primary/5 px-6 md:px-12 py-6 border-b-2 border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Your Profile
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your developer identity
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEditToggle}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                      isEditing
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </>
                    )}
                  </motion.button>

                  {isEditing && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-accent/90 text-accent-foreground rounded-xl font-medium hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 bg-destructive text-white rounded-xl font-medium hover:opacity-90 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Profile Content Details */}
            <div className="p-6 md:p-12">
              <div className="grid md:grid-cols-12 gap-8">
                {/* Left Sidebar - Avatar and Name (Sticky) */}
                <div className="md:col-span-4">
                  <div className="sticky top-20 space-y-8">
                    {/* Avatar Block - Adjusted to use full width and better padding */}
                    <div className="text-center p-6 bg-secondary/30 rounded-3xl border-2 border-border shadow-lg">
                      <motion.div
                        whileHover={{ scale: isEditing ? 1.02 : 1 }}
                        className="relative w-48 h-48 mx-auto"
                      >
                        <div
                          className={`relative w-full h-full rounded-3xl overflow-hidden border-4 border-primary/50 shadow-xl transition-all duration-300 ${
                            isEditing ? "cursor-pointer" : ""
                          }`}
                          onClick={handleAvatarClick}
                        >
                          <img
                            src={currentAvatarSrc}
                            alt={profileData.name || "User"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://api.dicebear.com/6.x/micah/svg?seed=fallback";
                            }}
                          />
                          {isEditing && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white"
                            >
                              <Camera className="w-8 h-8 mb-2" />
                              <span className="text-sm font-medium">
                                Change Photo
                              </span>
                            </motion.div>
                          )}
                        </div>

                        {isEditing && (
                          <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleGenerateAvatar}
                            type="button"
                            className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-full shadow-lg border border-primary/20"
                            title="Generate random avatar"
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.button>
                        )}
                      </motion.div>

                      {/* Name & Contact Info */}
                      <div className="mt-6 space-y-3">
                        {!isEditing ? (
                          <>
                            <h2 className="text-3xl font-bold text-foreground">
                              {profileData.name || "Your Name"}
                            </h2>
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span className="text-sm">
                                {profileData.email || "your@email.com"}
                              </span>
                            </div>
                          </>
                        ) : (
                          <input
                            type="text"
                            name="name"
                            value={editData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="w-full text-center text-2xl font-bold bg-background border-2 border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                          />
                        )}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    {!isEditing && (
                      <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 space-y-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <Check className="w-5 h-5 text-primary" />
                          Status Overview
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-border">
                            <span className="text-sm text-muted-foreground">
                              Total Skills
                            </span>
                            <span className="font-bold text-primary text-lg">
                              {profileData.skills?.length || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Platforms Connected
                            </span>
                            <span className="font-bold text-primary text-lg">
                              {connectedPlatformsCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Content - Details */}
                <div className="md:col-span-8 space-y-10">
                  {/* Bio Section */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>
                      About Me
                    </h3>
                    {!isEditing ? (
                      <p className="text-foreground/90 leading-relaxed bg-secondary/30 rounded-2xl p-6 border-2 border-border shadow-inner whitespace-pre-wrap">
                        {profileData.bio ||
                          "No bio added yet. Click 'Edit Profile' to introduce yourself!"}
                      </p>
                    ) : (
                      <textarea
                        name="bio"
                        value={editData.bio}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us about yourself, your interests, and what you're working on..."
                        className="w-full px-5 py-4 bg-background border-2 border-border rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                      />
                    )}
                  </motion.div>

                  {/* Details Grid */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>
                      Contact & Location
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Location */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Location
                        </label>
                        {!isEditing ? (
                          <p className="text-foreground font-medium bg-secondary/30 rounded-xl px-4 py-3 border-2 border-border">
                            {profileData.location || "Not specified"}
                          </p>
                        ) : (
                          <input
                            type="text"
                            name="location"
                            value={editData.location}
                            onChange={handleChange}
                            placeholder="City, Country"
                            className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                          />
                        )}
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          Personal Website
                        </label>
                        {!isEditing ? (
                          <a
                            href={
                              profileData.website ||
                              profileData.socialLinks?.website
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-primary font-medium bg-secondary/30 rounded-xl px-4 py-3 border-2 border-border truncate hover:underline"
                          >
                            {profileData.website ||
                              profileData.socialLinks?.website ||
                              "Not specified"}
                          </a>
                        ) : (
                          <input
                            type="text"
                            name="website"
                            value={
                              editData.website ||
                              editData.socialLinks?.website ||
                              ""
                            }
                            onChange={handleWebsiteChange}
                            placeholder="https://yourwebsite.com"
                            className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Skills Section */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                        Skills & Technologies
                      </h3>
                      {!isEditing && (
                        <span className="text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border">
                          {profileData.skills?.length || 0} skills
                        </span>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          placeholder="Add a skill (e.g., React, Python, Docker)"
                          className="flex-1 px-5 py-3 bg-background border-2 border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleAddSkill()
                          }
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddSkill}
                          type="button"
                          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Add
                        </motion.button>
                      </div>
                    )}

                    {(isEditing ? editData.skills : profileData.skills)
                      ?.length === 0 ? (
                      <div className="text-center py-12 bg-secondary/20 rounded-2xl border-2 border-dashed border-border">
                        <p className="text-muted-foreground">
                          No skills added yet
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {(isEditing ? editData.skills : profileData.skills).map(
                          (skill, index) => (
                            <motion.div
                              key={index}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.03 }}
                              className={`group relative ${
                                isEditing
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                                  : "bg-secondary text-foreground hover:bg-primary/10 hover:text-primary"
                              } px-5 py-2 rounded-full font-medium transition-all border-2 border-border flex items-center gap-2 shadow-sm`}
                            >
                              {!isEditing && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                              <span>{skill}</span>
                              {isEditing && (
                                <button
                                  onClick={() => handleRemoveSkill(skill)}
                                  className="hover:bg-white/20 rounded-full p-1 transition-colors ml-1"
                                  aria-label="Remove skill"
                                >
                                  <X className="w-4 h-4 text-primary-foreground" />
                                </button>
                              )}
                            </motion.div>
                          )
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Social Links */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>
                      Social Profiles
                    </h3>

                    {!isEditing ? (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SocialButton
                          icon={<SiGithub />}
                          buttonUrl={profileData.socialLinks?.github}
                          buttonName="GitHub"
                          leetcodeUrl={getLeetcodeUrl}
                        />
                        <SocialButton
                          icon={<SiGitlab />}
                          buttonUrl={profileData.socialLinks?.gitlab}
                          buttonName="GitLab"
                          leetcodeUrl={getLeetcodeUrl}
                        />
                        <SocialButton
                          icon={<SiLinkedin />}
                          buttonUrl={profileData.socialLinks?.linkedin}
                          buttonName="LinkedIn"
                          leetcodeUrl={getLeetcodeUrl}
                        />
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-6">
                        <SocialInput
                          labelName="GitHub"
                          icon={<SiGithub className="w-5 h-5" />}
                          linkName="github"
                          editData={editData}
                          setEditData={setEditData}
                          error={error}
                        />
                        <SocialInput
                          labelName="GitLab"
                          icon={<SiGitlab className="w-5 h-5" />}
                          linkName="gitlab"
                          editData={editData}
                          setEditData={setEditData}
                          error={error}
                        />
                        <SocialInput
                          labelName="LinkedIn"
                          icon={<SiLinkedin className="w-5 h-5" />}
                          linkName="linkedin"
                          editData={editData}
                          setEditData={setEditData}
                          error={error}
                        />
                      </div>
                    )}
                  </motion.div>

                  {/* Competitive Coding */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <div className="w-1 h-6 bg-accent rounded-full"></div>
                      Competitive Coding
                    </h3>

                    {!isEditing ? (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SocialButton
                          icon={<SiLeetcode />}
                          buttonUrl={profileData.socialLinks?.leetcode}
                          buttonName="Leetcode"
                          leetcodeUrl={getLeetcodeUrl}
                        />
                        <SocialButton
                          icon={<SiCodechef />}
                          buttonUrl={profileData.socialLinks?.codechef}
                          buttonName="CodeChef"
                          leetcodeUrl={getLeetcodeUrl}
                        />
                        <SocialButton
                          icon={<SiHackerrank />}
                          buttonUrl={profileData.socialLinks?.hackerrank}
                          buttonName="HackerRank"
                          leetcodeUrl={getLeetcodeUrl}
                        />
                        <SocialButton
                          icon={<SiCodeforces />}
                          buttonUrl={profileData.socialLinks?.codeforces}
                          buttonName="Codeforces"
                          leetcodeUrl={getLeetcodeUrl}
                        />
                        <SocialButton
                          icon={<SiHackerearth />}
                          buttonUrl={profileData.socialLinks?.hackerearth}
                          buttonName="HackerEarth"
                          leetcodeUrl={getLeetcodeUrl}
                        />
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-6">
                        <SocialInput
                          labelName="LeetCode"
                          icon={<SiLeetcode className="w-5 h-5" />}
                          linkName="leetcode"
                          editData={editData}
                          setEditData={setEditData}
                          error={error}
                        />
                        <SocialInput
                          labelName="CodeChef"
                          icon={<SiCodechef className="w-5 h-5" />}
                          linkName="codechef"
                          editData={editData}
                          setEditData={setEditData}
                          error={error}
                        />
                        <SocialInput
                          labelName="HackerRank"
                          icon={<SiHackerrank className="w-5 h-5" />}
                          linkName="hackerrank"
                          editData={editData}
                          setEditData={setEditData}
                          error={error}
                        />
                        <SocialInput
                          labelName="Codeforces"
                          icon={<SiCodeforces className="w-5 h-5" />}
                          linkName="codeforces"
                          editData={editData}
                          setEditData={setEditData}
                          error={error}
                        />
                        <SocialInput
                          labelName="HackerEarth"
                          icon={<SiHackerearth className="w-5 h-5" />}
                          linkName="hackerearth"
                          editData={editData}
                          setEditData={setEditData}
                          error={error}
                        />
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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