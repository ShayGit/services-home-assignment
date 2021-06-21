import {
  getServiceEvents,
  getServiceState,
  getServicesState,
  postServiceDeployEvent,
  postServiceHealthEvent,
} from "../controllers/services-controller";

import express from "express";

const router = express.Router();

router.post("/data", postServiceDeployEvent);

router.post("/data", postServiceHealthEvent);

router.get("/list/services", getServicesState);

router.get("/data/:serviceId", getServiceState);

router.get("/list/:serviceId/events", getServiceEvents);

export default router;
