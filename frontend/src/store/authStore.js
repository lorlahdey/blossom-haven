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
      //fetchUSer data
      fetchUserData: async (token) => {
        try {
          const response = await axios.get("/api/auth/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const user = response.data.user;

          // Store user data in global state & localStorage
          set({ user, token, isLoggedIn: true });

          return {
            error: false,
            success: true,
            // message: "Login successful",
            data: { token, user },
          };
        } catch (error) {
          return {
            error: true,
            success: false,
            message: error.response?.data?.message || "Failed to fetch user",
          };
        }
      },

      // Google authentication
      // loginWithGoogle: async () => {
      //   try {
      //     const response = await axios.get("/api/auth/google");
      //     const { token, user } = response.data;
      //     console.log(token, user, "user auth oooo 1111111");

      //     set({ isLoggedIn: true, token, user });
      //     return {
      //       error: false,
      //       success: true,
      //       message: "Google login successful",
      //       data: { token, user },
      //     };
      //   } catch (error) {
      //     return {
      //       error: true,
      //       success: false,
      //       message: error.response?.data?.message || "Google login failed",
      //     };
      //   }
      // },

      // // Facebook authentication
      // loginWithFacebook: async () => {
      //   try {
      //     const response = await axios.get("/api/auth/facebook");
      //     const { token, user } = response.data;

      //     set({ isLoggedIn: true, token, user });
      //     return {
      //       error: false,
      //       success: true,
      //       message: "Facebook login successful",
      //       data: { token, user },
      //     };
      //   } catch (error) {
      //     return {
      //       error: true,
      //       success: false,
      //       message: error.response?.data?.message || "Facebook login failed",
      //     };
      //   }
      // },

      // // Pinterest authentication
      // loginWithPinterest: async () => {
      //   try {
      //     const response = await axios.get("/api/auth/pinterest");
      //     const { token, user } = response.data;

      //     set({ isLoggedIn: true, token, user });
      //     return {
      //       error: false,
      //       success: true,
      //       message: "Pinterest login successful",
      //       data: { token, user },
      //     };
      //   } catch (error) {
      //     return {
      //       error: true,
      //       success: false,
      //       message: error.response?.data?.message || "Pinterest login failed",
      //     };
      //   }
      // },
    }),
    {
      name: "auth-storage", // key to store the data in localStorage
      //   getStorage: () => localStorage, // use localStorage for persistence
    }
  )
);

export default useAuthStore;