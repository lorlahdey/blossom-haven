import express from "express"
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post(
  "/",
  authenticateToken,
  authorizeRole(["superadmin", "admin"]),
  createProduct
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["superadmin", "admin"]),
  updateProduct
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["superadmin", "admin"]),
  deleteProduct
);

export default router;