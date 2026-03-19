"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState("");
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwError, setPwError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setDisplayName(user.display_name || "");
    }
  }, [user]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileMessage(null);
    setSavingProfile(true);
    try {
      const body: { email?: string; display_name?: string | null } = {};
      if (email.trim().toLowerCase() !== user?.email) {
        body.email = email.trim().toLowerCase();
      }
      const dn = displayName.trim() || null;
      if (dn !== (user?.display_name ?? null)) {
        body.display_name = dn;
      }
      if (Object.keys(body).length === 0) {
        setProfileMessage("No changes to save.");
        return;
      }
      const { error } = await updateProfile(body);
      if (error) {
        setProfileError(error);
        return;
      }
      setProfileMessage("Profile saved.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwMessage(null);
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    setSavingPw(true);
    try {
      const { error } = await updateProfile({
        new_password: newPassword,
        current_password: currentPassword,
      });
      if (error) {
        setPwError(error);
        return;
      }
      setPwMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-2">Account</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
        Update your profile or password.{" "}
        <Link href="/studio/today" className="underline hover:no-underline">
          Back to Today
        </Link>
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-medium mb-4">Profile</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          {profileError && (
            <p className="text-sm text-red-600 dark:text-red-400">{profileError}</p>
          )}
          {profileMessage && (
            <p className="text-sm text-green-700 dark:text-green-400">{profileMessage}</p>
          )}
          <div>
            <label htmlFor="acc-email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="acc-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200"
            />
          </div>
          <div>
            <label htmlFor="acc-dn" className="block text-sm font-medium mb-1">
              Display name
            </label>
            <input
              id="acc-dn"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="py-2 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded disabled:opacity-50"
          >
            {savingProfile ? "Saving…" : "Save profile"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-4">Change password</h2>
        <form onSubmit={savePassword} className="space-y-4">
          {pwError && <p className="text-sm text-red-600 dark:text-red-400">{pwError}</p>}
          {pwMessage && (
            <p className="text-sm text-green-700 dark:text-green-400">{pwMessage}</p>
          )}
          <div>
            <label htmlFor="acc-cur" className="block text-sm font-medium mb-1">
              Current password
            </label>
            <div className="relative">
              <input
                id="acc-cur"
                type={currentPasswordVisible ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-3 py-2 pr-11 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200"
              />
              <button
                type="button"
                onClick={() => setCurrentPasswordVisible((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
                aria-label={currentPasswordVisible ? "Hide password" : "Show password"}
              >
                {currentPasswordVisible ? (
                  <img src="/icons/eye-open.svg" alt="" className="w-5 h-5" />
                ) : (
                  <img src="/icons/eye-close.svg" alt="" className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="acc-new" className="block text-sm font-medium mb-1">
              New password
            </label>
            <div className="relative">
              <input
                id="acc-new"
                type={newPasswordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                className="w-full px-3 py-2 pr-11 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200"
              />
              <button
                type="button"
                onClick={() => setNewPasswordVisible((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
                aria-label={newPasswordVisible ? "Hide password" : "Show password"}
              >
                {newPasswordVisible ? (
                  <img src="/icons/eye-open.svg" alt="" className="w-5 h-5" />
                ) : (
                  <img src="/icons/eye-close.svg" alt="" className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={savingPw}
            className="py-2 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded disabled:opacity-50"
          >
            {savingPw ? "Updating…" : "Update password"}
          </button>
        </form>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Forgot your password?{" "}
          <Link href="/forgot-password" className="underline hover:no-underline">
            Reset by email
          </Link>
        </p>
      </section>
    </div>
  );
}
