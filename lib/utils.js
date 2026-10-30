/**
 * lib/utils.js
 * Shared utility functions
 * Demonstrates: Code Splitting (tree-shakeable utility module)
 */

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatStatus(status) {
  const map = {
    pending:     { label: "Pending",     color: "text-yellow-400 bg-yellow-400/10" },
    investigating:{ label: "Investigating", color: "text-blue-400 bg-blue-400/10" },
    resolved:    { label: "Resolved",    color: "text-green-400 bg-green-400/10" },
    closed:      { label: "Closed",      color: "text-gray-400 bg-gray-400/10" },
    rejected:    { label: "Rejected",    color: "text-red-400 bg-red-400/10" },
  };
  return map[status] || { label: status, color: "text-gray-400 bg-gray-400/10" };
}

export function formatCrimeType(type) {
  const map = {
    phishing:        "Phishing",
    hacking:         "Hacking / Unauthorized Access",
    identity_theft:  "Identity Theft",
    online_fraud:    "Online Fraud",
    cyberbullying:   "Cyberbullying",
    ransomware:      "Ransomware",
    data_breach:     "Data Breach",
    child_safety:    "Child Safety",
    other:           "Other",
  };
  return map[type] || type;
}

export const CRIME_TYPES = [
  { value: "phishing",       label: "Phishing" },
  { value: "hacking",        label: "Hacking / Unauthorized Access" },
  { value: "identity_theft", label: "Identity Theft" },
  { value: "online_fraud",   label: "Online Fraud" },
  { value: "cyberbullying",  label: "Cyberbullying" },
  { value: "ransomware",     label: "Ransomware" },
  { value: "data_breach",    label: "Data Breach" },
  { value: "child_safety",   label: "Child Safety" },
  { value: "other",          label: "Other" },
];

export const SEVERITY_LEVELS = [
  { value: "low",      label: "Low",      color: "text-green-400" },
  { value: "medium",   label: "Medium",   color: "text-yellow-400" },
  { value: "high",     label: "High",     color: "text-orange-400" },
  { value: "critical", label: "Critical", color: "text-red-400" },
];

