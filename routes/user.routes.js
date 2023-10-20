const router = require("express").Router()

const {
  getUser
} = require("../controllers/user.controller")
const { userHimself } = require("../middleware/userHimself")

// GET User
router.get("/:userId", userHimself, getUser)

// Patch update self info
router.patch("/:userId", userHimself)

module.exports = router