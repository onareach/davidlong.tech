"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authClient";

type AdminUserRow = {
  id: number;
  email: string;
  display_name: string | null;
  is_admin: boolean;
  is_active: boolean;
};

export default function StudioAdminPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loadError, setLoadError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    setLoadError("");
    try {
      const res = await authFetch("/api/admin/users");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoadError(data?.error || "Failed to load users");
        return;
      }
      const list = (data.users || []).map((u: AdminUserRow) => ({
        ...u,
        is_admin: Boolean(u.is_admin),
        is_active: Boolean(u.is_active),
      }));
      setUsers(list);
    } catch {
      setLoadError("Request failed");
    }
  }, []);

  useEffect(() => {
    if (!loading && user && !user.is_admin) {
      window.location.replace("/studio/today");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.is_admin) {
      loadUsers();
    }
  }, [user?.is_admin, loadUsers]);

  async function toggleAdmin(target: AdminUserRow) {
    const next = !target.is_admin;
    setBusyId(target.id);
    setLoadError("");
    try {
      const res = await authFetch(`/api/admin/users/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_admin: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoadError(data?.error || "Update failed");
        return;
      }
      await loadUsers();
    } catch {
      setLoadError("Request failed");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(target: AdminUserRow) {
    const next = !target.is_active;
    setBusyId(target.id);
    setLoadError("");
    try {
      const res = await authFetch(`/api/admin/users/${target.id}/activation`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoadError(data?.error || "Update failed");
        return;
      }
      await loadUsers();
    } catch {
      setLoadError("Request failed");
    } finally {
      setBusyId(null);
    }
  }

  if (loading || !user) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">Loading…</div>
    );
  }

  if (!user.is_admin) {
    return null;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-2">Admin — users</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Grant or revoke admin access and activate/inactivate non-admin accounts.
      </p>
      {loadError && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{loadError}</p>
      )}
      <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-700 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Display name</th>
              <th className="text-left p-3 font-medium">Admin</th>
              <th className="text-left p-3 font-medium">Active</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <td className="p-3">{u.email}</td>
                <td className="p-3 text-zinc-600 dark:text-zinc-400">
                  {u.display_name || "—"}
                </td>
                <td className="p-3">{u.is_admin ? "Yes" : "No"}</td>
                <td className="p-3">{u.is_active ? "Yes" : "No"}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={busyId === u.id}
                      onClick={() => toggleAdmin(u)}
                      className="text-left underline hover:no-underline disabled:opacity-50"
                    >
                      {u.is_admin ? "Revoke admin" : "Make admin"}
                      {busyId === u.id ? "…" : ""}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === u.id || u.is_admin}
                      onClick={() => toggleActive(u)}
                      className="text-left underline hover:no-underline disabled:opacity-50"
                      title={u.is_admin ? "Remove admin first before inactivating." : undefined}
                    >
                      {u.is_active ? "Inactivate" : "Activate"}
                      {busyId === u.id ? "…" : ""}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && !loadError && (
        <p className="text-sm text-zinc-500 mt-4">No users loaded.</p>
      )}
    </div>
  );
}
