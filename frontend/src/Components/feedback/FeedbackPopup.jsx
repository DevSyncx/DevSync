import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import StarRating from "@/Components/ui/StarRating";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { Sparkles } from "lucide-react";

const feedbackCategories = [
  { id: "ui", label: "User Interface" },
  { id: "features", label: "Features" },
  { id: "bugs", label: "Bug Reports" },
  { id: "suggestions", label: "Suggestions" },
  { id: "other", label: "Other" }
];

export default function FeedbackPopup({ open, onOpenChange, onSubmit, userInfo }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("other");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [errors, setErrors] = useState({ rating: "", comment: "" });

  const handleRatingChange = (value) => {
    setRating(value);
    if (errors.rating) setErrors({ ...errors, rating: "" });
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (errors.comment && e.target.value.trim().length >= 10) {
      setErrors({ ...errors, comment: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
      isValid = false;
    }

    if (!comment.trim()) {
      newErrors.comment = "Please provide some feedback";
      isValid = false;
    } else if (comment.trim().length < 10) {
      newErrors.comment = "Feedback should be at least 10 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    // If user is not logged in, we'll always treat it as anonymous
    const actualIsAnonymous = !userInfo ? true : isAnonymous;

    const feedbackData = {
      userId: userInfo?.id || "anonymous",
      rating,
      comment: comment.trim(),
      category,
      isAnonymous: actualIsAnonymous,
      date: new Date().toISOString()
    };

    onSubmit(feedbackData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" /> 
              We'd Love Your Feedback
            </DialogTitle>
            <DialogDescription>
              Help us improve DevSync by sharing your thoughts and experience.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Rating */}
            <div className="flex flex-col gap-2">
              <label htmlFor="rating" className="text-sm font-medium text-[var(--primary)]">
                How would you rate your experience?
              </label>
              <div className="flex justify-center py-2">
                <StarRating 
                  value={rating} 
                  onChange={handleRatingChange} 
                  size={28} 
                  activeColor="gold"
                />
              </div>
              {errors.rating && (
                <p className="text-xs text-red-500 mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-sm font-medium text-[var(--primary)]">
                Feedback Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {feedbackCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-2">
              <label htmlFor="comment" className="text-sm font-medium text-[var(--primary)]">
                Your Feedback
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={handleCommentChange}
                placeholder="Tell us what you think..."
                className="min-h-[100px]"
              />
              {errors.comment && (
                <p className="text-xs text-red-500 mt-1">{errors.comment}</p>
              )}
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="anonymous" 
                checked={isAnonymous} 
                onCheckedChange={(checked) => setIsAnonymous(!!checked)} 
              />
              <label
                htmlFor="anonymous"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[var(--muted-foreground)]"
              >
                Submit anonymously
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="submit" className="bg-[var(--primary)] hover:bg-opacity-90 text-white">
              Submit Feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}