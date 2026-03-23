import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import casesRouter from "./cases.js";
import patientsRouter from "./patients.js";
import reauthRouter from "./reauth.js";
import aiRouter from "./ai.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/cases", casesRouter);
router.use("/patients", patientsRouter);
router.use("/reauth", reauthRouter);
router.use("/ai", aiRouter);

export default router;
