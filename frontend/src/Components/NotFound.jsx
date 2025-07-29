import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center px-6">
      <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 dark:from-yellow-400 dark:via-orange-500 dark:to-red-500 animate-pulse">
        404
      </h1>
      <p className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Oops! Page Not Found
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-md text-center">
        The page you're looking for doesn't exist, got removed, changed name or
        is temporarily unavailable.
      </p>

      <Link
        to="/"
        className="mt-8 px-6 py-3 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-md hover:from-purple-600 hover:to-pink-500 transition duration-300 ease-in-out"
      >
        ← Go back to Home
      </Link>

      <div className="mt-16">
        <img
          src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg"
          alt="404 Illustration"
          className="w-64 max-w-md rounded-full shadow-2xl shadow-indigo-400"
        />
      </div>
    </div>
  );
};

export default NotFound;
