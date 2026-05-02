import { useState } from "react";

export default function NotesSection({ chicken, updateChicken }: any) {
  if (!chicken) return null;

  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("General");

  const notes = chicken.notes || [];

  const handleAddNote = () => {
  if (!newNote.trim()) return;

  const newEntry = {
    id: Date.now(),
    date: new Date().toISOString(),
    type: noteType,
    description: newNote,
  };

  const updated = {
    ...chicken,
    notes: [...notes, newEntry],
  };

  updateChicken(updated);
  setNewNote("");
};

  return (
    <div className="flex flex-col gap-3">
<select
  value={noteType}
  onChange={(e) => setNoteType(e.target.value)}
  className="border rounded-lg px-3 py-2 text-sm"
>
  <option>General</option>
  <option>Health</option>
  <option>Egg</option>
  <option>Behavior</option>
  <option>Planning</option> {/* 👈 add this */}
</select>
      <input
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add a note..."
        className="border rounded-lg px-3 py-2 text-sm"
      />

      <button
        onClick={handleAddNote}
        className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm"
      >
        + Add Note
      </button>

      <div className="flex flex-col gap-2">
  {notes.map((note: any, index: number) => {
    const isObject = typeof note === "object";

    return (
      <div key={index} className="bg-gray-100 p-2 rounded-lg">
        {isObject && (
          <div className="text-xs text-gray-500">
            {note.type} • {new Date(note.date).toLocaleDateString()}
          </div>
        )}
        <div className="text-sm">
          {isObject ? note.description : note}
        </div>
      </div>
    );
  })}
</div>

    </div>
  );
}