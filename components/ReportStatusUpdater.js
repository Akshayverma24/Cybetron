"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { Shield, MessageSquare } from "lucide-react";

/**
 * ReportStatusUpdater — Client Component
 * Demonstrates: Client Components, Data Mutations, Optimistic UI Updates
 */
export default function ReportStatusUpdater({ reportId, currentStatus }) {
  const [status,  setStatus]  = useState(currentStatus);
  const [note,    setNote]    = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    const prevStatus = status;

    // Optimistic update
    const toastId = toast.loading("Updating case…");

    try {
      const body = { status };
      if (note.trim()) body.note = note.trim();

      const res  = await fetch(`/api/reports/${reportId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Case updated successfully", { id: toastId });
        setNote("");
      } else {
        setStatus(prevStatus); // revert optimistic
        toast.error(data.message, { id: toastId });
      }
    } catch {
      setStatus(prevStatus);
      toast.error("Failed to update", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass rounded-xl p-5 border border-blue-500/20">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-blue-400" /> Officer Actions
      </h3>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Update Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 text-sm cyber-input"
          >
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1">
            <MessageSquare className="h-3 w-3" /> Add Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add an update for the victim…"
            rows={3}
            className="w-full px-3 py-2 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input resize-none"
          />
        </div>

        <Button
          onClick={handleUpdate}
          loading={loading}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Update Case
        </Button>
      </div>
    </div>
  );
}

