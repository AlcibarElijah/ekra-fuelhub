/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  handleError,
  buildFilter,
  buildSort,
  validateExistingRecord,
  cleanedUser,
} = require("./functions/utils");

/* ---------------------------------- model --------------------------------- */
const User = require("../models/User");
const Role = require("../models/Role");

/* -------------------------------------------------------------------------- */
/*                                 controllers                                */
/* -------------------------------------------------------------------------- */
module.exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, username, password, roleId } = req.body;

    /* ----------------------------- validations ---------------------------- */
    if (!firstName || !lastName || !username || !password || !roleId)
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists." });

    const { statusCode, message } = await validateExistingRecord(
      Role,
      roleId,
      res
    );

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message,
      });

    /* ---------------------------- hash password --------------------------- */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ----------------------------- create user ---------------------------- */
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      role: roleId,
    });

    res.status(201).json({
      message: "User created successfully.",
      data: cleanedUser(await newUser.populate("role")),
    });
  } catch (error) {
    handleError("Something went wrong while creating a user.", error, res);
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 25,
      firstName,
      lastName,
      username,
      sort = "username",
      direction = "asc",
    } = req.query;

    // build filter
    const filter = buildFilter({ firstName, lastName, username });
    const sortObj = buildSort(sort, direction);

    // get total count of users matching the filters
    const totalCount = await User.countDocuments(filter);

    // get paginated users
    const users = await User.find(filter)
      .sort(sortObj)
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize))
      .populate("role");

    res.status(200).json({
      message: "Users retrieved successfully.",
      data: users.map(cleanedUser),
      count: totalCount,
    });
  } catch (error) {
    handleError("Something went wrong while getting the users.", error, res);
  }
};

module.exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validations ---------------------------- */
    const {
      statusCode,
      message,
      data: existingUser,
    } = await validateExistingRecord(User, id, res);

    await existingUser.populate("role");

    return res.status(statusCode).json({
      message,
      data: cleanedUser(existingUser),
    });
  } catch (error) {
    handleError("Something went wrong while getting the user.", error, res);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { firstName, lastName, username, roleId } = req.body;

    /* ----------------------------- restriction ---------------------------- */
    if (req.user.role.name !== "admin" && String(req.user._id) !== String(id))
      return res.status(403).json({
        message: "You are not authorized to update this user's details.",
      });

    /* ----------------------------- validations ---------------------------- */
    if (!firstName || !lastName || !username || !roleId)
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });

    const { statusCode, message } = await validateExistingRecord(User, id, res);

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message,
      });

    const { statusCode: roleStatusCode, message: roleMessage } =
      await validateExistingRecord(Role, roleId, res);

    if (roleStatusCode !== 200)
      return res.status(roleStatusCode).json({
        message: roleMessage,
      });

    const userWithTheSameUsername = await User.findOne({ username });
    if (
      userWithTheSameUsername &&
      String(userWithTheSameUsername._id) !== String(id)
    )
      return res.status(400).json({
        message: "Username already exists.",
      });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        username,
        role: roleId,
      },
      {
        new: true,
      }
    ).populate("role");

    res.status(200).json({
      message: "User updated successfully.",
      data: cleanedUser(updatedUser),
    });
  } catch (error) {
    handleError("Something went wrong while updating the user.", error, res);
  }
};

module.exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;

    const { password } = req.body;

    /* ----------------------------- restriction ---------------------------- */
    if (req.user.role.name !== "admin" && String(req.user._id) !== String(id))
      return res.status(403).json({
        message: "You are not authorized to update this user's password",
      });

    /* ----------------------------- validations ---------------------------- */
    if (!password)
      return res.status(400).json({
        message: "Password cannot be blank.",
      });

    const {
      statusCode,
      message,
      data: existingUser,
    } = await validateExistingRecord(User, id, res);

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message,
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    ).populate("role");

    res.status(200).json({
      message: "Password updated successfully.",
      data: cleanedUser(updatedUser),
    });
  } catch (error) {
    handleError(
      "Something went wrong while updating your password.",
      error,
      res
    );
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validations ---------------------------- */
    const { statusCode, message } = await validateExistingRecord(User, id, res);

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message,
      });

    const deletedUser = await User.findByIdAndDelete(id).populate("role");
    res.status(200).json({
      message: "User deleted successfully",
      data: cleanedUser(deletedUser),
    });
  } catch (error) {
    handleError("Something went wrong while deleting the user.", error, res);
  }
};
