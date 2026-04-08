"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Screen = {
  id: number;
  alpha: string;
  Screen_type: number;
  screen_number: number;
  screen_description: string;
  file_label: string;
  screen_label: string;
  notes: string;
  status: string;
  sitemap: string;
};

const API_BASE = "http://localhost:8000";
const TOKEN_KEY = "sca_auth_token";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

type DatabaseContextType = {
  data: Screen[];
  handleAdd: (newData: any) => Promise<void>;
  handleEdit: (id: number, updatedItem: any) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  isMounted: boolean;
  isLoading: boolean;
  error: string | null;
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Screen[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Load all screens from API on mount ───────────────────────────────────
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/screens`, {
          headers: authHeaders(),
        });
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const json: Screen[] = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching screens:", err);
        setError("Could not connect to the API. Is the backend running?");
      } finally {
        setIsLoading(false);
        setIsMounted(true);
      }
    };

    fetchScreens();
  }, []);

  // ── Create ────────────────────────────────────────────────────────────────
  const handleAdd = async (newData: any) => {
    const payload = {
      alpha: newData.alpha,
      Screen_type: Number(newData.screenType) || 0,
      screen_number: Number(newData.screenNumber),
      screen_description: newData.screenDescription,
      file_label: newData.fileLabel,
      screen_label: newData.screenLabel,
      notes: newData.notes ?? "",
      status: newData.status,
      sitemap: newData.sitemap ?? "",
    };

    const res = await fetch(`${API_BASE}/screens`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create screen");
    const created: Screen = await res.json();
    setData((prev) => [...prev, created]);
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const handleEdit = async (id: number, updatedItem: any) => {
    const payload = {
      alpha: updatedItem.alpha,
      Screen_type: Number(updatedItem.screenType) || 0,
      screen_number: Number(updatedItem.screenNumber),
      screen_description: updatedItem.screenDescription,
      file_label: updatedItem.fileLabel,
      screen_label: updatedItem.screenLabel,
      notes: updatedItem.notes ?? "",
      status: updatedItem.status,
      sitemap: updatedItem.sitemap ?? "",
    };

    const res = await fetch(`${API_BASE}/screens/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update screen");
    const updated: Screen = await res.json();
    setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    const res = await fetch(`${API_BASE}/screens/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!res.ok) throw new Error("Failed to delete screen");
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <DatabaseContext.Provider
      value={{
        data,
        handleAdd,
        handleEdit,
        handleDelete,
        isMounted,
        isLoading,
        error,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}

