import "./globals.css";
import { Inter } from "next/font/google";
import { UserContextProvider } from "@/utils/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Relay",
  description: "A real-time chat app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <UserContextProvider>{children}</UserContextProvider>
      </body>
    </html>
  );
}
