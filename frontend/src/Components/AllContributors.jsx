import React, { useEffect, useState } from "react";
import { Github } from "lucide-react"; // ✅ GitHub icon (lucide-react)

const AllContributors = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const OWNER = "DevSyncx";
  const REPO = "DevSync";

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contributors?per_page=100`
        );
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        const data = await response.json();
        setContributors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className="bg-[#0B1120] text-white py-12 px-6 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
        🌟 All Contributors
      </h2>

      {loading && (
        <p className="text-center text-gray-400">Loading contributors...</p>
      )}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {contributors.map((contributor) => (
            <a
              key={contributor.id}
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-2xl shadow-lg p-5 flex flex-col items-center transition-all duration-300 hover:scale-105"
            >
              {/* Avatar with ring */}
              <div className="relative">
                <img
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  className="w-20 h-20 rounded-full"
                />
                
              </div>

              {/* Username */}
              <p className="mt-4 font-semibold truncate w-full text-center">
                {contributor.login}
              </p>

              {/* Commits */}
              <p className="text-sm text-gray-400 mb-2">
                {contributor.contributions} commits
              </p>

              {/* GitHub button */}
              <div className="flex items-center gap-1 text-blue-400 text-sm opacity-80 group-hover:opacity-100 transition">
                <Github size={16} />
                <span>View Profile</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllContributors;
