export function money(n) {
  const num = Number(n || 0);
  return `₦${num.toLocaleString("en-NG")}`;
}


export const API_BASE = process.env.REACT_APP_API_URL || "https://shinex-marketplace.onrender.com/api";

export const COLORS = {
  primary: "#14532D",
  primaryDark: "#0F3D21",
  secondary: "#22C55E",
  secondaryDark: "#16A34A",
  bg: "#F3FBF6",
};

/* ------------------------------------------------------------
   API HELPER
   Backend envelope: { success: boolean, message?: string, data?: any }
   ------------------------------------------------------------ */
export async function api(path, { method = "GET", body, auth = true, formData = false } = {}) {
  const headers = {};
  if (!formData) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = localStorage.getItem("shinex_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? (formData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (e) {
    throw new Error("Can't reach the server. Check your connection and try again.");
  }
  let payload = null;
  try {
    payload = await res.json();
  } catch (e) {
    payload = null;
  }
  if (!res.ok || (payload && payload.success === false)) {
    const msg =
      (payload && (payload.message || (Array.isArray(payload.errors) && payload.errors[0]))) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  // Return the full payload so callers can read data/pagination/message as needed.
  return payload || {};
}
