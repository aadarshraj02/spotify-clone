/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/lib/axios";
import { Message } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
  users: any[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  socket: any;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
}

const baseURL = "http://localhost:5000";
const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],

  fetchUsers: async () => {
    if (get().users.length > 0) return;

    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch users" });
    } finally {
      set({ isLoading: false });
    }
  },
  initSocket: (userId: string) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();
      socket.emit("user:join", { userId });

      socket.on("user online", (users: string[]) => {
        set({
          onlineUsers: new Set(users),
        });
      });
      socket.on("activities", (activities: [string, string][]) => {
        set({
          userActivities: new Map(activities),
        });
      });
      socket.on("user connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });
      socket.on("User Disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return {
            onlineUsers: newOnlineUsers,
          };
        });
      });
      socket.on("receive Message", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });
      socket.on("message sent", (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      });
      socket.on("activity updated", ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        });
      });
      set({ socket, isConnected: true });
    }
  },
  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },
  sendMessage: (receiverId: string, senderId: string, content: string) => {
    const socket = get().socket;
    if (!socket) return;

    socket.emit("send_message", { receiverId, senderId, content });
  },
  fetchMessages: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
