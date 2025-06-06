/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const express = require("express");

/* ------------------------------- controllers ------------------------------ */
const {
  createRole,
  getAllRoles,
  getSingleRole,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");

/* ------------------------------- middleware ------------------------------- */
const {
  isUserAuthenticated,
  isUserAdmin,
} = require("../middlewares/authMiddleware");

/* -------------------------------------------------------------------------- */
/*                                  variables                                 */
/* -------------------------------------------------------------------------- */
const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                 middleware                                 */
/* -------------------------------------------------------------------------- */
router.use(isUserAuthenticated);

/* -------------------------------------------------------------------------- */
/*                                   routes                                   */
/* -------------------------------------------------------------------------- */
router.post("/", isUserAdmin, createRole);
router.get("/", getAllRoles);
router.get("/:id", getSingleRole);
router.put("/:id", isUserAdmin, updateRole);
router.delete("/:id", deleteRole);

/* -------------------------------------------------------------------------- */
/*                                   export                                   */
/* -------------------------------------------------------------------------- */
module.exports = router;
