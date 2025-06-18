"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "./UserContext";


export default function Router() {
  const { username, id } = useContext(UserContext);
  const router = useRouter();

  // Redirect to chat if username and id are set, otherwise redirect to login
  useEffect(() => {
    if (username && id) {
      router.push("/chat");
    } else {
      router.push("/login");
    }
  }, [username, id, router]);

  return null;
}
