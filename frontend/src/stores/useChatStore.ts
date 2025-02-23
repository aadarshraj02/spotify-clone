/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface ChatStore {
  users: any[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

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
}));
