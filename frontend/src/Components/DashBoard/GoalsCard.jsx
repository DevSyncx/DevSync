import { useState } from "react";
import CardWrapper from "./CardWrapper";

export default function GoalsCard({ goals = [], onGoalsChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [draft, setDraft] = useState("");

  const startEditing = (i, current) => {
    setEditingIndex(i);
    setDraft(current || "");
  };

  const saveEdit = (i) => {
    let updated = [...goals];
    if (i === goals.length) {
      // new goal
      if (draft.trim()) updated.push(draft.trim());
    } else {
      updated[i] = draft.trim() || goals[i];
    }
    setEditingIndex(null);
    setDraft("");
    onGoalsChange && onGoalsChange(updated);
  };

  return (
    <CardWrapper className="p-6">
      <h3 className="font-semibold mb-2">Goals</h3>

      <ul className="space-y-2 text-sm text-gray-700">
        {goals.map((goal, i) => (
          <li key={i}>
            {editingIndex === i ? (
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => saveEdit(i)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit(i)}
                autoFocus
                className="border rounded px-2 py-1 text-sm w-full"
              />
            ) : (
              <span
                className="cursor-pointer hover:underline"
                onClick={() => startEditing(i, goal)}
              >
                {goal}
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Add new goal row */}
      {editingIndex === goals.length ? (
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => saveEdit(goals.length)}
          onKeyDown={(e) => e.key === "Enter" && saveEdit(goals.length)}
          autoFocus
          className="border rounded px-2 py-1 text-sm w-full mt-2"
          placeholder="New goal..."
        />
      ) : (
        <button
          onClick={() => startEditing(goals.length, "")}
          className="text-blue-600 text-sm mt-2 hover:underline"
        >
          + Add Goal
        </button>
      )}
    </CardWrapper>
  );
}
