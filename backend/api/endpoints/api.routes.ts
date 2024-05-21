import express from "express";
import testRoutes from "./test.routes";
const router = express.Router();

router.use("/test", testRoutes);

export default router;
