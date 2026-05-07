const express = require("express");
const router = express.Router();

// Controllers
const {
  createApp,
  getApps,
  updateApp,
  deleteApp,
} = require("../controllers/appController");

// Auth middleware
const auth = require("../middleware/auth");

// ================= ROUTES =================

// ➕ Create Application
router.post("/", auth, createApp);

// 📥 Get All Applications
router.get("/", auth, getApps);

// ✏️ Update Application (role, company, status, dates)
router.put("/:id", auth, updateApp);

// ❌ Delete Application
router.delete("/:id", auth, deleteApp);

module.exports = router;
