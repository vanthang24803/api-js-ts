const { ObjectId } = require("mongodb");

module.exports = {
  authentication: async (req, res, next) => {
    const tokenFromHeader = req.headers.authorization;

    if (!tokenFromHeader) {
      return res.unauthorized("Token not found!");
    }

    const token = tokenFromHeader.split(" ")[1];

    if (!token) {
      return res.unauthorized("Token not found!");
    }
    const payload = jwt.decodeToken(token);

    if (payload === null) {
      return res.unauthorized("Invalid token!");
    }

    const existingUser = await db.collection("users").findOne(
      {
        _id: new ObjectId(payload.id),
      },
      {
        projection: {
          hashed_password: 0,
        },
      }
    );

    if (!existingUser) {
      return res.unauthorized("Session not found login again!");
    }

    req.user = existingUser;

    next();
  },
  authorization: (allowedRoles = [constant.ROLE.USER]) => {
    return (req, res, next) => {
      const userRoles = req.user.roles;

      if (!userRoles) {
        return res.unauthorized("Session not found login again!");
      }

      const hasAccess = allowedRoles.some((role) => userRoles.includes(role));
      if (!hasAccess) {
        return res.forbidden("You don't have permission!");
      }

      next();
    };
  },
};
