import { Router } from "express";
import {createMatch, joinMatch,getMatch, startMatch} from "../controller/match.controller";
import { authenticate} from "../middleware/auth.middleware";

const router = Router();

router.post("/create", authenticate, createMatch);

router.post("/:id/join", authenticate, joinMatch);

router.get("/:id", authenticate, getMatch);

router.post("/:id/start", authenticate, startMatch);

export default router;