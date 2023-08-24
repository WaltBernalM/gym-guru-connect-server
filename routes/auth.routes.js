const router = require("express").Router()
const {
  postSignupController,
  postLoginController,
  getVerifyController,
} = require("../controllers/auth.controller")
const { isAuthenticated } = require("../middleware/jwt.middleware")

router.post("/signup", postSignupController)

router.post("/login", postLoginController)

router.get('/verify', isAuthenticated, getVerifyController)

module.exports = router
