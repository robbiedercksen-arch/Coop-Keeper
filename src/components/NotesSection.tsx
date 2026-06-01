import { useState } from "react";

export default function NotesSection({ chicken, updateChicken }: any) {
  if (!chicken) return null;

  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("General");

  const notes = chicken.notes || [];

  const fieldClass =
    "border rounded-lg px-3 py-3 text-base w-full max-w-full min-w-0 box-border";

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: noteType,
      description: newNote.trim(),
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
        className={fieldClass}
      >
        <option>General</option>
        <option>Health</option>
        <option>Egg</option>
        <option>Behavior</option>
        <option>Planning</option>
      </select>

      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add a note..."
        className={`${fieldClass} min-h-[95px] resize-none`}
      />

      <button
        onClick={handleAddNote}
        className="bg-green-500 text-white px-3 py-3 rounded-lg text-base font-semibold"
      >
        + Add Note
      </button>

      <div className="flex flex-col gap-2">
        {notes.map((note: any, index: number) => {
          const isObject = typeof note === "object";

          return (
            <div key={index} className="bg-gray-100 p-3 rounded-lg">
              {isObject && (
                <div className="text-sm text-gray-500">
                  {note.type} • {new Date(note.date).toLocaleDateString()}
                </div>
              )}

              <div className="text-base break-words">
                {isObject ? note.description : note}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}