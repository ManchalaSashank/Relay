"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { UserContextProvider } from "@/utils/UserContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserContextProvider>
      <html lang="en">
        <body className={inter.className + " bg-zinc-900 text-white"}>
          {children}
        </body>
      </html>
    </UserContextProvider>
  );
}
