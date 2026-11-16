// Logs live in the same function as the endpoint so they share memory.
globalThis.__nxlogs = globalThis.__nxlogs || [];

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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();

  // Viewer access: /v1/escalation?__logs=1 (GET = list, DELETE = clear)
  if (req.query && req.query.__logs) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method === "DELETE") globalThis.__nxlogs = [];
    return res.status(200).json(globalThis.__nxlogs);
  }

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
  globalThis.__nxlogs.unshift(entry);
  globalThis.__nxlogs.length = Math.min(globalThis.__nxlogs.length, 50);

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
