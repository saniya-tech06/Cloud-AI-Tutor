import Navbar from "../components/navbar";
import Menubar from "../components/MenuBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  getStudySpaces,
  deleteStudySpace as deleteStudySpaceAPI,
} from "../api/studySpaceApi";

import ConfirmModal from "../components/ui/ConfirmModal";
import RenameModal from "../components/ui/RenameModal";
import Toast from "../components/ui/Toast";

import {
  BookOpen,
  Plus,
  ArrowRight,
  Search,
  Star,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react";

type StudySpace = {
  id: number;
  title: string;
  description: string;
  favorite?: boolean;
  created_at: string;
};

function StudySpaces() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const [studySpaces, setStudySpaces] = useState<StudySpace[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [studySpaceName, setStudySpaceName] = useState("");

  // FAVORITE TOGGLE
  const toggleFavorite = async (id: number, current: boolean) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/study-spaces/${id}/favorite`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            favorite: !current,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorite");
      }

      setStudySpaces((prev) =>
        prev.map((space) =>
          space.id === id
            ? { ...space, favorite: !current }
            : space
        )
      );
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  // LOAD STUDY SPACES
  const loadStudySpaces = async () => {
    try {
      setLoading(true);

      const response = await getStudySpaces();

      console.log("Study Spaces:", response);

      setStudySpaces(
        response.studySpaces.map((space: any) => ({
          ...space,
          favorite: Boolean(space.favorite),
        }))
      );
    } catch (error) {
      console.log("Failed loading study spaces", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudySpaces();
  }, []);
    const filteredStudySpaces = [...studySpaces]
    .filter((space) =>
      space.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      // Favorites first
      if (a.favorite !== b.favorite) {
        return Number(b.favorite) - Number(a.favorite);
      }

      if (sortBy === "az") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "za") {
        return b.title.localeCompare(a.title);
      }

      return 0;
    });

  // RENAME
  const renameStudySpace = () => {
    setStudySpaces((prev) =>
      prev.map((space) =>
        space.id === selectedId
          ? {
              ...space,
              title: studySpaceName,
            }
          : space
      )
    );

    setShowRenameModal(false);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // DELETE
  const deleteStudySpace = async () => {
    try {
      if (!selectedId) return;

      await deleteStudySpaceAPI(selectedId);

      setStudySpaces((prev) =>
        prev.filter((space) => space.id !== selectedId)
      );

      setShowDeleteModal(false);

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.log("Delete failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Menubar />

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">Library</p>
            <h1 className="text-4xl font-bold tracking-tight">Study Spaces</h1>

            <p className="text-slate-400 mt-3">
              Organize your subjects and study materials with AI.
            </p>
          </div>

          <Link
            to="/new-study-space"
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition w-fit shadow-lg shadow-blue-950/30"
          >
            <Plus size={20} />
            New Study Space
          </Link>
        </div>

        {/* SEARCH + SORT */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 flex items-center">
            <Search size={20} className="text-slate-500" />

            <input
              type="text"
              placeholder="Search Study Spaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent p-4 outline-none text-white placeholder-slate-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-slate-300"
          >
            <option value="recent">Recently Updated</option>
            <option value="az">Name (A-Z)</option>
            <option value="za">Name (Z-A)</option>
          </select>
        </div>
                {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 mt-10">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <h2 className="text-xl">Loading Study Spaces...</h2>
            </div>
          ) : filteredStudySpaces.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <h2 className="text-xl font-semibold">
                No Study Spaces Found
              </h2>

              <p className="text-slate-400 mt-2">
                Create your first study space.
              </p>
            </div>
          ) : (
            filteredStudySpaces.map((space) => (
              <div
                key={space.id}
                className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/20 hover:border-blue-500/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <BookOpen className="text-blue-400" size={28} />

                    <div>
                      <h2 className="text-2xl font-semibold">{space.title}</h2>

                      <p className="text-slate-500 text-sm">
                        {space.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {/* FAVORITE */}
                    <button
                      onClick={() =>
                        toggleFavorite(space.id, !!space.favorite)
                      }
                      className="transition"
                    >
                      <Star
                        size={18}
                        className={
                          space.favorite
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-400 hover:text-yellow-400"
                        }
                      />
                    </button>

                    {/* RENAME */}
                    <button
                      onClick={() => {
                        setSelectedId(space.id);
                        setStudySpaceName(space.title);
                        setShowRenameModal(true);
                      }}
                      className="hover:text-blue-400 transition"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        setSelectedId(space.id);
                        setShowDeleteModal(true);
                      }}
                      className="hover:text-red-500 transition"
                    >
                      <Trash2 size={18} />
                    </button>

                    <button className="hover:text-slate-300 transition">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                <p className="mt-6 text-slate-400">📄 Documents</p>

                <p className="text-slate-500 text-sm mt-2">
                  🕒 Created
                  {" "}
                  {new Date(space.created_at).toLocaleDateString()}
                </p>

                <Link
                  to={`/study-space/${space.id}`}
                  className="mt-6 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Open Study Space
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))
          )}

          {/* CREATE CARD */}
          <Link
            to="/new-study-space"
            className="border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-blue-500 hover:bg-slate-900 transition-all duration-300"
          >
            <Plus size={42} className="text-slate-500" />

            <h3 className="text-xl font-semibold mt-5">
              Create New Study Space
            </h3>

            <p className="text-slate-400 text-center mt-2">
              Upload PDFs and start learning with AI.
            </p>

            <div className="mt-6 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold">
              Create
            </div>
          </Link>
        </div>
      </main>
            {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Study Space?"
        message="This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={deleteStudySpace}
      />

      {/* RENAME MODAL */}
      <RenameModal
        isOpen={showRenameModal}
        title="Rename Study Space"
        value={studySpaceName}
        setValue={setStudySpaceName}
        onCancel={() => setShowRenameModal(false)}
        onSave={renameStudySpace}
      />

      {/* TOAST */}
      {showToast && (
        <Toast
          type="success"
          message="Action completed successfully!"
        />
      )}
    </div>
  );
}

export default StudySpaces;
