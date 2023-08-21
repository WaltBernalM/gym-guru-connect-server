const router = require("express").Router()
const {
  postSignupController,
  postLoginController,
} = require("../controllers/auth.controller")

router.post("/signup", postSignupController)

router.post("/login", postLoginController)

module.exports = router
