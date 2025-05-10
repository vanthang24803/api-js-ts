const router = require("express").Router();
const controller = require("@/controllers/user.controller");
const { authentication } = require("@/middlewares/auth.middleware");

router.post("/profile", authentication, controller.profile);
router.post("/profile/update", authentication, controller.updateProfile);

module.exports = router;
