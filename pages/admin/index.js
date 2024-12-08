import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { promises as fs } from "fs";
import path from "path";

export default function AdminPage({ files }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  // Authentication form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
    } else {
      setStatus("Authentication failed");
    }
  };

  useEffect(() => {
    if (selectedFile) {
      fetch(`/api/content/${selectedFile}`)
        .then(async (res) => {
          if (res.status === 401) {
            // If unauthorized, reset auth state
            setIsAuthenticated(false);
            return;
          }
          const data = await res.json();
          setContent(data.content);
        })
        .catch(error => {
          console.error('Error fetching content:', error);
          setStatus('Error loading file');
        });
    }
  }, [selectedFile]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/content/${selectedFile}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      if (res.ok) {
        setStatus("Saved successfully");
      } else {
        const error = await res.json();
        setStatus(error.error || "Error saving file");
      }
    } catch (error) {
      setStatus("Error saving file");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Content Admin</h1>

      <div className="mb-4">
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="rounded border p-2"
        >
          <option value="">Select a file</option>
          {files.map((file) => (
            <option key={file.path} value={file.path}>
              {file.name}
            </option>
          ))}
        </select>
      </div>

      {selectedFile && (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-[600px] w-full rounded border p-4 font-mono text-sm"
          />

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleSave}
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              Save Changes
            </button>
            {status && <span>{status}</span>}
          </div>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const contentDir = path.join(process.cwd(), "content");

  const getFiles = async (dir, base = "") => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(base, entry.name);

        if (entry.isDirectory()) {
          return getFiles(fullPath, relativePath);
        }

        if (entry.name.endsWith(".md")) {
          return [
            {
              path: relativePath,
              name: relativePath,
            },
          ];
        }

        return [];
      })
    );

    return files.flat();
  };

  const files = await getFiles(contentDir);

  return {
    props: {
      files,
    },
  };
}
