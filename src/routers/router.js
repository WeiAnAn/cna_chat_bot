const router = require("express").Router();
const authRouter = require("../routers/authRouter.js");
const messageRouter = require("../routers/messageRouter.js");

router.use(messageRouter);
router.use(authRouter);

module.exports = router;