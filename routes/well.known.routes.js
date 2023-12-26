const router = require("express").Router()

const { getWellKnownJson } = require("../controllers/well.known.controller")

router.get("/", getWellKnownJson )

module.exports = router