const router = require("express").Router()
const {
  postSignupController,
  postLoginController,
  getVerifyController,
  postLogout,
  postUserSignupController,
  postUserLoginController,
} = require("../controllers/auth.controller")
const { isValidTokenVer } = require("../middleware/isValidTokenVer")
const { isAuthenticated } = require("../middleware/jwt.middleware")

router.post("/signup", postSignupController)

router.post("/login", postLoginController)

router.get("/verify", isAuthenticated, isValidTokenVer, getVerifyController)

router.post('/logout', isAuthenticated, postLogout)

// Routes for general users
router.post('/user-signup', postUserSignupController)
router.post('/user-login', postUserLoginController)

module.exports = router
