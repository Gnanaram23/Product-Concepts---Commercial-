import { Router } from "express";
import { getPatients, getPatientById } from "../data/store.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(getPatients());
});

router.get("/:id", (req, res) => {
  const p = getPatientById(req.params.id);
  if (!p) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }
  res.json(p);
});

export default router;
