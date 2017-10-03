const router = require("express").Router();
const controller = require("../controllers/authController.js");

router.get("/authorize", controller.authorizeView);
router.post("/authorize", controller.authorize);

module.exports = router;