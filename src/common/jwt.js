const jwt = require("jsonwebtoken");

let jwtFuc = {};

jwtFuc.generateToken = (user) => {
  return jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

jwtFuc.verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

jwtFuc.decodeToken = (token) => {
  return jwt.decode(token);
};

global.jwt = jwtFuc;
