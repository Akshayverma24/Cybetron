"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Users, Shield, Search, Filter, Edit3,
  CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button, Spinner } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

/**
 * Admin Users Management — Client Component
 * Demonstrates: Client Components, Client-side Fetching,
 *               Role-based Access Control, Data Mutations
 */
export default function AdminUsersPage() {
  const router = useRouter();
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page,       setPage]       = useState(1);
  const [pagination, setPagination] = useState({});
  const [updating,   setUpdating]   = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, page]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search)     params.set("search", search);
      if (roleFilter) params.set("role",   roleFilter);

      const res  = await fetch(`/api/users?${params}`);
      const data = await res.json();

      if (res.status === 403) {
        router.push("/dashboard");
        return;
      }

      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(userId, updates) {
    setUpdating(userId);
    try {
      const res  = await fetch("/api/users", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId, ...updates }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("User updated");
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...updates } : u))
        );
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdating(null);
    }
  }

  const roleColors = {
    admin:   "text-purple-400 bg-purple-400/10 border-purple-400/20",
    officer: "text-blue-400   bg-blue-400/10   border-blue-400/20",
    user:    "text-slate-400  bg-slate-400/10  border-slate-400/20",
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 pt-8 mb-6">
          <Link href="/admin" className="hover:text-cyan-400 transition-colors">Admin</Link>
          <span>/</span>
          <span className="text-white">Users</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Users className="h-7 w-7 text-purple-400" /> User Management
            </h1>
            <p className="text-slate-400 mt-1">{pagination.total ?? "—"} total users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-4 border border-cyan-500/10 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email…"
              className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-300 text-sm cyber-input"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="officer">Officer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Table */}
        <div className="glass rounded-xl border border-cyan-500/10 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Name", "Email", "Phone", "Role", "Status", "Joined", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold flex-shrink-0">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{user.email}</td>
                      <td className="px-4 py-3 text-slate-400">{user.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs flex items-center gap-1 ${user.isActive ? "text-green-400" : "text-red-400"}`}>
                          {user.isActive
                            ? <><CheckCircle className="h-3.5 w-3.5" /> Active</>
                            : <><XCircle    className="h-3.5 w-3.5" /> Inactive</>
                          }
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Role Selector */}
                          <select
                            value={user.role}
                            onChange={(e) => updateUser(user._id, { role: e.target.value })}
                            disabled={updating === user._id}
                            className="text-xs px-2 py-1 bg-dark-700 border border-slate-600 rounded text-slate-300 cyber-input"
                          >
                            <option value="user">User</option>
                            <option value="officer">Officer</option>
                            <option value="admin">Admin</option>
                          </select>

                          {/* Toggle active */}
                          <button
                            onClick={() => updateUser(user._id, { isActive: !user.isActive })}
                            disabled={updating === user._id}
                            className={`text-xs px-2 py-1 rounded border transition-all ${
                              user.isActive
                                ? "text-red-400 border-red-400/30 hover:bg-red-400/10"
                                : "text-green-400 border-green-400/30 hover:bg-green-400/10"
                            }`}
                          >
                            {updating === user._id ? <Clock className="h-3.5 w-3.5 animate-spin" /> : user.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Page {pagination.page} of {pagination.pages} — {pagination.total} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

