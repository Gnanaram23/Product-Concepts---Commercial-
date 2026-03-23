import { Router } from "express";
import { getReauthCases } from "../data/store.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(getReauthCases());
});

export default router;
