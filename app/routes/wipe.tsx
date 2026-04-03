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

        // reset selection
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
            await fs.delete(file.path); // ✅ proper async loop
        }

        loadFiles();
        setConfirm(false);
    };
    
    const clearKV = async () => {
        await kv.flush();
        alert("KV storage cleared");
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error {error}</div>;

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-4">Data Control Panel</h1>

            <p className="mb-4">
                Logged in as: <span className="font-semibold">{auth.user?.username}</span>
            </p>

            {/* FILE LIST */}
            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <h2 className="text-lg font-semibold">Files</h2>
                    <button
                        onClick={toggleAll}
                        className="text-sm text-blue-400"
                    >
                        Toggle All
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center gap-3 bg-gray-800 p-2 rounded"
                        >
                            <input
                                type="checkbox"
                                checked={selected[file.path] || false}
                                onChange={() => toggleFile(file.path)}
                            />
                            <p>{file.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
                <button
                    onClick={() => setConfirm(true)}
                    className="bg-red-500 px-4 py-2 rounded"
                >
                    Delete Selected Files
                </button>

                <button
                    onClick={clearKV}
                    className="bg-yellow-500 px-4 py-2 rounded"
                >
                    Clear KV Store
                </button>
            </div>

            {/* CONFIRM MODAL */}
            {confirm && (
                <div className="mt-6 bg-gray-900 p-4 rounded border border-red-500">
                    <p className="mb-4">
                        Are you sure you want to delete selected files?
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={deleteSelectedFiles}
                            className="bg-red-600 px-4 py-2 rounded"
                        >
                            Yes, Delete
                        </button>
                        <button
                            onClick={() => setConfirm(false)}
                            className="bg-gray-600 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WipeApp;