const userModule = require("../modules/user.module");

module.exports = {
  profile: async (req, res) => {
    try {
    } catch (error) {
      log.error(error);
      res.internalServerError();
    }
  },
};
