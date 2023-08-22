const {
  getAllTrainers,
  getTrainer,
  putUpdateTrainer,
  putAddTrainee,
} = require("../controllers/trainer.controller")
const { isTrainee } = require("../middleware/isTrainee.middleware")
const { isTraineeOrAllowedTrainer } = require("../middleware/isTraineeOrAllowedTrainer")
const { isTrainer } = require("../middleware/isTrainer.middleware")

const router = require("express").Router()

router.get('/', isTrainee, getAllTrainers)

router.get('/:trainerId', isTraineeOrAllowedTrainer, getTrainer)

router.put('/:trainerId', isTrainer, putUpdateTrainer)

router.put('/:trainerId/trainee', isTrainee, putAddTrainee)

module.exports = router