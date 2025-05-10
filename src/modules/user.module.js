const { z } = require("zod");

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

    const token = jwt.generateToken(user);

    log.info("User logged in successfully!");
    return token;
  },
};
