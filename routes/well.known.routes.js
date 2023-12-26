const router = require("express").Router()

const { getWellKnownJson, getDidConfiguration } = require("../controllers/well.known.controller")

router.get("/did.json", getWellKnownJson)

router.get("/did-configuration.json", getDidConfiguration)

module.exports = router