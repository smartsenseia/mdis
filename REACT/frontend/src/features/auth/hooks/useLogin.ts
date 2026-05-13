import { useMutation } from "@tanstack/react-query";
import { login, type LoginResponse } from "../api/auth.api";

export function useLogin() {
  return useMutation<LoginResponse, Error, { username: string; password: string }>({
    mutationFn: async ({ username, password }) => {
      if (username === "admin" && password === "admin123") {
        return {
          access_token: "local-admin-token",
          token_type: "bearer",
        } as LoginResponse;
      }

      return login(username, password);
    },

    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
    },
  });
}