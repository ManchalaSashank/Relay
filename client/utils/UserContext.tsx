"use client";

import axios from "axios";
import { createContext, useEffect, useState } from "react";

// --- User context for authentication state ---
export const UserContext = createContext<any>(null);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  // --- State for username and user id ---
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- Set axios defaults for API requests ---
    axios.defaults.baseURL = "http://localhost:4000/api";
    axios.defaults.withCredentials = true;

    // --- Fetch user profile on mount ---
    axios.get("/auth/profile").then((res) => {
      if (res.data.valid) {
        setUsername(res.data.username);
        setId(res.data.userId);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return null; 
  }

  return (
    <UserContext.Provider value={{ username, id, setUsername, setId }}>
      {children}
    </UserContext.Provider>
  );
}