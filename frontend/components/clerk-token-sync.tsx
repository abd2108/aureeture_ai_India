"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { apiClient } from "@/lib/api";

/**
 * Keeps the backend API client in-sync with the current Clerk session token.
 * This is required because our Express backend expects `Authorization: Bearer <token>`.
 */
export default function ClerkTokenSync() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      try {
        if (!isLoaded) return;

        if (!isSignedIn) {
          apiClient.setToken(null);
          return;
        }

        const token = await getToken();
        if (!cancelled) {
          apiClient.setToken(token || null);
        }
      } catch {
        // If token retrieval fails, clear it so calls don't send stale tokens
        apiClient.setToken(null);
      }
    }

    sync();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken]);

  return null;
}
