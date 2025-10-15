import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import Footer from "../footer";

// Component to display individual feedback cards
const FeedbackCard = ({ feedback }) => {
  const { rating, comment, category, date, isAnonymous } = feedback;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  // Category labels mapping
  const categoryLabels = {
    ui: "User Interface",
    features: "Features",
    bugs: "Bug Reports",
    suggestions: "Suggestions",
    other: "Other"
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? "gold" : "transparent"}
        stroke={i < rating ? "gold" : "gray"}
        className="inline-block"
      />
    ));
  };

  return (
    <div className="bg-[var(--card)] rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center">
            {renderStars(rating)}
            <span className="ml-2 text-sm text-[var(--muted-foreground)]">
              {rating}/5
            </span>
          </div>
          <div className="mt-1 inline-block bg-[var(--muted)] text-[var(--muted-foreground)] text-xs px-2 py-1 rounded">
            {categoryLabels[category] || "Other"}
          </div>
        </div>
        <span className="text-xs text-[var(--muted-foreground)]">
          {formattedDate}
        </span>
      </div>
      
      <div className="mt-3">
        <p className="text-[var(--foreground)]">{comment}</p>
      </div>
      
      <div className="mt-2 text-xs text-[var(--muted-foreground)] italic">
        {isAnonymous ? "Anonymous User" : "DevSync User"}
      </div>
    </div>
  );
};

// Filter component for feedback
const FeedbackFilters = ({ categories, selectedCategory, onCategoryChange, selectedRating, onRatingChange }) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
          Filter by Category
        </label>
        <select 
          value={selectedCategory} 
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full p-2 border rounded bg-[var(--background)] text-[var(--foreground)] border-[var(--border)]"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">
          Filter by Rating
        </label>
        <select 
          value={selectedRating} 
          onChange={(e) => onRatingChange(e.target.value)}
          className="w-full p-2 border rounded bg-[var(--background)] text-[var(--foreground)] border-[var(--border)]"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Star</option>
        </select>
      </div>
    </div>
  );
};

// Main feedback review page
export default function FeedbackReviewPage() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  
  // Category options
  const categories = [
    { id: "ui", label: "User Interface" },
    { id: "features", label: "Features" },
    { id: "bugs", label: "Bug Reports" },
    { id: "suggestions", label: "Suggestions" },
    { id: "other", label: "Other" }
  ];

  // Fetch feedback from the backend or use mock data if unavailable
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        
        try {
          // Try to fetch from backend first
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            setFeedbackList(data);
            return;
          }
        } catch (backendError) {
          console.warn("Backend API not available:", backendError);
        }
        
        // If backend fetch fails, show empty list
        console.log("Backend API not available, showing empty feedback list");
        setFeedbackList([]);
      } catch (err) {
        console.error("Error setting up feedback:", err);
        setError("Failed to load feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, []);

  // Filter feedback based on selected category and rating
  const filteredFeedback = feedbackList.filter(feedback => {
    // Filter by category
    const categoryMatch = selectedCategory === 'all' || feedback.category === selectedCategory;
    
    // Filter by rating
    const ratingMatch = 
      selectedRating === 'all' || 
      (selectedRating === '5' && feedback.rating === 5) ||
      (selectedRating === '4' && feedback.rating >= 4) ||
      (selectedRating === '3' && feedback.rating >= 3) ||
      (selectedRating === '2' && feedback.rating >= 2) ||
      (selectedRating === '1' && feedback.rating >= 1);
    
    return categoryMatch && ratingMatch;
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
    
      
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2 text-[var(--primary)]">Community Feedback</h1>
        <p className="text-[var(--muted-foreground)] mb-8">
          See what our users are saying about DevSync and how we're improving based on your feedback.
        </p>
        
        {/* Filters */}
        <FeedbackFilters 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedRating={selectedRating}
          onRatingChange={setSelectedRating}
        />
        
        {/* Feedback display */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
              <p className="mt-4 text-[var(--muted-foreground)]">Loading feedback...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
            <p className="mt-2">Don't worry! You're seeing our demo feedback data.</p>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-[var(--muted-foreground)]">No feedback found</h3>
            {selectedCategory !== 'all' || selectedRating !== 'all' ? (
              <p className="mt-2 text-[var(--muted-foreground)]">
                Try adjusting your filters to see more results
              </p>
            ) : (
              <p className="mt-2 text-[var(--muted-foreground)]">
                Be the first to provide feedback!
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFeedback.map((feedback, index) => (
              <FeedbackCard key={index} feedback={feedback} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}