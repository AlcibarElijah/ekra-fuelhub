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
  deleteUser
} = require("../controllers/userController");

/* -------------------------------------------------------------------------- */
/*                                  variables                                 */
/* -------------------------------------------------------------------------- */
const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                   routes                                   */
/* -------------------------------------------------------------------------- */
router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.put("/:id", updateUser);
router.put("/password/:id", updatePassword);
router.delete("/:id", deleteUser);

/* -------------------------------------------------------------------------- */
/*                                   export                                   */
/* -------------------------------------------------------------------------- */
module.exports = router;