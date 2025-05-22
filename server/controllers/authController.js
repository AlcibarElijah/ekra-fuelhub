/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { handleError, cleanedUser } = require("./functions/utils");

/* --------------------------------- models --------------------------------- */
const User = require("../models/User");

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */
const getToken = (user) => {
  return jwt.sign(String(user._id), process.env.JWT_SECRET);
}

/* -------------------------------------------------------------------------- */
/*                                 controllers                                */
/* -------------------------------------------------------------------------- */
module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    /* ----------------------------- validation ----------------------------- */
    if (!username || !password)
      return res.status(400).json({
        message: "Please fill in all the fields."
      })

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({
        message: "User with this username does not exist."
      })

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({
        message: "Incorrect password."
      })

    const token = getToken(user);

    res.status(200).json({
      message: "Logged in successfully.",
      data: {
        token,
        user: cleanedUser(user)
      }
    })
  } catch (error) {
    handleError("Something went wrong while logging in.", error, res);
  }
}