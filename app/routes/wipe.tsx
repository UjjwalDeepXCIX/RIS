import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();

  const [files, setFiles] = useState<FSItem[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [confirm, setConfirm] = useState(false);

  const loadFiles = async () => {
    const data = (await fs.readDir("./")) as FSItem[];
    setFiles(data);

    const initial: Record<string, boolean> = {};
    data.forEach((f) => (initial[f.path] = false));
    setSelected(initial);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const toggleFile = (path: string) => {
    setSelected((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const toggleAll = () => {
    const allSelected = Object.values(selected).every(Boolean);
    const updated: Record<string, boolean> = {};
    files.forEach((f) => {
      updated[f.path] = !allSelected;
    });
    setSelected(updated);
  };

  const deleteSelectedFiles = async () => {
    const selectedFiles = files.filter((f) => selected[f.path]);

    for (const file of selectedFiles) {
      await fs.delete(file.path);
    }

    loadFiles();
    setConfirm(false);
  };

  const clearKV = async () => {
    await kv.flush();
    alert("KV storage cleared");
  };

  if (isLoading) return <div className="text-white p-6">Loading...</div>;
  if (error) return <div className="text-red-400 p-6">Error {error}</div>;

  return (
    <div className="min-h-screen p-6 text-white bg-linear-to-br from-black via-[#020617] to-[#020617]">


      {/* NAVBAR */}
<div className="flex items-center justify-between mb-6 px-2">

  {/* LEFT - Back */}
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 px-3 py-1.5 rounded-md 
    bg-white/5 border border-white/10 backdrop-blur-md
    hover:border-cyan-400/40 hover:bg-white/10
    transition-all duration-200 text-sm"
  >
    <span className="text-cyan-600">←</span>
    <span className="text-gray-700">Back</span>
  </button>

  {/* CENTER - Title */}
  <h1 className="text-lg md:text-xl font-semibold 
    bg-linear-to-r from-stone-800 via-teal-700 to-gray-300 
    bg-clip-text text-transparent">
    Data Control Panel
  </h1>

  {/* RIGHT spacer (keeps title centered) */}
  <div className="w-[60px]" />

</div>

      {/* USER INFO */}
      <div className="mb-6 p-5 rounded-2xl 
        bg-white/5 border border-white/10 backdrop-blur-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

        <p className="text-xs text-gray-400 mb-1">Authenticated User</p>
        <p className="font-medium text-white tracking-wide">
          {auth.user?.username}
        </p>
      </div>

      {/* FILE SECTION */}
      <div className="mb-6 p-6 rounded-2xl 
        bg-white/5 border border-white/10 backdrop-blur-2xl
        shadow-[0_20px_80px_rgba(0,0,0,0.7)]">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">
            File Storage
          </h2>

          <button
            onClick={toggleAll}
            className="nav-button"
          >
            <span>Toggle All</span>
          </button>
        </div>

       <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">

  {files.map((file) => {
    const isSelected = selected[file.path];

    return (
      <div
        key={file.id}
        onClick={() => toggleFile(file.path)}
        className={`group relative flex items-center justify-between px-4 py-3 rounded-xl 
        border transition-all duration-300 cursor-pointer
        ${isSelected 
          ? "bg-cyan-500/10 border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]" 
          : "bg-black/30 border-white/5 hover:border-cyan-400/30 hover:bg-black/50"
        }`}
      >

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={() => toggleFile(file.path)}
            onClick={(e) => e.stopPropagation()}
            className="accent-cyan-400 scale-110 cursor-pointer"
          />

          {/* Icon */}
          <div className="flex items-center justify-center 
            border border-white/10 text-cyan-300 text-sm">
          </div>

          {/* Name + path */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-200 group-hover:text-white truncate max-w-55">
              {file.name}
            </p>

            <p className="text-xs text-gray-500 group-hover:text-gray-400 truncate max-w-55">
              {file.path}
            </p>
          </div>
        </div>

       

        {/* Glow hover layer */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
          bg-linear-to-r from-cyan-500/10 to-blue-500/10 
          transition duration-300 pointer-events-none"/>
      </div>
    );
  })}
</div>
</div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-4">

        <button
          onClick={() => setConfirm(true)}
          className="primary-button"
        >
          <span>Delete Selected</span>
        </button>

        <button
          onClick={clearKV}
          className="primary-button"
        >
          <span>Clear KV Store</span>
        </button>

      </div>

      {/* CONFIRM MODAL */}
      {confirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50">

          <div className="w-full max-w-md p-6 rounded-2xl 
            bg-white/5 border border-red-500/40 backdrop-blur-2xl
            shadow-[0_20px_80px_rgba(0,0,0,0.9)]">

            <h3 className="text-lg font-semibold mb-2 text-red-400">
              Confirm Deletion
            </h3>

            <p className="text-sm text-gray-300 mb-5 leading-relaxed">
              This action will permanently delete selected files. This cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setConfirm(false)}
                className="nav-button"
              >
                <span>Cancel</span>
              </button>

              <button
                onClick={deleteSelectedFiles}
                className="nav-button-danger px-4 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default WipeApp;