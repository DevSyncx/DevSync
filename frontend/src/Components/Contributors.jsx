import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const ContributorsSection = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="bg-[#0B1120] text-white my-8 py-12 pb-20 px-6 relative">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">
        🚀 Our Top Contributors
      </h2>

      {loading && (
        <p className="text-center text-gray-400">Loading contributors...</p>
      )}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contributors.slice(0, 3).map((contributor) => (
              <a
                key={contributor.id}
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#111827] rounded-2xl shadow-md p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <p className="mt-3 font-medium">{contributor.login}</p>
                <p className="text-sm text-gray-400">
                  {contributor.contributions} commits
                </p>
              </a>
            ))}
          </div>

          <button
            onClick={() => navigate("/contributors")}
            className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer"
          >
            <FaArrowRight className="text-xl" />
          </button>
        </>
      )}
    </div>
  );
};

export default ContributorsSection;
