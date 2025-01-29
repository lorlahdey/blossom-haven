import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";


const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      user: null,
      setUser: (data) =>
        set({ isLoggedIn: true, token: data.token, user: data.user }),
      logout: () => set({ isLoggedIn: false, token: null, user: null }),

      // Action to set user details upon successful login
      login: async (credentials) => {
        try {
          const response = await axios.post("/api/auth/login", credentials);
          const { token, user } = response.data;

          set({ isLoggedIn: true, token, user });
          return {
            error: false,
            success: true,
            message: "Login successful",
            data: { token, user },
          };
        } catch (error) {
          return {
            error: true,
            success: false,
            message: error.response?.data?.message || "Login failed",
          };
        }
      },

      // Action to register a new user
      register: async (userData) => {
        try {
          const response = await axios.post("/api/auth/register", userData);
          const { token, user } = response.data;

          set({ isLoggedIn: true, token, user });
          return {
            error: false,
            success: true,
            message: "Registration successful",
            data: { token, user },
          };
        } catch (error) {
          return {
            error: true,
            success: false,
            message: error.response?.data?.message || "Registration failed",
          };
        }
      },
    }),
    {
      name: "auth-storage", // key to store the data in localStorage
    //   getStorage: () => localStorage, // use localStorage for persistence
    }
  )
);

export default useAuthStore;