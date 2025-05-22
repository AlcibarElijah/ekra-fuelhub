/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const mongoose = require("mongoose");
const { handleError, validateExistingRecord } = require("./functions/utils");

/* ---------------------------------- model --------------------------------- */
const Role = require("../models/Role");

/* -------------------------------------------------------------------------- */
/*                                controllers                                */
/* -------------------------------------------------------------------------- */
module.exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    /* ----------------------------- validations ---------------------------- */
    if (!name)
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });

    const existingRole = await Role.findOne({ name });
    if (existingRole)
      return res.status(400).json({ message: "Role already exists." });

    const newRole = await Role.create({ name });
    res.status(201).json({
      message: "Role created successfully.",
      data: newRole,
    });
  } catch (error) {
    handleError(
      "Something went wrong while creating the user level.",
      error,
      res
    );
  }
};

module.exports.getAllRoles = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, name } = req.query;

    // build filter
    const filter = {};
    if (name) filter.name = name;

    const roles = await Role.find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      message: "Roles retrieved successfully.",
      data: roles,
    });
  } catch (error) {
    handleError("Something went wrong while getting the roles.", error, res);
  }
};

module.exports.getSingleRole = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validations ---------------------------- */
    const validation = await validateExistingRecord(Role, id, res);

    const responseBody = {
      message: validation.message,
    };

    if (validation.data) {
      responseBody.data = validation.data;
    }

    return res.status(validation.statusCode).json(responseBody);
  } catch (error) {
    handleError("Something went wrong while getting the role.", error, res);
  }
};

module.exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    /* ----------------------------- validations ---------------------------- */
    const validation = await validateExistingRecord(Role, id, res);

    if (validation.statusCode !== 200)
      return res.status(validation.statusCode).json({
        message: validation.message,
      });

    const existingRole = await Role.findOne({ name });
    if (existingRole && String(existingRole._id) !== String(id))
      return res.status(400).json({
        message: "Role already exists.",
      });

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    res.status(200).json({
      message: "Role updated successfully.",
      data: updatedRole,
    });
  } catch (error) {
    handleError("Something went wrong while updating the role.", error, res);
  }
};

module.exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    /* ----------------------------- validations ---------------------------- */
    const validation = await validateExistingRecord(Role, id, res);

    if (validation.statusCode !== 200)
      return res.status(validation.statusCode).json({
        message: validation.message,
      });

    const deletedRole = await Role.findByIdAndDelete(id);
    res.status(200).json({
      message: "Role deleted successfully",
      data: deletedRole,
    });
  } catch (error) {
    handleError("Something went wrong while deleting the role.", error, res);
  }
};
