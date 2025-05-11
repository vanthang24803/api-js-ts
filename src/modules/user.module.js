const { z } = require("zod");
const { ObjectId } = require("mongodb");

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
      roles: ["root"],
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
    const cachedToken = await redis.get(constant.KEY.LOGIN_TOKEN);

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

    if (user.tokens?.access_token && user.tokens?.refresh_token) {
      const isAccessTokenValid = jwt.verifyToken(user.tokens.access_token);

      if (isAccessTokenValid) {
        await redis.set(
          constant.KEY.LOGIN_TOKEN,
          JSON.stringify(user.tokens),
          "EX",
          constant.JWT.JWT_EXPIRE - 5 * 60
        );

        log.info("Token from MongoDB cache.");
        return user.tokens;
      }
    }

    const token = {
      accessToken: jwt.generateToken(user),
      refreshToken: jwt.generateToken(user, true),
    };

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          tokens: token,
          updatedAt: new Date(),
        },
      }
    );

    await redis.set(
      constant.KEY.LOGIN_TOKEN,
      JSON.stringify(token),
      "EX",
      constant.JWT.JWT_EXPIRE - 5 * 60
    );

    log.info("New token generated and saved.");
    return token;
  },

  logout: async function (params) {
    await redis.del(constant.KEY.LOGIN_TOKEN);
    await db.collection("users").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          tokens: null,
          updatedAt: new Date(),
        },
      }
    );
    return { message: "Logged out successfully!" };
  },

  refreshToken: async function (params) {
    const decoded = jwt.verifyToken(params.refreshToken, true);
    if (!decoded) return exception(401);

    const user = await db.collection("users").findOne({
      $or: [{ username: decoded.username }, { email: decoded.email }],
    });

    if (!user || !user.tokens?.refreshToken) return exception(401);

    const storedRefreshToken = user.tokens.refreshToken;
    const isStoredRefreshTokenValid = jwt.verifyToken(storedRefreshToken, true);

    if (
      params.refreshToken === storedRefreshToken &&
      isStoredRefreshTokenValid
    ) {
      const token = {
        accessToken: jwt.generateToken(user),
        refreshToken: params.refreshToken,
      };

      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            tokens: token,
            updatedAt: new Date(),
          },
        }
      );

      await redis.set(
        constant.KEY.LOGIN_TOKEN,
        JSON.stringify(token),
        "EX",
        constant.JWT.JWT_EXPIRE - 5 * 60
      );

      log.info("Reused valid refresh token.");
      return token;
    }

    const newToken = {
      accessToken: jwt.generateToken(user),
      refreshToken: jwt.generateToken(user, true),
    };

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          tokens: newToken,
          updatedAt: new Date(),
        },
      }
    );

    await redis.set(
      constant.KEY.LOGIN_TOKEN,
      JSON.stringify(newToken),
      "EX",
      constant.JWT.JWT_EXPIRE - 5 * 60
    );

    log.info("Generated new token from refresh.");
    return newToken;
  },

  /**
   * @param {string} id
   * @returns
   */

  findUserById: async function (params) {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(params.id) });
    return user;
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
