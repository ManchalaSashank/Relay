"use client";

import { useContext, useEffect, useRef, useState, memo } from "react";
import { UserContext } from "@/utils/UserContext";
import axios from "@/utils/axios";
import { Paperclip, Send, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// --- Types ---
type User = { _id: string; name: string; username: string };
type Message = {
  sender: string;
  recipient: string;
  text?: string;
  file?: string;
  createdAt?: string;
};

// --- Sidebar User Button (memoized) ---
const SidebarUserButton = memo(
  ({
    user,
    isSelected,
    isOnline,
    onSelect,
  }: {
    user: User;
    isSelected: boolean;
    isOnline: boolean;
    onSelect: (user: User) => void;
  }) => (
    <button
      onClick={() => onSelect(user)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition shadow-sm relative group
        ${isSelected ? "bg-gradient-to-r from-[#312e81]/80 to-[#6d28d9]/80 shadow-lg" : ""}
        hover:bg-gradient-to-r hover:from-[#312e81]/70 hover:to-[#6d28d9]/70 hover:shadow-[0_2px_16px_0_rgba(109,40,217,0.14)] hover:scale-[1.03] focus:outline-none`}
      style={{ transition: "box-shadow 0.18s, transform 0.18s, background 0.18s" }}
    >
      <Avatar className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-base font-bold shadow group-hover:ring-1 group-hover:ring-purple-400 group-hover:ring-offset-1 group-hover:ring-offset-zinc-900 transition">
        <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <span className="font-semibold text-sm flex items-center gap-1">
          {user.name}
          {isOnline && <span className="ml-1 w-2 h-2 rounded-full bg-green-500 inline-block" />}
        </span>
        <span className="text-xs mt-0.5">
          {isOnline ? <span className="text-green-400">Active</span> : <span className="text-zinc-400">Offline</span>}
        </span>
      </div>
    </button>
  )
);

// --- Message Bubble (memoized) ---
const MessageBubble = memo(
  ({ msg, isOwn }: { msg: Message; isOwn: boolean }) => (
    <div className={`w-full flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl shadow-lg text-sm whitespace-pre-wrap break-words ${
          isOwn
            ? "bg-gradient-to-br from-[#312e81] to-[#6d28d9] text-white"
            : "bg-zinc-800/90 text-zinc-200 border border-zinc-700"
        }`}
        style={{ maxWidth: "70%", overflowX: "hidden", wordBreak: "break-word", whiteSpace: "pre-wrap" }}
      >
        {msg.text && <p>{msg.text}</p>}
        {msg.file && (
          <div className="mt-2">
            <img
              src={msg.file}
              alt="Sent"
              className="rounded-lg max-w-xs cursor-pointer hover:scale-105 transition"
              onClick={() => window.open(msg.file, "_blank")}
            />
          </div>
        )}
        <p className="text-[10px] text-right mt-1 text-zinc-400">
          {msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "Sending..."}
        </p>
      </div>
    </div>
  )
);

export default function ChatPage() {
  // --- Context and State ---
  const { username, id, setUsername, setId } = useContext(UserContext);
  const [sidebarUsers, setSidebarUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  // --- Move user to top of sidebar and persist order ---
  const moveUserToTop = (userId: string) => {
    setSidebarUsers((prev) => {
      const idx = prev.findIndex((u) => u._id === userId);
      const user = idx === -1 ? allUsers.find((u) => u._id === userId) : prev[idx];
      if (!user) return prev;
      const newUsers = [user, ...prev.filter((u) => u._id !== userId)];
      localStorage.setItem("chatUserOrder", JSON.stringify(newUsers.map((u) => u._id)));
      return newUsers;
    });
  };

  // --- Fetch users and restore sidebar order ---
  useEffect(() => {
    axios.get("/users").then((res) => {
      const filtered = res.data.filter((user: User) => user._id !== id);
      setAllUsers(filtered);
      const savedOrder = localStorage.getItem("chatUserOrder");
      if (savedOrder) {
        const order = JSON.parse(savedOrder) as string[];
        filtered.sort((a: User, b: User) => {
          const ai = order.indexOf(a._id), bi = order.indexOf(b._id);
          if (ai === -1 && bi === -1) return 0;
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        });
      }
      setSidebarUsers(filtered);
    });
  }, [id]);

  // --- WebSocket setup and message handling ---
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    setSocket(ws);

    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.online) {
        setOnlineUsers(data.online.map((u: any) => u.userId));
        return;
      }
      if (data.sender) {
        moveUserToTop(data.sender);
        if (data.sender === selectedUser?._id) setMessages((prev) => [...prev, data]);
      }
    });

    return () => ws.close();
  }, [selectedUser?._id, allUsers]);

  // --- Fetch messages for selected user ---
  useEffect(() => {
    if (selectedUser) {
      axios.get(`/messages/${selectedUser._id}`).then((res) => setMessages(res.data));
    }
  }, [selectedUser]);

  // --- Auto-scroll chat to bottom on new message ---
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "auto" });
    }
  }, [selectedUser, messages.length]);

  // --- Logout handler ---
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } finally {
      setUsername("");
      setId("");
      window.location.href = "/login";
    }
  };

  // --- Send message on Enter (without Shift) ---
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as any);
    }
  };

  // --- Send message (text or file) ---
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !selectedUser) return;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("recipient", selectedUser._id);
      if (text.trim()) formData.append("text", text.trim());
      try {
        const res = await axios.post("/messages/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newMessage = res.data;
        setMessages((prev) => [...prev, newMessage]);
        socket.send(JSON.stringify(newMessage));
        moveUserToTop(selectedUser._id);
      } catch {
        // Optionally handle upload error
      }
      setFile(null);
      setText("");
    } else if (text.trim()) {
      const message = {
        recipient: selectedUser._id,
        sender: id,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };
      socket.send(JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
      moveUserToTop(selectedUser._id);
      setText("");
    }
  };

  // --- Main Render ---
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a0a15] via-[#181825] to-[#10101a] text-white">
      {/* Sidebar */}
      <aside className="w-80 bg-gradient-to-b from-[#181825] via-[#16162a] to-[#10101a] border-r border-zinc-800 flex flex-col shadow-2xl">
        <div className="p-4 flex justify-between items-center border-b border-zinc-800">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Relay</h1>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md transition focus:outline-none"
                style={{ minHeight: 36 }}
              >
                <Avatar className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                  <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-white font-medium text-sm truncate max-w-[80px]">@{username}</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl mt-2 min-w-[120px] p-1 z-50"
              sideOffset={8}
            >
              <DropdownMenu.Item
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500 hover:text-white rounded-md cursor-pointer text-sm transition active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 hide-scrollbar">
          {sidebarUsers.length === 0 ? (
            <div className="text-zinc-500 text-center mt-10">No users found</div>
          ) : (
            sidebarUsers.map((user) => (
              <SidebarUserButton
                key={user._id}
                user={user}
                isSelected={selectedUser?._id === user._id}
                isOnline={onlineUsers.includes(user._id)}
                onSelect={setSelectedUser}
              />
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-[#181825] via-[#232347] to-[#181825]">
        {/* Chat header */}
        <div className="flex items-center gap-3 p-3 border-b border-zinc-800 bg-zinc-900/80 min-h-[56px] max-h-[56px]">
          {selectedUser ? (
            <>
              <Avatar className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-base font-bold shadow">
                <AvatarFallback>{selectedUser.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <span className="text-base font-semibold">{selectedUser.name}</span>
                <span className="flex items-center gap-1 text-xs ml-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser._id) ? "bg-green-400" : "bg-zinc-500"}`} />
                  {onlineUsers.includes(selectedUser._id) ? <span className="text-green-400">Active</span> : <span className="text-zinc-400">Offline</span>}
                </span>
              </div>
            </>
          ) : (
            <span className="text-zinc-400 text-lg">Select a user to start chatting</span>
          )}
        </div>

        {/* Chat messages */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-[#6d28d9]/80 scrollbar-track-[#232347]/60 hover:scrollbar-thumb-[#a78bfa] rounded-b-xl"
          ref={chatRef}
          style={{
            background: "linear-gradient(135deg, rgba(24,24,37,0.95) 0%, rgba(39,39,54,0.95) 100%)",
            backgroundImage: "url('/chat-bg.svg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          {selectedUser ? (
            messages.length === 0 ? (
              <div className="text-zinc-500 text-center">No messages yet</div>
            ) : (
              messages.map((msg, index) => (
                <MessageBubble key={index} msg={msg} isOwn={msg.sender === id} />
              ))
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <span className="text-2xl mb-2">💬</span>
              <span>Select a user to start chatting</span>
            </div>
          )}
        </div>

        {/* File preview before sending */}
        {file && (
          <div className="p-3 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={URL.createObjectURL(file)} alt="Preview" className="h-16 w-16 rounded-lg object-cover shadow-md" />
              <span className="text-sm text-zinc-300">{file.name}</span>
            </div>
            <button type="button" onClick={() => setFile(null)} className="text-red-400 hover:text-red-600 text-sm font-medium">
              Cancel
            </button>
          </div>
        )}

        {/* Message input */}
        {selectedUser && (
          <form onSubmit={sendMessage} className="flex items-center gap-3 p-4 border-t border-zinc-800 bg-zinc-900/80">
            <label className="cursor-pointer flex items-center">
              <Paperclip className="w-5 h-5 text-zinc-400 hover:text-purple-400 transition" />
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) setFile(selectedFile);
                }}
              />
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Type your message..."
              className="flex-1 resize-none px-4 py-2 rounded-xl bg-zinc-800/80 text-white border border-zinc-700 shadow-inner focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition font-medium placeholder:text-zinc-400 break-words"
              rows={1}
              maxLength={500}
              style={{ overflowX: "hidden", wordBreak: "break-word", whiteSpace: "pre-wrap" }}
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-[#312e81] to-[#6d28d9] hover:from-[#3730a3] hover:to-[#7c3aed] px-5 py-2 rounded-lg text-white transition flex items-center justify-center shadow"
              disabled={!text.trim() && !file}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
