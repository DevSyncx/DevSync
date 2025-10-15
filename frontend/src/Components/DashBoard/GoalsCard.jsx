import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/Components/ui/Card";
import { Input } from "@/Components/ui/input";

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
      if (draft.trim()) updated.push(draft.trim());
    } else {
      updated[i] = draft.trim() || goals[i];
    }
    setEditingIndex(null);
    setDraft("");
    onGoalsChange && onGoalsChange(updated);
  };

  return (
    <Card className="w-full sm:w-auto p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <h3 className="font-semibold text-[var(--primary)]">Goals</h3>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2 text-sm text-[var(--card-foreground)]">
        <ul className="space-y-2">
          {goals.map((goal, i) => (
            <li key={i}>
              {editingIndex === i ? (
                <Input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={() => saveEdit(i)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(i)}
                  autoFocus
                  placeholder="Edit goal..."
                  className="w-full"
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

        {/* Add new goal */}
        {editingIndex === goals.length ? (
          <Input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => saveEdit(goals.length)}
            onKeyDown={(e) => e.key === "Enter" && saveEdit(goals.length)}
            autoFocus
            placeholder="New goal..."
            className="w-full mt-2"
          />
        ) : (
          <button
            onClick={() => startEditing(goals.length, "")}
            className="text-[var(--primary)] text-sm mt-2 hover:underline self-start"
          >
            + Add Goal
          </button>
        )}
      </CardContent>
    </Card>
  );
}
