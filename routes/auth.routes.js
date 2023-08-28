const router = require("express").Router()
const {
  postSignupController,
  postLoginController,
  getVerifyController,
  postLogout,
} = require("../controllers/auth.controller")
const { isValidTokenVer } = require("../middleware/isValidTokenVer")
const { isAuthenticated } = require("../middleware/jwt.middleware")

router.post("/signup", postSignupController)

router.post("/login", postLoginController)

router.get("/verify", isValidTokenVer, isAuthenticated, getVerifyController)

router.post('/logout', isAuthenticated, postLogout )

module.exports = router
