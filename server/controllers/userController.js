/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { handleError, buildFilter, buildSort, validateExistingRecord, cleanedUser } = require("./functions/utils");

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

    const {
      statusCode,
      message
    } = await validateExistingRecord(Role, roleId, res);

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message
      })

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
      data: cleanedUser(newUser),
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
      sort = "createdAt",
      direction = "asc",
    } = req.query;

    // build filter
    const filter = buildFilter({ firstName, lastName, username });
    const sortObj = buildSort(sort, direction);

    const users = await User.find(filter)
      .sort(sortObj)
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    res.status(200).json({
      message: "Users retrieved successfully.",
      data: users.map(cleanedUser),
    })
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
      data: existingUser
    } = await validateExistingRecord(User, id, res);

    return res.status(statusCode).json({
      message,
      data: cleanedUser(existingUser)
    })

  } catch (error) {
    handleError("Something went wrong while getting the user.", error, res);
  }
}

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      username,
      roleId
    } = req.body;

    /* ----------------------------- validations ---------------------------- */
    if (!firstName || !lastName || !username || !roleId)
      return res.status(400).json({
        message: "Please fill in all required fields."
      })

    const {
      statusCode,
      message,
    } = await validateExistingRecord(User, id, res);

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message
      })

    const {
      statusCode: roleStatusCode,
      message: roleMessage
    } = await validateExistingRecord(Role, roleId, res);

    if (roleStatusCode !== 200)
      return res.status(roleStatusCode).json({
        message: roleMessage
      })

    const userWithTheSameUsername = await User.findOne({ username });
    if (userWithTheSameUsername && String(userWithTheSameUsername._id) !== String(id))
      return res.status(400).json({
        message: "Username already exists."
      })

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        username,
        role: roleId
      },
      {
        new: true
      }
    );

    res.status(200).json({
      message: "User updated successfully.",
      data: cleanedUser(updatedUser),
    })

  } catch (error) {
    handleError("Something went wrong while updating the user.", error, res);
  }
}

module.exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      password
    } = req.body;

    /* ----------------------------- validations ---------------------------- */
    if (!password)
      return res.status(400).json({
        message: "Password cannot be blank."
      })

    const {
      statusCode,
      message,
      data: existingUser
    } = await validateExistingRecord(User, id, res);

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message
      })

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    )

    res.status(200).json({
      message: "Password updated successfully.",
      data: cleanedUser(updatedUser),
    })

  } catch (error) {
    handleError("Something went wrong while updating your password.", error, res);
  }
}

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validations ---------------------------- */
    const {
      statusCode,
      message,
    } = await validateExistingRecord(User, id, res);

    if (statusCode !== 200)
      return res.status(statusCode).json({
        message
      })

    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json({
      message: "User deleted successfully",
      data: cleanedUser(deletedUser)
    })
  } catch (error) {
    handleError("Something went wrong while deleting the user.", error, res);
  }
}