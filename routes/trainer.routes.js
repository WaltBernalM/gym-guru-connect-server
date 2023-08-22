const { getAllTrainers, getTrainer, putUpdateTrainer } = require("../controllers/trainers.controller")
const { isTrainee } = require("../middleware/isTrainee.middleware")
const { isTraineeOrAllowedTrainer } = require("../middleware/isTraineeOrAllowedTrainer")
const { isTrainer } = require("../middleware/isTrainer.middleware")

const router = require("express").Router()

router.get('/', isTrainee, getAllTrainers)

router.get('/:trainerId', isTraineeOrAllowedTrainer, getTrainer)

router.put('/:trainerId', isTrainer, putUpdateTrainer)

module.exports = router