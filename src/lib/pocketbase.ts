import { goto } from "$app/navigation";
import PocketBase, { type RecordModel } from "pocketbase";
import { writable } from "svelte/store";

// Get PocketBase URL from environment or use default
const PB_URL = import.meta.env.PUBLIC_POCKETBASE_URL || "http://localhost:8090";

// Create PocketBase instance
export const pb = new PocketBase(PB_URL);

// Store for current user
export function getCurrentUser(): UserRecord | null {
  return pb.authStore.record as UserRecord | null;
}

export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

export const ensureAuthenticated = async () => {
  if (!isAuthenticated()) {
    goto("/auth");
  }
};

export const ensureNotAuthenticated = async () => {
  if (isAuthenticated()) {
    goto("/dashboard");
  }
};

export const logout = () => {
  pb.authStore.clear();
  window.location.href = "/";
};

export interface UserRecord extends RecordModel {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: true;
  id: string;
  name: string;
  updated: string;
  verified: boolean;
}
