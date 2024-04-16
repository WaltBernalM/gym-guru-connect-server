"use strict"

const { getAllSetTypes } = require("../controllers/setType.controller")
const { selfTraineeOrAllowedTrainer } = require("../middleware/selfTraineeOrAllowedTrainer.middleware")
const router = require("express").Router()

router.get("/", selfTraineeOrAllowedTrainer, getAllSetTypes)

module.exports = router