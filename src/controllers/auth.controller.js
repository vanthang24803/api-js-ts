const userModule = require("@/modules/user.module");
const {
  validationLoginSchema,
  validationRegisterSchema,
} = require("@/validations/auth.validation");

module.exports = {
  login: async (req, res) => {
    const validationResult = validationLoginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.badRequest(validationResult.error.errors);
    }
    try {
      const result = await userModule.login(req.body);

      res.ok(result);
    } catch (error) {
      log.error(error);
      res.internalServerError();
    }
  },

  register: async (req, res) => {
    const validationResult = validationRegisterSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.badRequest(validationResult.error.errors);
    }
    try {
      const result = await userModule.register(req.body);

      res.ok(result);
    } catch (error) {
      log.error(error);
      res.internalServerError();
    }
  },
};
