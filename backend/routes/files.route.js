import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { transferFile, uploadFile } from "../controllers/files.controller.js";
import auth from "../middleware/auth.js";


const router = express.Router();

// router.post('/upload', protectRoute, uploadFile);

// router.post('/share', protectRoute, transferFile);

router.post('/upload', auth, uploadFile);

router.post('/share', auth, transferFile);

export default router;