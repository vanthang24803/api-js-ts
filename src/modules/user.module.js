const { z } = require("zod");
const { ObjectId } = require("mongodb");
const moment = require("moment");

module.exports = {
  validateBeforeSave: (params) => {
    const schema = z.object({
      username: z.string().min(1).max(255),
      email: z.string().email().max(255),
      phone: z.string().optional(),
      firstName: z.string().max(100),
      lastName: z.string().max(100),
      gender: z.string().max(10),
      address: z.string().max(255).optional(),
      dateOfBirth: z.string().optional(),
      roles: z.array(z.string()).min(1),
      active: z.boolean(),
      timezone: z.string().max(50),
      createdAt: z.date().default(new Date()),
      updatedAt: z.date().default(new Date()),
    });

    try {
      schema.parse(params);
      return { isValid: true };
    } catch (error) {
      return { isValid: false, errors: error.errors };
    }
  },

  register: async function (params) {
    const isExistingUser = await db.collection("users").findOne({
      $or: [{ username: params.username }, { email: params.email }],
    });

    if (isExistingUser) {
      return exception(400, "Username or email is existed!");
    }

    const newUser = {
      ...params,
      hashedPassword: await bcrypt.hashPassword(params.password),
      roles: [constant.ROLE.USER],
      timezone: "Asia/Ho_Chi_Minh",
      version: 1,
      active: true,
      gender: "male",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    delete newUser.password;

    const validationResult = this.validateBeforeSave(newUser);

    if (!validationResult.isValid) {
      log.error("Validation errors:", validationResult.errors);
      return exception(400, validationResult.errors);
    }

    await db.collection("users").insertOne(newUser);

    log.info("User created successfully!");
    return { message: "Created user successfully!" };
  },
  login: async function (params) {
    const cachedToken = await redis.get(
      `${constant.KEY.LOGIN_TOKEN}_${params.username || params.email}`
    );
    if (cachedToken) {
      log.info("Token from Redis cache.");
      return JSON.parse(cachedToken);
    }

    const user = await db.collection("users").findOne({
      $or: [{ username: params.username }, { email: params.email }],
    });

    if (!user) return exception(401);

    const isPasswordValid = await bcrypt.verifyPassword(
      params.password,
      user.hashedPassword
    );

    if (!isPasswordValid) return exception(401);

    const token = {
      accessToken: jwt.generateToken(user),
      refreshToken: jwt.generateToken(user, true),
    };

    const currentToken = await db.collection("tokens").findOne({
      userId: user._id,
      key: "refresh_token",
    });

    const newExpireAt = moment()
      .add(constant.JWT.JWT_REFRESH_EXPIRE, "seconds")
      .toDate();

    if (currentToken) {
      const isExpired = moment(currentToken.expiredAt).isBefore(moment());

      if (!isExpired) {
        log.info("Token from MongoDB cache. Still valid.");

        const tokenToCache = {
          accessToken: token.accessToken,
          refreshToken: currentToken.value,
        };

        await redis.set(
          `${constant.KEY.LOGIN_TOKEN}_${user.username || user.email}`,
          JSON.stringify(tokenToCache),
          "EX",
          constant.JWT.JWT_EXPIRE - 5 * 60
        );

        return tokenToCache;
      }

      await db.collection("tokens").updateOne(
        {
          userId: user._id,
          key: "refresh_token",
        },
        {
          $set: {
            value: token.refreshToken,
            expiredAt: newExpireAt,
          },
        }
      );

      log.info("Existing refresh token updated.");
    } else {
      await db.collection("tokens").insertOne({
        userId: user._id,
        key: "refresh_token",
        value: token.refreshToken,
        expiredAt: newExpireAt,
      });

      log.info("New token inserted.");
    }

    await redis.set(
      `${constant.KEY.LOGIN_TOKEN}_${user.username || user.email}`,
      JSON.stringify(token),
      "EX",
      constant.JWT.JWT_EXPIRE - 5 * 60
    );

    log.info("Token cached in Redis.");
    return token;
  },

  logout: async function (params) {
    await redis.del(
      `${constant.KEY.LOGIN_TOKEN}_${params.username || params.email}`
    );

    await db.collection("tokens").findOneAndDelete({
      userId: params._id,
      key: "refresh_token",
    });
    return { message: "Logged out successfully!" };
  },

  /**
   * @param {object} params
   * @param {string} params.refreshToken
   * @returns {Promise<{accessToken: string, refreshToken: string}>}
   */

  refreshToken: async function (params) {
    const decoded = jwt.verifyToken(params.refreshToken, true);
    if (!decoded) return exception(401, "Token invalid!");

    const existingUser = await db.collection("users").findOne({
      _id: new ObjectId(decoded.id),
    });

    if (_.isNull(existingUser)) {
      return exception(401, "User not found!");
    }

    const existingRefreshToken = await db.collection("tokens").findOne({
      userId: new ObjectId(decoded.id),
    });

    if (_.isNull(existingRefreshToken))
      return exception(401, "Token not found!");

    if (existingRefreshToken.value !== params.refreshToken)
      return exception(401, "Token not match!");

    const isExpired = moment(existingRefreshToken.expiredAt).isBefore(moment());

    if (isExpired) {
      const newToken = {
        accessToken: jwt.generateToken(existingUser),
        refreshToken: jwt.generateToken(existingUser, true),
      };

      await db.collection("tokens").updateOne(
        {
          userId: new ObjectId(decoded.id),
          key: "refresh_token",
        },
        {
          $set: {
            value: newToken.refreshToken,
            expiredAt: moment()
              .add(constant.JWT.JWT_REFRESH_EXPIRE, "seconds")
              .toDate(),
          },
        }
      );

      await redis.set(
        `${constant.KEY.LOGIN_TOKEN}_${existingUser.username || existingUser.email}`,
        JSON.stringify(newToken),
        "EX",
        constant.JWT.JWT_EXPIRE - 5 * 60
      );

      log.info("Generated new token from refresh.");
      return newToken;
    }

    const token = {
      accessToken: jwt.generateToken(existingUser),
      refreshToken: existingRefreshToken.value,
    };

    await redis.set(
      `${constant.KEY.LOGIN_TOKEN}_${existingUser.username || existingUser.email}`,
      JSON.stringify(token),
      "EX",
      constant.JWT.JWT_EXPIRE - 5 * 60
    );

    log.info("Generated new token from refresh.");
    return token;
  },

  /**
   * @param {string} id
   * @param {object} params
   * @returns
   */
  updateProfile: async function (params) {
    const updateUser = await db.collection("users").findOneAndUpdate(
      {
        _id: new ObjectId(params.id),
      },
      {
        $set: {
          ...params,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        projection: {
          _id: 1,
          username: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          phone: 1,
          gender: 1,
          address: 1,
          dateOfBirth: 1,
          updatedAt: 1,
        },
      }
    );

    return updateUser;
  },
};
