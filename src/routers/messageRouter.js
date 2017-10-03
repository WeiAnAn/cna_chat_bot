const router = require("express").Router();
const controller = require("../controllers/messageController.js");

router.get("/webhook", controller.verifyWebhook);
router.post("/webhook", controller.webhook);

module.exports = router;