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

export const ensureAuthenticated = async () => {
  if (!pb.authStore.isValid) {
    goto("/login");
  }
};

export const logout = () => {
  pb.authStore.clear();
  goto("/");
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
