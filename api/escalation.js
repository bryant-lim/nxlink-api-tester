import { addLog } from "./_store.js";

// Optional auth: set AUTH_TOKEN in Vercel env to enforce it.
// Accepts "Authorization: Bearer <token>", "Authorization: Basic <base64>" or "x-api-key: <token>".
function checkAuth(req) {
  const token = process.env.AUTH_TOKEN;
  if (!token) return true; // auth not required
  const h = req.headers["authorization"] || "";
  const key = req.headers["x-api-key"] || "";
  if (h === `Bearer ${token}` || key === token) return true;
  if (h.startsWith("Basic ")) {
    const decoded = Buffer.from(h.slice(6), "base64").toString();
    if (decoded === token || decoded.split(":")[1] === token) return true;
  }
  return false;
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();

  const authorized = checkAuth(req);
  const entry = {
    receivedAt: new Date().toISOString(),
    method: req.method,
    url: req.url,
    query: req.query,
    headers: req.headers,
    body: req.body ?? null,
    authorized,
  };
  addLog(entry);

  if (!authorized) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  return res.status(200).json({
    success: true,
    message: "Request received",
    receivedAt: entry.receivedAt,
    method: req.method,
    query: req.query,
    body: req.body ?? null,
  });
}
