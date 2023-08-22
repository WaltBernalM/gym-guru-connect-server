const router = require("express").Router()

const {
  getTrainee,
  putUpdateTrainee,
} = require("../controllers/trainees.controller")
const { isAllowedTrainee } = require("../middleware/isAllowedTrainee.middleware")

router.get("/:traineeId", isAllowedTrainee, getTrainee)

router.put("/:traineeId", isAllowedTrainee, putUpdateTrainee)

module.exports = router
