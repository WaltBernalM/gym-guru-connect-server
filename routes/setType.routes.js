"use strict"

const { getAllSetTypes } = require("../controllers/setType.controller")
const router = require("express").Router()

router.get("/", getAllSetTypes)

module.exports = router