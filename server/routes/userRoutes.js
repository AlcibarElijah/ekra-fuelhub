/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const express = require("express");

/* ------------------------------- controller ------------------------------- */
const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updatePassword,
  deleteUser,
} = require("../controllers/userController");

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
/*                                   routes                                   */
/* -------------------------------------------------------------------------- */
router.use(isUserAuthenticated);
router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.put("/:id", updateUser);
router.put("/password/:id", updatePassword);

router.use(isUserAdmin);
router.post("/", createUser);
router.delete("/:id", deleteUser);

/* -------------------------------------------------------------------------- */
/*                                   export                                   */
/* -------------------------------------------------------------------------- */
module.exports = router;
