const {
  validationUpdateProfileSchema,
} = require("@/validations/user.validation");
const userModule = require("@/modules/user.module");

module.exports = {
  profile: async (req, res) => {
    try {
      const existingUser = req.user;

      res.ok(existingUser);
    } catch (error) {
      log.error(error);
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const existingUser = req.user;

      const result = await userModule.logout(existingUser);

      res.ok(result);
    } catch (error) {
      log.error(error);
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const existingUser = req.user;

      const validationResult = validationUpdateProfileSchema.safeParse(
        req.body
      );
      if (!validationResult.success) {
        return res.badRequest(validationResult.error.errors);
      }

      const result = await userModule.updateProfile(
        existingUser._id,
        validationResult.data
      );

      res.ok(result);
    } catch (error) {
      log.error(error);
      next(error);
    }
  },
};
