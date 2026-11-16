import { getLogs, clearLogs } from "./_store.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "DELETE") {
    clearLogs();
    return res.status(200).json({ cleared: true });
  }
  res.status(200).json(getLogs());
}
