const userModule = require("../modules/user.module");

module.exports = {
  profile: async (req, res) => {
    try {
      log.info(_.isString("a"));
    } catch (error) {
      log.error(error);
      res.internalServerError();
    }
  },
};
