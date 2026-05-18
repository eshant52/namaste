import { validateAuthState } from "@/api/utils";
import { redirect } from "react-router";

export async function authLoader() {
  const isAuthenticated = await validateAuthState();

  if (isAuthenticated) {
    return redirect("/app");
  }

  return null;
}

export async function registerLoader() {
  return null;
}

export async function loginLoader() {
  return null;
}

export async function sessionLimitLoader() {
  return null;
}

export async function appLoader() {
  const isAuthenticated = await validateAuthState();

  if (!isAuthenticated) {
    return redirect("/auth/login");
  }

  return null;
}
