import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { ArrowLeft, Edit, Trash2, Pin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);

  const [search, setSearch] = useState("");

  const [editNote, setEditNote] = useState(null);
  const [editText, setEditText] = useState("");

  const [deleteNote, setDeleteNote] = useState(null);

  const navigate = useNavigate();

  const load = async () => {
    const { data } = await API.get("/notes");

    const sorted = [...data].sort((a, b) => b.pinned - a.pinned);
    setNotes(sorted);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await API.post("/notes/create", { text });
    setText("");
    load();
  };

  const updateNote = async () => {
    await API.put(`/notes/edit/${editNote._id}`, { text: editText });
    setEditNote(null);
    load();
  };

  const togglePin = async (n) => {
    await API.put(`/notes/pin/${n._id}`);
    load();
  };

  const deleteNoteFn = async () => {
    await API.delete(`/notes/delete/${deleteNote._id}`);
    setDeleteNote(null);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  const filteredNotes = notes.filter((n) =>
    n.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#101726] p-6 rounded-2xl shadow-xl text-white">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-4"
      >
        <ArrowLeft size={22} /> Back
      </button>

      <h2 className="text-3xl font-bold mb-6">Personal Notes</h2>

      <div className="flex items-center gap-3 mb-6 bg-[#161e32] p-3 rounded-xl border border-gray-700">
        <Search size={20} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="bg-transparent flex-1 outline-none text-gray-200"
        />
      </div>

      <form onSubmit={submit} className="flex gap-4 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something..."
          className="flex-1 p-3 rounded bg-[#161e32] border border-gray-700 text-gray-200"
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-3 rounded-lg shadow hover:opacity-90"
          type="submit"
        >
          Add
        </button>
      </form>

      <div className="space-y-4">
        {filteredNotes.map((n) => (
          <div
            key={n._id}
            className="relative bg-[#161e32] p-4 rounded-xl shadow-lg border border-gray-700"
          >
            <button
              onClick={() => togglePin(n)}
              className="absolute right-3 top-3 text-yellow-400 hover:scale-110"
            >
              <Pin size={20} fill={n.pinned ? "yellow" : "none"} />
            </button>

            <p className="text-gray-200">{n.text}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(n.createdAt).toLocaleString()}
            </p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => {
                  setEditNote(n);
                  setEditText(n.text);
                }}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Edit size={18} /> Edit
              </button>

              <button
                onClick={() => setDeleteNote(n)}
                className="text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editNote && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-[#161e32] p-6 rounded-xl w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Edit Note</h3>

            <textarea
              className="w-full p-3 bg-[#101626] text-gray-300 rounded-lg border border-gray-700"
              rows={5}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-purple-600 py-2 rounded-lg"
                onClick={updateNote}
              >
                Save
              </button>

              <button
                className="flex-1 bg-gray-600 py-2 rounded-lg"
                onClick={() => setEditNote(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteNote && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-[#161e32] p-6 rounded-xl w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-3 text-red-300">Delete Note?</h3>
            <p className="text-gray-300 mb-5">
              Are you sure you want to delete this note?
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 bg-red-600 py-2 rounded-lg"
                onClick={deleteNoteFn}
              >
                Delete
              </button>

              <button
                className="flex-1 bg-gray-600 py-2 rounded-lg"
                onClick={() => setDeleteNote(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

