import { goto } from "$app/navigation";
import PocketBase, {
  type AuthMethodsList,
  type AuthProviderInfo,
  type RecordModel,
} from "pocketbase";
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

export async function listAuthMethods(): Promise<AuthMethodsList> {
  return await pb.collection("users").listAuthMethods();
}

export async function listOAuthMethods(): Promise<AuthProviderInfo[]> {
  const authMethods = await listAuthMethods();
  if (!authMethods.oauth2.enabled) return [];

  return authMethods.oauth2.providers;
}

export async function loginWithEmail(email: string, password: string) {
  return pb.collection("users").authWithPassword(email, password);
}

export async function registerWithEmail(
  email: string,
  password: string,
  passwordConfirm: string,
) {
  if (!email || !password || !passwordConfirm) {
    throw new Error("Please fill in all fields");
  }

  if (password !== passwordConfirm) {
    throw new Error("Passwords do not match");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  await pb.collection("users").create({
    email,
    password,
    passwordConfirm,
    emailVisibility: true,
  });

  return await loginWithEmail(email, password);
}

export async function loginWithOAuth(provider: string) {
  return pb.collection("users").authWithOAuth2({
    provider: provider,
  });
}

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
