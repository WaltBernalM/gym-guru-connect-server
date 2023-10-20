const router = require("express").Router()

const {
  getUser
} = require("../controllers/user.controller")

// GET User
router.get("/:userId", getUser)

// Patch update self info
router.patch("/:userId")

module.exports = router