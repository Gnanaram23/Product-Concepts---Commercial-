import { Router } from "express";
import { getAIResponse } from "../services/aiResponses.js";

const router = Router();

router.post("/", (req, res) => {
  const { role, feature, message } = req.body as {
    role: string;
    feature?: string;
    message: string;
  };

  if (!message) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const result = getAIResponse(feature ?? "general", message, role ?? "provider");
  res.json({
    response: result.response,
    feature: result.feature,
    timestamp: new Date().toISOString(),
  });
});

export default router;
