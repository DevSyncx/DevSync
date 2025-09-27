import React, { useState } from "react";

export default function FAQ() {
  const faqs = [
    { 
      question: "What is DevSync?",
      answer: "DevSync is a unified productivity tracker for developers. It aggregates your coding activity, contributions, and daily goals from multiple platforms into a single dashboard, helping you track growth, stay consistent, and showcase your development journey." 
    },
    { 
      question: "Which platforms does DevSync support?", 
      answer: "DevSync supports a growing list of coding and development platforms. Currently, it integrates with popular platforms like GitHub, LeetCode, and other major coding platforms. More integrations will be added over time." 
    },
    { 
      question: "How is DevSync different?", 
      answer: "While platforms like GitHub, LeetCode, and Wakatime track specific activities, DevSync consolidates all your coding stats, streaks, and growth across multiple platforms into a single, easy-to-read dashboard, providing a holistic view of your developer progress." 
    },
    { 
      question: "Can I connect multiple platforms?", 
      answer: "Yes! DevSync allows you to connect multiple supported platforms simultaneously, giving you a unified view of all your coding activity and progress in one place." 
    },
    { 
      question: "How to set up locally?", 
      answer: (
        <>
          1. Fork the repository and clone it to your machine.<br />
          2. Install dependencies for the frontend and backend using <code>npm install</code>.<br />
          3. Run the development servers:<br />
          &nbsp;&nbsp;- Frontend: <code>npm run dev</code><br />
          &nbsp;&nbsp;- Backend: <code>npm run dev</code><br />
        </>
      ) 
    },
    { 
      question: "Do I need an account?", 
      answer: "Yes, you will need to sign in using your GitHub or other supported accounts to sync your coding activity." 
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id ="faq" className="max-w-4xl mx-auto py-16 px-6 font-sans">
      <h2 className="text-4xl font-bold font-heading text-center mb-4 text-gray-900 dark:text-gray-100">
        Frequently Asked Questions
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
        Have questions? Click a question to expand.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm dark:shadow-none overflow-hidden transition-shadow hover:shadow-lg dark:hover:shadow-gray-700"
          >
            <button
              className="flex justify-between items-center w-full px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-heading font-medium text-lg text-gray-900 dark:text-gray-100 transition-all duration-300"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              {faq.question}
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === idx && (
              <div className="px-6 py-4 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 font-sans transition-colors">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
