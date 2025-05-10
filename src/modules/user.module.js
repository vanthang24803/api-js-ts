const { z } = require("zod");
const { ObjectId } = require("mongodb");

module.exports = {
  validateBeforeSave: (params) => {
    const schema = z.object({
      username: z.string().min(1).max(255),
      email: z.string().email().max(255),
      phone: z.string().optional(),
      first_name: z.string().max(100),
      last_name: z.string().max(100),
      gender: z.string().max(10),
      address: z.string().max(255).optional(),
      date_of_birth: z.string().optional(),
      roles: z.array(z.string()).min(1),
      active: z.boolean(),
      timezone: z.string().max(50),
      created_at: z.date().default(new Date()),
      updated_at: z.date().default(new Date()),
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
      hashed_password: await bcrypt.hashPassword(params.password),
      roles: ["root"],
      timezone: "Asia/Ho_Chi_Minh",
      version: 1,
      active: true,
      gender: "male",
      created_at: new Date(),
      updated_at: new Date(),
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
    const user = await db.collection("users").findOne({
      $or: [{ username: params.username }, { email: params.email }],
    });

    if (!user) {
      return exception(401);
    }

    const isPasswordValid = await bcrypt.verifyPassword(
      params.password,
      user.hashed_password
    );

    if (!isPasswordValid) {
      return exception(401);
    }

    const token = {
      access_token: jwt.generateToken(user),
      refresh_token: jwt.generateToken(user, true),
    };

    log.info("User logged in successfully!");
    return token;
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
  updateProfile: async function (id, params) {
    const updateUser = await db.collection("users").findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          ...params,
          updated_at: new Date(),
        },
      },
      {
        returnDocument: "after",
        projection: {
          _id: 1,
          username: 1,
          email: 1,
          first_name: 1,
          last_name: 1,
          phone: 1,
          gender: 1,
          address: 1,
          date_of_birth: 1,
          updated_at: 1,
        },
      }
    );

    return updateUser;
  },
};
