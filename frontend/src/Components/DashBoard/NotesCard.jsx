import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

export default function NotesCard({ notes = [], onNotesChange }) {
  const [newNote, setNewNote] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const addNote = () => {
    if (!newNote.trim()) return;
    const updated = [...notes, newNote.trim()];
    setNewNote("");
    onNotesChange && onNotesChange(updated);
  };

  const startEditing = (i) => {
    setEditingIndex(i);
    setEditingValue(notes[i]);
  };

  const saveEdit = (i) => {
    if (!editingValue.trim()) return;
    const updated = [...notes];
    updated[i] = editingValue.trim();
    setEditingIndex(null);
    setEditingValue("");
    onNotesChange && onNotesChange(updated);
  };

  const removeNote = (i) => {
    const updated = notes.filter((_, idx) => idx !== i);
    onNotesChange && onNotesChange(updated);
  };

  return (
    <Card className="p-4 sm:p-6 w-full sm:w-auto hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <h3 className="font-semibold text-[var(--primary)]">Notes</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {notes.length > 0 ? (
          <ul className="space-y-2 text-sm text-[var(--card-foreground)]">
            {notes.map((note, i) => (
              <li
                key={i}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              >
                {editingIndex === i ? (
                  <>
                    <Input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      autoFocus
                      className="flex-1"
                    />
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => saveEdit(i)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingIndex(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      className="cursor-pointer hover:underline flex-1"
                      onClick={() => startEditing(i)}
                    >
                      {note}
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeNote(i)}
                    >
                      ✕
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--muted-foreground)] text-sm italic">
            No notes yet.
          </p>
        )}

        {/* Add new note */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <Input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            className="flex-1"
          />
          <Button onClick={addNote} className="sm:w-auto w-full">
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
