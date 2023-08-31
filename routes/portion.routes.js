const router = require('express').Router()

const { selfTraineeOrAllowedTrainer } = require('../middleware/selfTraineeOrAllowedTrainer.middleware')

const {
  postCreatePortion,
  getPortionInfo,
  putUpdatePortion,
  deletePortion,
} = require("../controllers/portions.controller")

router.post('/trainee/:traineeId', selfTraineeOrAllowedTrainer, postCreatePortion)

router.get("/:portionId/trainee/:traineeId", selfTraineeOrAllowedTrainer, getPortionInfo)

router.put('/:portionId/trainee/:traineeId', selfTraineeOrAllowedTrainer, putUpdatePortion)

router.delete('/:portionId/trainee/:traineeId', selfTraineeOrAllowedTrainer, deletePortion)

module.exports = router