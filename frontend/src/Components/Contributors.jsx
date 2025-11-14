import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

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
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
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
    <section className="relative bg-[#0B1120] text-white py-16 px-6 border-y border-[rgba(80,120,255,0.25)]">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-fuchsia-500 animate-[liquidflow_8s_ease_infinite]">
        🚀 Our Top Contributors
      </h2>

      {loading && (
        <p className="text-center text-gray-400 animate-pulse">
          Loading contributors...
        </p>
      )}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && contributors.length > 0 && (
        <>
          <div className="relative max-w-6xl mx-auto">
            <InfiniteMovingCards
              items={contributors.map((c) => ({
                quote: `${c.contributions} commits`,
                name: c.login,
                title: "GitHub Contributor",
                avatar: c.avatar_url,
                url: c.html_url,
              }))}
              direction="left"
              speed="slow"
            />
          </div>

          <button
            onClick={() => navigate("/contributors")}
            className="absolute bottom-6 right-6 bg-gradient-to-r from-blue-600 to-fuchsia-500 hover:from-blue-500 hover:to-fuchsia-400 
                       text-white p-4 rounded-full shadow-lg flex items-center justify-center 
                       transition-all duration-300 cursor-pointer hover:scale-110"
          >
            <FaArrowRight className="text-xl" />
          </button>
        </>
      )}

      <style>{`
        @keyframes liquidflow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default ContributorsSection;
