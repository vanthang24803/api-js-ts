const userModule = require("@/modules/user.module");
const {
  validationLoginSchema,
  validationRegisterSchema,
} = require("@/validations/auth.validation");

module.exports = {
  login: async (req, res, next) => {
    const validationResult = validationLoginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.badRequest(validationResult.error.errors);
    }
    try {
      const result = await userModule.login(req.body);

      res.ok(result);
    } catch (error) {
      log.error(error);
      next(error);
    }
  },

  register: async (req, res, next) => {
    const validationResult = validationRegisterSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.badRequest(validationResult.error.errors);
    }
    try {
      const result = await userModule.register(req.body);

      res.ok(result);
    } catch (error) {
      log.error(error);
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      const isRefreshTokenValid = _.isString(refreshToken);

      if (!isRefreshTokenValid) {
        return res.badRequest("Refresh token is required!");
      }

      const result = await userModule.refreshToken({ refreshToken });

      res.ok(result);
    } catch (error) {
      log.error(error);
      next(error);
    }
  },
};
