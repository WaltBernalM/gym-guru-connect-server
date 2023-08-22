const router = require("express").Router()

const {
  getTrainee,
  putUpdateTrainee,
  putUpdateTrainer,
} = require("../controllers/trainees.controller")
const {
  isAllowedTrainee,
} = require("../middleware/isAllowedTrainee.middleware")
const { isTrainee } = require("../middleware/isTrainee.middleware")

router.get("/:traineeId", isAllowedTrainee, getTrainee)

router.put("/:traineeId", putUpdateTrainee)

module.exports = router
