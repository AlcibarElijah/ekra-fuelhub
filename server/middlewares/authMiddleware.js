/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
const jwt = require("jsonwebtoken");

/* --------------------------------- models --------------------------------- */
const User = require("../models/User");
const Role = require("../models/Role");

/* -------------------------------------------------------------------------- */
/*                                  functions                                 */
/* -------------------------------------------------------------------------- */
const getUserFromToken = async (token) => {
  const userId = jwt.verify(token, process.env.JWT_SECRET);
  return await User.findById(userId);
}

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    throw {
      statusCode: 401,
      message: "Please provide a token in the authorization header."
    }

  const token = authHeader.split(" ")[1];
  if (!token)
    throw {
      statusCode: 401,
      message: "Please provide a token in the authorization header."
    }
  
  return token;
}

/* -------------------------------------------------------------------------- */
/*                                 middleware                                 */
/* -------------------------------------------------------------------------- */
module.exports.isUserAuthenticated = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    const user = await getUserFromToken(token);

    if (!user)
      throw {
        statusCode: 401,
        message: "User not found."
      }

    next();
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message
    })
  }
}

module.exports.isUserNotAuthenticated = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    const user = await getUserFromToken(token);

    if (!user)
      throw {
        statusCode: 401,
        message: "User not found."
      }

    res.status(400).json({
      message: "User already logged in."
    })
  } catch (error) {
    next();
  }
}

module.exports.isUserAdmin = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    const user = await getUserFromToken(token);

    if (!user)
      throw {
        statusCode: 401,
        message: "User not found."
      }

    const role = await Role.findById(user.role);
    if (role.name !== "admin")
      throw {
        statusCode: 403,
        message: "You are not authorized to access this resource."
      }

    next();
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message
    })
  }
}