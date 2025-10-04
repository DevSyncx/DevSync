import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/Card";

const GitHubCard = ({ githubUsername }) => {
  const [loading, setLoading] = useState(true);
  const [validUser, setValidUser] = useState(false);

  useEffect(() => {
    if (!githubUsername) {
      setLoading(false);
      setValidUser(false);
      return;
    }

    const checkGitHubUser = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/github/${githubUsername}`);
        const json = await res.json();
        setValidUser(res.ok && !json.error);
      } catch (err) {
        console.error(err);
        setValidUser(false);
      } finally {
        setLoading(false);
      }
    };

    checkGitHubUser();
  }, [githubUsername]);

  return (
    <Card className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
      {loading ? (
        <p className="text-center text-gray-500">Checking GitHub...</p>
      ) : validUser ? (
        <Link to={`/dashboard/github/${githubUsername}`}>
          <CardContent className="cursor-pointer">
            <h3 className="font-bold">GitHub</h3>
            <p>View {githubUsername}'s GitHub profile</p>
          </CardContent>
        </Link>
      ) : (
        <div className="text-center text-red-500">
          GitHub username not found
        </div>
      )}
    </Card>
  );
};

export default GitHubCard;
