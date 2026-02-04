import { goto } from "$app/navigation";
import PocketBase, { type RecordModel } from "pocketbase";
import { dev } from "$app/environment";

// Get PocketBase URL from environment or use default
// In production (Docker), PocketBase serves the app and its API
// In development, PocketBase runs on localhost:8090
const pocketBaseDevUrl = "http://localhost:8090";
const pocketBaseUrl = dev ? pocketBaseDevUrl : window.location.origin;

// Create PocketBase instance
export const pb = new PocketBase(pocketBaseUrl);

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

export function getAdminPanelUrl(): string {
  return `${pocketBaseUrl}/_`;
}

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
