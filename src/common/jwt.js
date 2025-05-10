const jwt = require("jsonwebtoken");

let jwtFuc = {};
/**
 *
 * @param {*} user
 * @param {boolean} isRefreshToken
 * @returns
 */
jwtFuc.generateToken = (user, isRefreshToken = false) => {
  return jwt.sign(
    { id: user._id },
    isRefreshToken ? env.JWT_REFRESH : env.JWT_SECRET,
    {
      expiresIn: isRefreshToken ? "30d" : "7d",
    }
  );
};

/**
 *
 * @param {*} token
 * @param {boolean} isRefreshToken
 * @returns
 */
jwtFuc.verifyToken = (token, isRefreshToken = false) => {
  return jwt.verify(token, isRefreshToken ? env.JWT_REFRESH : env.JWT_SECRET);
};

/**
 *
 * @param {*} token
 * @returns
 */
jwtFuc.decodeToken = (token) => {
  return jwt.decode(token);
};

global.jwt = jwtFuc;
