"use client";

import { createContext, useEffect, useState, useContext } from "react";
import axios from "@/utils/axios";

export interface UserContextType {
  username: string;
  id: string;
  setUsername: (username: string) => void;
  setId: (id: string) => void;
}

export const UserContext = createContext<UserContextType>({
  username: "",
  id: "",
  setUsername: () => {},
  setId: () => {},
});

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    axios.get("/auth/profile").then((res) => {
      if (res.data.valid) {
        setUsername(res.data.username);
        setId(res.data.userId);
      }
    }).catch(() => {
      setUsername("");
      setId("");
    });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
