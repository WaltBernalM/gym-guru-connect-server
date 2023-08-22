const router = require("express").Router()

const {
  getTrainee,
  putUpdateTrainee,
  putUpdateTrainer,
} = require("../controllers/trainees.controller")
const { isAllowedTrainee } = require("../middleware/isAllowedTrainee")

router.get("/:traineeId", getTrainee)

router.put("/:traineeId", putUpdateTrainee)

module.exports = router
