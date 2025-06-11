"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";

export default function Router() {
  const router = useRouter();
  const { username, id } = useUser();

  useEffect(() => {
    if (username && id) {
      router.push("/chats");
    } else {
      router.push("/login");
    }
  }, [username, id]);

  return <div className="text-zinc-400 text-center mt-8">Checking authentication...</div>;
}
