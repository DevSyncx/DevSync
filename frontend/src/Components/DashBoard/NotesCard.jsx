import { useState } from "react";
import CardWrapper from "./CardWrapper";

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
    <CardWrapper className="p-6">
      <h3 className="font-semibold mb-2">Notes</h3>

      {notes.length > 0 ? (
        <ul className="space-y-2 text-sm text-gray-700">
          {notes.map((note, i) => (
            <li key={i} className="flex justify-between items-center gap-2">
              {editingIndex === i ? (
                <>
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="border rounded px-2 py-1 text-sm flex-1"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(i)}
                    className="text-green-600 text-xs"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="text-gray-500 text-xs"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="cursor-pointer hover:underline flex-1"
                    onClick={() => startEditing(i)}
                  >
                    {note}
                  </span>
                  <button
                    className="text-red-500 text-xs"
                    onClick={() => removeNote(i)}
                  >
                    ✕
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm italic">No notes yet.</p>
      )}

      {/* Add new note */}
      <div className="flex gap-2 mt-4">
  <input
    type="text"
    value={newNote}
    onChange={(e) => setNewNote(e.target.value)}
    placeholder="Add a new note..."
    className="border rounded px-1 h-8 text-sm flex-1"
  />
  <button
    onClick={addNote}
    className="bg-blue-500 text-white px-2 md:px-4 h-8 rounded text-sm"
  >
    Add
  </button>
</div>
    </CardWrapper>
  );
}
